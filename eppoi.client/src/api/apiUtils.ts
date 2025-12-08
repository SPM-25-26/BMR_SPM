import axios from 'axios';

// Tipo generico per le risposte API
export interface ApiResponse {
  success: boolean;
  result: unknown;
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

// Utility function per invocare le API con gestione errori centralizzata
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