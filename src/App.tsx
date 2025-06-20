
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Content } from "./pages/Content";
import { Images } from "./pages/Images";
import { Videos } from "./pages/Videos";
import { Schedule } from "./pages/Schedule";
import { Settings } from "./pages/Settings";
import { Auth } from "./pages/Auth";
import ErrorBoundary from './components/system/ErrorBoundary';
import { OfflineIndicator } from './components/system/OfflineIndicator';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { ProtectedRoute } from './components/system/ProtectedRoute';
import { useIdleTimeout } from './hooks/useIdleTimeout';

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  // Set idle timeout to 15 minutes (900000 ms)
  useIdleTimeout(900000);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ErrorBoundary fallback={<div>Something went wrong. Please refresh.</div>}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <OfflineIndicator />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/content" element={<Content />} />
                  <Route path="/images" element={<Images />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                {/* Add a catch-all route that redirects to the index page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SessionContextProvider>
  );
};

export default App;
