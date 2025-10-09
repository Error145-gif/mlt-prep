import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all study materials (for users)
export const getAllStudyMaterials = query({
  args: {},
  handler: async (ctx) => {
    const materials = await ctx.db
      .query("studyMaterials")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();

    // Get file URLs for each material
    const materialsWithUrls = await Promise.all(
      materials.map(async (material) => {
        const url = await ctx.storage.getUrl(material.fileId);
        return {
          ...material,
          fileUrl: url,
        };
      })
    );

    return materialsWithUrls;
  },
});

// Get all study materials for admin
export const getAllStudyMaterialsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const materials = await ctx.db
      .query("studyMaterials")
      .order("desc")
      .collect();

    // Get file URLs and uploader info
    const materialsWithDetails = await Promise.all(
      materials.map(async (material) => {
        const url = await ctx.storage.getUrl(material.fileId);
        const uploader = await ctx.db.get(material.uploadedBy);
        return {
          ...material,
          fileUrl: url,
          uploaderName: uploader?.name || "Unknown",
        };
      })
    );

    return materialsWithDetails;
  },
});

// Upload study material (admin only)
export const uploadStudyMaterial = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    fileId: v.id("_storage"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const materialId = await ctx.db.insert("studyMaterials", {
      title: args.title,
      description: args.description,
      fileId: args.fileId,
      uploadedBy: userId,
      status: "active",
      views: 0,
      category: args.category,
    });

    return materialId;
  },
});

// Delete study material (admin only)
export const deleteStudyMaterial = mutation({
  args: {
    materialId: v.id("studyMaterials"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const material = await ctx.db.get(args.materialId);
    if (!material) throw new Error("Material not found");

    // Delete the file from storage
    await ctx.storage.delete(material.fileId);

    // Delete the material record
    await ctx.db.delete(args.materialId);

    return { success: true };
  },
});

// Update study material (admin only)
export const updateStudyMaterial = mutation({
  args: {
    materialId: v.id("studyMaterials"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const { materialId, ...updates } = args;
    await ctx.db.patch(materialId, updates);

    return { success: true };
  },
});

// Increment view count
export const incrementViews = mutation({
  args: {
    materialId: v.id("studyMaterials"),
  },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.materialId);
    if (!material) throw new Error("Material not found");

    await ctx.db.patch(args.materialId, {
      views: material.views + 1,
    });

    return { success: true };
  },
});
