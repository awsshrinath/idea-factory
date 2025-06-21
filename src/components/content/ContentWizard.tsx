
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentWizardProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 1, title: 'Content Brief', description: 'Define your content goals' },
  { id: 2, title: 'Platform Selection', description: 'Choose target platforms' },
  { id: 3, title: 'AI Generation', description: 'Generate with AI' },
  { id: 4, title: 'Refinement', description: 'Perfect your content' }
];

export function ContentWizard({ currentStep, onStepChange }: ContentWizardProps) {
  return (
    <Card className="premium-card border border-gray-800 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <Button
                  variant={currentStep >= step.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-10 h-10 rounded-full p-0 transition-all duration-300",
                    currentStep >= step.id 
                      ? "bg-purple-600 hover:bg-purple-700 text-white" 
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                  )}
                  onClick={() => onStepChange(step.id)}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </Button>
                <div className="ml-3 hidden sm:block">
                  <div className={cn(
                    "text-sm font-medium transition-colors",
                    currentStep >= step.id ? "text-white" : "text-gray-400"
                  )}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-600 mx-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
