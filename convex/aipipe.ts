"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const answerQuestionWithAIPipe = action({
  args: {
    question: v.string(),
    aipipeToken: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const messages = [
        {
          role: "system" as const,
          content: `You are a virtual Teaching Assistant for the IIT Madras Online Degree Tools in Data Science (TDS) course. 

Your role is to answer student questions based on your knowledge of data science, Python programming, machine learning, and general TDS course topics.

Guidelines:
1. Answer questions accurately and helpfully
2. Focus on TDS course content and data science topics
3. Provide practical, actionable advice
4. If you're unsure about specific course policies, recommend checking the official course materials
5. Be educational and supportive in your responses

Respond with a clear, helpful answer that addresses the student's question.`
        },
        {
          role: "user" as const,
          content: args.question
        }
      ];

      const response = await fetch('https://aipipe.org/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${args.aipipeToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Pipe API error: ${response.status}`);
      }

      const result = await response.json();
      const answer = result.choices[0].message.content || "I couldn't generate an answer.";

      // Provide general TDS course links
      const links = [
        {
          url: "https://tds.s-anand.net/#/",
          text: "TDS Course Materials"
        },
        {
          url: "https://discourse.onlinedegree.iitm.ac.in/c/courses/tds-kb/34",
          text: "TDS Knowledge Base"
        }
      ];

      return {
        answer,
        links,
      };
    } catch (error) {
      console.error("Error with AI Pipe:", error);
      return {
        answer: "I'm sorry, I encountered an error while processing your question. Please try again.",
        links: [],
      };
    }
  },
});

export const getAIPipeUsage = action({
  args: {
    aipipeToken: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await fetch('https://aipipe.org/usage', {
        headers: {
          'Authorization': `Bearer ${args.aipipeToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`AI Pipe usage API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching AI Pipe usage:", error);
      throw error;
    }
  },
});
