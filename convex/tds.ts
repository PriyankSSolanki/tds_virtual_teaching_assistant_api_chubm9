"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://aipipe.org/openai/v1",
  apiKey: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjIzZjIwMDI4MDNAZHMuc3R1ZHkuaWl0bS5hYy5pbiJ9.wPQ82I4uY8aNI9tg9ovfBHwxVKbP4v1AJsHXl69_2J8",
});

export const answerQuestion = action({
  args: {
    question: v.string(),
    image: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args): Promise<{ answer: string; links: Array<{ url: string; text: string }> }> => {
    try {
      // First, ensure we have some sample data in the database
      await ctx.runAction(api.scraper.scrapeCourseContent, {});
      await ctx.runAction(api.scraper.scrapeDiscourse, {});

      // Get relevant content from database
      const relevantContent: Array<{
        url: string;
        title: string;
        content: string;
        type: string;
        score: number;
      }> = await ctx.runQuery(api.search.findRelevantContent, {
        query: args.question,
      });

      // Prepare context for AI
      const context: string = relevantContent.map((item: any) => 
        `Source: ${item.url}\nTitle: ${item.title}\nContent: ${item.content}\n---`
      ).join('\n');

      const systemPrompt: string = `You are a virtual Teaching Assistant for the IIT Madras Online Degree Tools in Data Science (TDS) course. 

Your role is to answer student questions based ONLY on the provided course content and Discourse posts from the TDS course.

Guidelines:
1. Answer questions accurately based on the provided context
2. Always reference specific sources when possible
3. If the question cannot be answered from the provided context, say so clearly
4. Be helpful and educational in your responses
5. Focus on TDS course content specifically

Context from course materials and Discourse posts:
${context}

Respond with a clear, helpful answer that references the source materials when appropriate.`;

      let messages: Array<any> = [
        { role: "system" as const, content: systemPrompt }
      ];

      // Handle image input if provided
      if (args.image) {
        messages.push({
          role: "user" as const,
          content: [
            {
              type: "text",
              text: args.question
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${args.image}`
              }
            }
          ]
        });
      } else {
        messages.push({
          role: "user" as const,
          content: args.question
        });
      }

      const response = await openai.chat.completions.create({
        model: args.image ? "gpt-4o" : "gpt-4o-mini", // Use gpt-4o for vision capabilities
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      });

      const answer: string = response.choices[0].message.content || "I couldn't generate an answer.";

      // Extract relevant links from the content
      const links: Array<{ url: string; text: string }> = relevantContent.slice(0, 3).map((item: any) => ({
        url: item.url,
        text: item.title || "Relevant course content"
      }));

      // Store the Q&A for future reference
      await ctx.runMutation(api.storage.storeQuestion, {
        question: args.question,
        answer,
        links,
      });

      return {
        answer,
        links,
      };
    } catch (error) {
      console.error("Error answering question:", error);
      return {
        answer: "I'm sorry, I encountered an error while processing your question. Please try again.",
        links: [],
      };
    }
  },
});
