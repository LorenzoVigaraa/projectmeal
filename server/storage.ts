import { users, ingredients, plates, orders, type User, type InsertUser, type Ingredient, type InsertIngredient, type Plate, type InsertPlate, type Order, type InsertOrder } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientsByType(type: string): Promise<Ingredient[]>;
  createPlate(plate: InsertPlate): Promise<Plate>;
  getUserPlates(userId: number): Promise<Plate[]>;
  getFavoritePlates(userId: number): Promise<Plate[]>;
  getPlate(id: number): Promise<Plate | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    const allIngredients = await db.select().from(ingredients);
    
    // If no ingredients exist, seed the database with default ingredients
    if (allIngredients.length === 0) {
      await this.seedIngredients();
      return await db.select().from(ingredients);
    }
    
    return allIngredients;
  }

  async getIngredientsByType(type: string): Promise<Ingredient[]> {
    return await db.select().from(ingredients).where(eq(ingredients.type, type));
  }

  async createPlate(insertPlate: InsertPlate): Promise<Plate> {
    const [plate] = await db
      .insert(plates)
      .values({
        ...insertPlate,
        userId: insertPlate.userId ?? null,
        isFavorite: insertPlate.isFavorite ?? false
      })
      .returning();
    return plate;
  }

  async getUserPlates(userId: number): Promise<Plate[]> {
    return await db.select().from(plates).where(eq(plates.userId, userId));
  }

  async getFavoritePlates(userId: number): Promise<Plate[]> {
    return await db.select().from(plates).where(eq(plates.userId, userId));
  }

  async getPlate(id: number): Promise<Plate | undefined> {
    const [plate] = await db.select().from(plates).where(eq(plates.id, id));
    return plate || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    return order;
  }

  private async seedIngredients(): Promise<void> {
    const defaultIngredients: InsertIngredient[] = [
      { name: "صدر دجاج", type: "بروتين", calories: 165, protein: 31, price: 0.7, icon: "fas fa-drumstick-bite", color: "red" },
      { name: "تونة خفيفة", type: "بروتين", calories: 120, protein: 25, price: 0.6, icon: "fas fa-fish", color: "blue" },
      { name: "رز بني", type: "كربوهيدرات", calories: 215, protein: 5, price: 0.4, icon: "fas fa-seedling", color: "amber" },
      { name: "بطاط مسلوق", type: "كربوهيدرات", calories: 130, protein: 3, price: 0.3, icon: "fas fa-cookie-bite", color: "orange" },
      { name: "سلطة خضراء", type: "خضار", calories: 25, protein: 1, price: 0.2, icon: "fas fa-leaf", color: "green" },
      { name: "صوص دايت", type: "صوص", calories: 40, protein: 0, price: 0.2, icon: "fas fa-tint", color: "purple" },
    ];

    await db.insert(ingredients).values(defaultIngredients);
  }
}

export const storage = new DatabaseStorage();
