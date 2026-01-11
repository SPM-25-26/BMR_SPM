import type { EnumType } from '@ncoderz/superenum';
import { invokeApi, type ApiResponse, getClient } from './apiUtils';

const API_BASE = '/api/Information';

const apiClient = getClient(API_BASE, true);

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
  id: string;
  name: string;
  entityName: string;
  imagePath: string;
  badgeText: string;
  address?: string;  
  date?: string;  
  category: string;  
  latitude?: number;
  longitude?: number;
  dietaryNeeds?: Array<string>;
  audience?: string;
}

export interface PoiItem extends DiscoverItem {
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  gallery: Array<string>;
}

export interface DiscoverListResponse extends ApiResponse {
  success: boolean;
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

export async function getAllPois(): Promise<DiscoverListResponse> {
  return invokeApi(async () => {
    // For now we don't paginate, since there is not a huge amount of returned data
    return await apiClient.get<DiscoverListResponse>('/GetBaseInformation?skip=0&take=1000');
  }, 'Errore durante il recupero di tutti i tipi di interesse ');
}
