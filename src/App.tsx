
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { ProtectedRoute } from '@/components/system/ProtectedRoute';
import Index from '@/pages/Index';
import { Auth } from '@/pages/Auth';
import { Content } from '@/pages/Content';
import { Schedule } from '@/pages/Schedule';
import { Images } from '@/pages/Images';
import { Videos } from '@/pages/Videos';
import { VideoStudio } from '@/pages/VideoStudio';
import { Sources } from '@/pages/Sources';
import { Settings } from '@/pages/Settings';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <ErrorBoundary>
            <Routes>
              <Route path="/auth" element={<Auth />} />
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
    </QueryClientProvider>
  );
}

export default App;
