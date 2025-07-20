import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Ingredient } from "@shared/schema";
import Navigation from "@/components/navigation";
import IngredientCard from "@/components/ingredient-card";
import PlateBuilder from "@/components/plate-builder";
import ProgressBar from "@/components/progress-bar";
import Recommendations from "@/components/recommendations";

export default function MealPlanner() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data: ingredients = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: ["/api/ingredients"],
  });

  const total = selectedIngredients.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.price += item.price;
      return acc;
    },
    { calories: 0, protein: 0, price: 0 }
  );

  const addIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find(item => item.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredientId: number) => {
    setSelectedIngredients(selectedIngredients.filter(item => item.id !== ingredientId));
  };

  const clearPlate = () => {
    setSelectedIngredients([]);
  };

  const filteredIngredients = activeFilter === "all" 
    ? ingredients 
    : ingredients.filter(ingredient => {
        switch (activeFilter) {
          case "protein":
            return ingredient.type === "بروتين";
          case "carbs":
            return ingredient.type === "كربوهيدرات";
          case "vegetables":
            return ingredient.type === "خضار";
          default:
            return true;
        }
      });

  const filterOptions = [
    { key: "all", label: "الكل" },
    { key: "protein", label: "بروتين" },
    { key: "carbs", label: "كربوهيدرات" },
    { key: "vegetables", label: "خضار" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <ProgressBar total={total} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredient Selector */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  <svg className="inline w-6 h-6 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  المكونات المتوفرة
                </h2>
                
                {/* Filter Tabs */}
                <div className="flex space-x-2 space-x-reverse">
                  {filterOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setActiveFilter(option.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === option.key
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredIngredients.map(ingredient => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    onAdd={addIngredient}
                    isSelected={selectedIngredients.some(item => item.id === ingredient.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Plate Builder */}
          <div className="lg:col-span-1">
            <PlateBuilder
              selectedIngredients={selectedIngredients}
              total={total}
              onRemove={removeIngredient}
              onClear={clearPlate}
            />
          </div>
        </div>

        {/* Recommendations Section */}
        <Recommendations />
      </main>
    </div>
  );
}
