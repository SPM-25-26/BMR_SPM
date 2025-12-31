import axios from 'axios';
import type { EnumType } from '@ncoderz/superenum';
import { invokeApi, type ApiResponse, STORAGE_AUTHTOKEN_KEY } from './apiUtils';

const API_BASE = '/api/LocalInfo';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authorization token for all of these APIs
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_AUTHTOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const DiscoverType = {
  Poi: 0,
  Event: 1,
  Article: 2,
  Organization: 3
}

type DiscoverType = EnumType<typeof DiscoverType>;

export interface Category {
  Name: string;
  Label: string;
}

export interface DiscoverItem {
  entityId: string;
  entityName: string;
  imagePath: string;
  badgeText: string;
  address?: string;  
  date?: string;  
}

export interface PoiItem extends DiscoverItem {
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  gallery: Array<string>;
}

export interface DiscoverListResponse extends ApiResponse {
  result: {
    result: Array<DiscoverItem>
  };
}

export interface GetCategoriesResponse extends ApiResponse {
  result: Array<Category>;
}

export interface GetPoiResponse extends ApiResponse {
  result: {
    result: PoiItem
  };
}

export async function getCategories(): Promise<GetCategoriesResponse> {
  return invokeApi(async () => {
    return await apiClient.get<GetCategoriesResponse>('/GetCategories');
  }, 'Errore durante il recupero delle categorie');
}

export async function getDiscoverList(type: DiscoverType): Promise<DiscoverListResponse> {
  return invokeApi(async () => {
    return await apiClient.get<DiscoverListResponse>('/GetDiscoverList?type=' + type);
  }, 'Errore durante il recupero della discovery list di tipo ' + type);
}

export async function getPoiDetail(id: string): Promise<GetPoiResponse> {
  return invokeApi(async () => {
    return await apiClient.get<GetPoiResponse>('/GetPOIById?id=' + id);
  }, 'Errore durante il recupero delle categorie');
}