import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock('./apiUtils', () => ({
  invokeApi: async <T>(callee: () => Promise<{ data: T }>) => {
    const response = await callee();
    return response.data;
  },
  getClient: () => ({
    post: mockPost,
  }),
  ApiErrorWithResponse: class ApiErrorWithResponse extends Error {},
}));

import { loginGoogle, loginUser, type LoginResponse } from './authApi';

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loginUser calls /Login with right payload and returns answer', async () => {
    const apiResponse: LoginResponse = {
      success: true,
      result: {
        token: 'jwt-token',
        preferences: '[]',
      },
    };

    mockPost.mockResolvedValue({ data: apiResponse });

    const result = await loginUser('test@example.com', 'Password123!');

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith('/Login', {
      userOrEmail: 'test@example.com',
      password: 'Password123!',
    });
    expect(result).toEqual(apiResponse);
  });

  it('loginGoogle calls /GoogleLogin with right payload and returns answer', async () => {
    const apiResponse: LoginResponse = {
      success: true,
      result: {
        token: 'google-jwt-token',
        preferences: '[]',
      },
    };

    mockPost.mockResolvedValue({ data: apiResponse });

    const result = await loginGoogle(
      'google-uid-123',
      'Mario Rossi',
      'mrossi',
      'mario.rossi@example.com',
      'google-access-token'
    );

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith('/GoogleLogin', {
      id: 'google-uid-123',
      name: 'Mario Rossi',
      username: 'mrossi',
      email: 'mario.rossi@example.com',
      token: 'google-access-token',
    });
    expect(result).toEqual(apiResponse);
  });
});