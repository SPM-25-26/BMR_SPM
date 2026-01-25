import { memo, useCallback, useMemo } from 'react';
import { Calendar, MapPin, Leaf, Milk, Wheat } from 'lucide-react';

export interface RecommendationItem {
  id: string | number;
  title: string;
  cardBadge: string;
  category: string;
  location?: string;
  image: string;
  date?: string;
  distance?: number;
  dietaryNeeds?: string[];
}

export interface UserPreferences {
  interests: string[];
  travelStyle: string;
  dietaryNeeds: string[];
}

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onClick: (recommendation: RecommendationItem) => void;
  userPreferences: UserPreferences;
}

// Configurazione esigenze dietetiche
const dietaryNeedsConfig: Record<string, { icon: typeof Leaf; text: string }> = {
  'Adatto ai vegetariani': { icon: Leaf, text: 'Adatto ai vegetariani' },
  'Alternative senza lattosio': { icon: Milk, text: 'Alternative senza lattosio' },
  'Adatto ai celiaci': { icon: Wheat, text: 'Adatto ai celiaci' }
};

// Mappa user preferences alle etichette del backend
const userDietaryNeedsMap: Record<string, string> = {
  'celiachia': 'Adatto ai celiaci',
  'lattosio': 'Alternative senza lattosio',
  'vegetariano': 'Adatto ai vegetariani'
};

const RecommendationCard = memo(function RecommendationCard({ 
  recommendation, 
  onClick, 
  userPreferences 
}: RecommendationCardProps) {
  const handleClick = useCallback(() => {
    onClick(recommendation);
  }, [onClick, recommendation]);
  
  // Determina se mostrare il badge "adatto a bambini"
  const showFamilyBadge = recommendation.category === 'Event' && userPreferences.travelStyle === 'famiglia';
  
  // Filtra le esigenze dietetiche da mostrare
  const dietaryBadgesToShow = useMemo(() => {
    if (recommendation.category !== 'Restaurant' || !userPreferences.dietaryNeeds?.length || !recommendation.dietaryNeeds?.length) {
      return [];
    }

    const badges: Array<{ icon: typeof Leaf; text: string }> = [];
    
    for (const userDiet of userPreferences.dietaryNeeds) {
      const mappedDiet = userDietaryNeedsMap[userDiet.toLowerCase()];
      if (mappedDiet && recommendation.dietaryNeeds.includes(mappedDiet)) {
        const config = dietaryNeedsConfig[mappedDiet];
        if (config) {
          badges.push(config);
        }
      }
    }
    
    return badges;
  }, [recommendation.category, recommendation.dietaryNeeds, userPreferences.dietaryNeeds]);
  
  return (
    <div onClick={handleClick} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="h-36 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
        <img
          src={recommendation.image}
          alt={recommendation.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 sm:p-3 md:p-4">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
            {recommendation.cardBadge}
          </span>
          {recommendation.category === 'Event' ? (
            recommendation.date && (
              <div className="flex items-center gap-1 text-[#0066cc]">
                <Calendar className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                <span className="text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
                  {recommendation.date}
                </span>
              </div>
            )
          ) : (
            recommendation.distance !== undefined && recommendation.distance > -1 && (
              <span className="bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
                {recommendation.distance.toFixed(1)}km                  
              </span>
            )
          )}
        </div>
        
        {/* Badge "adatto a bambini" per utenti con preferenze famiglia */}
        {showFamilyBadge && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
              <span className="text-[12px] sm:text-[14px]">👶</span>
              Adatto a bambini
            </span>
          </div>
        )}

        {/* Badge esigenze dietetiche per ristoranti */}
        {dietaryBadgesToShow.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {dietaryBadgesToShow.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 leading-none bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]"
                >
                  <Icon className="inline-block align-middle shrink-0 w-3 h-3 sm:w-3 sm:h-3" />
                  <span className="inline whitespace-nowrap">
                    {badge.text}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        <h4 className="text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:Bold',sans-serif] mb-1.5 sm:mb-2 overflow-hidden text-ellipsis line-clamp-2">
          {recommendation.title}
        </h4>
        {recommendation.location && (
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
              {recommendation.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export default RecommendationCard;