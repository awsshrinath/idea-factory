
import React, { useState } from "react";
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
import { AdminIntegrations } from "./pages/AdminIntegrations";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import { OfflineIndicator } from "./components/system/OfflineIndicator";

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

  // Make sure environment variables are properly loaded
  console.log("Supabase URL exists:", !!import.meta.env.VITE_SUPABASE_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <OfflineIndicator />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/content" element={
              <ProtectedRoute>
                <Content />
              </ProtectedRoute>
            } />
            <Route path="/images" element={
              <ProtectedRoute>
                <Images />
              </ProtectedRoute>
            } />
            <Route path="/videos" element={
              <ProtectedRoute>
                <Videos />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            {/* Admin-only routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Index />
              </AdminRoute>
            } />
            <Route path="/admin/integrations" element={
              <AdminRoute>
                <AdminIntegrations />
              </AdminRoute>
            } />
            {/* Catch-all route that redirects to the appropriate dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
