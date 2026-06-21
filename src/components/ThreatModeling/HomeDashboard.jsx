import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/ThreatDesigner/stats";
import Spinner from "@cloudscape-design/components/spinner";
import {
  Shield,
  Plus,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  Bell,
  Share2,
  Folder,
  Layers,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import "./HomeDashboard.css";

export default function HomeDashboard({ user, onCreateNew }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data?.data || response.data || null);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.given_name || user?.name || "Security Expert";

  // Aggregated data
  const totalThreats = stats?.total_threats ?? 0;
  const highRisk = stats?.high_risk ?? 0;
  const mediumRisk = stats?.medium_risk ?? 0;
  const lowRisk = stats?.low_risk ?? 0;

  const topThreats = stats?.top_threats ?? [];
  const strideCounts = stats?.stride_counts ?? {
    "Spoofing": 0,
    "Tampering": 0,
    "Repudiation": 0,
    "Information Disclosure": 0,
    "Denial of Service": 0,
    "Elevation of Privilege": 0
  };

  const spaces = stats?.spaces ?? [];
  const recentDocuments = stats?.recent_documents ?? [];
  const advisories = stats?.advisories ?? [];

  // Calculate percentages for STRIDE counts
  const totalStrideThreats = Object.values(strideCounts).reduce((a, b) => a + b, 0) || 1;
  const strideData = Object.entries(strideCounts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / totalStrideThreats) * 100)
  })).sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="home-dashboard-loading">
        <Spinner size="large" />
        <span className="mt-3 text-muted-foreground">Loading workspace dashboard...</span>
      </div>
    );
  }

  return (
    <main className="home-dashboard-container">
      {/* Header Row */}
      <header className="dashboard-header">
        <div className="header-breadcrumbs">
          <span>Models</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">Dashboard</span>
        </div>
        <div className="header-actions">
          <button className="icon-action-btn" title="Notifications">
            <Bell size={18} />
            {totalThreats > 0 && <span className="badge-dot"></span>}
          </button>
          <button className="icon-action-btn" title="Help & Guides" onClick={() => navigate("/guides/quick-start")}>
            <HelpCircle size={18} />
          </button>
          <div className="avatar-initials" title={userName}>
            {user?.given_name?.[0] || user?.name?.[0] || "SE"}
          </div>
        </div>
      </header>

      {/* Greeting block */}
      <section className="dashboard-title-section">
        <div className="title-left">
          <h1>{greeting()}, {userName}</h1>
          <span className="status-badge green">Active Workspace</span>
        </div>
        <div className="title-right">
          <button className="btn-secondary flex items-center gap-2" onClick={() => navigate("/threat-catalog")}>
            <Folder size={16} />
            <span>Catalog</span>
          </button>
          <button className="btn-primary-gradient flex items-center gap-2" onClick={onCreateNew}>
            <Plus size={18} />
            <span>New Model</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </section>

      {/* Row 1: Threat Summary Cards */}
      <section className="stats-row">
        <div className="stat-card">
          <span className="card-label">Total Threats</span>
          <div className="card-value-row">
            <span className="card-value">{totalThreats}</span>
            <span className="card-percentage up flex items-center">
              <ArrowUpRight size={14} />
              <span>Workspace Total</span>
            </span>
          </div>
        </div>
        <div className="stat-card">
          <span className="card-label">High Risk</span>
          <div className="card-value-row">
            <span className="card-value">{highRisk}</span>
            <span className={`card-percentage flex items-center ${highRisk > 0 ? "up" : "down"}`}>
              {highRisk > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>Requires Attention</span>
            </span>
          </div>
        </div>
        <div className="stat-card">
          <span className="card-label">Medium Risk</span>
          <div className="card-value-row">
            <span className="card-value">{mediumRisk}</span>
            <span className="card-percentage down flex items-center">
              <ArrowDownRight size={14} />
              <span>Monitored</span>
            </span>
          </div>
        </div>
        <div className="stat-card">
          <span className="card-label">Low Risk</span>
          <div className="card-value-row">
            <span className="card-value">{lowRisk}</span>
            <span className="card-percentage down flex items-center">
              <ArrowDownRight size={14} />
              <span>Mitigated</span>
            </span>
          </div>
        </div>
      </section>

      {/* Row 2: STRIDE Profile & Top Threats */}
      <section className="grid-row-2">
        {/* STRIDE Threat Profile Widget */}
        <div className="dashboard-widget stride-profile-widget">
          <h3 className="widget-title">STRIDE Threat Profile</h3>
          <p className="text-xs text-muted-foreground -mt-2">Distribution of identified threat risks categorized by STRIDE methodology.</p>
          <div className="stride-bars-container">
            {strideData.map((item, index) => (
              <div className="stride-bar-row" key={item.category}>
                <div className="stride-bar-info text-sm">
                  <span className="font-medium text-white">{item.category}</span>
                  <span className="text-muted-foreground">{item.count} threats ({item.percentage}%)</span>
                </div>
                <div className="stride-bar-track bg-slate-950/50 rounded-full h-2 w-full overflow-hidden border border-line-soft">
                  <div 
                    className="stride-bar-fill bg-indigo-500 rounded-full h-full"
                    style={{ 
                      width: `${item.percentage}%`,
                      background: `linear-gradient(to right, #4f46e5, ${index === 0 ? "#8b5cf6" : "#6366f1"})`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Threats Widget */}
        <div className="dashboard-widget list-widget">
          <div className="widget-header">
            <h3>Top Threat Vulnerabilities</h3>
            <button className="btn-link flex items-center gap-1" onClick={() => navigate("/threat-catalog")}>
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>
          {topThreats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-line-soft rounded-lg">
              <Shield size={32} className="text-indigo-400/60 mb-2" />
              <strong className="text-sm">No threat vulnerabilities found</strong>
              <span className="text-xs text-muted-foreground">Submit a new model with an architecture diagram to identify risks.</span>
            </div>
          ) : (
            <div className="threats-list">
              {topThreats.map((threat, index) => (
                <div className="threat-item" key={index}>
                  <div className="threat-item-left">
                    <span className="threat-item-bullet">•</span>
                    <div className="threat-item-details">
                      <strong className="threat-item-name">{threat.name}</strong>
                      <span className="threat-item-model">{threat.target} | {threat.model_title}</span>
                    </div>
                  </div>
                  <span className={`risk-badge ${threat.likelihood.toLowerCase()}`}>
                    {threat.likelihood}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Row 3: Active Workspaces & AI Advisors */}
      <section className="grid-row-3">
        {/* Active Workspaces */}
        <div className="dashboard-widget list-widget">
          <div className="widget-header">
            <h3>Active Workspaces (Spaces)</h3>
            <button className="btn-link flex items-center gap-1" onClick={() => navigate("/spaces")}>
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>
          {spaces.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-line-soft rounded-lg">
              <Layers size={32} className="text-indigo-400/60 mb-2" />
              <strong className="text-sm">No workspaces yet</strong>
              <span className="text-xs text-muted-foreground">Create a Space to organize architectures and security guidelines.</span>
              <button className="btn-improve-coverage text-xs mt-3 py-1.5" onClick={() => navigate("/spaces")}>
                Create Space
              </button>
            </div>
          ) : (
            <div className="spaces-list flex flex-col gap-3">
              {spaces.map((space) => (
                <div 
                  className="space-card-item p-3 rounded-lg border border-line-soft bg-slate-950/30 flex items-center justify-between hover:border-indigo-500/50 transition-colors cursor-pointer"
                  key={space.space_id}
                  onClick={() => navigate(`/spaces/${space.space_id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Layers size={16} />
                    </div>
                    <div className="flex flex-col">
                      <strong className="text-sm font-semibold text-white">{space.name}</strong>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">{space.description || "Security architecture space"}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Documents */}
        <div className="dashboard-widget list-widget">
          <div className="widget-header">
            <h3>Security Guidelines & PDFs</h3>
            <span className="text-[11px] text-muted-foreground">RAG Knowledge Base</span>
          </div>
          {recentDocuments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-line-soft rounded-lg">
              <FileText size={32} className="text-indigo-400/60 mb-2" />
              <strong className="text-sm">No guidelines uploaded</strong>
              <span className="text-xs text-muted-foreground">Guidelines uploaded to Spaces are automatically used by the AI Agent for compliance audits.</span>
            </div>
          ) : (
            <div className="documents-list flex flex-col gap-3">
              {recentDocuments.map((doc) => (
                <div className="doc-card-item p-3 rounded-lg border border-line-soft bg-slate-950/30 flex items-center justify-between" key={doc.document_id}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={16} className="text-indigo-400 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <strong className="text-xs font-semibold text-white truncate max-w-[200px]">{doc.filename}</strong>
                      <span className="text-[10px] text-muted-foreground">{doc.space_name}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${doc.status === "READY" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Security Advisors */}
        <div className="dashboard-widget advisories-widget">
          <h3 className="widget-title">AI Security Recommendations</h3>
          <div className="advisories-list flex flex-col gap-3">
            {advisories.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-line-soft rounded-lg h-full">
                <ShieldAlert size={32} className="text-indigo-400/60 mb-2" />
                <strong className="text-sm">No recommendations yet</strong>
                <span className="text-xs text-muted-foreground">Recommendations will appear once your models identify security vulnerabilities.</span>
              </div>
            ) : (
              advisories.map((adv, index) => (
                <div className="advisory-card p-3 rounded-lg border border-red-500/20 bg-red-950/10 flex flex-col gap-1.5" key={index}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-orange-400" />
                    <strong className="text-xs font-bold text-white">{adv.title}</strong>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-red-500/20 text-red-400 rounded-full ml-auto uppercase">{adv.severity}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed m-0">{adv.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
