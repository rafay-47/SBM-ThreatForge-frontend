import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnedThreatModels } from "../../services/ThreatDesigner/stats";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Spinner from "@cloudscape-design/components/spinner";
import { Shield, LayoutGrid, Folder, Plus, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import "./HomeDashboard.css";

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
      tone: "primary",
      onClick: () => onCreateNew(),
    },
    {
      title: "Threat Catalog",
      description: "Browse all your threat models",
      icon: <LayoutGrid size={24} />,
      tone: "secondary",
      onClick: () => navigate("/threat-catalog"),
    },
    {
      title: "Spaces",
      description: "Organize models into workspaces",
      icon: <Folder size={24} />,
      tone: "secondary",
      onClick: () => navigate("/spaces"),
    },
  ];

  const operatingQuestions = [
    "What are we working on?",
    "What could go wrong?",
    "What will we do about it?",
    "Did we do a good job?",
  ];

  return (
    <main className="workstation-page home-dashboard">
      <section className="home-command-panel" aria-labelledby="home-dashboard-title">
        <div>
          <p className="home-eyebrow">Threat modeling workspace</p>
          <h1 id="home-dashboard-title">{greeting}, {userName}</h1>
          <p className="home-command-copy">
            Start a model, review active analysis, or return to a cataloged threat decision.
          </p>
        </div>
        <div className="home-question-track" aria-label="Threat modeling operating questions">
          {operatingQuestions.map((question, index) => (
            <div className="home-question" key={question}>
              <span>Q{index + 1}</span>
              <strong>{question}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="home-stat-grid" aria-label="Threat model status summary">
        {[
          { label: "Total models", value: stats.total, icon: <Shield size={20} />, tone: "brand" },
          { label: "Completed", value: stats.completed, icon: <CheckCircle2 size={20} />, tone: "safe" },
          { label: "In progress", value: stats.inProgress, icon: <Clock size={20} />, tone: "watch" },
        ].map((stat) => (
          <div className={`home-stat home-stat-${stat.tone}`} key={stat.label}>
            <div className="home-stat-icon">{stat.icon}</div>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Next action</h2>
        </div>
        <div className="home-action-grid">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`home-action home-action-${action.tone}`}
            >
              <div className="home-action-icon">{action.icon}</div>
              <div className="home-action-content">
                <strong>{action.title}</strong>
                <span>{action.description}</span>
              </div>
              <ArrowRight size={16} className="home-action-arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Recent threat models</h2>
          <button
            onClick={() => navigate("/threat-catalog")}
            className="home-text-button"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="home-loading">
            <Spinner />
          </div>
        ) : recentModels.length === 0 ? (
          <div className="home-empty">
            <Shield size={42} />
            <strong>No threat models yet</strong>
            <span>Create the first model when you have an architecture diagram ready.</span>
            <button onClick={onCreateNew} className="home-primary-button">
              Create Threat Model
            </button>
          </div>
        ) : (
          <div className="home-model-grid">
            {recentModels.map((model) => {
              const state = model.state || "UNKNOWN";
              const status = statusConfig[state] || { type: "pending", label: state };
              return (
                <button
                  key={model.job_id}
                  onClick={() => navigate(`/${model.job_id}`)}
                  className="home-model-card"
                >
                  <div className="home-model-header">
                    <strong>
                      {model.title || "Untitled Model"}
                    </strong>
                    <StatusIndicator type={status.type}>{status.label}</StatusIndicator>
                  </div>
                  {model.description && (
                    <p>
                      {model.description}
                    </p>
                  )}
                  <div className="home-model-meta">
                    <span>
                      {formatDate(model.created_at || model.updated_at)}
                    </span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
