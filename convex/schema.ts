import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  courseContent: defineTable({
    url: v.string(),
    title: v.string(),
    content: v.string(),
    lastScraped: v.number(),
  }).index("by_url", ["url"]),
  
  discoursePost: defineTable({
    postId: v.string(),
    title: v.string(),
    content: v.string(),
    url: v.string(),
    createdAt: v.string(),
    category: v.string(),
    lastScraped: v.number(),
  }).index("by_post_id", ["postId"])
   .index("by_created_at", ["createdAt"]),

  questions: defineTable({
    question: v.string(),
    answer: v.string(),
    links: v.array(v.object({
      url: v.string(),
      text: v.string(),
    })),
    timestamp: v.number(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
