
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkflowSelection } from '@/components/videos/WorkflowSelection';
import { MainForm } from '@/components/videos/form/MainForm';
import { RecentVideosSection } from '@/components/videos/recent/RecentVideosSection';
import { HeroSection } from '@/components/videos/hero/HeroSection';
import { TipsSection } from '@/components/videos/TipsSection';

export function Videos() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<"direct" | "fine-tuned" | null>(null);

  const handleWorkflowSelect = (type: "direct" | "fine-tuned") => {
    setSelectedWorkflow(type);
  };

  const handleBackToSelection = () => {
    setSelectedWorkflow(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {!selectedWorkflow ? (
          <>
            <HeroSection />
            
            <div className="max-w-4xl mx-auto space-y-8">
              <WorkflowSelection onSelect={handleWorkflowSelect} />
              
              <Separator className="bg-white/10" />
              
              <TipsSection />
              
              <RecentVideosSection />
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">
                {selectedWorkflow === 'direct' ? 'Direct Video Generation' : 'Fine-Tuned Video Generation'}
              </h1>
            </div>

            <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <MainForm onSubmit={(data) => console.log('Generate video:', data)} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
