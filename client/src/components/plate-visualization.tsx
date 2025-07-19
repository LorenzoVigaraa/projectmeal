import type { Ingredient } from "@shared/schema";

interface PlateVisualizationProps {
  selectedIngredients: Ingredient[];
}

export default function PlateVisualization({ selectedIngredients }: PlateVisualizationProps) {
  // Group ingredients by type for better plate organization
  const groupedIngredients = selectedIngredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.type]) {
      acc[ingredient.type] = [];
    }
    acc[ingredient.type].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  // Define positions and colors for different ingredient types
  const getIngredientStyle = (type: string, index: number, total: number) => {
    const positions = {
      "بروتين": { 
        x: 45, 
        y: 40, 
        color: "#D2691E", // Saddle brown for protein
        width: 25,
        height: 15
      },
      "كربوهيدرات": { 
        x: 25, 
        y: 55, 
        color: "#DAA520", // Goldenrod for carbs
        width: 20,
        height: 20
      },
      "خضار": { 
        x: 65, 
        y: 50, 
        color: "#228B22", // Forest green for vegetables
        width: 15,
        height: 12
      },
      "صوص": { 
        x: 50, 
        y: 30, 
        color: "#8B4513", // Saddle brown for sauce
        width: 8,
        height: 8
      }
    };

    const baseStyle = positions[type] || positions["خضار"];
    
    // Slightly offset multiple items of same type
    const offset = index * 3;
    
    return {
      ...baseStyle,
      x: baseStyle.x + (offset % 10),
      y: baseStyle.y + Math.floor(offset / 10) * 5
    };
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Plate SVG */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-auto drop-shadow-lg"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
      >
        {/* Plate base with gradient and rim */}
        <defs>
          <radialGradient id="plateGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8f9fa" />
            <stop offset="100%" stopColor="#e9ecef" />
          </radialGradient>
          <radialGradient id="rimGradient" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#e9ecef" />
            <stop offset="100%" stopColor="#dee2e6" />
          </radialGradient>
        </defs>
        
        {/* Outer rim */}
        <circle 
          cx="100" 
          cy="100" 
          r="95" 
          fill="url(#rimGradient)" 
          stroke="#adb5bd"
          strokeWidth="1"
        />
        
        {/* Inner plate surface */}
        <circle 
          cx="100" 
          cy="100" 
          r="85" 
          fill="url(#plateGradient)" 
          stroke="#ced4da"
          strokeWidth="1"
        />
        
        {/* Subtle inner rim */}
        <circle 
          cx="100" 
          cy="100" 
          r="78" 
          fill="none" 
          stroke="#e9ecef"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Render ingredients on the plate */}
        {Object.entries(groupedIngredients).map(([type, ingredients]) =>
          ingredients.map((ingredient, index) => {
            const style = getIngredientStyle(type, index, ingredients.length);
            
            return (
              <g key={`${ingredient.id}-${index}`}>
                {/* Ingredient representation */}
                {type === "بروتين" && (
                  <ellipse
                    cx={style.x * 2}
                    cy={style.y * 2}
                    rx={style.width}
                    ry={style.height}
                    fill={style.color}
                    stroke="#A0522D"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                )}
                
                {type === "كربوهيدرات" && (
                  <rect
                    x={style.x * 2 - style.width / 2}
                    y={style.y * 2 - style.height / 2}
                    width={style.width}
                    height={style.height}
                    rx="3"
                    fill={style.color}
                    stroke="#B8860B"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                )}
                
                {type === "خضار" && (
                  <g>
                    {/* Leafy vegetable representation */}
                    <path
                      d={`M ${style.x * 2 - style.width/2} ${style.y * 2} 
                          Q ${style.x * 2} ${style.y * 2 - style.height/2} 
                          ${style.x * 2 + style.width/2} ${style.y * 2}
                          Q ${style.x * 2} ${style.y * 2 + style.height/2} 
                          ${style.x * 2 - style.width/2} ${style.y * 2}`}
                      fill={style.color}
                      stroke="#006400"
                      strokeWidth="1"
                      opacity="0.9"
                    />
                  </g>
                )}
                
                {type === "صوص" && (
                  <circle
                    cx={style.x * 2}
                    cy={style.y * 2}
                    r={style.width / 2}
                    fill={style.color}
                    stroke="#654321"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                )}
              </g>
            );
          })
        )}

        {/* Empty plate message */}
        {selectedIngredients.length === 0 && (
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fill="#6c757d"
            fontSize="12"
            fontFamily="Arial, sans-serif"
          >
            أضف مكونات لترى الطبق
          </text>
        )}
      </svg>

      {/* Ingredient legend */}
      {selectedIngredients.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(groupedIngredients).map(([type, ingredients]) => (
            <div key={type} className="flex items-center space-x-2 space-x-reverse">
              <div 
                className="w-3 h-3 rounded-full border"
                style={{ 
                  backgroundColor: type === "بروتين" ? "#D2691E" :
                                 type === "كربوهيدرات" ? "#DAA520" :
                                 type === "خضار" ? "#228B22" : "#8B4513"
                }}
              />
              <span className="text-gray-600">{type} ({ingredients.length})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}