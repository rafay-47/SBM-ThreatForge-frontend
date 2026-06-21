import {
  LayoutGrid,
  Folder,
  Layers,
  Network,
  Shield,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Link2,
  Settings
} from "lucide-react";
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
    {
      title: "Diagrams",
      url: "#",
      icon: Network,
    },
    {
      title: "Threats",
      url: "#",
      icon: Shield,
    },
    {
      title: "Findings",
      url: "#",
      icon: AlertTriangle,
    },
    {
      title: "Mitigations",
      url: "#",
      icon: ShieldCheck,
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
    },
    {
      title: "Integrations",
      url: "#",
      icon: Link2,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
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
