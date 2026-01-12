import { Navigation, Calendar, Newspaper, Briefcase, MapPin, Loader2, LogOut, MessageCircle, X, Send, ChevronLeft, ChevronRight, Settings, Leaf, Milk, Wheat } from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { STORAGE_CATEGORIES_KEY, STORAGE_POIS_KEY } from '../api/apiUtils';
import { getCategories, getDiscoverList, type Category, type DiscoverItem, getAllPois } from '../api/infoApi';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorModal from './ui/ErrorModal';
import { getMediaUrl } from '../config/constants';
import SettingsModal from './SettingsModal';
import { useApiDataLoader } from '../hooks/useApiDataLoader';

const DiscoverType = {
  Poi: 0,
  Event: 1,
  Article: 2,
  Organization: 3
} as const;

type DiscoverType = typeof DiscoverType[keyof typeof DiscoverType];

interface HomePageProps {
  user: {
    name: string;
    userName: string;
    email: string;
  };
  userPreferences: {
    interests: string[];
    travelStyle: string;
    dietaryNeeds: string[];
  };
  onLogout: () => void;
  onViewDetail: (item: any) => void;
}

interface Interest {
  name: string;
  icon: typeof Navigation;
  discoverType: DiscoverType;
}

const ITEMS_PER_PAGE = 20;

