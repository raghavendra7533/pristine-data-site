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
      {/* Modern Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto w-full">
          {/* Left: Logo + Home */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src={pristineDataLogo} 
                alt="Pristine Data AI" 
                className="h-10 w-auto"
              />
            </button>
            
            {!isHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Right: Menu + Profile */}
          <div className="flex items-center gap-3">
            {/* Secondary Navigation Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/lists")}>
                  <List className="h-4 w-4 mr-2" />
                  Lists
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/campaigns")}>
                  <Megaphone className="h-4 w-4 mr-2" />
                  Campaigns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/integrations")}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/subscription-hub")}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscription Hub
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      JR
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
