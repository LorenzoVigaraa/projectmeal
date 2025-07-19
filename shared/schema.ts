import { pgTable, text, serial, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'بروتين', 'كربوهيدرات', 'خضار', 'صوص'
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  price: real("price").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const plates = pgTable("plates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  ingredientIds: text("ingredient_ids").array().notNull(),
  totalCalories: integer("total_calories").notNull(),
  totalProtein: real("total_protein").notNull(),
  totalPrice: real("total_price").notNull(),
  isFavorite: boolean("is_favorite").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

export const insertPlateSchema = createInsertSchema(plates).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Plate = typeof plates.$inferSelect;
export type InsertPlate = z.infer<typeof insertPlateSchema>;
