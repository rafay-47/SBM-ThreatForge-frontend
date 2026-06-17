import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnedThreatModels } from "../../services/ThreatDesigner/stats";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Spinner from "@cloudscape-design/components/spinner";
import { Shield, LayoutGrid, Folder, Plus, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const statusConfig = {
  COMPLETE: { type: "success", label: "Completed" },
  FAILED: { type: "error", label: "Failed" },
  LOADING: { type: "loading", label: "Loading" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HomeDashboard({ user, onCreateNew }) {
  const navigate = useNavigate();
  const [recentModels, setRecentModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await getOwnedThreatModels(6, null);
        const catalogs = response?.data?.catalogs || [];
        setRecentModels(catalogs);
        const total = response?.data?.pagination?.total || catalogs.length;
        const completed = catalogs.filter((m) => m.state === "COMPLETE").length;
        const inProgress = catalogs.filter(
          (m) => m.state !== "COMPLETE" && m.state !== "FAILED"
        ).length;
        setStats({ total, completed, inProgress });
      } catch (err) {
        console.error("Failed to load recent models:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const userName = user?.given_name || user?.name || "there";

  const quickActions = [
    {
      title: "New Threat Model",
      description: "Start a new AI-powered threat analysis",
      icon: <Plus size={24} />,
      color: "#7c3aed",
      onClick: () => onCreateNew(),
    },
    {
      title: "Threat Catalog",
      description: "Browse all your threat models",
      icon: <LayoutGrid size={24} />,
      color: "#8b5cf6",
      onClick: () => navigate("/threat-catalog"),
    },
    {
      title: "Spaces",
      description: "Organize models into workspaces",
      icon: <Folder size={24} />,
      color: "#a78bfa",
      onClick: () => navigate("/spaces"),
    },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Header */}
      <div
        style={{
          marginBottom: "32px",
          padding: "32px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 9px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              fontFamily: 'var(--font-family-heading)',
              letterSpacing: "0.02em",
            }}
          >
            {greeting}, {userName}
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "15px",
              opacity: 0.9,
              fontFamily: "var(--font-family-body)",
            }}
          >
            Welcome to SBM ThreatForge. Start analyzing threats or review your existing models.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Total Models", value: stats.total, icon: <Shield size={20} />, color: "#7c3aed" },
          { label: "Completed", value: stats.completed, icon: <CheckCircle2 size={20} />, color: "#22c55e" },
          { label: "In Progress", value: stats.inProgress, icon: <Clock size={20} />, color: "#f59e0b" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid var(--token-border-primary)",
              background: "var(--token-bg-primary)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: `${stat.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  fontFamily: "var(--font-family-heading)",
                  color: "var(--token-text-primary)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--token-text-secondary)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "var(--font-family-heading)",
            color: "var(--token-text-primary)",
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--token-border-primary)",
                background: "var(--token-bg-primary)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}20`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--token-border-primary)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${action.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: action.color,
                }}
              >
                {action.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    fontFamily: "var(--font-family-heading)",
                    color: "var(--token-text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {action.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--token-text-secondary)",
                    fontFamily: "var(--font-family-body)",
                  }}
                >
                  {action.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Models */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              fontFamily: "var(--font-family-heading)",
              color: "var(--token-text-primary)",
            }}
          >
            Recent Threat Models
          </h2>
          <button
            onClick={() => navigate("/threat-catalog")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#7c3aed",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "var(--font-family-body)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px 0",
            }}
          >
            <Spinner />
          </div>
        ) : recentModels.length === 0 ? (
          <div
            style={{
              padding: "60px 32px",
              borderRadius: "12px",
              border: "1px dashed var(--token-border-primary)",
              background: "var(--token-bg-primary)",
              textAlign: "center",
            }}
          >
            <Shield
              size={48}
              style={{ color: "var(--token-text-muted)", marginBottom: "16px" }}
            />
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--token-text-primary)",
                marginBottom: "8px",
                fontFamily: "var(--font-family-heading)",
              }}
            >
              No threat models yet
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--token-text-secondary)",
                marginBottom: "20px",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Create your first threat model to get started with AI-powered analysis.
            </div>
            <button
              onClick={onCreateNew}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#7c3aed",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-family-body)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
            >
              Create Threat Model
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {recentModels.map((model) => {
              const state = model.state || "UNKNOWN";
              const status = statusConfig[state] || { type: "pending", label: state };
              return (
                <div
                  key={model.job_id}
                  onClick={() => navigate(`/${model.job_id}`)}
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid var(--token-border-primary)",
                    background: "var(--token-bg-primary)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--token-border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--token-text-primary)",
                        fontFamily: "var(--font-family-heading)",
                        lineHeight: 1.3,
                        flex: 1,
                        marginRight: "8px",
                      }}
                    >
                      {model.title || "Untitled Model"}
                    </div>
                    <StatusIndicator type={status.type}>{status.label}</StatusIndicator>
                  </div>
                  {model.description && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--token-text-secondary)",
                        marginBottom: "12px",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontFamily: "var(--font-family-body)",
                      }}
                    >
                      {model.description}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "12px",
                      borderTop: "1px solid var(--token-border-primary)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--token-text-muted)",
                        fontFamily: "var(--font-family-body)",
                      }}
                    >
                      {formatDate(model.created_at || model.updated_at)}
                    </span>
                    <ArrowRight size={14} style={{ color: "var(--token-text-muted)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
