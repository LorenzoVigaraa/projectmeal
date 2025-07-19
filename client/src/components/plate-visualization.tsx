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

  // Define designated sections for different ingredient types on the plate
  const getIngredientPosition = (type: string, index: number, totalOfType: number) => {
    // Define quadrants and sections of the plate
    const sections = {
      "بروتين": { 
        centerX: 65,   // Right side of plate
        centerY: 45,   // Center-right
        radiusX: 15,   // Horizontal spread
        radiusY: 12,   // Vertical spread
        color: "#D2691E"
      },
      "كربوهيدرات": { 
        centerX: 35,   // Left side of plate
        centerY: 45,   // Center-left
        radiusX: 15,   
        radiusY: 12,   
        color: "#DAA520"
      },
      "خضار": { 
        centerX: 50,   // Top center of plate
        centerY: 25,   // Upper section
        radiusX: 20,   
        radiusY: 10,   
        color: "#228B22"
      },
      "صوص": { 
        centerX: 50,   // Bottom center
        centerY: 65,   // Lower section (small drizzles)
        radiusX: 12,   
        radiusY: 8,    
        color: "#8B4513"
      }
    };

    const section = sections[type] || sections["خضار"];
    
    // For multiple items of same type, arrange them in their designated section
    let offsetX = 0;
    let offsetY = 0;
    
    if (totalOfType > 1) {
      // Create a small cluster within the section
      const angle = (index * 360 / totalOfType) * Math.PI / 180;
      const radius = Math.min(section.radiusX, section.radiusY) * 0.6;
      offsetX = Math.cos(angle) * radius;
      offsetY = Math.sin(angle) * radius;
    }
    
    return {
      x: section.centerX + offsetX,
      y: section.centerY + offsetY,
      color: section.color
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
          
          {/* Food shadow filters */}
          <filter id="foodShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.15"/>
          </filter>
          
          {/* Food highlight gradients */}
          <radialGradient id="chickenGradient" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#F2D4B3" />
            <stop offset="70%" stopColor="#E6C2A6" />
            <stop offset="100%" stopColor="#D4A574" />
          </radialGradient>
          
          <radialGradient id="tunaGradient" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#F7E8C7" />
            <stop offset="70%" stopColor="#F4E4C1" />
            <stop offset="100%" stopColor="#E6D2A3" />
          </radialGradient>
          
          <radialGradient id="riceGradient" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#E6D2B8" />
            <stop offset="70%" stopColor="#D2B48C" />
            <stop offset="100%" stopColor="#C19A6B" />
          </radialGradient>
          
          <radialGradient id="potatoGradient" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#F7E8D5" />
            <stop offset="70%" stopColor="#F5E6D3" />
            <stop offset="100%" stopColor="#E6D2B8" />
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

        {/* Optional: Subtle section guides (only visible when empty) */}
        {selectedIngredients.length === 0 && (
          <g opacity="0.15">
            {/* Protein section guide - right */}
            <circle cx="130" cy="90" r="25" fill="none" stroke="#D2691E" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="130" y="95" textAnchor="middle" fill="#D2691E" fontSize="8" fontFamily="Arial, sans-serif">بروتين</text>
            
            {/* Carbs section guide - left */}
            <circle cx="70" cy="90" r="25" fill="none" stroke="#DAA520" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="70" y="95" textAnchor="middle" fill="#DAA520" fontSize="8" fontFamily="Arial, sans-serif">كربوهيدرات</text>
            
            {/* Vegetables section guide - top */}
            <ellipse cx="100" cy="50" rx="35" ry="18" fill="none" stroke="#228B22" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="100" y="55" textAnchor="middle" fill="#228B22" fontSize="8" fontFamily="Arial, sans-serif">خضار</text>
            
            {/* Sauce section guide - bottom */}
            <ellipse cx="100" cy="130" rx="20" ry="12" fill="none" stroke="#8B4513" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="100" y="135" textAnchor="middle" fill="#8B4513" fontSize="8" fontFamily="Arial, sans-serif">صوص</text>
          </g>
        )}

        {/* Render realistic food ingredients on the plate in designated sections */}
        {Object.entries(groupedIngredients).map(([type, ingredients]) =>
          ingredients.map((ingredient, index) => {
            const position = getIngredientPosition(type, index, ingredients.length);
            const x = position.x * 2;
            const y = position.y * 2;
            
            return (
              <g key={`${ingredient.id}-${index}`}>
                {/* Chicken breast - realistic representation */}
                {ingredient.name === "صدر دجاج" && (
                  <g filter="url(#foodShadow)">
                    {/* Main chicken piece */}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="22"
                      ry="16"
                      fill="url(#chickenGradient)"
                      stroke="#D4A574"
                      strokeWidth="1.5"
                    />
                    {/* Grilled marks */}
                    <line x1={x-15} y1={y-8} x2={x+15} y2={y-8} stroke="#B8956A" strokeWidth="2" opacity="0.8"/>
                    <line x1={x-15} y1={y} x2={x+15} y2={y} stroke="#B8956A" strokeWidth="2" opacity="0.8"/>
                    <line x1={x-15} y1={y+8} x2={x+15} y2={y+8} stroke="#B8956A" strokeWidth="2" opacity="0.8"/>
                    {/* Texture spots */}
                    <circle cx={x-8} cy={y-5} r="1.5" fill="#D4A574" opacity="0.6"/>
                    <circle cx={x+6} cy={y+3} r="1.2" fill="#D4A574" opacity="0.6"/>
                    <circle cx={x-3} cy={y+8} r="1" fill="#D4A574" opacity="0.6"/>
                  </g>
                )}

                {/* Tuna - realistic representation */}
                {ingredient.name === "تونة خفيفة" && (
                  <g filter="url(#foodShadow)">
                    {/* Tuna chunks */}
                    <ellipse cx={x} cy={y} rx="18" ry="12" fill="url(#tunaGradient)" stroke="#E6D2A3" strokeWidth="1"/>
                    <ellipse cx={x-8} cy={y-3} rx="6" ry="8" fill="#F7E8C7" stroke="#E6D2A3" strokeWidth="1"/>
                    <ellipse cx={x+6} cy={y+4} rx="7" ry="6" fill="#F1E1BE" stroke="#E6D2A3" strokeWidth="1"/>
                    {/* Texture lines for flaky appearance */}
                    <path d={`M ${x-12} ${y-6} Q ${x} ${y-2} ${x+12} ${y-6}`} stroke="#E0C595" strokeWidth="1" fill="none"/>
                    <path d={`M ${x-10} ${y+2} Q ${x+2} ${y+6} ${x+10} ${y+2}`} stroke="#E0C595" strokeWidth="1" fill="none"/>
                    <path d={`M ${x-6} ${y-8} Q ${x+4} ${y-4} ${x+8} ${y-8}`} stroke="#E0C595" strokeWidth="0.8" fill="none"/>
                  </g>
                )}

                {/* Brown rice - realistic representation */}
                {ingredient.name === "رز بني" && (
                  <g filter="url(#foodShadow)">
                    {/* Rice pile base */}
                    <ellipse cx={x} cy={y} rx="20" ry="18" fill="url(#riceGradient)" stroke="#C19A6B" strokeWidth="1"/>
                    {/* Individual rice grains for texture */}
                    {Array.from({length: 15}).map((_, i) => {
                      const angle = (i * 24) * Math.PI / 180;
                      const grainX = x + Math.cos(angle) * (6 + i % 5);
                      const grainY = y + Math.sin(angle) * (4 + i % 4);
                      return (
                        <ellipse
                          key={i}
                          cx={grainX}
                          cy={grainY}
                          rx="1.5"
                          ry="3"
                          fill="#E6D2B8"
                          stroke="#D2B48C"
                          strokeWidth="0.3"
                          transform={`rotate(${i * 12} ${grainX} ${grainY})`}
                          opacity="0.9"
                        />
                      );
                    })}
                    {/* Rice steam */}
                    <path d={`M ${x-5} ${y-20} Q ${x-3} ${y-25} ${x-1} ${y-20}`} stroke="#F0F0F0" strokeWidth="1" fill="none" opacity="0.3"/>
                    <path d={`M ${x+3} ${y-18} Q ${x+5} ${y-23} ${x+7} ${y-18}`} stroke="#F0F0F0" strokeWidth="1" fill="none" opacity="0.3"/>
                  </g>
                )}

                {/* Boiled potatoes - realistic representation */}
                {ingredient.name === "بطاط مسلوق" && (
                  <g filter="url(#foodShadow)">
                    {/* Main potato pieces with gradients */}
                    <ellipse cx={x-5} cy={y-3} rx="12" ry="10" fill="url(#potatoGradient)" stroke="#E6D2B8" strokeWidth="1"/>
                    <ellipse cx={x+8} cy={y+5} rx="10" ry="8" fill="#F2E3D0" stroke="#E6D2B8" strokeWidth="1"/>
                    <ellipse cx={x-2} cy={y+8} rx="8" ry="6" fill="#F7E8D5" stroke="#E6D2B8" strokeWidth="1"/>
                    {/* Potato texture spots */}
                    <circle cx={x-8} cy={y-6} r="1" fill="#E6D2B8" opacity="0.8"/>
                    <circle cx={x+3} cy={y-2} r="0.8" fill="#E6D2B8" opacity="0.8"/>
                    <circle cx={x+6} cy={y+8} r="1.2" fill="#E6D2B8" opacity="0.8"/>
                    {/* Natural potato indentations */}
                    <ellipse cx={x-3} cy={y-1} rx="2" ry="1.5" fill="#E0D0B8" opacity="0.6"/>
                    <ellipse cx={x+5} cy={y+7} rx="1.5" ry="1" fill="#E0D0B8" opacity="0.6"/>
                    {/* Steam effect */}
                    <path d={`M ${x-10} ${y-15} Q ${x-8} ${y-20} ${x-6} ${y-15}`} stroke="#E0E0E0" strokeWidth="1.5" fill="none" opacity="0.4"/>
                    <path d={`M ${x+2} ${y-12} Q ${x+4} ${y-17} ${x+6} ${y-12}`} stroke="#E0E0E0" strokeWidth="1.5" fill="none" opacity="0.4"/>
                  </g>
                )}

                {/* Green salad - realistic representation */}
                {ingredient.name === "سلطة خضراء" && (
                  <g filter="url(#foodShadow)">
                    {/* Multiple lettuce leaves with natural curves */}
                    <path d={`M ${x-15} ${y} Q ${x-10} ${y-12} ${x-5} ${y} Q ${x-10} ${y+8} ${x-15} ${y}`} 
                          fill="#7CB342" stroke="#689F38" strokeWidth="1"/>
                    <path d={`M ${x-5} ${y-3} Q ${x} ${y-15} ${x+5} ${y-3} Q ${x} ${y+5} ${x-5} ${y-3}`} 
                          fill="#8BC34A" stroke="#689F38" strokeWidth="1"/>
                    <path d={`M ${x+5} ${y+2} Q ${x+10} ${y-10} ${x+15} ${y+2} Q ${x+10} ${y+10} ${x+5} ${y+2}`} 
                          fill="#7CB342" stroke="#689F38" strokeWidth="1"/>
                    
                    {/* Additional leaf layers for depth */}
                    <path d={`M ${x-8} ${y-5} Q ${x-3} ${y-8} ${x+2} ${y-5} Q ${x-3} ${y-2} ${x-8} ${y-5}`} 
                          fill="#9CCC65" stroke="#689F38" strokeWidth="0.8" opacity="0.9"/>
                    <path d={`M ${x+3} ${y+6} Q ${x+8} ${y+3} ${x+13} ${y+6} Q ${x+8} ${y+9} ${x+3} ${y+6}`} 
                          fill="#8BC34A" stroke="#689F38" strokeWidth="0.8" opacity="0.9"/>
                    
                    {/* Detailed leaf veins */}
                    <path d={`M ${x-10} ${y-6} L ${x-10} ${y+4}`} stroke="#5A8A2A" strokeWidth="1" opacity="0.8"/>
                    <path d={`M ${x} ${y-9} L ${x} ${y+1}`} stroke="#5A8A2A" strokeWidth="1" opacity="0.8"/>
                    <path d={`M ${x+10} ${y-6} L ${x+10} ${y+6}`} stroke="#5A8A2A" strokeWidth="1" opacity="0.8"/>
                    
                    {/* Branch veins */}
                    <path d={`M ${x-10} ${y-2} Q ${x-7} ${y-1} ${x-4} ${y-2}`} stroke="#5A8A2A" strokeWidth="0.6" opacity="0.7"/>
                    <path d={`M ${x} ${y-5} Q ${x+3} ${y-4} ${x+6} ${y-5}`} stroke="#5A8A2A" strokeWidth="0.6" opacity="0.7"/>
                    <path d={`M ${x+10} ${y+2} Q ${x+13} ${y+3} ${x+16} ${y+2}`} stroke="#5A8A2A" strokeWidth="0.6" opacity="0.7"/>
                    
                    {/* Colorful garnish */}
                    <circle cx={x-5} cy={y+5} r="2.5" fill="#FF5722" stroke="#E53935" strokeWidth="0.5"/> {/* Cherry tomato */}
                    <ellipse cx={x-5} cy={y+5} rx="1" ry="0.8" fill="#FF8A80" opacity="0.7"/> {/* Tomato highlight */}
                    <circle cx={x+8} cy={y-2} r="1.8" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.5"/> {/* Corn kernel */}
                    <circle cx={x+6} cy={y+8} r="1.2" fill="#FF7043" stroke="#BF360C" strokeWidth="0.5"/> {/* Carrot piece */}
                  </g>
                )}

                {/* Diet sauce - realistic representation */}
                {ingredient.name === "صوص دايت" && (
                  <g filter="url(#foodShadow)">
                    {/* Main sauce pool with organic shape */}
                    <path d={`M ${x-8} ${y} Q ${x-4} ${y-6} ${x} ${y-4} Q ${x+4} ${y-6} ${x+8} ${y} Q ${x+4} ${y+6} ${x} ${y+4} Q ${x-4} ${y+6} ${x-8} ${y}`} 
                          fill="#8D6E63" stroke="#5D4037" strokeWidth="1" opacity="0.9"/>
                    
                    {/* Sauce drips and texture */}
                    <ellipse cx={x-6} cy={y-4} rx="4" ry="3" fill="#A1887F" stroke="#5D4037" strokeWidth="0.8" opacity="0.8"/>
                    <ellipse cx={x+5} cy={y+3} rx="3.5" ry="2.5" fill="#795548" stroke="#5D4037" strokeWidth="0.8" opacity="0.8"/>
                    <ellipse cx={x-2} cy={y+5} rx="2.5" ry="2" fill="#6D4C41" stroke="#5D4037" strokeWidth="0.6" opacity="0.8"/>
                    
                    {/* Sauce shine and reflections */}
                    <ellipse cx={x-2} cy={y-2} rx="3" ry="2" fill="#BCAAA4" opacity="0.7"/>
                    <ellipse cx={x+3} cy={y+1} rx="2" ry="1.5" fill="#D7CCC8" opacity="0.5"/>
                    
                    {/* Small sauce bubbles */}
                    <circle cx={x-4} cy={y+2} r="0.8" fill="#A1887F" opacity="0.6"/>
                    <circle cx={x+2} cy={y-3} r="0.6" fill="#A1887F" opacity="0.6"/>
                  </g>
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