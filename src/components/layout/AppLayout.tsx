import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Menu, User, List, Megaphone, Settings, Link2, Search, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import pristineDataLogo from "@/assets/pristine-data-logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Glass Top Navigation */}
      <header className="border-b border-border/60 bg-background/80 glass-nav sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-6 max-w-7xl mx-auto w-full">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-75 transition-opacity"
            >
              <img
                src={pristineDataLogo}
                alt="Pristine Data AI"
                className="h-8 w-auto"
              />
            </button>

            <div className="h-4 w-px bg-border mx-2" />

            {!isHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-3 text-xs font-medium"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-3 text-xs font-medium"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Right: Menu + Profile */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/lists")} className="text-xs">
                  <List className="h-3.5 w-3.5 mr-2" />
                  Lists
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/campaigns")} className="text-xs">
                  <Megaphone className="h-3.5 w-3.5 mr-2" />
                  Campaigns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/integrations")} className="text-xs">
                  <Link2 className="h-3.5 w-3.5 mr-2" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/subscription-hub")} className="text-xs">
                  <CreditCard className="h-3.5 w-3.5 mr-2" />
                  Subscription Hub
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin")} className="text-xs">
                  <Settings className="h-3.5 w-3.5 mr-2" />
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                      JR
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-xs">
                  <User className="h-3.5 w-3.5 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
