import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import CampaignSetup from "@/components/campaign/CampaignSetup";
import CampaignPreview from "@/components/campaign/CampaignPreview";
import CampaignReview from "@/components/campaign/CampaignReview";

type CampaignStep = 1 | 2 | 3;

export type PersonalizationMode = "full_ai" | "selective" | "static";

export interface DynamicVariable {
  id: string;
  type: "merge" | "conditional" | "ai_paragraph" | "ai_subject_line";
  token: string;
  label: string;
  // conditional-specific
  attribute?: string;
  rows?: { condition: string; content: string }[];
  fallback?: string;
  // ai_paragraph-specific
  aiInstruction?: string;
}

export interface CampaignData {
  name: string;
  theme: string;
  stages: number;
  contactList: string;
  instructions: string;
  personalizationMode: PersonalizationMode;
  subjectLine: string;
  subjectVariables: DynamicVariable[];
  emailBody: string;
  dynamicVariables: DynamicVariable[];
}

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CampaignStep>(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    theme: "",
    stages: 3,
    contactList: "",
    instructions: "",
    personalizationMode: "full_ai",
    subjectLine: "",
    subjectVariables: [],
    emailBody: "",
    dynamicVariables: []
  });

  const steps = [
    { number: 1, label: "Campaign", completed: currentStep > 1 },
    { number: 2, label: "Email", completed: currentStep > 2 },
    { number: 3, label: "Review & Send", completed: false }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as CampaignStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CampaignStep);
    }
  };

  const handleSave = () => {
    // Save draft logic
    console.log("Saving campaign draft...", campaignData);
  };

  const handleLaunch = () => {
    // Launch campaign logic
    console.log("Launching campaign...", campaignData);
    navigate("/campaigns");
  };

  return (
    <div className="min-h-full">
      {/* Header - Card Style Top Bar */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Left - Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/campaigns")}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {campaignData.name || "New Campaign"}
              </h1>
              <span className="text-xs text-muted-foreground">Sequence Builder</span>
            </div>
          </div>

          {/* Center - Step Progress */}
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.completed || currentStep === step.number) {
                      setCurrentStep(step.number as CampaignStep);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    currentStep === step.number
                      ? "text-foreground"
                      : step.completed
                      ? "text-primary hover:text-primary/80 cursor-pointer"
                      : "text-muted-foreground cursor-default"
                  }`}
                >
                  {step.label}
                </button>
                {index < steps.length - 1 && (
                  <Icon icon="solar:alt-arrow-right-linear" className="h-3 w-3 text-muted-foreground/50 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/campaigns")}
              className="text-muted-foreground hover:text-foreground"
            >
              Exit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
            >
              Save Draft
            </Button>
            {currentStep < 3 ? (
              <Button
                size="sm"
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90"
              >
                Continue
                <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleLaunch}
                className="bg-primary hover:bg-primary/90"
              >
                <Icon icon="solar:rocket-linear" className="h-3.5 w-3.5 mr-1.5" />
                Launch
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-5xl mx-auto mt-3">
          <div className="flex h-1 rounded-full overflow-hidden bg-muted">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex-1 transition-colors duration-300 ${
                  step.completed || currentStep === step.number
                    ? "bg-primary"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {currentStep === 1 && (
          <CampaignSetup
            data={campaignData}
            onUpdate={setCampaignData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <CampaignPreview
            data={campaignData}
            onUpdate={setCampaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <CampaignReview
            data={campaignData}
            onBack={handleBack}
            onLaunch={handleLaunch}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
