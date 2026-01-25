import { useState, useCallback } from 'react';

export interface GpsError {
  title: string;
  message: string;
}

export interface GeolocationState {
  location: { latitude: number; longitude: number } | null;
  error: GpsError | null;
  showErrorModal: boolean;
  closeErrorModal: () => void;
  requestLocation: () => void;
}

export function useGeolocation(): GeolocationState {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<GpsError | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeErrorModal = useCallback(() => {
    setShowErrorModal(false);
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        title: 'GPS non supportato',
        message: 'Il tuo browser non supporta la geolocalizzazione. Prova ad utilizzare un browser più recente.'
      });
      setShowErrorModal(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Posizione GPS ottenuta:', { latitude, longitude });
        setLocation({ latitude, longitude });
      },
      (geoError) => {
        console.error('Errore nel recupero della posizione GPS:', geoError.message);

        let errorTitle = 'Errore GPS';
        let errorMessage = '';

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorTitle = 'Permesso GPS negato';
            errorMessage = 'Per utilizzare questa funzionalità, è necessario attivare i permessi di localizzazione nelle impostazioni del browser.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorTitle = 'GPS non disponibile';
            errorMessage = 'La posizione GPS non è disponibile. Controlla le impostazioni del tuo dispositivo e assicurati che il GPS sia attivo.';
            break;
          case geoError.TIMEOUT:
            errorTitle = 'Timeout GPS';
            errorMessage = 'Il recupero della posizione GPS ha impiegato troppo tempo. Controlla le impostazioni del tuo dispositivo e riprova.';
            break;
          default:
            errorTitle = 'Errore GPS';
            errorMessage = 'Si è verificato un errore durante il recupero della posizione GPS.';
        }

        setError({ title: errorTitle, message: errorMessage });
        setShowErrorModal(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return {
    location,
    error,
    showErrorModal,
    closeErrorModal,
    requestLocation
  };
}