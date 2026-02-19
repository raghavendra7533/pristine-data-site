import { useState } from "react";
import { Target, Bot, Lightbulb, Mail, ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featureCards = [
  {
    title: "Prospecting and Lead Enrichment",
    description: "Discover and enrich the right leads for your pipeline",
    icon: Target,
    iconBg: "bg-indigo-600",
    actions: [
      { label: "Lead Search/Insights", route: "/search" },
      { label: "Lists/Saved Searches", route: "/lists" },
    ],
  },
  {
    title: "AI Relevance Engine",
    description: "Generate personalized outreach and campaigns at scale",
    icon: Bot,
    iconBg: "bg-violet-600",
    actions: [
      { label: "Campaign/Sequence Builder", route: "/campaigns/create" },
      { label: "Campaign Analytics", route: "/campaigns" },
    ],
  },
  {
    title: "Sales Intelligence",
    description: "Account research, intent signals, and opportunity playbooks",
    icon: Lightbulb,
    iconBg: "bg-amber-600",
    actions: [
      { label: "Opportunity Playbook & Deal Story", route: "/opportunities" },
      { label: "Account Intelligence", route: "/search" },
    ],
  },
];

const activeCampaigns = [
  {
    id: 1,
    name: "Single Grain Campaign 3 2Feb26",
    type: "Static Theme",
    totalLeads: 9234,
    contacted: 3963,
    openRate: 31.4,
    clickRate: 0,
  },
  {
    id: 2,
    name: "Campaign 2 29Jan26",
    type: "Static Theme",
    totalLeads: 9008,
    contacted: 9008,
    openRate: 28.3,
    clickRate: 0,
  },
];

type Tab = "active" | "recent" | "performance";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("active");

  return (
    <div className="p-6 space-y-5">
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col hover:border-slate-700 transition-all duration-200"
          >
            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center mb-3 flex-shrink-0`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>

            {/* Title + Description */}
            <h3 className="text-sm font-semibold text-white mb-1">{card.title}</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{card.description}</p>

            {/* Actions */}
            <div className="space-y-0 mt-auto border-t border-slate-800 -mx-5 px-5 pt-3">
              {card.actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.route)}
                  className="w-full flex items-center justify-between py-2 text-xs text-slate-400 hover:text-white transition-colors group"
                >
                  <span>{action.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">Campaigns</span>
            <button
              onClick={() => navigate("/campaigns")}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 gap-0.5">
            {(["active", "recent", "performance"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all capitalize ${
                  tab === t
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "active" ? "Active Campaigns" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Active badge row */}
        <div className="px-5 py-3 border-b border-slate-800/60">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        {/* Campaign rows */}
        <div className="divide-y divide-slate-800/60">
          {activeCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 cursor-pointer transition-colors group"
            >
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{campaign.name}</p>
                  <p className="text-xs text-slate-500">{campaign.type}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-8 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{campaign.totalLeads.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Total Leads</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{campaign.contacted.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Contacted</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{campaign.openRate}%</p>
                  <p className="text-[11px] text-slate-500">Open Rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{campaign.clickRate}</p>
                  <p className="text-[11px] text-slate-500">Click Rate</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
