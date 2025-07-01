
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OfflineIndicator } from "@/components/system/OfflineIndicator";
import Index from '@/pages/Index';
import { Auth } from '@/pages/Auth';
import { Admin } from '@/pages/Admin';
import { AdminIntegrations } from '@/pages/AdminIntegrations';
import { Content } from '@/pages/Content';
import { Schedule } from '@/pages/Schedule';
import { Images } from '@/pages/Images';
import { Videos } from '@/pages/Videos';
import { VideoStudio } from '@/pages/VideoStudio';
import { Sources } from '@/pages/Sources';
import { Integrations } from '@/pages/Integrations';
import { Settings } from '@/pages/Settings';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-gray-950">
            <Toaster />
            <OfflineIndicator />
            <ErrorBoundary>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes - Protected by AdminRoute */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/integrations"
                  element={
                    <AdminRoute>
                      <AdminIntegrations />
                    </AdminRoute>
                  }
                />
                
                {/* User Routes - Protected by ProtectedRoute */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/content"
                  element={
                    <ProtectedRoute>
                      <Content />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/images"
                  element={
                    <ProtectedRoute>
                      <Images />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/videos"
                  element={
                    <ProtectedRoute>
                      <Videos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/video-studio"
                  element={
                    <ProtectedRoute>
                      <VideoStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sources"
                  element={
                    <ProtectedRoute>
                      <Sources />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/integrations"
                  element={
                    <ProtectedRoute>
                      <Integrations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ErrorBoundary>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
