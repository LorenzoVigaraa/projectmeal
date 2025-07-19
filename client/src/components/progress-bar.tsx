import { Card, CardContent } from "@/components/ui/card";

interface ProgressBarProps {
  total: { calories: number; protein: number; price: number };
}

export default function ProgressBar({ total }: ProgressBarProps) {
  const caloriePercentage = Math.min((total.calories / 800) * 100, 100);
  const proteinPercentage = Math.min((total.protein / 50) * 100, 100);

  const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            stroke="#E5E7EB" 
            strokeWidth="8" 
            fill="transparent"
          />
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            stroke={color} 
            strokeWidth="8" 
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <svg className="inline w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          تقدم بناء وجبتك
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <CircularProgress percentage={caloriePercentage} color="#4CAF50" />
            <p className="text-sm text-gray-600 mt-2">السعرات الحرارية</p>
            <p className="text-xs text-gray-500">{total.calories} / 800 ك.س</p>
          </div>
          <div className="text-center">
            <CircularProgress percentage={proteinPercentage} color="#FF9800" />
            <p className="text-sm text-gray-600 mt-2">البروتين</p>
            <p className="text-xs text-gray-500">{total.protein.toFixed(1)} / 50 غ</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-lg font-bold">{total.price.toFixed(2)} د.ك</p>
              <p className="text-xs opacity-90">إجمالي التكلفة</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
