import type { Ingredient } from "@shared/schema";

export const ingredients: Omit<Ingredient, 'id'>[] = [
  { name: "صدر دجاج", type: "بروتين", calories: 165, protein: 31, price: 0.7, icon: "fas fa-drumstick-bite", color: "red" },
  { name: "رز بني", type: "كربوهيدرات", calories: 215, protein: 5, price: 0.4, icon: "fas fa-seedling", color: "amber" },
  { name: "سلطة خضراء", type: "خضار", calories: 25, protein: 1, price: 0.2, icon: "fas fa-leaf", color: "green" },
  { name: "بطاط مسلوق", type: "كربوهيدرات", calories: 130, protein: 3, price: 0.3, icon: "fas fa-cookie-bite", color: "orange" },
  { name: "تونة خفيفة", type: "بروتين", calories: 120, protein: 25, price: 0.6, icon: "fas fa-fish", color: "blue" },
  { name: "صوص دايت", type: "صوص", calories: 40, protein: 0, price: 0.2, icon: "fas fa-tint", color: "purple" },
];

export const calculateNutrition = (selectedIngredients: Ingredient[]) => {
  return selectedIngredients.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.price += item.price;
      return acc;
    },
    { calories: 0, protein: 0, price: 0 }
  );
};
