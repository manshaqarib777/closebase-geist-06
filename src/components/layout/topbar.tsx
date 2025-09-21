import { Search, Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";

export function Topbar() {

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">CB</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">Closebase</span>
        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Jobs, Unternehmen oder Skills suchen..."
              className="pl-10 bg-cb-surface border-border/50 font-ui"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Max Mustermann" />
                  <AvatarFallback className="bg-cb-primary text-white font-ui font-medium">MM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card border-border/50" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-ui font-medium">Max Mustermann</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    max.mustermann@email.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-ui">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-ui">
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-ui text-cb-danger">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}