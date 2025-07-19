import { Button } from "@/components/ui/button";
import type { Ingredient } from "@shared/schema";

interface IngredientCardProps {
  ingredient: Ingredient;
  onAdd: (ingredient: Ingredient) => void;
  isSelected: boolean;
}

const colorMap: Record<string, string> = {
  red: "from-red-50 to-red-100 border-red-200",
  blue: "from-blue-50 to-blue-100 border-blue-200",
  amber: "from-amber-50 to-amber-100 border-amber-200",
  orange: "from-orange-50 to-orange-100 border-orange-200",
  green: "from-green-50 to-green-100 border-green-200",
  purple: "from-purple-50 to-purple-100 border-purple-200",
};

const buttonColorMap: Record<string, string> = {
  red: "bg-red-500 hover:bg-red-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  amber: "bg-amber-500 hover:bg-amber-600",
  orange: "bg-orange-500 hover:bg-orange-600",
  green: "bg-green-500 hover:bg-green-600",
  purple: "bg-purple-500 hover:bg-purple-600",
};

export default function IngredientCard({ ingredient, onAdd, isSelected }: IngredientCardProps) {
  const handleAdd = () => {
    onAdd(ingredient);
  };

  return (
    <div className={`ingredient-card bg-gradient-to-br ${colorMap[ingredient.color]} border-2 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${isSelected ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
          <span className={`inline-block ${buttonColorMap[ingredient.color].split(' ')[0]} text-white text-xs px-2 py-1 rounded-full mt-1`}>
            {ingredient.type}
          </span>
        </div>
        <div className="text-xl text-gray-600">
          {ingredient.type === "بروتين" && "🍗"}
          {ingredient.type === "كربوهيدرات" && "🌾"}
          {ingredient.type === "خضار" && "🥬"}
          {ingredient.type === "صوص" && "🧴"}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
        <div className="text-center">
          <div className="font-medium text-gray-900">{ingredient.calories}</div>
          <div className="text-xs">ك.س</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">{ingredient.protein}غ</div>
          <div className="text-xs">بروتين</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-green-500">{ingredient.price} د.ك</div>
          <div className="text-xs">السعر</div>
        </div>
      </div>
      
      <Button
        onClick={handleAdd}
        disabled={isSelected}
        className={`w-full ${buttonColorMap[ingredient.color]} text-white py-2 rounded-lg font-medium transition-colors`}
      >
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        {isSelected ? "مضاف" : "إضافة للصحن"}
      </Button>
    </div>
  );
}
