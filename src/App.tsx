import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import TalentDashboard from "./pages/TalentDashboard";
import Search from "./pages/Search";
import SearchLanding from "./pages/SearchLanding";
import UnifiedFilters from "./pages/UnifiedFilters";
import Insights from "./pages/Insights";
import Results from "./pages/Results";
import AccountSearch from "./pages/AccountSearch";
import ICPFunnel from "./pages/ICPFunnel";
import ContactProfile from "./pages/ContactProfile";
import Opportunities from "./pages/Opportunities";
import CampaignDashboard from "./pages/CampaignDashboard";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import CreateCampaign from "./pages/CreateCampaign";
import NotFound from "./pages/NotFound";
import PersonalizationAssets from "./pages/PersonalizationAssets";
import Integrations from "./pages/Integrations";
import AddIntegration from "./pages/AddIntegration";
import SubscriptionHub from "./pages/SubscriptionHub";
import SubscriptionFuture from "./pages/SubscriptionFuture";
import PricingCalculator from "./pages/PricingCalculator";
import ChromeExtension from "./pages/ChromeExtension";
import SCWorkspace from "./pages/SCWorkspace";
import ContentIQ from "./pages/ContentIQ";
import SalesOpenersMockup from "./pages/SalesOpenersMockup";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import EnrichLeads from "./pages/EnrichLeads";
import CampaignCalendar from "./pages/CampaignCalendar";
import AdminCampaignCalendar from "./pages/AdminCampaignCalendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/talent" element={<TalentDashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search-old" element={<SearchLanding />} />
            <Route path="/unified-filters" element={<UnifiedFilters />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/account-search" element={<AccountSearch />} />
            <Route path="/icp-funnel" element={<ICPFunnel />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/results/accounts" element={<Results />} />
            <Route path="/results/contacts" element={<Results />} />
            <Route path="/contact/profile" element={<ContactProfile />} />
            {/* Placeholder routes for menu items */}
            <Route path="/lists" element={<Lists />} />
            <Route path="/lists/:id" element={<ListDetail />} />
            <Route path="/enrich-leads" element={<EnrichLeads />} />
            <Route path="/campaigns" element={<CampaignDashboard />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/:id/analytics" element={<CampaignAnalytics />} />
            <Route path="/campaigns/calendar" element={<CampaignCalendar />} />
            <Route path="/personalization" element={<PersonalizationAssets />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/integrations/add" element={<AddIntegration />} />
            <Route path="/subscription-hub" element={<SubscriptionHub />} />
            <Route path="/subscription-future" element={<SubscriptionFuture />} />
            <Route path="/pricing-calculator" element={<PricingCalculator />} />
            <Route path="/chrome-extension" element={<ChromeExtension />} />
            <Route path="/sc-workspace" element={<SCWorkspace />} />
            <Route path="/content-iq" element={<ContentIQ />} />
            <Route path="/sales-openers-mockup" element={<SalesOpenersMockup />} />
            <Route path="/admin" element={<Dashboard />} />
          </Route>
          {/* Standalone admin routes — no AppLayout wrapper */}
          <Route path="/admin/campaign-calendar" element={<AdminCampaignCalendar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
