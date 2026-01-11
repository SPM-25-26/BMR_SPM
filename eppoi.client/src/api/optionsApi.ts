import { invokeApi, type ApiResponse, getClient, type UserPreferences, convertPreferencesFromStructureToEnumList } from './apiUtils';

const API_BASE = '/api/Options';

const apiClient = getClient(API_BASE, true);


export async function updateUserPreferences(userPreferences: UserPreferences): Promise<ApiResponse> {
  // Convert preferences to a list of enum values like in Preferences object - the backend will take care of aggregate them
  const apiInput = convertPreferencesFromStructureToEnumList(userPreferences);

  return invokeApi(async () => {
    return await apiClient.put<ApiResponse>('/ChangePreferences', apiInput);
  }, 'Errore durante l\'aggiornamento delle preferenze utente');
}