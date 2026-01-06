import { useState, useRef, useCallback } from 'react';
import { ApiErrorWithResponse } from '../api/apiUtils';

interface ErrorState {
  title: string;
  message: string;
}

interface CustomErrorMessages {
  title?: string;
  message?: string;
}

interface UseApiDataLoaderOptions<T> {
  onLogout: () => void;
  onSuccess?: (data: T) => void | Promise<void>;
  customErrorMessages?: CustomErrorMessages;
}

export function useApiDataLoader<T>({ onLogout, onSuccess, customErrorMessages }: UseApiDataLoaderOptions<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const dataLoadingRef = useRef(false);
  
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const showServerError = useCallback((error: any) => {
    console.error('Errore nel caricamento dei dati');
    console.log(error);

    if (error instanceof ApiErrorWithResponse) {
      // Token expired, should login again
      if (error.statusCode === 401) {
        onLogout();
        return;
      }

      setErrorState({
        title: customErrorMessages?.title || 'Errore Server',
        message: customErrorMessages?.message || error.message || 'Si è verificato un errore durante il caricamento dei dati. Riprova tra qualche minuto.'
      });
    } else {
      setErrorState({
        title: customErrorMessages?.title || 'Errore Sconosciuto',
        message: customErrorMessages?.message || 'Si è verificato un errore imprevisto.'
      });
    }
    setShowErrorModal(true);
  }, [onLogout, customErrorMessages]);

  const loadData = useCallback(async <R>(
    apiCall: () => Promise<R>,
    options?: {
      errorTitle?: string;
      errorMessage?: string;
    }
  ): Promise<R | null> => {
    // Avoid duplicate calls during re-renders
    if (dataLoadingRef.current) {
      return null;
    }

    setIsLoading(true);
    dataLoadingRef.current = true;
    let success = false;
    let result: R | null = null;

    try {
      const response = await apiCall();

      if ((response as any).success && (response as any).result) {
        result = (response as any).result;
        success = true;
      } else {
        setErrorState({
          title: options?.errorTitle || customErrorMessages?.title || 'Errore nel caricamento',
          message: options?.errorMessage || customErrorMessages?.message || 'Non è stato possibile caricare i dati del comune. Riprova.'
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      showServerError(error);
    } finally {
      setIsLoading(false);
      dataLoadingRef.current = false;

      if (success && result && onSuccessRef.current) {
        await onSuccessRef.current(result);
      }
    }

    return result;
  }, [showServerError, customErrorMessages]);

  const closeErrorModal = useCallback(() => {
    setShowErrorModal(false);
    setErrorState(null);
  }, []);

  const resetLoadingFlag = useCallback(() => {
    dataLoadingRef.current = false;
  }, []);

  return {
    isLoading,
    errorState,
    showErrorModal,
    loadData,
    closeErrorModal,
    resetLoadingFlag,
    setIsLoading
  };
}