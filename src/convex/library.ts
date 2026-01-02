import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all active library PDFs
export const getAllLibraryPDFs = query({
  args: {
    subject: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    let pdfs;

    if (args.searchQuery) {
      // Search by title (case-insensitive)
      const allPdfs = await ctx.db
        .query("library")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .take(500);
      
      const searchLower = args.searchQuery.toLowerCase();
      pdfs = allPdfs.filter((pdf) =>
        pdf.title.toLowerCase().includes(searchLower)
      );
    } else if (args.subject) {
      // Filter by subject
      pdfs = await ctx.db
        .query("library")
        .withIndex("by_subject", (q) => q.eq("subject", args.subject!))
        .filter((q) => q.eq(q.field("status"), "active"))
        .take(500);
    } else {
      // Get all active PDFs
      pdfs = await ctx.db
        .query("library")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .take(500);
    }

    // Randomize order
    return pdfs.sort(() => Math.random() - 0.5);
  },
});

// Get PDFs by subject (for subject sections)
export const getPDFsBySubject = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const subjects = [
      "Hematology",
      "Biochemistry",
      "Microbiology",
      "Clinical Pathology",
      "Blood Bank",
      "Histopathology",
      "Immunology",
      "Lab Instruments",
    ];

    const allPdfs = await ctx.db
      .query("library")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(500);

    const pdfsBySubject: Record<string, Array<any>> = {};

    subjects.forEach((subject) => {
      const subjectPdfs = allPdfs.filter((pdf) => pdf.subject === subject);
      pdfsBySubject[subject] = subjectPdfs.sort(() => Math.random() - 0.5);
    });

    return pdfsBySubject;
  },
});

// Debug: Get count of active PDFs (for troubleshooting)
export const getLibraryPDFCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const activePdfs = await ctx.db
      .query("library")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(500);

    return {
      total: activePdfs.length,
      bySubject: activePdfs.reduce((acc: Record<string, number>, pdf) => {
        acc[pdf.subject] = (acc[pdf.subject] || 0) + 1;
        return acc;
      }, {}),
    };
  },
});

// Check if user has yearly plan access
export const checkLibraryAccess = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { 
        hasAccess: false, 
        isYearlyUser: false, 
        planType: "free",
        dailyAdUnlocksUsed: 0,
        unlockedPdfIds: [] 
      };
    }

    // Check for active subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    let planType = "free";
    let isYearly = false;

    if (subscription) {
      const planName = subscription.planName.toLowerCase();
      if (planName.includes("yearly") || planName.includes("year") || planName.includes("12 month")) {
        planType = "yearly";
        isYearly = true;
      } else if (planName.includes("premium") || planName.includes("399")) {
        planType = "premium";
      } else if (planName.includes("starter") || planName.includes("99")) {
        planType = "monthly_starter";
      }
    }

    // Get ad unlocks for today
    const now = Date.now();
    const startOfDay = new Date(now).setHours(0, 0, 0, 0);
    
    const adUnlocks = await ctx.db
      .query("libraryAdUnlocks")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id).gte("unlockedAt", startOfDay))
      .collect();

    return {
      hasAccess: isYearly,
      isYearlyUser: isYearly,
      planName: subscription?.planName,
      planType,
      dailyAdUnlocksUsed: adUnlocks.length,
      unlockedPdfIds: adUnlocks.map(u => u.pdfId),
    };
  },
});

// Unlock PDF with Ad
export const unlockLibraryPDFWithAd = mutation({
  args: {
    pdfId: v.id("library"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Check if already unlocked
    const existingUnlock = await ctx.db
      .query("libraryAdUnlocks")
      .withIndex("by_user_and_pdf", (q) => q.eq("userId", user._id).eq("pdfId", args.pdfId))
      .first();

    if (existingUnlock) {
      return { success: true, message: "Already unlocked" };
    }

    // Check daily limit
    const now = Date.now();
    const startOfDay = new Date(now).setHours(0, 0, 0, 0);
    
    const dailyUnlocks = await ctx.db
      .query("libraryAdUnlocks")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id).gte("unlockedAt", startOfDay))
      .collect();

    if (dailyUnlocks.length >= 2) {
      throw new Error("Daily ad unlock limit reached (2/day)");
    }

    await ctx.db.insert("libraryAdUnlocks", {
      userId: user._id,
      pdfId: args.pdfId,
      unlockedAt: now,
    });

    return { success: true };
  },
});

// Admin: Add new PDF
export const addLibraryPDF = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    pdf_url: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const pdfId = await ctx.db.insert("library", {
      title: args.title,
      subject: args.subject,
      pdf_url: args.pdf_url,
      uploadedBy: user._id,
      status: "active",
    });

    return pdfId;
  },
});

// Admin: Update PDF
export const updateLibraryPDF = mutation({
  args: {
    pdfId: v.id("library"),
    title: v.string(),
    subject: v.string(),
    pdf_url: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.pdfId, {
      title: args.title,
      subject: args.subject,
      pdf_url: args.pdf_url,
    });

    return { success: true };
  },
});

// Admin: Delete PDF
export const deleteLibraryPDF = mutation({
  args: {
    pdfId: v.id("library"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.pdfId, {
      status: "archived",
    });

    return { success: true };
  },
});

// Admin: Get all PDFs (including archived)
export const getAllLibraryPDFsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("library").collect();
  },
});