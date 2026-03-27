import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { CampaignData } from "@/pages/CreateCampaign";
import SelectiveEmailEditor from "./SelectiveEmailEditor";

interface CampaignPreviewProps {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock preview data (used for full_ai preview)
const mockContacts = [
  { email: "josh@compscience.com", name: "Josh", company: "CompScience" },
  { email: "thamilton@unitedfiregroup.com", name: "T. Hamilton", company: "United Fire Group" },
  { email: "michael.celi@springventuregroup.com", name: "Michael", company: "Spring Venture Group" },
];

const generateEmailContent = (contact: { name: string; company: string }, stage: number) => {
  const stages = [
    {
      id: 1,
      title: "Initial Outreach",
      subject: `Transform ${contact.company}'s Partner Onboarding Process`,
      content: `Hi ${contact.name},\n\nAs a leader at ${contact.company}, you're likely navigating the complexities of integrating a diverse range of plan providers and TPAs.\n\nWe simplify this with our no-code, AI-powered integration platform, which accelerates partner onboarding and ensures compliance.\n\nCan we schedule a brief call to discuss how we can help streamline your processes at ${contact.company}?\n\nRegards,\nPristine Data Team`,
    },
    {
      id: 2,
      title: "1st Follow-up",
      subject: `Quick Question About ${contact.company}'s Integration Strategy`,
      content: `Hi ${contact.name},\n\nI wanted to follow up on my previous message about streamlining your partner onboarding process.\n\nI'd love to share some quick insights on how companies similar to ${contact.company} have reduced their integration time by 60%.\n\nWould a 15-minute call next week work for you?\n\nBest regards,\nPristine Data Team`,
    },
    {
      id: 3,
      title: "2nd Follow-up",
      subject: `Final Follow-up: Integration Solutions for ${contact.company}`,
      content: `Hi ${contact.name},\n\nThis is my final follow-up regarding our AI-powered integration platform.\n\nI respect your time and inbox, but I wanted to make sure you had the opportunity to learn how we can help ${contact.company}:\n• Reduce onboarding time by 60%\n• Ensure compliance across all integrations\n• Eliminate manual data mapping\n\nFeel free to reach out when you're ready.\n\nBest,\nPristine Data Team`,
    },
    {
      id: 4,
      title: "3rd Follow-up",
      subject: `One More Thing for ${contact.company}`,
      content: `Hi ${contact.name},\n\nI came across some recent news about ${contact.company} and thought our platform could be particularly relevant.\n\nIf you're open to a quick 10-minute call, I'd love to share how we've helped similar companies achieve:\n• 3x faster partner onboarding\n• 90% reduction in manual data entry\n• Real-time compliance monitoring\n\nNo pressure at all.\n\nBest,\nPristine Data Team`,
    },
    {
      id: 5,
      title: "Final Touch",
      subject: `Closing the Loop - ${contact.company}`,
      content: `Hi ${contact.name},\n\nThis will be my last email on this topic.\n\nI genuinely believe our platform could help ${contact.company} streamline operations and save significant time on partner integrations.\n\nIf the timing isn't right now, no worries at all. Feel free to reach out whenever you're ready.\n\nWarm regards,\nPristine Data Team`,
    },
  ];
  return stages[stage - 1];
};

/* ─── Full AI Preview ─── */

function FullAiPreview({ data }: { data: CampaignData }) {
  const [selectedEmail, setSelectedEmail] = useState(mockContacts[0].email);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmailSearch, setShowEmailSearch] = useState(false);

