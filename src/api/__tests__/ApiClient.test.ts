import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/api/ApiClient';
import { ApiError } from '@/api/ApiError';
import { supabase } from '@/integrations/supabase/client';

const MOCK_API_URL = 'http://localhost:3000/api/v1';

// Mock the global fetch function
global.fetch = vi.fn();

// Mock the supabase client module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      refreshSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('ApiClient', () => {
  const mockedSupabase = vi.mocked(supabase, true);

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Re-apply essential mocks after reset
    mockedSupabase.auth.getSession.mockResolvedValue({
      data: { session: { access_token: 'fake-token' } },
      error: null,
    } as any); // Using 'as any' to simplify mock typing
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make a GET request and return data on success', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      const data = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith(`${MOCK_API_URL}/test`, {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer fake-token',
        }),
        body: undefined,
      });
      expect(data).toEqual(mockData);
    });

    it('should throw an ApiError on a failed GET request', async () => {
      const errorResponse = { message: 'Not Found', code: 'NOT_FOUND' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      } as Response);

      await expect(apiClient.get('/nonexistent')).rejects.toThrow(ApiError);
      await expect(apiClient.get('/nonexistent')).rejects.toMatchObject({
        status: 404,
        message: 'Not Found',
      });
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with data and return a response', async () => {
      const postData = { name: 'New Item' };
      const responseData = { id: 2, ...postData };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => responseData,
      } as Response);

      const data = await apiClient.post('/items', postData);

      expect(fetch).toHaveBeenCalledWith(`${MOCK_API_URL}/items`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-token',
        }),
        body: JSON.stringify(postData),
      });
      expect(data).toEqual(responseData);
    });

    it('should handle 204 No Content responses gracefully', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
          ok: true,
          status: 204,
          json: async () => null, // Should not be called
        } as Response);
  
        const result = await apiClient.delete('/items/1');
  
        expect(result).toBeUndefined();
      });
  });
}); 