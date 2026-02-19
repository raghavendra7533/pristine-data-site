import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Target, Lightbulb, Bot, Settings, Bell, Plus } from "lucide-react";
import pristineDataLogo from "@/assets/pristine-data-logo.svg";

const sidebarSections = [
  {
    label: "PLATFORM",
    items: [
      { icon: Home, label: "Home", route: "/" },
      { icon: Search, label: "Search", route: "/search" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { icon: Target, label: "Prospecting", route: "/search" },
      { icon: Bot, label: "AI Relevance", route: "/campaigns" },
      { icon: Lightbulb, label: "Sales Intelligence", route: "/opportunities" },
    ],
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route: string) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-300">
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 flex flex-col border-r border-slate-800 bg-slate-900">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-semibold text-white">PristineData <span className="text-indigo-400">AI</span></span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.route);
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all duration-150 rounded-none ${
                      active
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <item.icon className={`h-3.5 w-3.5 flex-shrink-0 ${active ? "text-indigo-400" : ""}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom — User */}
        <div className="border-t border-slate-800 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">SG</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Single Grain</p>
              <p className="text-[10px] text-slate-500 truncate">Pro Plan</p>
            </div>
          </div>
          <button className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900 flex-shrink-0">
          {/* Page title — injected by route context via a simple approach */}
          <h1 className="text-sm font-semibold text-white">
            {location.pathname === "/" ? "Home"
              : location.pathname.startsWith("/search") ? "Search"
              : location.pathname.startsWith("/campaigns/create") ? "Create Campaign"
              : location.pathname.startsWith("/campaigns") ? "Campaigns"
              : location.pathname.startsWith("/opportunities") ? "Sales Intelligence"
              : location.pathname.startsWith("/integrations") ? "Integrations"
              : location.pathname.startsWith("/personalization") ? "Content HQ"
              : location.pathname.startsWith("/subscription") ? "Subscription"
              : ""}
          </h1>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search leads, lists..."
                className="h-8 pl-8 pr-3 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-44 transition-all"
              />
            </div>

            {/* Dark mode toggle placeholder */}
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
              <Bell className="h-4 w-4" />
            </button>

            {/* New Campaign CTA */}
            <button
              onClick={() => navigate("/campaigns/create")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all hover:scale-[1.02] shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