  const filteredContacts = mockContacts.filter((c) =>
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedContact = mockContacts.find((c) => c.email === selectedEmail) || mockContacts[0];
  const stages = Array.from({ length: data.stages }, (_, i) =>
    generateEmailContent(selectedContact, i + 1)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:letter-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Email Preview</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {data.stages} {data.stages === 1 ? "Stage" : "Stages"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Contact Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Preview Contact</Label>
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowEmailSearch(true)}
                  className="h-7 w-40 text-xs"
                />
                <Icon
                  icon="solar:magnifer-linear"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground"
                />
                {showEmailSearch && searchQuery && (
                  <div className="absolute top-full mt-1 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-auto">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.email}
                        onClick={() => {
                          setSelectedEmail(contact.email);
                          setSearchQuery("");
                          setShowEmailSearch(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-muted text-xs"
                      >
                        {contact.email}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {mockContacts.map((contact) => (
                <button
                  key={contact.email}
                  onClick={() => setSelectedEmail(contact.email)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedEmail === contact.email
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {contact.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Tabs */}
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="w-full justify-start h-8 gap-1 bg-muted/30 p-1">
              {stages.map((stage) => (
                <TabsTrigger
                  key={stage.id}
                  value={stage.id.toString()}
                  className="text-xs px-3 py-1 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  {stage.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {stages.map((stage) => (
              <TabsContent key={stage.id} value={stage.id.toString()} className="mt-3">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 px-4 py-2 border-b border-border space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">To:</span> {selectedEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">From:</span> Pristine Data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Subject:</span> {stage.subject}
                    </p>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto scrollbar-minimal">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                      {stage.content}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Subject Line with Write with AI ─── */

const MOCK_SUBJECTS = [
  "Quick question about {{companyName}}, {{firstName}}",
  "{{firstName}}, saw {{companyName}} is growing fast",
  "Idea for {{companyName}}'s outreach strategy",
];

function SubjectLineField({
  data,
  onUpdate,
  isStatic,
}: {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
  isStatic: boolean;
}) {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!aiPrompt.trim() || generating) return;
    setGenerating(true);
    setTimeout(() => {
      const pick = MOCK_SUBJECTS[Math.floor(Math.random() * MOCK_SUBJECTS.length)];
      onUpdate({ ...data, subjectLine: pick });
      setGenerating(false);
      setAiOpen(false);
      setAiPrompt("");
    }, 800);
  }, [aiPrompt, generating, data, onUpdate]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Subject Line <span className="text-destructive">*</span>
        </Label>
        {!isStatic && !aiOpen && (
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
              "bg-blue-500/5 border border-blue-500/20",
              "text-blue-600 dark:text-blue-400",
              "hover:bg-blue-500/10 hover:border-blue-500/30",
              "transition-all duration-200"
            )}
          >
            <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5" />
            Write with AI
          </button>
        )}
      </div>

      {/* AI prompt inline */}
      {aiOpen && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-foreground">Generate subject line</span>
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
            placeholder="e.g. A casual intro referencing their recent growth"
            disabled={generating}
            autoFocus
            className={cn(
              "w-full rounded-md border border-blue-500/20 bg-background",
              "px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40",
              "transition-colors duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => { setAiOpen(false); setAiPrompt(""); }}
              disabled={generating}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!aiPrompt.trim() || generating}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {generating ? (
                <>
                  <Icon icon="solar:refresh-linear" className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <SelectiveEmailEditor
        emailBody={data.subjectLine}
        dynamicVariables={data.subjectVariables ?? []}
        onEmailBodyChange={(subjectLine) => onUpdate({ ...data, subjectLine })}
        onVariablesChange={(subjectVariables) => onUpdate({ ...data, subjectVariables })}
        scope={isStatic ? "merge_only" : "subject"}
        compact
      />
    </div>
  );
}

/* ─── Email Drafting (selective / static) ─── */

function EmailDraftEditor({
  data,
  onUpdate,
}: {
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
}) {
  const isStatic = data.personalizationMode === "static";

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Icon icon="solar:pen-new-round-linear" className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              {isStatic ? "Email Editor" : "Email Editor"}
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isStatic
              ? "Write your email. Use merge tokens like first name or company with the / command."
              : "Write your email and use / to insert AI paragraphs, conditional blocks, or merge tokens."}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Subject Line */}
          <SubjectLineField data={data} onUpdate={onUpdate} isStatic={isStatic} />

          {/* Email Body */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email Body</Label>
            <SelectiveEmailEditor
              emailBody={data.emailBody}
              dynamicVariables={data.dynamicVariables}
              onEmailBodyChange={(emailBody) => onUpdate({ ...data, emailBody })}
              onVariablesChange={(dynamicVariables) =>
                onUpdate({ ...data, dynamicVariables })
              }
              mergeOnly={isStatic}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Main Component ─── */

const CampaignPreview = ({ data, onUpdate }: CampaignPreviewProps) => {
  const isFullAi = data.personalizationMode === "full_ai";

  if (isFullAi) {
    return <FullAiPreview data={data} />;
  }

  return <EmailDraftEditor data={data} onUpdate={onUpdate} />;
};

export default CampaignPreview;
