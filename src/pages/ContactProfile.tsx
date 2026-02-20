import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ContactProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkedinUrl = searchParams.get("linkedin") || "";
  const [activeOpener, setActiveOpener] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("openers");

  // Email Dialog State
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Deal Overview State
  const [dealStatus, setDealStatus] = useState("Active");
  const [dealStage, setDealStage] = useState("Discovery");
  const [dealValue, setDealValue] = useState("125000");
  const [closeDate, setCloseDate] = useState("Q2 2025");
  const [editingField, setEditingField] = useState<string | null>(null);

  // Mock data
  const contact = {
    name: "Kyle Hollingsworth",
    title: "VP of Sales",
    headline: "Helping revenue teams compete and win in the age of Account Based Buying - We're Hiring!!!",
    email: "kyle.hollingsworth@6sense.com",
    phone: "+1 (555) 123-4567",
    linkedin: linkedinUrl || "https://www.linkedin.com/in/kyle-hollingsworth",
    avatar: "",
    company: "6sense",
    location: "San Francisco, CA",
    engagementScore: 78,
    relationshipStrength: "warm",
    lastContacted: "2 days ago",
    objectives: [
      "Increase adoption of AI-driven insights among sales teams",
      "Enhance customer engagement through personalized account-based marketing",
      "Drive revenue growth by optimizing the sales pipeline using predictive analytics"
    ],
    painPoints: [
      "Challenge in integrating diverse data signals into actionable insights",
      "Difficulty in ensuring user adoption of the predictive analytics platform",
      "Pressure to deliver measurable ROI from sales initiatives"
    ],
    rationale: "As VP of Sales, Kyle needs to facilitate the use of 6sense's AI-driven tools to improve sales outcomes. The complexity of deploying a predictive analytics platform demands strong user adoption and training.",
    keywords: ["Account Based Marketing", "Predictive Analytics", "Sales Intelligence", "B2B Sales", "Revenue Operations"],
    talkingPoints: [
      "How 6sense helps sales teams prioritize high-value accounts using predictive analytics",
      "The impact of AI-driven insights on shortening sales cycles and improving win rates",
      "Best practices for integrating account-based marketing with sales operations",
      "ROI measurement frameworks for B2B sales technology investments"
    ],
    experience: [
      {
        title: "VP of Sales",
        company: "6sense",
        duration: "2020 - Present",
        description: "Leading revenue teams in account-based strategies and predictive analytics adoption"
      },
      {
        title: "Director of Sales",
        company: "Previous Company",
        duration: "2016 - 2020",
        description: "Built and scaled enterprise sales organization from $10M to $50M ARR"
      }
    ],
    socialSummary: {
      recentActivity: "Active on LinkedIn with posts about B2B sales strategies and predictive analytics",
      interests: ["Revenue Operations", "AI in Sales", "Account-Based Marketing", "Sales Leadership"],
      engagementStyle: "Regularly shares industry insights and engages with sales technology content"
    },
    careerHighlights: {
      highlights: [
        "Grew revenue team from 15 to 85+ sales professionals over 3 years",
        "Architected ABM strategy that increased enterprise deal velocity by 40%",
        "Led successful expansion into EMEA and APAC markets"
      ],
      awards: ["Sales Leader of the Year 2022", "Top 25 Revenue Leaders"]
    }
  };

  const opportunity = {
    probability: 65,
    actions: [
      { task: "Schedule discovery call with technical team", priority: "high", due: "Today" },
      { task: "Send ROI calculator and case studies", priority: "medium", due: "Tomorrow" },
      { task: "Follow up on security questionnaire", priority: "medium", due: "This week" }
    ],
    timeline: [
      { date: "Feb 18, 2025", event: "Discovery call completed", type: "meeting", notes: "Discussed pain points around data integration" },
      { date: "Feb 15, 2025", event: "Initial outreach sent", type: "email", notes: "Personalized email based on recent LinkedIn post" },
      { date: "Feb 12, 2025", event: "Lead added to pipeline", type: "system", notes: "Matched ICP criteria from 6sense intent data" }
    ],
    competitors: [
      { name: "Gong", notes: "Currently evaluating for conversation intelligence" },
      { name: "Outreach", notes: "Using for sequence automation" }
    ]
  };

  const salesOpeners = {
    icebreakers: [
      "I noticed 6sense recently expanded their AI capabilities - how has that shift impacted your team's approach to account prioritization?",
      "Congratulations on the recent product launch! With that growth, I imagine scaling revenue operations has become a key focus.",
      "I saw your post about predictive analytics adoption - your insights on change management were spot on."
    ]
  };

  const toneOptions = [
    { id: "professional", label: "Professional", icon: "solar:briefcase-linear", description: "Formal and business-focused" },
    { id: "friendly", label: "Friendly", icon: "solar:emoji-funny-circle-linear", description: "Warm and approachable" },
    { id: "concise", label: "Concise", icon: "solar:minimize-square-linear", description: "Short and to the point" },
    { id: "persuasive", label: "Persuasive", icon: "solar:target-linear", description: "Action-oriented pitch" }
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatDealValue = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''));
    if (isNaN(num)) return "$0";
    return `$${num.toLocaleString()}`;
  };

  const handleGenerateEmail = async () => {
    if (!selectedTone) {
      toast.error("Please select a tone first");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const generatedSubject = `Quick question about ${contact.company}'s revenue operations`;
    const generatedBody = `Hi ${contact.name.split(' ')[0]},

I came across your profile and was impressed by your work scaling revenue teams at ${contact.company}. Your focus on account-based strategies and predictive analytics adoption really resonates with the challenges we help companies solve.

I noticed you've been expanding AI capabilities recently - I'd love to hear how that's impacting your team's approach to account prioritization. We've been helping similar organizations increase their win rates by 35% through better signal integration.

Would you be open to a quick 15-minute call this week to explore if there might be synergies?

Best regards`;

    setEmailSubject(generatedSubject);
    setEmailBody(generatedBody);
    setIsGenerating(false);
    toast.success("Email generated successfully");
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }
    toast.success("Email sent successfully");
    setEmailDialogOpen(false);
    setEmailSubject("");
    setEmailBody("");
    setSelectedTone(null);
  };

  const statusOptions = ["Active", "On Hold", "Closed Won", "Closed Lost"];
  const stageOptions = ["Prospecting", "Discovery", "Evaluation", "Proposal", "Negotiation", "Closed"];
  const closeDateOptions = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "On Hold": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "Closed Won": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "Closed Lost": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
      default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getStageColor = (stage: string) => {
    const stageIndex = stageOptions.indexOf(stage);
    const colors = [
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      "bg-primary/10 text-primary",
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    ];
    return colors[stageIndex] || colors[0];
  };

  return (
    <div className="min-h-full bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
            <Icon icon="solar:arrow-left-linear" className="mr-2 h-4 w-4" />
            Back to Playbooks
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Icon icon="solar:refresh-linear" className="h-4 w-4 mr-2" />
              Refresh Intel
            </Button>
            <Button size="sm" onClick={() => setEmailDialogOpen(true)}>
              <Icon icon="solar:letter-linear" className="h-4 w-4 mr-2" />
              Compose Email
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Left Sidebar - Sticky Contact Card */}
          <div className="w-80 flex-shrink-0 sticky top-6">
            <Card className="overflow-hidden">
              {/* Contact Header */}
              <div className="bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-lg rounded-xl">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-lg rounded-xl">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-semibold text-foreground truncate">{contact.name}</h1>
                    <p className="text-sm text-muted-foreground truncate">{contact.title}</p>
                    <p className="text-xs text-primary font-medium mt-1">{contact.company}</p>
                  </div>
                </div>

                {/* Engagement Score */}
                <div className="mt-4 p-3 rounded-lg bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Engagement Score</span>
                    <span className="text-sm font-bold text-primary">{contact.engagementScore}%</span>
                  </div>
                  <Progress value={contact.engagementScore} className="h-1.5" />
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={cn(
                      "text-[10px] uppercase font-bold",
                      contact.relationshipStrength === "warm" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                      contact.relationshipStrength === "hot" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                      contact.relationshipStrength === "cold" && "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                    )}>
                      {contact.relationshipStrength}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Last contacted {contact.lastContacted}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/50">
                    <Icon icon="solar:letter-linear" className="h-4 w-4" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                    <Icon icon="solar:phone-linear" className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                    <Icon icon="solar:map-point-linear" className="h-4 w-4" />
                    <span>{contact.location}</span>
                  </div>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="h-16 flex-col gap-1.5 text-xs" asChild>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                      <Icon icon="mdi:linkedin" className="h-5 w-5 text-[#0A66C2]" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="h-16 flex-col gap-1.5 text-xs">
                    <Icon icon="solar:phone-calling-linear" className="h-5 w-5 text-emerald-600" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="h-16 flex-col gap-1.5 text-xs">
                    <Icon icon="solar:calendar-add-linear" className="h-5 w-5 text-primary" />
                    Schedule
                  </Button>
                </div>

                <Separator />

                {/* Keywords */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Topics & Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-normal">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Overview - Editable */}
            <Card className="mt-4 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-violet-500/5">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:chart-2-bold" className="h-4 w-4 text-primary" />
                    Deal Overview
                  </div>
                  <Badge variant="outline" className="text-[9px] font-normal">
                    <Icon icon="solar:pen-2-linear" className="h-3 w-3 mr-1" />
                    Click to edit
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 p-3">
                {/* Status */}
                <Popover open={editingField === "status"} onOpenChange={(open) => setEditingField(open ? "status" : null)}>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "p-3 rounded-lg text-left transition-all group relative overflow-hidden",
                      getStatusColor(dealStatus),
                      "hover:ring-2 hover:ring-primary/30 hover:shadow-md"
                    )}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        Status
                        <Icon icon="solar:pen-2-linear" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm font-semibold mt-0.5">{dealStatus}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-1">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => { setDealStatus(status); setEditingField(null); toast.success(`Status updated to ${status}`); }}
                          className={cn(
                            "w-full p-2 rounded-lg text-left text-sm transition-colors flex items-center gap-2",
                            dealStatus === status ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            status === "Active" && "bg-emerald-500",
                            status === "On Hold" && "bg-amber-500",
                            status === "Closed Won" && "bg-blue-500",
                            status === "Closed Lost" && "bg-red-500"
                          )} />
                          {status}
                          {dealStatus === status && <Icon icon="solar:check-circle-bold" className="h-4 w-4 ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Stage */}
                <Popover open={editingField === "stage"} onOpenChange={(open) => setEditingField(open ? "stage" : null)}>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "p-3 rounded-lg text-left transition-all group relative overflow-hidden",
                      getStageColor(dealStage),
                      "hover:ring-2 hover:ring-primary/30 hover:shadow-md"
                    )}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        Stage
                        <Icon icon="solar:pen-2-linear" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm font-semibold mt-0.5">{dealStage}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="start">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Select Stage</p>
                    <div className="space-y-1">
                      {stageOptions.map((stage, idx) => (
                        <button
                          key={stage}
                          onClick={() => { setDealStage(stage); setEditingField(null); toast.success(`Stage updated to ${stage}`); }}
                          className={cn(
                            "w-full p-2 rounded-lg text-left text-sm transition-colors flex items-center gap-3",
                            dealStage === stage ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                              idx <= stageOptions.indexOf(dealStage) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}>
                              {idx + 1}
                            </div>
                          </div>
                          {stage}
                          {dealStage === stage && <Icon icon="solar:check-circle-bold" className="h-4 w-4 ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Deal Value */}
                <Popover open={editingField === "value"} onOpenChange={(open) => setEditingField(open ? "value" : null)}>
                  <PopoverTrigger asChild>
                    <button className="p-3 rounded-lg bg-violet-500/10 text-left transition-all group relative overflow-hidden hover:ring-2 hover:ring-primary/30 hover:shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        Deal Value
                        <Icon icon="solar:pen-2-linear" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mt-0.5">{formatDealValue(dealValue)}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4" align="start">
                    <div className="space-y-3">
                      <Label className="text-xs">Enter Deal Value</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="text"
                          value={parseInt(dealValue).toLocaleString()}
                          onChange={(e) => setDealValue(e.target.value.replace(/\D/g, ''))}
                          className="pl-7"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex gap-2">
                        {["50000", "100000", "250000", "500000"].map((val) => (
                          <button
                            key={val}
                            onClick={() => setDealValue(val)}
                            className="flex-1 px-2 py-1.5 rounded text-[10px] bg-muted hover:bg-muted/80 transition-colors"
                          >
                            ${parseInt(val).toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <Button size="sm" className="w-full" onClick={() => { setEditingField(null); toast.success("Deal value updated"); }}>
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Close Date */}
                <Popover open={editingField === "date"} onOpenChange={(open) => setEditingField(open ? "date" : null)}>
                  <PopoverTrigger asChild>
                    <button className="p-3 rounded-lg bg-amber-500/10 text-left transition-all group relative overflow-hidden hover:ring-2 hover:ring-primary/30 hover:shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        Close Date
                        <Icon icon="solar:pen-2-linear" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">{closeDate}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-1">
                      {closeDateOptions.map((date) => (
                        <button
                          key={date}
                          onClick={() => { setCloseDate(date); setEditingField(null); toast.success(`Close date updated to ${date}`); }}
                          className={cn(
                            "w-full p-2 rounded-lg text-left text-sm transition-colors flex items-center gap-2",
                            closeDate === date ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          )}
                        >
                          <Icon icon="solar:calendar-linear" className="h-4 w-4" />
                          {date}
                          {closeDate === date && <Icon icon="solar:check-circle-bold" className="h-4 w-4 ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Sales Openers - Featured Section */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon icon="solar:chat-round-dots-bold" className="h-4 w-4 text-primary" />
                    </div>
                    Conversation Starters
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    AI Generated
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {salesOpeners.icebreakers.map((opener, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveOpener(activeOpener === opener ? null : opener)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        activeOpener === opener
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      )}
                    >
                      <p className={cn(
                        "text-sm",
                        activeOpener === opener ? "" : "line-clamp-2"
                      )}>
                        {opener}
                      </p>
                      {activeOpener === opener && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleCopy(opener); }}>
                            <Icon icon="solar:copy-linear" className="h-3.5 w-3.5 mr-1.5" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEmailBody(opener); setEmailDialogOpen(true); }}>
                            <Icon icon="solar:plain-2-linear" className="h-3.5 w-3.5 mr-1.5" />
                            Use in Email
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout for Intel */}
            <div className="grid grid-cols-2 gap-4">
              {/* Strategic Objectives */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon icon="solar:flag-bold" className="h-4 w-4 text-emerald-500" />
                    Strategic Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {contact.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pain Points */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon icon="solar:danger-triangle-bold" className="h-4 w-4 text-amber-500" />
                    Pain Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {contact.painPoints.map((pain, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Key Talking Points */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon icon="solar:chat-line-bold" className="h-4 w-4 text-primary" />
                  Key Talking Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {contact.talkingPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => handleCopy(point)}
                    >
                      <Icon icon="solar:chat-dots-linear" className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm flex-1">{point}</span>
                      <Icon icon="solar:copy-linear" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Actions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon icon="solar:checklist-bold" className="h-4 w-4 text-primary" />
                    Next Actions
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5 mr-1" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {opportunity.actions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        item.priority === "high" && "bg-red-500",
                        item.priority === "medium" && "bg-amber-500",
                        item.priority === "low" && "bg-emerald-500"
                      )} />
                      <span className="text-sm flex-1">{item.task}</span>
                      <Badge variant="outline" className="text-[10px]">{item.due}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Icon icon="solar:check-circle-linear" className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline & Competitive Intel */}
            <div className="grid grid-cols-5 gap-4">
              {/* Deal Timeline */}
              <Card className="col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon icon="solar:history-bold" className="h-4 w-4 text-primary" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {opportunity.timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            item.type === "meeting" && "bg-emerald-500/10",
                            item.type === "email" && "bg-blue-500/10",
                            item.type === "system" && "bg-slate-500/10"
                          )}>
                            <Icon
                              icon={item.type === "meeting" ? "solar:video-conference-linear" : item.type === "email" ? "solar:letter-linear" : "solar:bolt-linear"}
                              className={cn(
                                "h-4 w-4",
                                item.type === "meeting" && "text-emerald-600 dark:text-emerald-400",
                                item.type === "email" && "text-blue-600 dark:text-blue-400",
                                item.type === "system" && "text-slate-600 dark:text-slate-400"
                              )}
                            />
                          </div>
                          {idx < opportunity.timeline.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{item.event}</span>
                            <span className="text-[10px] text-muted-foreground">{item.date}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Intel */}
              <Card className="col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon icon="solar:shield-check-bold" className="h-4 w-4 text-primary" />
                    Competitive Intel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {opportunity.competitors.map((comp, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="outline" className="text-[10px]">Competitor</Badge>
                          <span className="text-sm font-medium">{comp.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{comp.notes}</p>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5 mr-1.5" />
                      Add Competitor Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-2">
              {/* Career & Experience */}
              <Card>
                <button
                  onClick={() => toggleSection("career")}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:medal-ribbon-star-bold" className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Career & Experience</span>
                  </div>
                  <Icon
                    icon={expandedSection === "career" ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                    className="h-4 w-4 text-muted-foreground"
                  />
                </button>
                {expandedSection === "career" && (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-3">Work History</p>
                        <div className="space-y-3">
                          {contact.experience.map((exp, idx) => (
                            <div key={idx} className="border-l-2 border-primary/30 pl-4">
                              <h4 className="font-medium text-sm">{exp.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="text-primary font-medium">{exp.company}</span>
                                <span>•</span>
                                <span>{exp.duration}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-3">Key Achievements</p>
                        <ul className="space-y-2">
                          {contact.careerHighlights.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-3">Awards & Recognition</p>
                        <div className="flex flex-wrap gap-2">
                          {contact.careerHighlights.awards.map((award, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                              <Icon icon="solar:cup-star-linear" className="h-3 w-3 mr-1" />
                              {award}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Social Summary */}
              <Card>
                <button
                  onClick={() => toggleSection("social")}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:share-circle-bold" className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Social Summary</span>
                  </div>
                  <Icon
                    icon={expandedSection === "social" ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                    className="h-4 w-4 text-muted-foreground"
                  />
                </button>
                {expandedSection === "social" && (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</p>
                        <p className="text-sm text-muted-foreground">{contact.socialSummary.recentActivity}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {contact.socialSummary.interests.map((interest, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Engagement Style</p>
                        <p className="text-sm text-muted-foreground">{contact.socialSummary.engagementStyle}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Email Compose Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="solar:letter-bold" className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg">Compose Email</span>
                <p className="text-sm font-normal text-muted-foreground">to {contact.name}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {/* AI Tone Selection */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 via-violet-500/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="solar:magic-stick-3-bold" className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">AI Write</span>
                <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-700 dark:text-violet-400">
                  Powered by AI
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Select a tone and let AI craft a personalized email based on the contact's profile</p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all",
                      selectedTone === tone.id
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <Icon icon={tone.icon} className={cn(
                      "h-5 w-5 mx-auto mb-1.5",
                      selectedTone === tone.id ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className="text-xs font-medium">{tone.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{tone.description}</p>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleGenerateEmail}
                disabled={!selectedTone || isGenerating}
                className="w-full"
                variant={selectedTone ? "default" : "outline"}
              >
                {isGenerating ? (
                  <>
                    <Icon icon="solar:refresh-linear" className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:magic-stick-3-linear" className="h-4 w-4 mr-2" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>

            <Separator />

            {/* Email Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-xs font-medium text-muted-foreground w-12">To:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{contact.email}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Subject</Label>
                <Input
                  placeholder="Enter email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Message</Label>
                <Textarea
                  placeholder="Write your message or use AI to generate one..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[200px] text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon icon="solar:paperclip-linear" className="h-4 w-4 mr-1.5" />
                Attach
              </Button>
              <Button variant="ghost" size="sm">
                <Icon icon="solar:link-linear" className="h-4 w-4 mr-1.5" />
                Insert Link
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => { toast.success("Draft saved"); setEmailDialogOpen(false); }}>
                <Icon icon="solar:diskette-linear" className="h-4 w-4 mr-1.5" />
                Save Draft
              </Button>
              <Button onClick={handleSendEmail}>
                <Icon icon="solar:plain-2-linear" className="h-4 w-4 mr-1.5" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactProfile;
