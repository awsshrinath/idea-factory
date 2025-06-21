
import { useState, useEffect } from "react";
import { Separator } from '@/components/ui/separator';
import { MobileNavigation } from "@/components/MobileNavigation";
import { ContentForm } from '@/components/content/ContentForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { RecentContent } from '@/components/content/RecentContent';
import { PromptTemplates } from '@/components/content/PromptTemplates';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Sidebar } from "@/components/Sidebar";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { useContentJob } from "@/hooks/api/useContentJob";
import { cn } from "@/lib/utils";
import { Platform } from '@/types/content';

// New wizard components
import { ContentWizard } from '@/components/content/ContentWizard';
import { QuickTemplates } from '@/components/content/QuickTemplates';
import { PlatformSelectionStep } from '@/components/content/PlatformSelectionStep';
import { TrendingSuggestions } from '@/components/content/TrendingSuggestions';

export function Content() {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [contentPrompt, setContentPrompt] = useState('');
  const { isMobile, getCardPadding } = useMobileOptimized();
  const { jobId, status, data, error, cancel } = useContentJob();

  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
  };

  const handleTemplateSelect = (template: any) => {
    setContentPrompt(template.prompt);
    setCurrentStep(2); // Move to platform selection
  };

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleTopicSelect = (topic: string) => {
    setContentPrompt(topic);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (status === 'completed' && data?.result_url) {
      const fetchContent = async () => {
        try {
          const response = await fetch(data.result_url);
          if (!response.ok) {
            throw new Error('Failed to fetch generated content.');
          }
          const textContent = await response.text();
          setGeneratedContent(textContent);
        } catch (fetchError: any) {
          console.error(fetchError);
        }
      };
      fetchContent();
    }
  }, [status, data]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <QuickTemplates onTemplateSelect={handleTemplateSelect} />
            <ContentForm onContentGenerated={handleContentGenerated} />
          </div>
        );
      case 2:
        return (
          <PlatformSelectionStep 
            selectedPlatforms={selectedPlatforms}
            onPlatformToggle={handlePlatformToggle}
          />
        );
      case 3:
        return (
          <div className="space-y-8">
            {/* Generation Status */}
            {(status === 'processing' || status === 'submitting') && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                    <span className="text-gray-300 font-medium">
                      {status === 'submitting' ? 'Submitting job...' : `Processing... (Job ID: ${jobId})`}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={cancel}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === 'failed' && (
              <div className="bg-red-900/20 rounded-xl p-6 border border-red-800/50 shadow-lg">
                <div className="text-red-400">
                  <p className="font-semibold mb-2">Generation failed:</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}

            <ContentForm onContentGenerated={handleContentGenerated} />
          </div>
        );
      case 4:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Content Refinement</h2>
            <p className="text-gray-400 mb-8">Review and refine your generated content</p>
            <div className="space-y-4">
              <Button className="premium-button bg-gradient-to-r from-purple-600 to-indigo-600">
                Generate Variations
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Edit Content
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950 overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <MobileNavigation />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full relative z-10 transition-all duration-300",
        getCardPadding(),
        isMobile ? "ml-0 pt-20 px-4" : "ml-64 pl-8 p-8",
      )}>
        <div className="container mx-auto max-w-7xl">
          {/* Premium Header Section */}
          <div className={cn(
            "text-center mb-8",
            isMobile && "mb-6"
          )}>
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4",
              isMobile ? "text-3xl" : "text-4xl"
            )}>
              AI Content Generator
            </h1>
            <p className={cn(
              "text-gray-400 max-w-3xl mx-auto leading-relaxed",
              isMobile ? "text-lg px-4" : "text-xl"
            )}>
              Create engaging content for social media, blogs, and marketing campaigns with our guided workflow
            </p>
          </div>

          {/* Content Wizard Progress */}
          <ContentWizard currentStep={currentStep} onStepChange={setCurrentStep} />

          {/* Main Content Area */}
          <div className={cn(
            "gap-8 max-w-none mx-auto",
            isMobile ? "flex flex-col space-y-8" : "grid lg:grid-cols-3"
          )}>
            {/* Left Panel - Main Content */}
            <div className={cn(
              "space-y-8",
              isMobile ? "order-1" : "lg:col-span-2"
            )}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={currentStep === 4}
                  className="premium-button bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Panel - Preview & Suggestions */}
            <div className={cn(
              "space-y-8",
              isMobile ? "order-2" : ""
            )}>
              <ContentPreview 
                content={generatedContent}
                platform={selectedPlatforms[0] || "instagram"}
                tone="professional"
              />
              
              <Separator className="bg-gray-800" />
              
              <TrendingSuggestions onTopicSelect={handleTopicSelect} />
            </div>
          </div>

          {/* Recent Content Section */}
          <div className={cn(
            "mt-16",
            isMobile && "mt-12"
          )}>
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg">
              <RecentContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