export default function HomePage({ user, onLogout, userPreferences }: HomePageProps) {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Punti di interesse']);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [discoveryData, setDiscoveryData] = useState<Array<DiscoverItem> | null>(null);
  const [showWorkInProgressModal, setShowWorkInProgressModal] = useState(false);
  const [showLoadDiscoveryTypeErrorModal, setShowLoadDiscoveryTypeErrorModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsError, setGpsError] = useState<{ title: string; message: string } | null>(null);
  const [showGpsErrorModal, setShowGpsErrorModal] = useState(false);
  
  // Lazy loading states
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Cambiato da useRef a useState per le categorie
  const [categories, setCategories] = useState<Array<Category> | null>(null);
  const cachedPois = useRef<Array<DiscoverItem> | null>(null);

  const { 
    isLoading, 
    errorState, 
    showErrorModal, 
    loadData, 
    closeErrorModal, 
    resetLoadingFlag 
  } = useApiDataLoader<Array<Category>>({ 
    onLogout,
    onSuccess: async () => {
      // Handled directly on returned result of loadData
    }
  });

  const cupraImages = useMemo(() => [
    getMediaUrl('/Media/Organization/mobile-home-00356330449-8569dd20-ac7c-48e7-a50b-acbe25da5c41.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-e6aaed31-1509-40d2-baf3-3c458900af03.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-435e0456-03cd-45d9-892d-bfc96c649ffd.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-aad1daeb-9faa-43a4-ad51-b028016766ae.webp'),
  ], []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % cupraImages.length);
  }, [cupraImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + cupraImages.length) % cupraImages.length);
  }, [cupraImages.length]);

  const interests: Interest[] = useMemo(() => [
    { name: 'Punti di interesse', icon: Navigation, discoverType: DiscoverType.Poi },
    { name: 'Eventi', icon: Calendar, discoverType: DiscoverType.Event },
    { name: 'Articoli', icon: Newspaper, discoverType: DiscoverType.Article },
    { name: 'Operatori economici', icon: Briefcase, discoverType: DiscoverType.Organization },
  ], []);

  const getSelectedDiscoverType = useCallback((): DiscoverType => {
    const selectedInterest = interests.find(i => selectedInterests.includes(i.name));
    return selectedInterest ? selectedInterest.discoverType : DiscoverType.Poi;
  }, [interests, selectedInterests]);

  const closeWorkInProgressModal = useCallback(() => {
    setShowWorkInProgressModal(false);
  }, []);

  const closeLoadDiscoveryTypeErrorModal = useCallback(() => {
    setShowLoadDiscoveryTypeErrorModal(false);
  }, []);

  const handleCardClick = useCallback((recommendation: DiscoverItem) => {
    const selectedDiscoveryType = getSelectedDiscoverType();
    if (selectedDiscoveryType === DiscoverType.Poi) {
      navigate('/detail?type=' + selectedDiscoveryType + '&id=' + recommendation.entityId);
      console.error('GO TO DETAIL');
    } else {
      setShowWorkInProgressModal(true);
    }
  }, [getSelectedDiscoverType, navigate]);

  const loadSelectedDiscoveryType = useCallback(async (selectedDiscoveryType: DiscoverType) => {
    try {
      const result = await getDiscoverList(selectedDiscoveryType);
      if (result) {
        setDiscoveryData(result.result.result);
      }
    } catch (error) {
      console.error('Errore nel caricamento della lista discover:', error);
    }
  }, []);

  const loadCurrentSelectedDiscoveryType = useCallback(async () => {
    await loadSelectedDiscoveryType(getSelectedDiscoverType());
  }, [loadSelectedDiscoveryType, getSelectedDiscoverType]);

  const closeGpsErrorModal = useCallback(() => {
    setShowGpsErrorModal(false);
    setGpsError(null);
  }, []);

  const loadMunicipalityData = useCallback(async () => {
    // GPS position of user (if he allows it)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Posizione GPS ottenuta:', { latitude, longitude });
          setUserLocation({ latitude, longitude });          
        },
        (error) => {
          console.error('Errore nel recupero della posizione GPS:', error.message);
          
          let errorTitle = 'Errore GPS';
          let errorMessage = '';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorTitle = 'Permesso GPS negato';
              errorMessage = 'Per utilizzare questa funzionalità, è necessario attivare i permessi di localizzazione nelle impostazioni del browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorTitle = 'GPS non disponibile';
              errorMessage = 'La posizione GPS non è disponibile. Controlla le impostazioni del tuo dispositivo e assicurati che il GPS sia attivo.';
              break;
            case error.TIMEOUT:
              errorTitle = 'Timeout GPS';
              errorMessage = 'Il recupero della posizione GPS ha impiegato troppo tempo. Controlla le impostazioni del tuo dispositivo e riprova.';
              break;
            default:
              errorTitle = 'Errore GPS';
              errorMessage = 'Si è verificato un errore durante il recupero della posizione GPS.';
          }

          setGpsError({ title: errorTitle, message: errorMessage });
          setShowGpsErrorModal(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation non è supportata da questo browser');
      setGpsError({ 
        title: 'GPS non supportato', 
        message: 'Il tuo browser non supporta la geolocalizzazione. Prova ad utilizzare un browser più recente.' 
      });
      setShowGpsErrorModal(true);
    }

    const categoriesOutput = await loadData(getCategories, { localStorageKey: STORAGE_CATEGORIES_KEY });
    // Cambiato da cachedCategories.current a setCategories
    setCategories(categoriesOutput || null);

    if (categoriesOutput) {
      const poisResult = await loadData(getAllPois, { localStorageKey: STORAGE_POIS_KEY });
      cachedPois.current = poisResult;
      setDiscoveryData(cachedPois.current);      
    }
  }, [loadData]);

  const handleRetry = useCallback(async () => {
    closeErrorModal();
    resetLoadingFlag();
    await loadMunicipalityData();
  }, [closeErrorModal, resetLoadingFlag, loadMunicipalityData]);

  const onEditPreferences = useCallback(() => {
    navigate('/onboarding');
  }, [navigate]);

  // Caricamento iniziale - usa un flag per eseguire solo al mount
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadMunicipalityData();
    }
  }, [loadMunicipalityData]);

  const toggleInterest = useCallback((interest: string) => {
    // Cannot deselect anything
    if (selectedInterests.includes(interest)) {
      return;
    }
    
    // Current selection change
    setSelectedInterests([interest]);
    const selectedInterest = interests.find(i => i.name === interest);
    if (selectedInterest) {
      loadSelectedDiscoveryType(selectedInterest.discoverType);
    }
  }, [selectedInterests, interests, loadSelectedDiscoveryType]);

  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { text: chatInput, isUser: true }]);
      
      setTimeout(() => {
        const responses = [
          'Ecco alcuni luoghi interessanti nelle vicinanze: il Duomo di Firenze, la Galleria degli Uffizi e Palazzo Vecchio.',
          'Ti consiglio di provare la Trattoria Mario per cibo tradizionale toscano, oppure il Mercato Centrale.',
          'Nelle vicinanze puoi visitare il Giardino di Boboli, un bellissimo parco storico con vista sulla città.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
      
      setChatInput('');
    }
  }, [chatInput]);

  // Interests -> POIs category mapping (unfortunately it doesn't match with cached categories)
  const interestToCategoryMap: Record<string, string> = {
    'ArtCulture': 'ArtCulture',
    'Articles': 'Article',
    'Sleep': 'Sleep',
    'Events': 'Event',
    'Routes': 'Route',
    'EatAndDrink': 'Restaurant',
    'Nature': 'Nature',
    'Organizations': 'Organization',
    'Shopping': 'Shopping',
    'EntertainmentLeisure': 'Entertainment'
  };

  // dietaryNeeds -> POI value mapping
  const dietaryNeedsMap: Record<string, string> = {
    'celiachia': 'Adatto ai celiaci',
    'lattosio': 'Alternative senza lattosio',
    'vegetariano': 'Adatto ai vegetariani'
  };

  // Harversine formula for km distance between two coordinates
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Parse event date string (format: 'DD/MM/YYYY' or 'DD/MM/YYYY - DD/MM/YYYY')
  // Returns the start date, converting 2025 to 2026
  const parseEventDate = useCallback((dateString: string): Date | null => {
    if (!dateString) return null;
    
    // If it's a range, take only the first date
    const startDateStr = dateString.includes(' - ') 
      ? dateString.split(' - ')[0].trim() 
      : dateString.trim();
    
    // Parse DD/MM/YYYY format
    const parts = startDateStr.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS
    let year = parseInt(parts[2], 10);
    
    // Convert 2025 to 2026 as requested
    if (year === 2025) {
      year = 2026;
    }
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    return new Date(year, month, day);
  }, []);

  // Calculate event date score (0-500): closer events get higher score
  // TODO: handle range events
  const calculateEventDateScore = useCallback((dateString: string): number => {
    const eventDate = parseEventDate(dateString);
    if (!eventDate) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const diffMs = eventDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // If event is in the past, score is 0
    if (diffDays < 0) return 0;
    
    // If event is today, score is 500
    // If event is 365 days away or more, score is 0
    // Linear interpolation in between
    const maxDaysForBonus = 365;
    if (diffDays >= maxDaysForBonus) return 0;

    // Max points 500 if event is today
    const score = Math.round(500 * (1 - diffDays / maxDaysForBonus));
    return score;
  }, [parseEventDate]);

  // Get all filtered and sorted content - MEMOIZED
  const allSortedItems = useMemo(() => {
    if (!discoveryData || !Array.isArray(discoveryData)) return [];

    // Score based on priorities
    const SCORE_FAMILY_EVENT = 10000;      // Max priority: events for families
    const SCORE_DIETARY_NEEDS = 5000;      // Second priority: dietary needs
    const SCORE_INTEREST_MATCH = 1000;     // Third priority: interests match
    const SCORE_DISTANCE_MAX = 500;        // Bonus for proximity (non-events)
    
    const scoredItems = discoveryData.map(item => {
      let score = 0;
      const isEvent = item.category === 'Event';

      // 1. TRAVEL STYLE "famiglia" - Events for families with kids
      if (userPreferences.travelStyle === 'famiglia') {
        if (isEvent && item.audience === 'Adulti e bambini') {
          score += SCORE_FAMILY_EVENT;
        }
      }

      // 2. DIETARY NEEDS - Restaurants with dietary needs alternatives
      if (userPreferences.dietaryNeeds && userPreferences.dietaryNeeds.length > 0) {
        if (item.category === 'Restaurant' && item.dietaryNeeds && item.dietaryNeeds.length > 0) {
          for (const userDiet of userPreferences.dietaryNeeds) {
            const mappedDiet = dietaryNeedsMap[userDiet.toLowerCase()];
            if (mappedDiet && item.dietaryNeeds.includes(mappedDiet)) {
              score += SCORE_DIETARY_NEEDS;
              break; // Do not sum if has multiple alternatives, one is enough
            }
          }
        }
      }

      // 3. INTERESTS - Categories corresponding to user interests
      if (userPreferences.interests && userPreferences.interests.length > 0) {
        for (const interest of userPreferences.interests) {
          const mappedCategory = interestToCategoryMap[interest];
          if (mappedCategory && item.category === mappedCategory) {
            score += SCORE_INTEREST_MATCH;
            break;
          }
        }
      }

      // 4. DISTANCE or EVENT DATE bonus
      if (isEvent) {
        // For events: score based on event date proximity (not distance)
        if (item.date) {
          const eventDateScore = calculateEventDateScore(item.date);
          score += eventDateScore;
        }
      } else {
        // For non-events: score based on geographic distance (only if userLocation available)
        if (userLocation && item.latitude != null && item.longitude != null && item.latitude !== 0 && item.longitude !== 0) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            item.latitude,
            item.longitude
          );

          // Bonus greater if item is nearer
          // 0 km distance = maximum bonus (500), distance >= 50 km = bonus 0
          const maxDistanceForBonus = 50; // km
          if (distance < maxDistanceForBonus) {
            const distanceBonus = Math.round(SCORE_DISTANCE_MAX * (1 - distance / maxDistanceForBonus));
            score += distanceBonus;
          }
        }
      }

      return {
        ...item,
        id: item.id,
        title: item.name,
        cardBadge: item.badgeText,
        dietaryNeeds: item.dietaryNeeds,
        category: item.category,
        location: item.address || 'Cupra Marittima',
        image: getMediaUrl(item.imagePath),
        date: item.date,
        score
      };
    });

    // Sort all items by score
    const sortedItems = scoredItems.sort((a, b) => b.score - a.score);

    console.log('>>>sorted items'); console.log(sortedItems);

    return sortedItems;
  }, [discoveryData, userLocation, userPreferences, calculateDistance, calculateEventDateScore, dietaryNeedsMap, interestToCategoryMap]);

  // Get currently displayed items based on displayedItemsCount
  const displayedContent = useMemo(() => {
    return allSortedItems.slice(0, displayedItemsCount);
  }, [allSortedItems, displayedItemsCount]);

  // Load more items function
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore) return;
    
    const totalItems = allSortedItems.length;
    if (displayedItemsCount >= totalItems) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay (rimuovi in produzione se non necessario)
    setTimeout(() => {
      setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, totalItems));
      setIsLoadingMore(false);
    }, 500);
  }, [displayedItemsCount, isLoadingMore, allSortedItems.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreItems]);

  // Reset displayed count when data changes
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [discoveryData]);

  // Pull-to-refresh: usa ref per evitare ricreazione listener
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      // Swipe down (pull-to-refresh gesture)
      if (touchEndY > touchStartY + 50) {
        loadMunicipalityData();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loadMunicipalityData]);

  if (isLoading) {
    return <LoadingSpinner message="Caricamento dati in corso..." />;
  }

  const hasMoreItems = displayedItemsCount < allSortedItems.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2" />
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#0066cc] hover:bg-[#bfdfff] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">Esci</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-4 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="w-full mx-auto" style={{ maxWidth: '1280px' }}>
          {/* Welcome Section */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <h2 className="text-[#004d99] text-[22px] sm:text-[24px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-1 sm:mb-2">
              Ciao {user.name}!
            </h2>            

            {/* Location Notice */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-5 flex items-center gap-3 sm:gap-4">
              <img
                src={getMediaUrl('/Media/Organization/logo-00356330449.png')}
                alt="Stemma Cupra Marittima"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
                  <p className="text-[#004080] text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">
                    Stai visitando
                  </p>
                </div>
                <h3 className="text-[#004d99] text-[18px] sm:text-[20px] md:text-[24px] font-['Titillium_Web:Bold',sans-serif]">
                  Cupra Marittima
                </h3>
              </div>
            </div>
          </div>

          {/* Cupra Carousel */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <div className="h-48 sm:h-56 md:h-64 lg:h-80">
                  <img
                    src={cupraImages[currentSlide]}
                    alt={`Cupra Marittima ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>
          </div>

          {/* Interests Filter */}
          {/* For now disabled */}
          <div className="mb-5 sm:mb-6 md:mb-8" style={{ display: 'none' }}>
            <div className="flex flex-wrap gap-2 sm:gap-2 md:gap-3">
              {interests.map((interest) => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.name);
                return (
                  <button
                    key={interest.name}
                    onClick={() => toggleInterest(interest.name)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-full text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors ${
                      isSelected
                        ? 'bg-[#0066cc] text-white'
                        : 'bg-white text-[#004080] border-2 border-[#0066cc] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 className="text-[#004d99] text-[18px] sm:text-[20px] md:text-[28px] font-['Titillium_Web:Bold',sans-serif] mb-3 sm:mb-4">
            Scopri i punti di interesse più vicini al tuo stile di viaggio:
          </h3>
          <hr className="border-[#bfdfff] mb-5 sm:mb-6 md:mb-8" />

          {/* Recommendations */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {displayedContent.map((rec, index) => (
                <RecommendationCard 
                  key={`${rec.id}-${index}`} 
                  recommendation={rec} 
                  onClick={() => handleCardClick(rec)}
                  userPreferences={userPreferences}
                />
              ))}
            </div>

            {/* Loader Trigger & Spinner */}
            {hasMoreItems && (
              <div 
                ref={loaderRef} 
                className="flex items-center justify-center py-8 sm:py-10 md:py-12"
              >
                {isLoadingMore && (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#0066cc] animate-spin" />
                    <p className="text-[#004d99] text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">
                      Caricamento...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* End of Results Message */}
            {!hasMoreItems && displayedContent.length > 0 && (
              <div className="flex items-center justify-center py-8 sm:py-10 md:py-12">
                <p className="text-gray-500 text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif]">
                  Hai visualizzato tutti i risultati
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 bg-[#0066cc] hover:bg-[#004d99] text-white p-3 sm:p-3 md:p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-end sm:justify-end z-50 p-0 sm:p-4 md:p-6">
          <div className="bg-white rounded-t-lg sm:rounded-lg shadow-2xl w-full sm:w-full sm:max-w-md h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#0066cc] px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-full">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
                </div>
                <div>
                  <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:Bold',sans-serif]">
                    Assistente AI
                  </h3>
                  <p className="text-[#bfdfff] text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-[#bfdfff] transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-3 sm:mt-4 md:mt-8">
                  <p className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] mb-3 sm:mb-4">
                    Ciao! Come posso aiutarti oggi?
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setChatInput('Cosa posso visitare vicino a me?')}
                      className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                    >
                      💡 Cosa posso visitare vicino a me?
                    </button>
                    <button
                      onClick={() => setChatInput('Dove posso mangiare cibo tradizionale?')}
                      className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                    >
                      🍝 Dove posso mangiare cibo tradizionale?
                    </button>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[85%] md:max-w-[80%] px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg ${
                        msg.isUser
                          ? 'bg-[#0066cc] text-white'
                          : 'bg-gray-100 text-[#004080]'
                      }`}
                    >
                      <p className="text-[13px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t p-2.5 sm:p-3 md:p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-[#0066cc] focus:outline-none text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#0066cc] hover:bg-[#004d99] text-white px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 bg-[#0066cc] hover:bg-[#004d99] text-white p-3 sm:p-3 md:p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <Settings className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          userName={user.name}
          userEmail={user.email}
          userPreferences={userPreferences}
          categories={categories}
          onEditPreferences={onEditPreferences}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* GPS Error Modal */}
      {gpsError && (
        <ErrorModal
          isOpen={showGpsErrorModal}
          title={gpsError.title}
          message={gpsError.message}
          onClose={closeGpsErrorModal}
          cancelLabel="Chiudi"
        />
      )}

      {/* Error Modal */}
      {errorState && (
        <ErrorModal
          isOpen={showErrorModal}
          title={errorState.title}
          message={errorState.message}
          onClose={closeErrorModal}
          onRetry={handleRetry}
          retryLabel="Riprova"
          cancelLabel="Chiudi"
        />
      )}

      {/* Work In Progress Modal */}
      <ErrorModal
        isOpen={showWorkInProgressModal}
        title="Work in progress"
        message="Coming soon"
        onClose={closeWorkInProgressModal}
        cancelLabel="Chiudi"
      />

      {/* Load discovery type Modal error */}
      <ErrorModal
        isOpen={showLoadDiscoveryTypeErrorModal}
        title="Errore server"
        message="Errore durante il caricamento dei dati"
        onClose={closeLoadDiscoveryTypeErrorModal}
        onRetry={loadCurrentSelectedDiscoveryType}
        retryLabel="Riprova"
        cancelLabel="Chiudi"
      />
      
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: any;
  onClick: (recommendation: any) => void;
  userPreferences: {
    interests: string[];
    travelStyle: string;
    dietaryNeeds: string[];
  };
}

const RecommendationCard = memo(function RecommendationCard({ recommendation, onClick, userPreferences }: RecommendationCardProps) {
  const handleClick = useCallback(() => {
    onClick(recommendation);
  }, [onClick, recommendation]);
  
  // Determina se mostrare il badge "adatto a bambini"
  const showFamilyBadge = recommendation.category === 'Event' && userPreferences.travelStyle === 'famiglia';
  
  // Mappa le esigenze dietetiche con icone e testi
  const dietaryNeedsConfig: Record<string, { icon: typeof Leaf; text: string; emoji?: string }> = {
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
          {recommendation.date && (
            <div className="flex items-center gap-1 text-[#0066cc]">
              <Calendar className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <span className="text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
                {recommendation.date}
              </span>
            </div>
          )}
        </div>
        
        {/* "adatto a bambini" badge for users with family preferences */}
        {showFamilyBadge && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
              <span className="text-[12px] sm:text-[14px]">👶</span>
              Adatto a bambini
            </span>
          </div>
        )}

        {/* Dietary needs badges for restaurants */}
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