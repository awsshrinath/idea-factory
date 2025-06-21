import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '@/hooks/api/useApi';
import { ApiError } from '@/api/ApiError';
import { Toaster } from 'sonner';

// Mock the API function with a generic signature
const mockApiFunction = vi.fn<(...args: any[]) => Promise<any>>();

// A simple wrapper to provide the Toaster context if needed for notification tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

describe('useApi', () => {
  beforeEach(() => {
    // Clear any previous mock history
    mockApiFunction.mockClear();
  });

  it('should initialize with an idle status', () => {
    const { result } = renderHook(() => useApi(mockApiFunction));
    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set status to loading when the execute function is called', async () => {
    // Make the promise hang so we can observe the loading state
    mockApiFunction.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useApi(mockApiFunction));

    act(() => {
      result.current.execute();
    });

    expect(result.current.status).toBe('loading');
  });

  it('should resolve with data and a success status', async () => {
    const successData = { message: 'It worked!' };
    mockApiFunction.mockResolvedValue(successData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(successData);
    expect(result.current.error).toBeNull();
  });

  it('should reject with an error and an error status', async () => {
    const error = new ApiError('Failed', 500);
    mockApiFunction.mockRejectedValue(error);

    const { result } = renderHook(() => useApi(mockApiFunction));

    // We need to act and wait for the state update
    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
  });

  it('should correctly pass arguments to the API function', async () => {
    mockApiFunction.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      await result.current.execute('param1', { id: 123 });
    });

    expect(mockApiFunction).toHaveBeenCalledWith('param1', { id: 123 });
  });
}); 