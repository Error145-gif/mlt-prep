import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all sections
export const getAllSections = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_order")
      .order("asc")
      .collect();
    return sections;
  },
});

// Get active sections only
export const getActiveSections = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return sections.sort((a, b) => a.order - b.order);
  },
});

// Get section by ID
export const getSectionById = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sectionId);
  },
});

// Create a new section
export const createSection = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const sectionId = await ctx.db.insert("sections", {
      name: args.name,
      description: args.description,
      questionCount: 0,
      order: args.order,
      isActive: true,
    });

    return sectionId;
  },
});

// Update section
export const updateSection = mutation({
  args: {
    sectionId: v.id("sections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const { sectionId, ...updates } = args;
    await ctx.db.patch(sectionId, updates);
    return sectionId;
  },
});

// Delete section
export const deleteSection = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Check if section has questions
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    if (questions.length > 0) {
      throw new Error("Cannot delete section with existing questions. Please reassign or delete questions first.");
    }

    await ctx.db.delete(args.sectionId);
    return { success: true };
  },
});

// Update section question count
export const updateSectionQuestionCount = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    await ctx.db.patch(args.sectionId, {
      questionCount: questions.length,
    });

    return questions.length;
  },
});

// Initialize 50 default sections
export const initializeDefaultSections = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Check if sections already exist
    const existingSections = await ctx.db.query("sections").collect();
    if (existingSections.length > 0) {
      throw new Error("Sections already initialized");
    }

    const defaultSections = [
      { name: "Hematology - Blood Cells", description: "Questions about blood cell types, morphology, and functions" },
      { name: "Hematology - Anemia", description: "Questions about different types of anemia" },
      { name: "Hematology - Coagulation", description: "Questions about blood clotting mechanisms" },
      { name: "Hematology - Blood Banking", description: "Questions about blood groups and transfusion" },
      { name: "Biochemistry - Carbohydrates", description: "Questions about carbohydrate metabolism" },
      { name: "Biochemistry - Proteins", description: "Questions about protein structure and function" },
      { name: "Biochemistry - Lipids", description: "Questions about lipid metabolism" },
      { name: "Biochemistry - Enzymes", description: "Questions about enzyme kinetics and function" },
      { name: "Biochemistry - Clinical Chemistry", description: "Questions about clinical biochemistry tests" },
      { name: "Microbiology - Bacteriology", description: "Questions about bacterial identification and culture" },
      { name: "Microbiology - Virology", description: "Questions about viruses and viral diseases" },
      { name: "Microbiology - Mycology", description: "Questions about fungi and fungal infections" },
      { name: "Microbiology - Parasitology", description: "Questions about parasites and parasitic diseases" },
      { name: "Microbiology - Immunology", description: "Questions about immune system and immunological tests" },
      { name: "Pathology - General Pathology", description: "Questions about disease processes" },
      { name: "Pathology - Systemic Pathology", description: "Questions about organ-specific pathology" },
      { name: "Pathology - Clinical Pathology", description: "Questions about laboratory diagnosis" },
      { name: "Histopathology - Tissue Processing", description: "Questions about tissue preparation techniques" },
      { name: "Histopathology - Staining Techniques", description: "Questions about various staining methods" },
      { name: "Cytology - Cell Structure", description: "Questions about cell morphology" },
      { name: "Cytology - Diagnostic Cytology", description: "Questions about cytological diagnosis" },
      { name: "Serology - Antigen-Antibody Reactions", description: "Questions about serological tests" },
      { name: "Serology - Immunoassays", description: "Questions about ELISA, RIA, and other immunoassays" },
      { name: "Molecular Biology - DNA & RNA", description: "Questions about nucleic acids" },
      { name: "Molecular Biology - PCR & Techniques", description: "Questions about molecular diagnostic techniques" },
      { name: "Clinical Microbiology - Specimen Collection", description: "Questions about sample collection and handling" },
      { name: "Clinical Microbiology - Culture Methods", description: "Questions about culture techniques" },
      { name: "Clinical Microbiology - Antimicrobial Testing", description: "Questions about antibiotic sensitivity testing" },
      { name: "Quality Control - Laboratory Standards", description: "Questions about QC procedures" },
      { name: "Quality Control - Instrument Calibration", description: "Questions about equipment maintenance" },
      { name: "Laboratory Safety - Biosafety", description: "Questions about laboratory safety protocols" },
      { name: "Laboratory Safety - Chemical Safety", description: "Questions about handling hazardous chemicals" },
      { name: "Instrumentation - Spectrophotometry", description: "Questions about spectrophotometers" },
      { name: "Instrumentation - Microscopy", description: "Questions about microscopes and microscopy" },
      { name: "Instrumentation - Automated Analyzers", description: "Questions about automated laboratory equipment" },
      { name: "Blood Gas Analysis", description: "Questions about arterial blood gas interpretation" },
      { name: "Urinalysis", description: "Questions about urine examination" },
      { name: "Body Fluid Analysis", description: "Questions about CSF, pleural fluid, etc." },
      { name: "Hormone Assays", description: "Questions about endocrine testing" },
      { name: "Tumor Markers", description: "Questions about cancer biomarkers" },
      { name: "Therapeutic Drug Monitoring", description: "Questions about drug level testing" },
      { name: "Toxicology", description: "Questions about toxicological analysis" },
      { name: "Genetics - Chromosomal Disorders", description: "Questions about genetic abnormalities" },
      { name: "Genetics - Molecular Genetics", description: "Questions about genetic testing" },
      { name: "Transfusion Medicine", description: "Questions about blood transfusion practices" },
      { name: "Laboratory Management", description: "Questions about lab administration" },
      { name: "Research Methodology", description: "Questions about research and statistics" },
      { name: "Ethics & Regulations", description: "Questions about medical ethics and regulations" },
      { name: "General MLT Knowledge", description: "Mixed questions covering multiple topics" },
      { name: "Mock Test Questions", description: "Comprehensive mock test questions" },
    ];

    const sectionIds = [];
    for (let i = 0; i < defaultSections.length; i++) {
      const sectionId = await ctx.db.insert("sections", {
        name: defaultSections[i].name,
        description: defaultSections[i].description,
        questionCount: 0,
        order: i + 1,
        isActive: true,
      });
      sectionIds.push(sectionId);
    }

    return { success: true, count: sectionIds.length };
  },
});
