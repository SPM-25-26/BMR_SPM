import axios from 'axios';

const API_BASE = '/api/Eppoi';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface LoginResponse {
    success: boolean;
    result: string;
}

interface RegisterInput {
    name: string;
    userName: string;
    email: string;
    password: string;
}

interface RegisterError {
    code: string;
    description: string;
}

interface RegisterResponse {
    success: boolean;
    result: {
        succeeded: boolean;
        errors?: RegisterError[];
    };
}

export class ApiErrorWithResponse extends Error {
  constructor(
    message: string,
    public response?: RegisterResponse,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiErrorWithResponse';
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await apiClient.post<LoginResponse>('/Login', {
            userOrEmail: email,
            password: password,
        });
        return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data as RegisterResponse | undefined;
        throw new ApiErrorWithResponse(
          error.response?.data?.message || 'Errore durante il login',
          responseData,
          statusCode
        );
      }
        throw new Error('Errore API');
    }
}

export async function registerUser(userData: RegisterInput): Promise<RegisterResponse> {
    try {
        const response = await apiClient.post<RegisterResponse>('/Register', userData);
        return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data as RegisterResponse | undefined;
        console.error('##axios output error');
        console.log(error);
        throw new ApiErrorWithResponse(
          error.response?.data?.message || 'Errore durante la registrazione',
          responseData,
          statusCode
        );
      }      
      throw new Error('Errore API');
    }
}