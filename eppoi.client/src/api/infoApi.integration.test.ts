import { beforeEach, describe, expect, it } from 'vitest';
import axios from 'axios';
import { getAllPois, getPoiDetail } from './infoApi';
import {
  ApiErrorWithResponse,
  itemCategoriesToEnumValue,
  STORAGE_AUTHTOKEN_KEY
} from './apiUtils';

const baseUrl = process.env.INTEGRATION_BASE_URL ?? 'https://127.0.0.1:7156';
const authToken = process.env.INTEGRATION_AUTH_TOKEN ?? '';

const describeIfIntegrationEnabled = authToken ? describe : describe.skip;

async function getSamplePoi() {
  const listResponse = await getAllPois();

  expect(listResponse.success).toBe(true);
  expect(Array.isArray(listResponse.result)).toBe(true);
  expect(listResponse.result.length).toBeGreaterThan(0);

  const sample = listResponse.result.find((item) =>
    Object.prototype.hasOwnProperty.call(itemCategoriesToEnumValue, item.category)
  );

  expect(sample).toBeDefined();

  const categoryEnum = itemCategoriesToEnumValue[
    sample!.category as keyof typeof itemCategoriesToEnumValue
  ] as Parameters<typeof getPoiDetail>[1];

  return {
    id: sample!.id,
    category: categoryEnum,
  };
}

describeIfIntegrationEnabled('infoApi integration (real backend)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    localStorage.setItem(STORAGE_AUTHTOKEN_KEY, authToken);
  });

  it('preflight: unreachable backend', async () => {
    const url = new URL('/api/Information/GetBaseInformation?skip=0&take=1', baseUrl).toString();

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(`Preflight auth failed (${response.status}): expired token.`);
      }

      if (response.status >= 500) {
        throw new Error(`Preflight server failed (${response.status}).`);
      }

      expect(response.status).toBe(200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Preflight network/TLS failed: code=${error.code ?? 'n/a'} message=${error.message}. ` +
          `BaseUrl=${baseUrl}. Se usi cert self-signed, avvia con INTEGRATION_INSECURE_TLS=1.`
        );
      }

      throw error;
    }
  });  

  it('getPoiDetail returns response without result for non-existing id', async () => {
    const sample = await getSamplePoi();
    const missingId = `missing-${Date.now()}`;

    const response = await getPoiDetail(missingId, sample.category);

    expect(response.success).toBe(true);
    expect(response).not.toHaveProperty('result');
  });

  it('getPoiDetail gets output with valid id', async () => {
    const sample = await getSamplePoi();

    const response = await getPoiDetail(sample.id, sample.category);
    
    expect(response.success).toBe(true);
    expect(response.result.id).toBe(sample.id);
    expect(response.result.name).toBeTruthy();
    expect(response.result.category).toBeTruthy();
  });

  
});