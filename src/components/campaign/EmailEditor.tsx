import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CampaignData, StageContent } from "@/pages/CreateCampaign";
import StageNavigator from "./StageNavigator";
import AiAssistPanel from "./AiAssistPanel";
import SelectiveEmailEditor from "./SelectiveEmailEditor";

interface EmailEditorProps {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
}

const EmailEditor = ({ data, onUpdate }: EmailEditorProps) => {
  const [activeStage, setActiveStage] = useState(0);

  const currentStage = data.stageContent[activeStage];
  const isSelective = data.personalizationMode === "selective";
  const isStatic = data.personalizationMode === "static";
  const showEditor = isSelective || isStatic;

  /* ─── Stage mutations ─── */

  const updateStage = useCallback(
    (index: number, patch: Partial<StageContent>) => {
      onUpdate({
        ...data,
        stageContent: data.stageContent.map((s, i) =>
          i === index ? { ...s, ...patch } : s
        ),
      });
    },
    [data, onUpdate]
  );

  const handleStageAdd = useCallback(() => {
    if (data.stageContent.length >= 5) return;
    const newStage: StageContent = {
      stageNumber: data.stageContent.length + 1,
      title: `Stage ${data.stageContent.length + 1}`,
      subject: "",
      body: "",
      dynamicVariables: [],
    };
    onUpdate({
      ...data,
      stages: data.stages + 1,
      stageContent: [...data.stageContent, newStage],
    });
  }, [data, onUpdate]);

  const handleStageRemove = useCallback(
    (index: number) => {
      if (data.stageContent.length <= 1) return;
      const updated = data.stageContent
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, stageNumber: i + 1 }));
      const newActive = Math.min(activeStage, updated.length - 1);
      setActiveStage(newActive);
      onUpdate({ ...data, stages: updated.length, stageContent: updated });
    },
    [data, onUpdate, activeStage]
  );

  const handleStageTitleChange = useCallback(
    (index: number, title: string) => {
      updateStage(index, { title });
    },
    [updateStage]
  );

  const handleAiGenerate = useCallback(
    (draft: string) => {
      updateStage(activeStage, { body: draft });
    },
    [activeStage, updateStage]
  );

  if (!currentStage) return null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* ─── Left: Stage Navigator ─── */}
      <StageNavigator
        stages={data.stageContent}
        activeStage={activeStage}
        maxStages={5}
        onStageSelect={setActiveStage}
        onStageAdd={handleStageAdd}
        onStageTitleChange={handleStageTitleChange}
        onStageRemove={handleStageRemove}
      />

      {/* ─── Right: Per-Stage Editor ─── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {/* Stage header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {activeStage + 1}
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {currentStage.title}
            </h2>
          </div>

          {/* Subject line */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Subject Line</Label>
            <Input
              placeholder="e.g., Quick question about {{companyName}}"
              value={currentStage.subject}
              onChange={(e) => updateStage(activeStage, { subject: e.target.value })}
              className="h-10"
            />
          </div>

          {/* AI Assist */}
          <AiAssistPanel onGenerate={handleAiGenerate} />

          {/* Email body */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email Body</Label>

            {showEditor ? (
              <SelectiveEmailEditor
                key={activeStage}
                emailBody={currentStage.body}
                dynamicVariables={currentStage.dynamicVariables}
                onEmailBodyChange={(body) => updateStage(activeStage, { body })}
                onVariablesChange={(dynamicVariables) =>
                  updateStage(activeStage, { dynamicVariables })
                }
                mergeOnly={isStatic}
              />
            ) : (
              /* Full AI mode — show a placeholder card */
              <div className="rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon icon="solar:magic-stick-3-linear" className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  AI will generate this email
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Based on your campaign theme and instructions, AI will create a
                  personalized email for each contact at send time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
