import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Main API endpoint for answering questions with AI Pipe
http.route({
  path: "/api/",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { question, image } = body;

      if (!question || typeof question !== "string") {
        return new Response(
          JSON.stringify({ error: "Question is required and must be a string" }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      // Process the question using TDS action
      const result = await ctx.runAction(api.tds.answerQuestion, {
        question,
        image: image || null,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    } catch (error) {
      console.error("API Error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }),
});

// Handle CORS preflight requests
http.route({
  path: "/api/",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }),
});

// AI Pipe usage endpoint
http.route({
  path: "/usage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { aipipeToken } = body;

      if (!aipipeToken) {
        return new Response(
          JSON.stringify({ error: "AI Pipe token is required" }),
          { 
            status: 401,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      const usage = await ctx.runAction(api.aipipe.getAIPipeUsage, {
        aipipeToken,
      });

      return new Response(JSON.stringify(usage), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });
    } catch (error) {
      console.error("Usage API Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch usage data" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }),
});

export default http;
