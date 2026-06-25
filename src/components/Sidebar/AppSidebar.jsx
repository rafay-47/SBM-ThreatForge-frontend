import { LayoutGrid, Folder, Layers } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarHeader } from "./SidebarHeader";
import { NavMain } from "./NavMain";
import { NavGuides } from "./NavGuides";
import { NavUser } from "./NavUser";
import "./Sidebar.css";

/**
 * AppSidebar is the main sidebar component that composes all sidebar sections.
 */
export function AppSidebar({ user, colorMode, effectiveTheme, setThemeMode, onLogout, ...props }) {
  // Navigation items configuration matching client mockup
  const navItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutGrid,
    },
    {
      title: "Models",
      url: "/threat-catalog",
      icon: Folder,
    },
    {
      title: "Spaces",
      url: "/spaces",
      icon: Layers,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent className="flex flex-col">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="!p-2">
        <NavGuides />
        <NavUser
          user={user}
          colorMode={colorMode}
          setThemeMode={setThemeMode}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
