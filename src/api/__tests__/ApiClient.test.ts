
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '../ApiClient';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token' } }
      })
    }
  }
}));

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient('debug');
    mockFetch.mockClear();
  });

  it('should make GET requests', async () => {
    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await apiClient.get('/test');
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should make POST requests with data', async () => {
    const mockResponse = { success: true };
    const requestData = { name: 'test' };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await apiClient.post('/test', requestData);
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestData)
      })
    );
  });

  it('should handle errors properly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad Request' })
    });

    await expect(apiClient.get('/test')).rejects.toThrow();
  });

  it('should retry on retryable errors', async () => {
    // First call fails, second succeeds
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server Error' })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'success' })
      });

    const result = await apiClient.get('/test', { retries: 2, retryDelay: 10 });
    expect(result).toEqual({ data: 'success' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(apiClient.get('/test')).rejects.toThrow();
  });

  it('should support request cancellation', async () => {
    const controller = apiClient.createAbortController();
    
    mockFetch.mockImplementationOnce(() => 
      Promise.reject(new DOMException('Request aborted', 'AbortError'))
    );

    apiClient.cancelRequest(controller, 'Test cancellation');

    await expect(
      apiClient.get('/test', { abortController: controller })
    ).rejects.toThrow();
  });

  it('should cache GET requests when enabled', async () => {
    const mockResponse = { data: 'cached' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    // First request
    const result1 = await apiClient.get('/test', { useCache: true });
    expect(result1).toEqual(mockResponse);

    // Second request should use cache
    const result2 = await apiClient.get('/test', { useCache: true });
    expect(result2).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
