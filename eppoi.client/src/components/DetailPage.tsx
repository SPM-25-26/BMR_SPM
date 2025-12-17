import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, X, ChevronLeft as ArrowLeft, ChevronRight as ArrowRight } from 'lucide-react';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { getPoiDetail, type PoiItem } from '../api/infoApi';
import { ApiErrorWithResponse } from '../api/apiUtils';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorModal from './ui/ErrorModal';
import { getMediaUrl } from '../config/constants';

interface DetailPageProps {
  onLogout: () => void;
}

interface ErrorState {
  title: string;
  message: string;
}

export default function DetailPage({ onLogout }: DetailPageProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullscreenGalleryOpen, setFullscreenGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [item, setItem] = useState<PoiItem | null>(null);

  const onBack = () => {
    navigate('/');
  };
  const dataLoadingRef = useRef(false);

  // Derive gallery images from item data
  const galleryImages = item?.gallery?.map(imagePath => getMediaUrl(imagePath)) || [];

  // Derive description from item data
  const description = item?.description || '';
  const shortDescription = description.split('\n\n')[0];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const openFullscreenGallery = (index: number) => {
    setCurrentImageIndex(index);
    setFullscreenGalleryOpen(true);
  };

  const showServerError = (error: any) => {
    console.error('Errore nel caricamento dei dati');
    console.log(error);

    if (error instanceof ApiErrorWithResponse) {

      // Token expired, should login again
      if (error.statusCode === 401) {
        onLogout();
        return;
      }

      setErrorState({
        title: 'Errore Server',
        message: error.message || 'Si è verificato un errore durante il caricamento dei dati. Riprova tra qualche minuto.'
      });
    } else {
      setErrorState({
        title: 'Errore Sconosciuto',
        message: 'Si è verificato un errore imprevisto.'
      });
    }
    setShowErrorModal(true);
  };

  const loadDetailData = async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) {
      navigate('/');
      return;
    }

    // Avoid duplicate calls during re-renders
    if (dataLoadingRef.current) {
      return;
    }

    setIsLoading(true);
    dataLoadingRef.current = true;

    try {      
      const response = await getPoiDetail(id);
      if (response.success && response.result) {
        console.error('have resp');
        console.log(response.result.result);
        setItem(response.result.result);
      } else {
        setErrorState({
          title: 'Errore nel caricamento',
          message: 'Non è stato possibile caricare i dati del punto di interesse. Riprova.'
        });
        setShowErrorModal(true);
      }      
    } catch (error) {
      showServerError(error);
    } finally {
      setIsLoading(false);
      dataLoadingRef.current = false;

      
    }
  };

  useEffect(() => {
    loadDetailData();
  }, []);

  // Prevent body scroll when fullscreen gallery is open
  useEffect(() => {
    if (fullscreenGalleryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fullscreenGalleryOpen]);

  // To render letters with accent mark
  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };
  if (isLoading) {
    return <LoadingSpinner message="Caricamento dati in corso..." />;
  }

  if (!item) {
    return <LoadingSpinner message="Nessun dato disponibile..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-white hover:text-[#bfdfff] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Image */}
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-gray-200">
          <img
            src={getMediaUrl(item.imagePath)}
            alt={item.entityName}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 max-w-4xl mx-auto">
          {/* Title and Category */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5">
            <h1 className="text-[#004d99] text-[24px] sm:text-[28px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-2">
              {item.entityName}
            </h1>
            <span className="inline-block bg-[#bfdfff] text-[#004080] px-3 py-1 rounded-full text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:SemiBold',sans-serif] mb-3">
              {item.badgeText}
            </span>
            
            {/* Location and Date */}
            <div className="space-y-2 mt-3">
              {item.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] font-['Titillium_Web:Regular',sans-serif]">
                    {item.address}
                  </span>
                </div>
              )}
              {item.date && (
                <div className="flex items-center gap-2 text-[#0066cc]">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] font-['Titillium_Web:SemiBold',sans-serif]">
                    {item.date}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-5">
            <div className="text-[#004080] text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] leading-relaxed">
              <p className={isExpanded ? '' : 'line-clamp-4'}>
                {description}
              </p>
              {description && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#0066cc] font-['Titillium_Web:SemiBold',sans-serif] mt-3 hover:text-[#004d99] transition-colors inline-block"
                >
                  {isExpanded ? 'Mostra meno' : decodeHtmlEntities('Leggi di pi&ugrave;')}
                </button>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          {galleryImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
              <h3 className="text-[#004d99] text-[18px] sm:text-[20px] md:text-[22px] font-['Titillium_Web:Bold',sans-serif] mb-4">
                Galleria
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => openFullscreenGallery(index)}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={image}
                      alt={`${item.entityName} - Immagine ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {fullscreenGalleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Gallery Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
            <div className="text-white text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif]">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
            <button
              onClick={() => setFullscreenGalleryOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* Image Container */}
          <div 
            className="flex-1 flex items-center justify-center relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt={`${item.entityName} - Immagine ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm"
            >
              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pb-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
