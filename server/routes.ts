import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlateSchema, insertOrderSchema } from "@shared/schema";

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

  // Get single plate
  app.get("/api/plate/:id", async (req, res) => {
    try {
      const plateId = parseInt(req.params.id);
      const plate = await storage.getPlate(plateId);
      if (!plate) {
        return res.status(404).json({ message: "Plate not found" });
      }
      res.json(plate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plate" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  // Get all orders (for developer dashboard)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(orderId, status);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
