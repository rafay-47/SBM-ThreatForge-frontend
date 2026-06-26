import { MonitorCog, Moon, Sun, LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user, colorMode, setThemeMode, onLogout }) {
  const { isMobile, state } = useSidebar();

  // Get user display name with robust fallbacks to get the logged in user name
  const displayName =
    user?.given_name && user?.family_name
      ? `${user.given_name} ${user.family_name}`
      : user?.given_name ||
        user?.family_name ||
        user?.name ||
        user?.user_metadata?.name ||
        user?.username ||
        user?.user_metadata?.username ||
        (user?.email ? user.email.split("@")[0] : "User");

  // Get initials for avatar fallback using fallbacks
  const getInitials = () => {
    const first =
      user?.given_name?.[0] ||
      user?.name?.[0] ||
      user?.user_metadata?.name?.[0] ||
      user?.username?.[0] ||
      user?.email?.[0] ||
      "U";
    const last = user?.family_name?.[0] || "";
    return (first + last).toUpperCase();
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

  // Cycle theme in collapsed view
  const cycleTheme = () => {
    const modes = ["system", "light", "dark"];
    const currentIndex = modes.indexOf(colorMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    handleThemeChange(modes[nextIndex]);
  };

  // Get active theme icon for collapsed cycle button
  const getThemeIcon = () => {
    switch (colorMode) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      default:
        return MonitorCog;
    }
  };

  const CurrentThemeIcon = getThemeIcon();

  if (state === "collapsed" && !isMobile) {
    return (
      <div className="flex flex-col gap-4 py-2 items-center w-full">
        {/* User Avatar */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-white select-none">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary text-white font-semibold text-xs flex items-center justify-center">
            {getInitials()}
          </div>
        </div>

        {/* Theme Cycle Button */}
        <button
          title={`Theme: ${colorMode.charAt(0).toUpperCase() + colorMode.slice(1)} (Click to cycle)`}
          onClick={cycleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent hover:bg-sidebar-accent text-muted-foreground transition-colors cursor-pointer"
        >
          <CurrentThemeIcon className="size-5" />
        </button>

        {/* Sign Out */}
        <button
          title="Sign out"
          onClick={handleSignOut}
          className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full border-t border-sidebar-border pt-3 mt-1">
      {/* Title Header */}
      <SidebarGroupLabel className="px-3">Settings</SidebarGroupLabel>

      {/* User Info Row */}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="cursor-default hover:bg-transparent active:bg-transparent footer-menu-button">
            <div className="absolute left-[0.6rem] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-sidebar-primary text-white font-semibold text-[10px] flex items-center justify-center select-none">
              {getInitials()}
            </div>
            <span className="font-semibold text-foreground footer-user-name-text">{displayName}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Theme Selector Section */}
      <div className="px-3 py-1">
        <div className="text-[11px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
          Theme
        </div>
        <div className="grid grid-cols-3 gap-1 bg-background p-1 rounded-md border border-sidebar-border">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = colorMode === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleThemeChange(option.id)}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 rounded-md transition-all text-[11px] font-medium cursor-pointer ${
                  isActive
                    ? "bg-sidebar-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                title={option.label}
              >
                <Icon className="size-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sign Out Button */}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleSignOut}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 active:bg-red-500/20 footer-menu-button"
          >
            <LogOut />
            <span>Sign out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

export default NavUser;
