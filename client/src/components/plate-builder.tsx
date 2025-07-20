import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PlateVisualization from "@/components/plate-visualization";
import { apiRequest } from "@/lib/queryClient";
import type { Ingredient } from "@shared/schema";

interface PlateBuilderProps {
  selectedIngredients: Ingredient[];
  total: { calories: number; protein: number; price: number };
  onRemove: (ingredientId: number) => void;
  onClear: () => void;
}

const backgroundColorMap: Record<string, string> = {
  red: "bg-red-50 border-red-200",
  blue: "bg-blue-50 border-blue-200",
  amber: "bg-amber-50 border-amber-200",
  orange: "bg-orange-50 border-orange-200",
  green: "bg-green-50 border-green-200",
  purple: "bg-purple-50 border-purple-200",
};

const textColorMap: Record<string, string> = {
  red: "text-red-400 hover:text-red-600",
  blue: "text-blue-400 hover:text-blue-600",
  amber: "text-amber-400 hover:text-amber-600",
  orange: "text-orange-400 hover:text-orange-600",
  green: "text-green-400 hover:text-green-600",
  purple: "text-purple-400 hover:text-purple-600",
};

export default function PlateBuilder({ selectedIngredients, total, onRemove, onClear }: PlateBuilderProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Create plate mutation
  const createPlateMutation = useMutation({
    mutationFn: async (plateData: any) => {
      const response = await apiRequest('POST', '/api/plates', plateData);
      return response.json();
    },
    onSuccess: (plate) => {
      queryClient.invalidateQueries({ queryKey: ['/api/plates'] });
      setLocation(`/checkout/${plate.id}`);
    },
    onError: () => {
      toast({
        title: "خطأ في الحفظ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSaveToFavorites = () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "الطبق فارغ",
        description: "يرجى إضافة مكونات أولاً",
        variant: "destructive",
      });
      return;
    }

    const plateData = {
      name: `طبق مخصص - ${new Date().toLocaleDateString('ar-SA')}`,
      ingredientIds: selectedIngredients.map(ingredient => ingredient.id.toString()),
      totalCalories: total.calories,
      totalProtein: total.protein,
      totalPrice: total.price,
      isFavorite: true,
      userId: 1, // For demo purposes
    };

    createPlateMutation.mutate(plateData);
  };

  const handleOrderMeal = () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "الطبق فارغ",
        description: "يرجى إضافة مكونات أولاً",
        variant: "destructive",
      });
      return;
    }

    // First save the plate, then redirect to checkout
    const plateData = {
      name: `طبق للطلب - ${new Date().toLocaleDateString('ar-SA')}`,
      ingredientIds: selectedIngredients.map(ingredient => ingredient.id.toString()),
      totalCalories: total.calories,
      totalProtein: total.protein,
      totalPrice: total.price,
      isFavorite: false,
      userId: 1, // For demo purposes
    };

    createPlateMutation.mutate(plateData);
  };

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            <svg className="inline w-6 h-6 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            صحني
          </h2>
          {selectedIngredients.length > 0 && (
            <button 
              onClick={onClear}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Plate Visualization */}
        <div className="mb-6">
          <PlateVisualization selectedIngredients={selectedIngredients} />
        </div>

        {/* Empty State Message */}
        {selectedIngredients.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">ابدأ بإضافة مكونات إلى الصحن</p>
            <p className="text-xs text-gray-400">اختر من المكونات المتوفرة على الجانب الأيمن</p>
          </div>
        )}

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="space-y-3 mb-6">
            {selectedIngredients.map((ingredient) => (
              <div 
                key={ingredient.id}
                className={`flex items-center justify-between ${backgroundColorMap[ingredient.color]} border rounded-lg p-3 animate-fade-in`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-xl">
                    {ingredient.type === "بروتين" && "🍗"}
                    {ingredient.type === "كربوهيدرات" && "🌾"}
                    {ingredient.type === "خضار" && "🥬"}
                    {ingredient.type === "صوص" && "🧴"}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                    <p className="text-xs text-gray-500">{ingredient.calories} ك.س • {ingredient.protein}غ بروتين</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(ingredient.id)}
                  className={`${textColorMap[ingredient.color]} transition-colors`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nutritional Summary */}
        {selectedIngredients.length > 0 && (
          <>
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">ملخص غذائي</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-red-500">🔥</span>
                    <span className="text-sm text-gray-600">السعرات الحرارية</span>
                  </div>
                  <span className="font-semibold text-gray-900">{total.calories} ك.س</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-orange-500">💪</span>
                    <span className="text-sm text-gray-600">البروتين</span>
                  </div>
                  <span className="font-semibold text-gray-900">{total.protein.toFixed(1)} غ</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-500">💰</span>
                    <span className="text-sm text-gray-600">إجمالي التكلفة</span>
                  </div>
                  <span className="font-bold text-green-500">{total.price.toFixed(2)} د.ك</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button 
                onClick={handleSaveToFavorites}
                disabled={createPlateMutation.isPending}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {createPlateMutation.isPending ? 'جاري الحفظ...' : 'حفظ في المفضلة'}
              </Button>
              <Button 
                onClick={handleOrderMeal}
                disabled={createPlateMutation.isPending}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {createPlateMutation.isPending ? 'جاري التحضير...' : 'طلب الوجبة'}
              </Button>
            </div>

            {/* Nutritional Goals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">الأهداف اليومية</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">السعرات الحرارية</span>
                  <span className="text-gray-900">{total.calories} / 2000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((total.calories / 2000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">البروتين</span>
                  <span className="text-gray-900">{total.protein.toFixed(1)} / 150 غ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((total.protein / 150) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
