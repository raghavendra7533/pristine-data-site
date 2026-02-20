import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import pristineDataLogo from "@/assets/pristine-data-logo.svg";

interface NavItem {
  icon: string;
  activeIcon: string;
  label: string;
  route?: string;
  children?: { label: string; route: string; icon: string }[];
}

interface SidebarSection {
  label: string;
  items: NavItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: "PLATFORM",
    items: [
      { icon: "solar:home-2-linear", activeIcon: "solar:home-2-bold", label: "Home", route: "/" },
      { icon: "solar:magnifer-linear", activeIcon: "solar:magnifer-bold", label: "Search", route: "/search" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      {
        icon: "solar:target-linear",
        activeIcon: "solar:target-bold",
        label: "Prospecting",
        children: [
          { label: "Lead Search", route: "/search", icon: "solar:magnifer-linear" },
          { label: "Lists", route: "/lists", icon: "solar:documents-linear" },
          { label: "Enrich Leads", route: "/upload", icon: "solar:upload-linear" },
        ],
      },
      {
        icon: "solar:magic-stick-3-linear",
        activeIcon: "solar:magic-stick-3-bold",
        label: "Personalization",
        children: [
          { label: "Sequence Builder", route: "/campaigns/create", icon: "solar:widget-linear" },
          { label: "Campaign Analytics", route: "/campaigns", icon: "solar:chart-linear" },
          { label: "Content HQ", route: "/personalization", icon: "solar:layers-linear" },
        ],
      },
      {
        icon: "solar:lightbulb-linear",
        activeIcon: "solar:lightbulb-bold",
        label: "Sales Intelligence",
        children: [
          { label: "Opportunity Playbook", route: "/opportunities", icon: "solar:bolt-linear" },
          { label: "Account Intelligence", route: "/account-search", icon: "solar:graph-up-linear" },
          { label: "Buying Signals", route: "/signals", icon: "solar:radar-linear" },
        ],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { icon: "solar:link-linear", activeIcon: "solar:link-bold", label: "Integrations", route: "/integrations" },
    ],
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
    }
  }, []);

  // Auto-expand parent if child route is active
  useEffect(() => {
    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) =>
            location.pathname === child.route || location.pathname.startsWith(child.route + "/")
          );
          if (hasActiveChild && !expandedItems.includes(item.label)) {
            setExpandedItems((prev) => [...prev, item.label]);
          }
        }
      });
    });
  }, [location.pathname]);

  const toggleTheme = () => setIsDark(!isDark);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (route: string) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => isActive(child.route));
    }
    return item.route ? isActive(item.route) : false;
  };

  const getPageTitle = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.startsWith("/search")) return "Search";
    if (location.pathname.startsWith("/campaigns/create")) return "Sequence Builder";
    if (location.pathname.startsWith("/campaigns")) return "Campaign Analytics";
    if (location.pathname.startsWith("/opportunities")) return "Opportunity Playbook";
    if (location.pathname.startsWith("/lists")) return "Lists";
    if (location.pathname.startsWith("/integrations")) return "Integrations";
    if (location.pathname.startsWith("/personalization")) return "Content HQ";
    if (location.pathname.startsWith("/account-search")) return "Account Intelligence";
    if (location.pathname.startsWith("/upload")) return "Enrich Leads";
    if (location.pathname.startsWith("/signals")) return "Buying Signals";
    return "";
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-card h-screen sticky top-0 overflow-y-auto">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src={pristineDataLogo} alt="PristineData AI" className="h-7 w-auto" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
              {section.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.label);
                const parentActive = isParentActive(item);

                return (
                  <div key={item.label}>
                    {/* Parent item */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.label);
                        } else if (item.route) {
                          navigate(item.route);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-all duration-150 ${
                        parentActive && !hasChildren
                          ? "bg-primary/10 text-primary border-r-2 border-primary"
                          : parentActive && hasChildren
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          icon={parentActive ? item.activeIcon : item.icon}
                          className={`h-4 w-4 flex-shrink-0 ${parentActive ? "text-primary" : ""}`}
                        />
                        {item.label}
                      </span>
                      {hasChildren && (
                        <Icon
                          icon="solar:alt-arrow-down-linear"
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 pl-2.5 border-l border-border/50 mt-1 mb-2">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.route);
                          return (
                            <button
                              key={child.label}
                              onClick={() => navigate(child.route)}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                                childActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              <Icon icon={child.icon} className="h-3.5 w-3.5" />
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom — User */}
        <div className="border-t border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-bold">SG</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Single Grain</p>
              <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          </div>
          <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <Icon icon="solar:settings-linear" className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card flex-shrink-0">
          <h1 className="text-sm font-semibold text-foreground">
            {getPageTitle()}
          </h1>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Icon icon="solar:magnifer-linear" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search leads, lists..."
                className="h-8 pl-9 pr-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Icon icon={isDark ? "solar:sun-linear" : "solar:moon-linear"} className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Icon icon="solar:bell-linear" className="h-4 w-4" />
            </button>

            {/* New Campaign CTA */}
            <button
              onClick={() => navigate("/campaigns/create")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
              New Campaign
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
