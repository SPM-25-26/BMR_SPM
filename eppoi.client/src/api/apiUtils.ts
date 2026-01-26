import axios, { type AxiosInstance } from 'axios';
import type { EnumType } from '@ncoderz/superenum';

export const STORAGE_AUTHTOKEN_KEY = 'authToken';
export const STORAGE_CATEGORIES_KEY = 'poisCategories';
export const STORAGE_POIS_KEY = 'pois';

import {
  Landmark,
  Newspaper,
  Hotel,
  Calendar,
  MapPin,
  Utensils,
  ShoppingBag,
  Sparkles,
  Trees,
  BriefcaseBusiness,
  Ham,
  Info,
  User,
  Users,
  UsersRound,
  Heart,
  Home,
  WheatOff,
  Milk,
  Leaf
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Generic type for Api response
export interface ApiResponse {
  success: boolean;
  result: unknown;
}

export const TravellerType = {
  Solo: 0,
  Couple: 1,
  Family: 2,
  FriendsGroup: 3
}

export type TravellerType = EnumType<typeof TravellerType>;

export interface UserPreferences {
  interests: string[];
  travelStyle: string;
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

export const getClient = (apiBaseUrl: string, withBearerToken: boolean): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Authorization token for all of these APIs (if needed)
  if (withBearerToken) {
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
  }

  return apiClient;
};

// Enum-like object as exposed by Apis
export const Preferences = {
  P_ArtCulture: 1 << 0,      // 1
  P_Nature: 1 << 1,           // 2
  P_Entertainment: 1 << 2,    // 4
  P_Restaurant: 1 << 3,       // 8
  P_Sleep: 1 << 4,            // 16
  P_Event: 1 << 5,            // 32
  P_Route: 1 << 6,            // 64
  P_Article: 1 << 7,          // 128
  P_Shopping: 1 << 8,         // 256
  P_Organization: 1 << 9,     // 512
  T_Solo: 1 << 10,            // 1024
  T_Couple: 1 << 11,          // 2048
  T_Family: 1 << 12,          // 4096
  T_Friends: 1 << 13,         // 8192
  F_GlutenFree: 1 << 14,      // 16384
  F_DairyFree: 1 << 15,       // 32768
  F_Vegetarian: 1 << 16,      // 65536
} as const;

// Type helper per type safety
export type PreferencesFlag = typeof Preferences[keyof typeof Preferences];

// Utilities for flag management
export const PreferencesUtils = {
  combine: (...flags: PreferencesFlag[]): number => {
    return flags.reduce((acc, flag) => acc | flag, 0);
  },

  hasFlag: (value: number, flag: PreferencesFlag): boolean => {
    return (value & flag) === flag;
  },

  addFlag: (value: number, flag: PreferencesFlag): number => {
    return value | flag;
  },

  removeFlag: (value: number, flag: PreferencesFlag): number => {
    return value & ~flag;
  },

  toggleFlag: (value: number, flag: PreferencesFlag): number => {
    return value ^ flag;
  }
};

/**
 * Category interest icon mapping
 * Maps category IDs to their corresponding Lucide icons
 */
export const CATEGORY_INTERESTS: Array<{
  id: string;
  name?: string;
  icon: LucideIcon;
}> = [
    {
      id: "ArtCulture",
      icon: Landmark,
    },
    {
      id: "Articles",
      icon: Newspaper,
    },
    { id: "Sleep", icon: Hotel },
    { id: "Events", name: "Eventi", icon: Calendar },
    { id: "Routes", icon: MapPin },
    { id: "EatAndDrink", icon: Utensils },
    { id: "Nature", icon: Trees },
    { id: "Organizations", icon: BriefcaseBusiness },
    { id: "TypicalProducts", icon: Ham },
    { id: "Shopping", icon: ShoppingBag },
    { id: "Services", icon: Info },
    {
      id: "EntertainmentLeisure",
      icon: Sparkles,
    },
  ];

export const travelStyles = [
  { id: "solo", name: "Viaggiatore solitario", icon: User },
  { id: "coppia", name: "Coppia", icon: Heart },
  { id: "famiglia", name: "Famiglia", icon: Home },
  { id: "amici", name: "Gruppo di amici", icon: UsersRound },
];

export const dietaryOptions = [
  { id: "celiachia", name: "Celiachia", icon: WheatOff },
  { id: "lattosio", name: "Senza lattosio", icon: Milk },
  { id: "vegetariano", name: "Vegetariano", icon: Leaf },
];

export const categoryToFlagMap: Record<string, PreferencesFlag> = {
  'ArtCulture': Preferences.P_ArtCulture,
  'Articles': Preferences.P_Article,
  'Sleep': Preferences.P_Sleep,
  'Events': Preferences.P_Event,
  'Routes': Preferences.P_Route,
  'EatAndDrink': Preferences.P_Restaurant,
  'Nature': Preferences.P_Nature,
  'Organizations': Preferences.P_Organization,
  'Shopping': Preferences.P_Shopping,
  'EntertainmentLeisure': Preferences.P_Entertainment,
};

export const itemCategoriesToEnumValue = {
  'ArtCulture': 0,
  'Event': 1,
  'Article': 2,
  'Organization': 3,
  'Restaurant': 4,
  'Sleep': 5,
  'Shopping': 6,
  'Route': 7,
  'Entertainment': 8
}

const dietaryToFlagMap: Record<string, PreferencesFlag> = {
  'celiachia': Preferences.F_GlutenFree,
  'lattosio': Preferences.F_DairyFree,
  'vegetariano': Preferences.F_Vegetarian,
};

const travellerTypeToIdMap: Record<TravellerType, string> = {
  [TravellerType.Solo]: "solo",
  [TravellerType.Couple]: "coppia",
  [TravellerType.Family]: "famiglia",
  [TravellerType.FriendsGroup]: "amici",
};

const travelStyleIdToFlagMap: Record<string, PreferencesFlag> = {
  'solo': Preferences.T_Solo,
  'coppia': Preferences.T_Couple,
  'famiglia': Preferences.T_Family,
  'amici': Preferences.T_Friends,
};

export const convertPreferencesFromIntToStructure = (preferencesInt: number): UserPreferences => {
  const interests: string[] = [];
  const dietaryNeeds: string[] = [];
  let travelStyle: string = "solo";
  
  CATEGORY_INTERESTS.forEach(category => {
    const flag = categoryToFlagMap[category.id];
    if (flag && PreferencesUtils.hasFlag(preferencesInt, flag)) {
      interests.push(category.id);
    }
  });

  dietaryOptions.forEach(dietary => {
    const flag = dietaryToFlagMap[dietary.id];
    if (flag && PreferencesUtils.hasFlag(preferencesInt, flag)) {
      dietaryNeeds.push(dietary.id);
    }
  });

  if (PreferencesUtils.hasFlag(preferencesInt, Preferences.T_Solo)) {
    travelStyle = travellerTypeToIdMap[TravellerType.Solo];
  } else if (PreferencesUtils.hasFlag(preferencesInt, Preferences.T_Couple)) {
    travelStyle = travellerTypeToIdMap[TravellerType.Couple];
  } else if (PreferencesUtils.hasFlag(preferencesInt, Preferences.T_Family)) {
    travelStyle = travellerTypeToIdMap[TravellerType.Family];
  } else if (PreferencesUtils.hasFlag(preferencesInt, Preferences.T_Friends)) {
    travelStyle = travellerTypeToIdMap[TravellerType.FriendsGroup];
  }

  return {
    interests,
    travelStyle,
    dietaryNeeds
  };
};

export const convertPreferencesFromStructureToInt = (userPrefs: UserPreferences): number => {
  const flags: PreferencesFlag[] = [];
  
  userPrefs.interests.forEach(interestId => {
    const flag = categoryToFlagMap[interestId];
    if (flag) flags.push(flag);
  });

  userPrefs.dietaryNeeds.forEach(dietaryId => {
    const flag = dietaryToFlagMap[dietaryId];
    if (flag) flags.push(flag);
  });

  const travelStyleFlag = travelStyleIdToFlagMap[userPrefs.travelStyle];
  if (travelStyleFlag) {
    flags.push(travelStyleFlag);
  }

  return PreferencesUtils.combine(...flags);
};

export const convertPreferencesFromStructureToEnumList = (userPrefs: UserPreferences): number[] => {
  const enumValues: number[] = [];

  userPrefs.interests.forEach(interestId => {
    const flag = categoryToFlagMap[interestId];
    if (flag) enumValues.push(flag);
  });

  userPrefs.dietaryNeeds.forEach(dietaryId => {
    const flag = dietaryToFlagMap[dietaryId];
    if (flag) enumValues.push(flag);
  });

  const travelStyleFlag = travelStyleIdToFlagMap[userPrefs.travelStyle];
  if (travelStyleFlag) {
    enumValues.push(travelStyleFlag);
  }

  return enumValues;
};

export const convertPreferencesFromStringListToStructure = (preferencesString: string): UserPreferences => {
  const interests: string[] = [];
  const dietaryNeeds: string[] = [];
  let travelStyle: string = "solo";

  const enumNames = preferencesString
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0);

  const flagToCategoryMap: Record<number, string> = Object.entries(categoryToFlagMap)
    .reduce((acc, [categoryId, flag]) => {
      acc[flag] = categoryId;
      return acc;
    }, {} as Record<number, string>);

  const flagToDietaryMap: Record<number, string> = Object.entries(dietaryToFlagMap)
    .reduce((acc, [dietaryId, flag]) => {
      acc[flag] = dietaryId;
      return acc;
    }, {} as Record<number, string>);

  enumNames.forEach(enumName => {
    const flagValue = Preferences[enumName as keyof typeof Preferences];

    if (flagValue === undefined) {
      console.warn(`Unknown preference enum name: ${enumName}`);
      return;
    }

    if (flagToCategoryMap[flagValue]) {
      interests.push(flagToCategoryMap[flagValue]);
    }
    else if (flagToDietaryMap[flagValue]) {
      dietaryNeeds.push(flagToDietaryMap[flagValue]);
    }
    else if (flagValue === Preferences.T_Solo) {
      travelStyle = travellerTypeToIdMap[TravellerType.Solo];
    } else if (flagValue === Preferences.T_Couple) {
      travelStyle = travellerTypeToIdMap[TravellerType.Couple];
    } else if (flagValue === Preferences.T_Family) {
      travelStyle = travellerTypeToIdMap[TravellerType.Family];
    } else if (flagValue === Preferences.T_Friends) {
      travelStyle = travellerTypeToIdMap[TravellerType.FriendsGroup];
    }
  });

  return {
    interests,
    travelStyle,
    dietaryNeeds
  };
};

export interface ChatMessage {
  text: string;
  isUser: boolean;
}