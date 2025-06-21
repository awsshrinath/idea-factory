
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '@/hooks/api/useApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';

// Mock the API client
vi.mock('@/api/ApiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide GET hook', () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.useGet).toBeDefined();
    expect(typeof result.current.useGet).toBe('function');
  });

  it('should provide POST hook', () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.usePost).toBeDefined();
    expect(typeof result.current.usePost).toBe('function');
  });

  it('should provide PUT hook', () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.usePut).toBeDefined();
    expect(typeof result.current.usePut).toBe('function');
  });

  it('should provide DELETE hook', () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.useDelete).toBeDefined();
    expect(typeof result.current.useDelete).toBe('function');
  });

  it('should provide invalidateQueries method', () => {
    const { result } = renderHook(() => useApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.invalidateQueries).toBeDefined();
    expect(typeof result.current.invalidateQueries).toBe('function');
  });
});
