import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";

/**
 * NavMain component renders the main navigation items in the sidebar.
 *
 * Requirements:
 * - 2.1: Navigate to home page when "New" is clicked
 * - 2.2: Navigate to threat catalog when "Threat Catalog" is clicked
 * - 2.3: Visually indicate active navigation state
 * - 2.4: Display icons alongside text labels
 *
 * @param {Object} props
 * @param {Array} props.items - Array of navigation items with title, url, icon
 */
export function NavMain({ items }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [featureName, setFeatureName] = useState("");

  const handleNavigation = (title, url) => {
    if (url === "#" || url.startsWith("#")) {
      setFeatureName(title);
      setModalVisible(true);
    } else {
      navigate(url);
    }
  };

  /**
   * Determines if a navigation item is active based on current route.
   * For the home route ("/"), only exact match is considered active.
   * For other routes, checks if current path starts with the item's url.
   * Memoized to prevent recalculation on every render.
   */
  const isItemActive = useCallback(
    (itemUrl) => {
      if (itemUrl === "/") {
        return location.pathname === "/";
      }
      return location.pathname.startsWith(itemUrl);
    },
    [location.pathname]
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  onClick={() => handleNavigation(item.title, item.url)}
                >
                  {Icon && <Icon className="size-5" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>

      <Modal
        onDismiss={() => setModalVisible(false)}
        visible={modalVisible}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <Button onClick={() => setModalVisible(false)} variant="primary">
              Got it
            </Button>
          </Box>
        }
        header="Feature Coming Soon"
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The <strong>{featureName}</strong> dashboard and analytics module is currently under
            active development.
          </Box>
          <Box variant="p" color="text-muted">
            We are building STRIDE-aligned mitigations, automated reporting tools, and direct cloud
            integration controls for this workspace. Check back soon for updates!
          </Box>
        </SpaceBetween>
      </Modal>
    </SidebarGroup>
  );
}

export default NavMain;
