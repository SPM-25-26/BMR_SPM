import axios from 'axios';
import { invokeApi, ApiErrorWithResponse, type ApiResponse } from './apiUtils';

const API_BASE = '/api/Authentication';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ConfirmEmailInput {
  id: string;
  token: string;
}

interface GoogleLoginInput {
  id: string;
  name: string;
  username: string;
  email: string;  
  googleToken: string;  
}

export interface LoginResponse extends ApiResponse {
  result: string;
}

interface PasswordResetInput {
  userId: string;
  token: string;
  newPassword: string;  
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

export interface RegisterResponse extends ApiResponse {
  result: {
    succeeded: boolean;
    errors?: RegisterError[];
  };
}

// Esporta ApiErrorWithResponse per compatibilità con codice esistente
export { ApiErrorWithResponse };

export async function confirmEmail(userId: string, token: string): Promise<LoginResponse> {
  const apiInput: ConfirmEmailInput = { id: userId, token: token };

  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/ConfirmEmail', apiInput);
  }, 'Errore durante la conferma della mail');
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/Login', {
      userOrEmail: email,
      password: password,
    });
  }, 'Errore durante il login');    
}

export async function loginGoogle(googleUid: string, name: string, userName: string, email: string, googleToken: string): Promise<LoginResponse> {  
  const apiInput: GoogleLoginInput = { id: googleUid, name: name, username: userName, email: email, googleToken: googleToken };

  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/GoogleLogin', apiInput);
  }, 'Errore durante il login con Google');      
}

export async function recoverPassword(email: string): Promise<LoginResponse> {
  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/RecoverPassword?email=' + encodeURIComponent(email), {});
  }, 'Errore durante il recupero password');
}

export async function resetPassword(userId: string, token: string, password: string): Promise<LoginResponse> {
  const apiInput: PasswordResetInput = { userId: userId, token: token, newPassword: password };

  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/ResetPassword', apiInput);
  }, 'Errore durante il reset della password');
}

export async function registerUser(userData: RegisterInput): Promise<RegisterResponse> {
  return invokeApi(async () => {
    return await apiClient.post<RegisterResponse>('/SignUp', userData);
  }, 'Errore durante la registrazione');        
}