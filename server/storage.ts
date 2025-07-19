import { users, ingredients, plates, type User, type InsertUser, type Ingredient, type InsertIngredient, type Plate, type InsertPlate } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientsByType(type: string): Promise<Ingredient[]>;
  createPlate(plate: InsertPlate): Promise<Plate>;
  getUserPlates(userId: number): Promise<Plate[]>;
  getFavoritePlates(userId: number): Promise<Plate[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ingredients: Map<number, Ingredient>;
  private plates: Map<number, Plate>;
  private currentUserId: number;
  private currentIngredientId: number;
  private currentPlateId: number;

  constructor() {
    this.users = new Map();
    this.ingredients = new Map();
    this.plates = new Map();
    this.currentUserId = 1;
    this.currentIngredientId = 1;
    this.currentPlateId = 1;
    this.initializeIngredients();
  }

  private initializeIngredients() {
    const defaultIngredients: Omit<Ingredient, 'id'>[] = [
      { name: "صدر دجاج", type: "بروتين", calories: 165, protein: 31, price: 0.7, icon: "fas fa-drumstick-bite", color: "red" },
      { name: "تونة خفيفة", type: "بروتين", calories: 120, protein: 25, price: 0.6, icon: "fas fa-fish", color: "blue" },
      { name: "رز بني", type: "كربوهيدرات", calories: 215, protein: 5, price: 0.4, icon: "fas fa-seedling", color: "amber" },
      { name: "بطاط مسلوق", type: "كربوهيدرات", calories: 130, protein: 3, price: 0.3, icon: "fas fa-cookie-bite", color: "orange" },
      { name: "سلطة خضراء", type: "خضار", calories: 25, protein: 1, price: 0.2, icon: "fas fa-leaf", color: "green" },
      { name: "صوص دايت", type: "صوص", calories: 40, protein: 0, price: 0.2, icon: "fas fa-tint", color: "purple" },
    ];

    defaultIngredients.forEach(ingredient => {
      const id = this.currentIngredientId++;
      this.ingredients.set(id, { ...ingredient, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values());
  }

  async getIngredientsByType(type: string): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values()).filter(ingredient => ingredient.type === type);
  }

  async createPlate(insertPlate: InsertPlate): Promise<Plate> {
    const id = this.currentPlateId++;
    const plate: Plate = { 
      ...insertPlate, 
      id,
      userId: insertPlate.userId ?? null,
      isFavorite: insertPlate.isFavorite ?? false
    };
    this.plates.set(id, plate);
    return plate;
  }

  async getUserPlates(userId: number): Promise<Plate[]> {
    return Array.from(this.plates.values()).filter(plate => plate.userId === userId);
  }

  async getFavoritePlates(userId: number): Promise<Plate[]> {
    return Array.from(this.plates.values()).filter(plate => plate.userId === userId && plate.isFavorite);
  }
}

export const storage = new MemStorage();
