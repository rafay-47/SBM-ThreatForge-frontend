import { useEffect, useState, useCallback, useContext } from "react";
import AppLayoutMFE from "./components/AppLayoutMFE/AppLayoutMFE";
import LoginPageInternal from "./pages/Landingpage/Landingpage";
import { Spinner } from "@cloudscape-design/components";
import { getUser, logOut } from "./services/Auth/auth";
import { SpaceBetween } from "@cloudscape-design/components";
import { SplitPanelProvider } from "./SplitPanelContext";
import customTheme from "./customTheme";
import "@cloudscape-design/global-styles/index.css";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { applyTheme } from "@cloudscape-design/components/theming";
import { ChatSessionProvider, ChatSessionFunctionsContext } from "./components/Agent/ChatContext";
import { ThemeProvider } from "./components/ThemeContext";
import AppRefreshManager from "./AppRefreshManager";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, useSidebar } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { SpacesPanel } from "./components/Spaces/SpacesPanel";
import { PanelLeft, X, Sparkles } from "lucide-react";
import Agent from "./pages/Agent/Agent";
import { isSentryEnabled } from "./config";


function SpacesPanelSlot() {

  const location = useLocation();
  if (!location.pathname.startsWith("/spaces")) return null;
  return <SpacesPanel />;
}

function isValidUUID(str) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

function MobileTopBar({ onChatToggle, sentryEnabled }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const functions = useContext(ChatSessionFunctionsContext);

  if (!isMobile) return null;

  const isVisible = sentryEnabled && functions?.visible;

  return (
    <div className="mobile-top-bar">
      <button
        onClick={() => setOpenMobile(true)}
        className="mobile-sidebar-toggle-btn"
        aria-label="Open sidebar"
      >
        <PanelLeft size={20} />
      </button>
      <span className="mobile-app-title">SBM ThreatForge</span>
      {isVisible && (
        <button
          onClick={onChatToggle}
          className="mobile-sentry-toggle-btn"
          aria-label="Open Sentry Assistant"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 422 582"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(-1370 -339)">
              <path
                d="M1396.92 571.242 1395.89 573.668 1396.92 574.096ZM1541.06 343.052 1541.06 552.678 1427.07 501.513 1427.07 586.635 1541.06 634.036 1541.06 890.87 1373 777.21 1373 777.21 1373 777.21 1373 524.87 1373.81 524.87 1373 518C1373 431.754 1444.64 359.796 1539.88 343.154ZM1622.33 343 1624.12 343.154C1719.36 359.796 1791 431.754 1791 518L1790.19 524.87 1791 524.87 1791 777.21 1790.98 777.21 1622.33 888.793 1622.33 634.898 1739.54 584.353 1738.51 505.603 1622.33 551.917Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </g>
          </svg>
        </button>
      )}
    </div>
  );
}

function MobileAgentSheet({ user, isOpen, onClose }) {
  const functions = useContext(ChatSessionFunctionsContext);
  const location = useLocation();
  const trimmedPath = location.pathname.substring(1);

  useEffect(() => {
    if (isOpen && functions && !functions.visible) {
      onClose();
    }
  }, [functions?.visible, isOpen, onClose]);

  if (!isOpen) return null;

  const handleClearSession = async () => {
    if (isValidUUID(trimmedPath)) {
      await functions?.clearSession(trimmedPath);
    }
  };

  return (
    <div className="mobile-agent-sheet-overlay" onClick={onClose}>
      <div className="mobile-agent-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-agent-header">
          <div className="mobile-agent-title-group">
            <span className="mobile-agent-logo-wrapper">
              <svg
                width="20"
                height="20"
                viewBox="0 0 422 582"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(-1370 -339)">
                  <path
                    d="M1396.92 571.242 1395.89 573.668 1396.92 574.096ZM1541.06 343.052 1541.06 552.678 1427.07 501.513 1427.07 586.635 1541.06 634.036 1541.06 890.87 1373 777.21 1373 777.21 1373 777.21 1373 524.87 1373.81 524.87 1373 518C1373 431.754 1444.64 359.796 1539.88 343.154ZM1622.33 343 1624.12 343.154C1719.36 359.796 1791 431.754 1791 518L1790.19 524.87 1791 524.87 1791 777.21 1790.98 777.21 1622.33 888.793 1622.33 634.898 1739.54 584.353 1738.51 505.603 1622.33 551.917Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </g>
              </svg>
            </span>
            <span className="mobile-agent-title">Sentry Assistant</span>
          </div>
          <div className="mobile-agent-header-actions">
            {isValidUUID(trimmedPath) && (
              <button onClick={handleClearSession} className="mobile-agent-new-chat-btn">
                <Sparkles size={14} />
                <span>New Chat</span>
              </button>
            )}
            <button onClick={onClose} className="mobile-agent-close-btn" aria-label="Close Assistant">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="mobile-agent-body">
          <Agent user={user} inTools={true} />
        </div>
      </div>
    </div>
  );
}


