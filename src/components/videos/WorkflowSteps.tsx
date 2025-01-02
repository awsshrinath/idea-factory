import { ChevronRight } from "lucide-react";

interface WorkflowStepsProps {
  currentStep: string;
  steps: { [key: string]: string };
}

export function WorkflowSteps({ currentStep, steps }: WorkflowStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8 bg-muted p-4 rounded-lg">
      {Object.entries(steps).map(([step, label], index) => (
        <div key={step} className="flex items-center">
          <div className={`flex flex-col items-center ${currentStep === step ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'}`}>
              {index + 1}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
          {index < Object.keys(steps).length - 1 && (
            <ChevronRight className="mx-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}