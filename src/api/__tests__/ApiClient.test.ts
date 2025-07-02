import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient, ApiClient } from '@/api/ApiClient';
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

// Mock environment variables
vi.mock('@/env', () => ({
  env: {
    VITE_API_URL: MOCK_API_URL,
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
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clear cache after each test
    apiClient.clearCache();
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

      expect(fetch).toHaveBeenCalledWith(
        `${MOCK_API_URL}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
          body: undefined,
          signal: expect.any(AbortSignal),
        })
      );
      expect(data).toEqual(mockData);
    });

    it('should include auth token in headers when useAuth is true', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await apiClient.get('/test');

      const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const headers = options.headers as Headers;
      expect(headers.get('Authorization')).toBe('Bearer fake-token');
    });

    it('should not include auth token when useAuth is false', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await apiClient.get('/test', { useAuth: false });

      const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const headers = options.headers as Headers;
      expect(headers.get('Authorization')).toBeNull();
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

    it('should handle query parameters correctly', async () => {
      const mockData = { results: [] };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await apiClient.get('/test', { params: { page: 1, limit: 10, search: 'hello world' } });

      const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe(`${MOCK_API_URL}/test?page=1&limit=10&search=hello+world`);
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

      expect(fetch).toHaveBeenCalledWith(
        `${MOCK_API_URL}/items`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Headers),
          body: JSON.stringify(postData),
          signal: expect.any(AbortSignal),
        })
      );
      expect(data).toEqual(responseData);
    });

    it('should set Content-Type header for requests with data', async () => {
      const postData = { name: 'New Item' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({}),
      } as Response);

      await apiClient.post('/items', postData);

      const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const headers = options.headers as Headers;
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should handle 204 No Content responses gracefully', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => null,
      } as Response);

      const result = await apiClient.delete('/items/1');

      expect(result).toBeUndefined();
    });
  });

  describe('Caching', () => {
    it('should cache GET requests when useCache is true', async () => {
      const mockData = { id: 1, name: 'Cached Data' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      // First request
      const result1 = await apiClient.get('/test', { useCache: true });
      expect(result1).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second request should use cache
      const result2 = await apiClient.get('/test', { useCache: true });
      expect(result2).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should not cache non-GET requests', async () => {
      const mockData = { id: 1, name: 'Data' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockData,
      } as Response);

      await apiClient.post('/test', {}, { useCache: true });
      await apiClient.post('/test', {}, { useCache: true });

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should clear cache when clearCache is called', async () => {
      const mockData = { id: 1, name: 'Data' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await apiClient.get('/test', { useCache: true });
      expect(apiClient.getCacheSize()).toBe(1);

      apiClient.clearCache();
      expect(apiClient.getCacheSize()).toBe(0);
    });
  });

  describe('Request Cancellation', () => {
    it('should support request cancellation with external AbortController', async () => {
      const controller = apiClient.createAbortController();
      
      // Mock a cancelled fetch
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        Object.assign(new Error('Request was cancelled'), { name: 'AbortError' })
      );

      // Cancel the request immediately
      controller.abort();

      await expect(
        apiClient.get('/test', { abortController: controller })
      ).rejects.toThrow('Request was cancelled');
    });

    it('should create AbortController', () => {
      const controller = apiClient.createAbortController();
      expect(controller).toBeInstanceOf(AbortController);
    });
  });

  describe('Retry Logic', () => {
    it('should retry on server errors', async () => {
      // First two calls fail, third succeeds
      (fetch as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Server Error'))
        .mockRejectedValueOnce(new Error('Server Error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);

      const result = await apiClient.get('/test', { retries: 3, retryDelay: 10 });

      expect(result).toEqual({ success: true });
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on client errors (4xx)', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad Request' }),
      } as Response);

      await expect(apiClient.get('/test', { retries: 3 })).rejects.toThrow(ApiError);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token on 401 response', async () => {
      // Mock initial 401 response
      (fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Unauthorized' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        } as Response);

      // Mock token refresh
      mockedSupabase.auth.refreshSession.mockResolvedValueOnce({
        data: { session: { access_token: 'new-token' } },
        error: null,
      } as any);

      const result = await apiClient.get('/test');

      expect(result).toEqual({ success: true });
      expect(mockedSupabase.auth.refreshSession).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should sign out user if token refresh fails', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      } as Response);

      // Mock failed token refresh
      mockedSupabase.auth.refreshSession.mockResolvedValueOnce({
        data: { session: null },
        error: { message: 'Refresh failed' },
      } as any);

      await expect(apiClient.get('/test')).rejects.toThrow('Session expired');
      expect(mockedSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new TypeError('Failed to fetch')
      );

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');
    });

    it('should handle unknown errors', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Unknown error')
      );

      await expect(apiClient.get('/test')).rejects.toThrow('An unknown error occurred');
    });
  });

  describe('Custom ApiClient Instance', () => {
    it('should allow creating custom instances with different log levels', () => {
      const customClient = new ApiClient('debug');
      expect(customClient).toBeInstanceOf(ApiClient);
    });
  });
}); 