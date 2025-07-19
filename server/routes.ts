import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all ingredients
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  // Get ingredients by type
  app.get("/api/ingredients/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const ingredients = await storage.getIngredientsByType(type);
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients by type" });
    }
  });

  // Save plate
  app.post("/api/plates", async (req, res) => {
    try {
      const plateData = insertPlateSchema.parse(req.body);
      const plate = await storage.createPlate(plateData);
      res.json(plate);
    } catch (error) {
      res.status(400).json({ message: "Failed to save plate" });
    }
  });

  // Get user plates
  app.get("/api/plates/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const plates = await storage.getUserPlates(userId);
      res.json(plates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user plates" });
    }
  });

  // Get favorite plates
  app.get("/api/plates/:userId/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const plates = await storage.getFavoritePlates(userId);
      res.json(plates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorite plates" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
