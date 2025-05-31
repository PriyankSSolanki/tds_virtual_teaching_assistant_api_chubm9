import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const storeCourseContent = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if content already exists
    const existing = await ctx.db
      .query("courseContent")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    if (existing) {
      // Update existing content
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        lastScraped: Date.now(),
      });
      return existing._id;
    } else {
      // Insert new content
      return await ctx.db.insert("courseContent", {
        url: args.url,
        title: args.title,
        content: args.content,
        lastScraped: Date.now(),
      });
    }
  },
});

export const storeDiscoursePost = mutation({
  args: {
    postId: v.string(),
    title: v.string(),
    content: v.string(),
    url: v.string(),
    createdAt: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if post already exists
    const existing = await ctx.db
      .query("discoursePost")
      .withIndex("by_post_id", (q) => q.eq("postId", args.postId))
      .first();

    if (existing) {
      // Update existing post
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        url: args.url,
        createdAt: args.createdAt,
        category: args.category,
        lastScraped: Date.now(),
      });
      return existing._id;
    } else {
      // Insert new post
      return await ctx.db.insert("discoursePost", {
        postId: args.postId,
        title: args.title,
        content: args.content,
        url: args.url,
        createdAt: args.createdAt,
        category: args.category,
        lastScraped: Date.now(),
      });
    }
  },
});

export const storeQuestion = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    links: v.array(v.object({
      url: v.string(),
      text: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", {
      question: args.question,
      answer: args.answer,
      links: args.links,
      timestamp: Date.now(),
    });
  },
});
