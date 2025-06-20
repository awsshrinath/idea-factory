
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { ContentForm } from '@/components/content/ContentForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { RecentContent } from '@/components/content/RecentContent';
import { TrendingTopics } from '@/components/content/TrendingTopics';
import { AuthStatus } from '@/components/AuthStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ContentFormData {
  prompt: string;
  platform: string;
  tone: string;
  language: string;
  length: string;
}

export function Content() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ContentFormData>({
    prompt: "",
    platform: "twitter",
    tone: "professional",
    language: "english",
    length: "medium"
  });
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const authenticated = !!data.session;
      setIsAuthenticated(authenticated);
      setIsLoading(false);
      
      if (!authenticated) {
        navigate('/auth');
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        navigate('/auth');
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleFormChange = (newFormData: ContentFormData) => {
    setFormData(newFormData);
  };

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate content generation
      const mockContent = `Generated content for ${formData.platform} with ${formData.tone} tone: ${formData.prompt}`;
      setGeneratedContent(mockContent);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="premium-body">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <Sidebar />
      <main className={cn(
        "flex-1 p-0 relative z-10",
        isMobile ? "ml-0 pt-16" : "ml-64",
        "w-full max-w-full"
      )}>
        <div className="w-full px-6 md:px-8 lg:px-10">
          <div className="flex justify-between items-center p-6 mb-8">
            <div className="animate-fadeIn space-y-3">
              <h1 className="enterprise-heading text-4xl">
                Content Generation
              </h1>
              <p className="premium-body text-lg max-w-2xl">
                Create engaging content for social media, blogs, and marketing campaigns using AI.
              </p>
            </div>
            <AuthStatus />
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 mb-12">
            {/* Left Column */}
            <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10 lg:col-span-8">
              <ContentForm 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:col-span-4">
              <ContentPreview 
                content={generatedContent}
                platform={formData.platform}
                tone={formData.tone}
              />
              
              <TrendingTopics />
            </div>
          </div>

          <section className="pb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="premium-heading text-3xl">Recent Content</h2>
            </div>
            <RecentContent />
          </section>
        </div>
      </main>
    </div>
  );
}
