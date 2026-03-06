import { describe, it, expect } from 'vitest';
import {
  convertPreferencesFromStructureToInt,
  convertPreferencesFromIntToStructure,
  convertPreferencesFromStringListToStructure,
  type UserPreferences
} from './apiUtils';

describe('apiUtils preferences conversion', () => {
  it('converting structure -> int -> structure keeping the values', () => {
    const input: UserPreferences = {
      interests: ['ArtCulture', 'Nature'],
      travelStyle: 'coppia',
      dietaryNeeds: ['celiachia']
    };

    const packed = convertPreferencesFromStructureToInt(input);
    const output = convertPreferencesFromIntToStructure(packed);

    expect(output.interests).toEqual(expect.arrayContaining(['ArtCulture', 'Nature']));
    expect(output.travelStyle).toBe('coppia');
    expect(output.dietaryNeeds).toEqual(expect.arrayContaining(['celiachia']));
  });

  it('converte una lista enum string in UserPreferences', () => {
    const output = convertPreferencesFromStringListToStructure('P_ArtCulture, T_Friends, F_Vegetarian');

    expect(output.interests).toContain('ArtCulture');
    expect(output.travelStyle).toBe('amici');
    expect(output.dietaryNeeds).toContain('vegetariano');
  });
});