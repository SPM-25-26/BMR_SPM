import { useMemo } from 'react';
import { type DiscoverItem } from '../api/infoApi';
import { getMediaUrl } from '../config/constants';

export interface UserPreferences {
  interests: string[];
  travelStyle: string;
  dietaryNeeds: string[];
}

export interface ScoredItem extends DiscoverItem {
  title: string;
  cardBadge: string;
  location: string;
  image: string;
  score: number;
  distance: number;
}

const INTEREST_TO_CATEGORY_MAP: Record<string, string> = {
  'ArtCulture': 'ArtCulture',
  'Articles': 'Article',
  'Sleep': 'Sleep',
  'Events': 'Event',
  'Routes': 'Route',
  'EatAndDrink': 'Restaurant',
  'Nature': 'Nature',
  'Organizations': 'Organization',
  'Shopping': 'Shopping',
  'EntertainmentLeisure': 'Entertainment'
};

const DIETARY_NEEDS_MAP: Record<string, string> = {
  'celiachia': 'Adatto ai celiaci',
  'lattosio': 'Alternative senza lattosio',
  'vegetariano': 'Adatto ai vegetariani'
};

const SCORE_FAMILY_EVENT = 10000;
const SCORE_DIETARY_NEEDS = 5000;
const SCORE_INTEREST_MATCH = 1000;
const SCORE_DISTANCE_MAX = 500;
const MAX_DISTANCE_FOR_BONUS = 50; // km
const MAX_DAYS_FOR_BONUS = 365;

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseEventDate(dateString: string): Date | null {
  if (!dateString) return null;

  const startDateStr = dateString.includes(' - ')
    ? dateString.split(' - ')[0].trim()
    : dateString.trim();

  const parts = startDateStr.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);

  if (year === 2025) year = 2026;
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return new Date(year, month, day);
}

function calculateEventDateScore(dateString: string): number {
  const eventDate = parseEventDate(dateString);
  if (!eventDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = eventDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || diffDays >= MAX_DAYS_FOR_BONUS) return 0;

  return Math.round(500 * (1 - diffDays / MAX_DAYS_FOR_BONUS));
}

export function useDiscoveryScoring(
  discoveryData: DiscoverItem[] | null,
  userLocation: { latitude: number; longitude: number } | null,
  userPreferences: UserPreferences
): ScoredItem[] {
  return useMemo(() => {
    if (!discoveryData || !Array.isArray(discoveryData)) return [];

    const scoredItems = discoveryData.map(item => {
      let score = 0;
      const isEvent = item.category === 'Event';

      // 1. Family events
      if (userPreferences.travelStyle === 'famiglia' && isEvent && item.audience === 'Adulti e bambini') {
        score += SCORE_FAMILY_EVENT;
      }

      // 2. Dietary needs
      if (userPreferences.dietaryNeeds?.length > 0 && item.category === 'Restaurant' && item.dietaryNeeds?.length > 0) {
        for (const userDiet of userPreferences.dietaryNeeds) {
          const mappedDiet = DIETARY_NEEDS_MAP[userDiet.toLowerCase()];
          if (mappedDiet && item.dietaryNeeds.includes(mappedDiet)) {
            score += SCORE_DIETARY_NEEDS;
            break;
          }
        }
      }

      // 3. Interests match
      if (userPreferences.interests?.length > 0) {
        for (const interest of userPreferences.interests) {
          const mappedCategory = INTEREST_TO_CATEGORY_MAP[interest];
          if (mappedCategory && item.category === mappedCategory) {
            score += SCORE_INTEREST_MATCH;
            break;
          }
        }
      }

      // 4. Distance or event date
      let calcDistance = -1;
      if (isEvent) {
        if (item.date) {
          score += calculateEventDateScore(item.date);
        }
      } else if (userLocation && item.latitude && item.longitude) {
        calcDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude
        );

        if (calcDistance < MAX_DISTANCE_FOR_BONUS) {
          score += Math.round(SCORE_DISTANCE_MAX * (1 - calcDistance / MAX_DISTANCE_FOR_BONUS));
        }
      }

      return {
        ...item,
        title: item.name,
        cardBadge: item.badgeText,
        location: item.address || 'Cupra Marittima',
        image: getMediaUrl(item.imagePath),
        score,
        distance: calcDistance
      };
    });

    return scoredItems.sort((a, b) => b.score - a.score);
  }, [discoveryData, userLocation, userPreferences]);
}