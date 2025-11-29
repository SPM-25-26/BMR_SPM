import axios from 'axios';

const API_BASE = '/api/Authentication';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface GoogleLoginInput {
  googleUid: string;
  name: string;
  userName: string;
  email: string;  
}
interface LoginResponse {
    success: boolean;
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

const invokeApi = async <T,>(callee: () => Promise<{ data: T }>, msgErr: string): Promise<T> => {
  try {
    const response = await callee();
    return response.data;
  } catch (error) {
    if(axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const responseData = error.response?.data as RegisterResponse | undefined;
      throw new ApiErrorWithResponse(
        error.response?.data?.message || msgErr,
        responseData,
        statusCode
      );
    }
    throw new Error('Errore API');
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/Login', {
      userOrEmail: email,
      password: password,
    });
  }, 'Errore durante il login');    
}

export async function loginGoogle(googleUid: string, name: string, userName: string, email: string): Promise<LoginResponse> {  
  const apiInput: GoogleLoginInput = { googleUid: googleUid, name: name, userName: userName, email: email };

  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/GoogleLogin', apiInput);
  }, 'Errore durante il login con Google');      
}

export async function recoverPassword(email: string): Promise<LoginResponse> {
  return invokeApi(async () => {
    return await apiClient.post<LoginResponse>('/RecoverPassword?email=' + email, {});
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
    return await apiClient.post<LoginResponse>('/SignUp', userData);
  }, 'Errore durante la registrazione');        
}