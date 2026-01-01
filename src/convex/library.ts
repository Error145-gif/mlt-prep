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
        .collect();
      
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
        .collect();
    } else {
      // Get all active PDFs
      pdfs = await ctx.db
        .query("library")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .collect();
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
      .collect();

    const pdfsBySubject: Record<string, Array<any>> = {};

    subjects.forEach((subject) => {
      const subjectPdfs = allPdfs.filter((pdf) => pdf.subject === subject);
      pdfsBySubject[subject] = subjectPdfs.sort(() => Math.random() - 0.5);
    });

    return pdfsBySubject;
  },
});

// Check if user has yearly plan access
export const checkLibraryAccess = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { hasAccess: false, isYearlyUser: false };
    }

    // Check for active subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!subscription) {
      return { hasAccess: false, isYearlyUser: false };
    }

    // Check if subscription is not expired
    const isActive = subscription.endDate > Date.now();
    
    // Check if it's a yearly plan (365 days or more)
    const isYearly = subscription.planName.toLowerCase().includes("yearly") || 
                     subscription.planName.toLowerCase().includes("year") ||
                     subscription.planName.toLowerCase().includes("12 month");

    return {
      hasAccess: isActive && isYearly,
      isYearlyUser: isYearly,
      planName: subscription.planName,
    };
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
