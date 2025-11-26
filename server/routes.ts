import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { getChatResponse, analyzeSoil } from "./openai";

const CURRENT_FARMER_ID = "default-farmer";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Weather endpoints
  app.get("/api/weather/current", async (req, res) => {
    try {
      const weather = await db.query.weatherData.findFirst({
        orderBy: [desc(schema.weatherData.timestamp)],
        limit: 1,
      });

      if (!weather) {
        return res.status(404).json({ message: "No weather data available" });
      }

      res.json(weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Crops endpoints
  app.get("/api/crops/recommended", async (req, res) => {
    try {
      const crops = await db.query.crops.findMany({
        limit: 4,
      });
      res.json(crops);
    } catch (error) {
      console.error("Error fetching crops:", error);
      res.status(500).json({ message: "Failed to fetch crops" });
    }
  });

  app.get("/api/crops", async (req, res) => {
    try {
      const crops = await db.query.crops.findMany();
      res.json(crops);
    } catch (error) {
      console.error("Error fetching all crops:", error);
      res.status(500).json({ message: "Failed to fetch crops" });
    }
  });

  // Resources endpoints
  app.get("/api/resources/current", async (req, res) => {
    try {
      const currentMonth = new Date().toLocaleString("default", { month: "long" });
      const currentYear = new Date().getFullYear();

      const resources = await db.query.resources.findMany({
        where: eq(schema.resources.month, currentMonth),
        limit: 3,
      });

      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Advisories endpoints
  app.get("/api/advisories/recent", async (req, res) => {
    try {
      const advisories = await db.query.advisories.findMany({
        orderBy: [desc(schema.advisories.timestamp)],
        limit: 3,
      });
      res.json(advisories);
    } catch (error) {
      console.error("Error fetching recent advisories:", error);
      res.status(500).json({ message: "Failed to fetch advisories" });
    }
  });

  app.get("/api/advisories", async (req, res) => {
    try {
      const advisories = await db.query.advisories.findMany({
        orderBy: [desc(schema.advisories.timestamp)],
      });
      res.json(advisories);
    } catch (error) {
      console.error("Error fetching all advisories:", error);
      res.status(500).json({ message: "Failed to fetch advisories" });
    }
  });

  // Chat endpoints
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await db.query.chatMessages.findMany({
        where: eq(schema.chatMessages.farmerId, CURRENT_FARMER_ID),
        orderBy: [schema.chatMessages.timestamp],
        limit: 50,
      });
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { content, language } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Save user message
      const userMessage = await db.insert(schema.chatMessages).values({
        farmerId: CURRENT_FARMER_ID,
        role: "user",
        content: content.trim(),
        language: language || "en",
      }).returning();

      // Get AI response
      const aiResponse = await getChatResponse(content.trim(), language || "en");

      // Save AI message
      const assistantMessage = await db.insert(schema.chatMessages).values({
        farmerId: CURRENT_FARMER_ID,
        role: "assistant",
        content: aiResponse,
        language: language || "en",
      }).returning();

      res.json({
        userMessage: userMessage[0],
        assistantMessage: assistantMessage[0],
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Soil analysis endpoint
  app.post("/api/soil/analyze", async (req, res) => {
    try {
      const { soilType, nitrogen, phosphorus, potassium, ph, organicMatter } = req.body;

      if (!soilType) {
        return res.status(400).json({ message: "Soil type is required" });
      }

      // Get AI-powered recommendations
      const recommendations = await analyzeSoil({
        soilType,
        nitrogen: nitrogen || 0,
        phosphorus: phosphorus || 0,
        potassium: potassium || 0,
        ph: ph || 7,
        organicMatter: organicMatter || 0,
      });

      // Save analysis
      const analysis = await db.insert(schema.soilAnalyses).values({
        farmerId: CURRENT_FARMER_ID,
        soilType,
        nitrogen,
        phosphorus,
        potassium,
        ph,
        organicMatter,
        recommendations,
      }).returning();

      res.json(analysis[0]);
    } catch (error) {
      console.error("Error analyzing soil:", error);
      res.status(500).json({ message: "Failed to analyze soil" });
    }
  });

  // Pests and diseases endpoints
  app.get("/api/pests-diseases", async (req, res) => {
    try {
      const pestsAndDiseases = await db.query.pestsDiseases.findMany();
      res.json(pestsAndDiseases);
    } catch (error) {
      console.error("Error fetching pests and diseases:", error);
      res.status(500).json({ message: "Failed to fetch pests and diseases" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