const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getEffectiveTheme = (mode) => {
  if (mode === "system") {
    return getSystemTheme();
  }
  return mode;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sentryEnabled = isSentryEnabled();

  const [colorMode, setColorMode] = useState(() => {
    const savedMode = localStorage.getItem("colorMode");
    return savedMode || "system";
  });


  // Make effectiveTheme a state variable
  const [effectiveTheme, setEffectiveTheme] = useState(() => getEffectiveTheme(colorMode));

  const setThemeMode = (mode) => {
    const validModes = ["SYSTEM", "LIGHT", "DARK"];
    const normalizedMode = mode.toUpperCase();

    if (validModes.includes(normalizedMode)) {
      setColorMode(normalizedMode.toLowerCase());
    } else {
      console.warn(`Invalid theme mode: ${mode}. Valid options are: SYSTEM, LIGHT, DARK`);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    const newEffectiveTheme = getEffectiveTheme(colorMode);
    setEffectiveTheme(newEffectiveTheme);
    applyMode(newEffectiveTheme === "light" ? Mode.Light : Mode.Dark);
    localStorage.setItem("colorMode", colorMode);

    // Apply dark class to document for shadcn/ui sidebar theming
    if (newEffectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (colorMode === "system") {
        const updatedEffectiveTheme = getEffectiveTheme(colorMode);
        setEffectiveTheme(updatedEffectiveTheme); // Update the state
        applyMode(updatedEffectiveTheme === "light" ? Mode.Light : Mode.Dark);

        // Update dark class for shadcn/ui sidebar theming
        if (updatedEffectiveTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    if (colorMode === "system") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [colorMode]);

  useEffect(() => {
    applyTheme({ theme: customTheme });
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      setAuthUser(user);
    } catch (error) {
      // Auth check failed - user not logged in
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logOut();
      setAuthUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <ThemeProvider
        colorMode={colorMode}
        effectiveTheme={effectiveTheme}
        setThemeMode={setThemeMode}
      >
        {loading ? (
          <SpaceBetween alignItems="center">
            <div style={{ marginTop: "20px" }}>
              <Spinner size="large" />
            </div>
          </SpaceBetween>
        ) : authUser ? (
          <AppRefreshManager>
            <ChatSessionProvider>
              <SplitPanelProvider>
                <SidebarProvider defaultOpen={false}>
                  <AppSidebar
                    user={authUser}
                    colorMode={colorMode}
                    effectiveTheme={effectiveTheme}
                    setThemeMode={setThemeMode}
                    onLogout={handleLogout}
                  />
                  <SidebarInset
                    className="app-main-inset"
                    style={{ overflow: "hidden" }}
                  >
                    <SpacesPanelSlot />
                    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <MobileTopBar onChatToggle={() => setIsChatOpen(prev => !prev)} sentryEnabled={sentryEnabled} />
                      <MobileAgentSheet user={authUser} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <AppLayoutMFE
                          user={authUser}
                          colorMode={colorMode}
                          setThemeMode={setThemeMode}
                        />
                      </div>
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </SplitPanelProvider>
            </ChatSessionProvider>
          </AppRefreshManager>
        ) : (
          <LoginPageInternal setAuthUser={checkAuthState} />
        )}
      </ThemeProvider>
    </div>
  );
};

export default App;
