import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  User,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Übersicht", href: "/", icon: BarChart3 },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Bewerbungen", href: "/applications", icon: FileText },
  { name: "Assessment Center", href: "/assessment", icon: ClipboardCheck },
  { name: "Nachrichten", href: "/messages", icon: MessageSquare },
  { name: "Profil", href: "/profile", icon: User },
];

const companyNavigation = [
  { name: "Dashboard", href: "/company/dashboard", icon: BarChart3 },
  { name: "Stellenanzeigen", href: "/company/jobs", icon: Briefcase },
  { name: "Kandidaten", href: "/company/candidates", icon: FileText },
  { name: "Nachrichten", href: "/company/messages", icon: MessageSquare },
  { name: "Unternehmen", href: "/company/profile", icon: User },
  { name: "Abrechnung", href: "/company/billing", icon: DollarSign },
  { name: "Team", href: "/company/team", icon: User },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Determine which navigation to show based on current path
  const isCompanySection = location.pathname.startsWith('/company');
  const currentNavigation = isCompanySection ? companyNavigation : navigation;

  return (
    <aside className={cn(
      "sticky top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {currentNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2.5 text-sm font-ui font-medium rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-cb-primary text-white shadow-sm relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r-full"
                    : "text-sidebar-foreground"
                )
              }
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  collapsed ? "mr-0" : "mr-3"
                )} 
              />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs font-ui text-muted-foreground text-center">
              {isCompanySection ? "Closebase Talent Hub" : "Closebase Sales Platform"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}