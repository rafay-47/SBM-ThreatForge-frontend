import { ChevronsUpDown, LogOut, MonitorCog, Moon, Sun, Check, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * NavUser component displays user profile information and provides
 * dropdown menu with theme options and sign out functionality.
 */
export function NavUser({ user, colorMode, setThemeMode, onLogout }) {
  const { isMobile, state } = useSidebar();

  // Get user display name with fallback
  const displayName =
    user?.given_name && user?.family_name
      ? `${user.given_name} ${user.family_name}`
      : user?.given_name || user?.family_name || "User";

  // Get initials for avatar fallback
  const getInitials = () => {
    const first = user?.given_name?.[0] || "";
    const last = user?.family_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const themeOptions = [
    { id: "system", label: "System", icon: MonitorCog },
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  const handleThemeChange = (themeId) => {
    setThemeMode(themeId.toUpperCase());
  };

  const handleSignOut = () => {
    onLogout();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-line-soft rounded-lg p-2 flex items-center gap-3 bg-transparent hover:bg-surface-hover transition-colors"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-selected text-primary border border-line-soft">
                <Shield className="size-4 text-violet-400" />
              </div>
              {state !== "collapsed" && (
                <div className="grid flex-1 text-left text-[13px] leading-tight">
                  <span className="truncate font-semibold text-white">Security Team</span>
                  <span className="truncate text-xs text-muted-foreground">Enterprise Plan</span>
                </div>
              )}
              {state !== "collapsed" && <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={state === "collapsed" ? 14 : 14}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  className="h-8 w-8 rounded-lg !border-0"
                  style={{ border: "none", borderWidth: 0, outline: "none" }}
                >
                  <AvatarFallback
                    className="rounded-lg !border-0 !bg-sidebar-primary"
                    style={{ border: "none", borderWidth: 0, outline: "none" }}
                  >
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = colorMode === option.id;

                return (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => handleThemeChange(option.id)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 size-4" />
                    <span>{option.label}</span>
                    {isActive && <Check className="ml-auto size-4" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 size-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavUser;
