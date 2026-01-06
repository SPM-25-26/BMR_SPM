import axios from 'axios';
import type { EnumType } from '@ncoderz/superenum';

// Tipo generico per le risposte API
export interface ApiResponse {
  success: boolean;
  result: unknown;
}

const TravellerType = {
  Solo: 0,
  Couple: 1,
  Family: 2,
  FriendsGroup: 3
}

type TravellerType = EnumType<typeof TravellerType>;

export interface UserPreferences {
  interests: string[];
  travelStyle: TravellerType;
  dietaryNeeds: string[];
}

// Classe di errore personalizzata
export class ApiErrorWithResponse extends Error {
  public response?: ApiResponse;
  public statusCode?: number;

  constructor(
    message: string,
    response?: ApiResponse,
    statusCode?: number
  ) {
    super(message);
    this.name = 'ApiErrorWithResponse';
    this.response = response;
    this.statusCode = statusCode;
  }
}

/**
 * Utility function to centralize API calls
 * @template T - Output type
 * @param callee - Internal calling function
 * @param msgErr - Fallback message error
 * @returns A typed Promise
 * @throws {ApiErrorWithResponse}
 */
export const invokeApi = async <T,>(
  callee: () => Promise<{ data: T }>, 
  msgErr: string
): Promise<T> => {
  try {
    const response = await callee();
    return response.data;
  } catch (error) {    
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const responseData = error.response?.data as ApiResponse | undefined;
      throw new ApiErrorWithResponse(
        error.response?.data?.message || msgErr,
        responseData,
        statusCode
      );
    }
    throw new Error('Errore API');
  }
};

export const STORAGE_AUTHTOKEN_KEY = 'authToken';