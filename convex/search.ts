import { query } from "./_generated/server";
import { v } from "convex/values";

export const findRelevantContent = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const queryLower = args.query.toLowerCase();
    
    // Get course content
    const courseContent = await ctx.db.query("courseContent").collect();
    
    // Get discourse posts
    const discoursePosts = await ctx.db.query("discoursePost").collect();
    
    // Simple relevance scoring based on keyword matching
    const allContent = [
      ...courseContent.map(item => ({
        url: item.url,
        title: item.title,
        content: item.content,
        type: "course" as const,
        score: calculateRelevanceScore(queryLower, item.title + " " + item.content),
      })),
      ...discoursePosts.map(item => ({
        url: item.url,
        title: item.title,
        content: item.content,
        type: "discourse" as const,
        score: calculateRelevanceScore(queryLower, item.title + " " + item.content),
      })),
    ];
    
    // Sort by relevance score and return top results
    return allContent
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },
});

function calculateRelevanceScore(query: string, content: string): number {
  const contentLower = content.toLowerCase();
  const queryWords = query.split(/\s+/).filter(word => word.length > 2);
  
  let score = 0;
  
  for (const word of queryWords) {
    // Count occurrences of each query word
    const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
    score += matches;
    
    // Bonus for exact phrase matches
    if (contentLower.includes(query)) {
      score += 5;
    }
  }
  
  return score;
}

export const getAllContent = query({
  args: {},
  handler: async (ctx) => {
    const courseContent = await ctx.db.query("courseContent").collect();
    const discoursePosts = await ctx.db.query("discoursePost").collect();
    
    return {
      courseContent: courseContent.length,
      discoursePosts: discoursePosts.length,
      totalContent: courseContent.length + discoursePosts.length,
    };
  },
});
