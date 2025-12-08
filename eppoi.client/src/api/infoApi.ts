import axios from 'axios';
import { invokeApi, type ApiResponse } from './apiUtils';

const API_BASE = '/api/Info';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MunicipalityData {
  poi: Array<{
    entityId: string;
    entityName: string;
    imagePath: string;
    badgeText: string;
    address: string;
  }>;
  events: Array<{
    municipalityData: {
      name: string;
      logoPath: string;
    };
    date: string;
    entityId: string;
    entityName: string;
    imagePath: string;
    badgeText: string;
    address: string | null;
  }>;
  articles: Array<{
    entityId: string;
    entityName: string;
    imagePath: string;
    badgeText: string;
    address: string | null;
  }>;
  organizations: Array<{
    entityId: string;
    entityName: string;
    imagePath: string;
    badgeText: string;
    address: string;
  }>;
}

export interface InfoResponse extends ApiResponse {
  result: MunicipalityData;
}

export async function getMunicipalityInfo(): Promise<InfoResponse> {
  return invokeApi(async () => {
    return await apiClient.get<InfoResponse>('/GetMunicipalityInfo');
  }, 'Errore durante il recupero delle informazioni del comune');
}