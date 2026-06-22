import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/ThreatDesigner/stats";
import Spinner from "@cloudscape-design/components/spinner";
import {
  Shield,
  Plus,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Bell,
  Folder,
  Layers,
  FileText,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  X,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import "./HomeDashboard.css";

export default function HomeDashboard({ user, onCreateNew }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [strideFilter, setStrideFilter] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardStats();
      setStats(response.data?.data || response.data || null);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError("Unable to retrieve workspace statistics. Please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  const recentModels = stats?.recent_models ?? [];
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

  // Calculate percentages for threat risk levels
  const riskSum = highRisk + mediumRisk + lowRisk || 1;
  const highPct = Math.round((highRisk / riskSum) * 100);
  const mediumPct = Math.round((mediumRisk / riskSum) * 100);
  const lowPct = Math.round((lowRisk / riskSum) * 100);

  // Calculate percentages for STRIDE counts
  const totalStrideThreats = Object.values(strideCounts).reduce((a, b) => a + b, 0) || 1;
  const strideData = Object.entries(strideCounts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / totalStrideThreats) * 100)
  })).sort((a, b) => b.count - a.count);

  // Time format helper
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Recent";
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Recent";
    }
  };

  // Filter top threats based on active STRIDE category
  const filteredTopThreats = strideFilter
    ? topThreats.filter(threat => {
        const sc = threat.stride_category || "";
        return sc.toLowerCase().trim() === strideFilter.toLowerCase().trim();
      })
    : topThreats;

  const handleStrideClick = (category) => {
    if (strideFilter === category) {
      setStrideFilter(null); // toggle off
    } else {
      setStrideFilter(category);
    }
  };

  if (loading) {
    return (
      <div className="home-dashboard-loading">
        <Spinner size="large" />
        <span className="mt-3 text-muted-foreground">Loading workspace dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <main className="home-dashboard-container flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full p-6 rounded-xl border border-line-soft bg-slate-950/40 text-center flex flex-col gap-4">
          <ShieldAlert size={48} className="text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Dashboard Error</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button className="btn-primary-gradient mt-2 py-2 w-full justify-center" onClick={fetchStats}>
            <RefreshCw size={16} className="mr-2" />
            <span>Retry Loading</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="home-dashboard-container">
      {/* Page Header (in place of breadcrumb) */}
      <div className="catalog-page-header">
        <div>
          <p className="workstation-kicker">Workspace Dashboard</p>
          <h1>{greeting()}, {userName}</h1>
          <p>Review generated threat models, track risk concentration, and manage knowledge spaces.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="header-actions">
            <button className="icon-action-btn" title="Refresh Dashboard" onClick={fetchStats}>
              <RefreshCw size={16} />
            </button>
            <button className="icon-action-btn" title="Notifications">
              <Bell size={16} />
              {totalThreats > 0 && <span className="badge-dot"></span>}
            </button>
            <button className="icon-action-btn" title="Help & Guides" onClick={() => navigate("/guides/quick-start")}>
              <HelpCircle size={16} />
            </button>
            <div className="avatar-initials" title={userName}>
              {user?.given_name?.[0] || user?.name?.[0] || "SE"}
            </div>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Unified Threat Posture Card */}
      <section className="dashboard-summary-card">
        <div className="summary-card-metric">
          <div className="metric-header">
            <span className="summary-label">Total Threats</span>
            <Shield size={16} className="text-indigo-400" />
          </div>
          <div className="metric-body">
            <span className="summary-value">{totalThreats}</span>
            <span className="summary-subtext">Identified across active models</span>
          </div>
        </div>

        <div className="summary-card-divider"></div>

        <div className="summary-card-distribution">
          <div className="distribution-header">
            <span className="summary-label">Workspace Risk Distribution</span>
            {highRisk > 0 ? (
              <span className="risk-status warning">
                <AlertTriangle size={12} className="inline mr-1" />
                Action Required: High-risk vulnerabilities detected
              </span>
            ) : (
              <span className="risk-status success">
                <CheckCircle2 size={12} className="inline mr-1" />
                Workspace Secure: No high-risk threats
              </span>
            )}
          </div>
          
          {/* Stacked Segmented Distribution Bar */}
          <div className="risk-distribution-bar">
            {totalThreats > 0 ? (
              <>
                {highRisk > 0 && (
                  <div 
                    className="bar-segment high" 
                    style={{ width: `${highPct}%` }}
                    title={`High Risk: ${highRisk} threats (${highPct}%)`}
                  ></div>
                )}
                {mediumRisk > 0 && (
                  <div 
                    className="bar-segment medium" 
                    style={{ width: `${mediumPct}%` }}
                    title={`Medium Risk: ${mediumRisk} threats (${mediumPct}%)`}
                  ></div>
                )}
                {lowRisk > 0 && (
                  <div 
                    className="bar-segment low" 
                    style={{ width: `${lowPct}%` }}
                    title={`Low Risk: ${lowRisk} threats (${lowPct}%)`}
                  ></div>
                )}
              </>
            ) : (
              <div className="bar-segment empty" style={{ width: "100%" }} title="No threats identified"></div>
            )}
          </div>

          {/* Risk Badges Legend */}
          <div className="distribution-legend">
            <div className="legend-item">
              <span className="legend-dot high"></span>
              <span className="legend-text"><strong>{highRisk}</strong> High</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot medium"></span>
              <span className="legend-text"><strong>{mediumRisk}</strong> Medium</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot low"></span>
              <span className="legend-text"><strong>{lowRisk}</strong> Low</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Dashboard Grid */}
      <div className="dashboard-grid-layout">
        
        {/* LEFT COLUMN: Core Workflows */}
        <section className="grid-column-left">
          
          {/* Widget 1: Recent Threat Models */}
          <div className="dashboard-widget recent-models-widget">
            <div className="widget-header">
              <div className="widget-header-title">
                <h3>Recent Threat Models</h3>
                <p className="widget-description">Quickly resume modeling, view progress, and track risk metrics.</p>
              </div>
              <button className="btn-link flex items-center gap-1" onClick={() => navigate("/threat-catalog")}>
                <span>Browse Catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {recentModels.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 border border-dashed border-line-soft rounded-xl">
                <Folder size={36} className="text-indigo-400/60 mb-3" />
                <strong className="text-sm font-semibold text-white">No threat models generated</strong>
                <span className="text-xs text-muted-foreground max-w-xs mt-1">Upload architecture diagrams to generate automated, STRIDE-aligned threat lists.</span>
                <button className="btn-improve-coverage text-xs mt-4 py-2 px-4" onClick={onCreateNew}>
                  Generate First Model
                </button>
              </div>
            ) : (
              <div className="recent-models-list">
                {recentModels.map((model) => (
                  <div 
                    key={model.job_id} 
                    className="recent-model-row" 
                    onClick={() => navigate(`/${model.job_id}`)}
                  >
                    <div className="model-row-left">
                      <div className="model-icon-wrapper">
                        <FileText size={15} />
                      </div>
                      <div className="model-info">
                        <strong className="model-title-text">{model.title || "Untitled Model"}</strong>
                        <span className="model-timestamp">
                          <Calendar size={11} className="inline mr-1" />
                          Updated {formatTimeAgo(model.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="model-row-right">
                      {/* State / Status Badge */}
                      <span className={`status-indicator-pill ${model.state?.toLowerCase() === "complete" ? "success" : model.state?.toLowerCase() === "failed" ? "error" : "progress"}`}>
                        <span className="dot"></span>
                        <span className="text">{model.state || "PROCESSING"}</span>
                      </span>

                      {/* Threat breakdown badges */}
                      {model.stats && (
                        <div className="model-stats-badges">
                          <span className="stat-badge-dot high" title="High Risks">
                            <span className="dot"></span>{model.stats.high}
                          </span>
                          <span className="stat-badge-dot medium" title="Medium Risks">
                            <span className="dot"></span>{model.stats.medium}
                          </span>
                          <span className="stat-badge-dot low" title="Low Risks">
                            <span className="dot"></span>{model.stats.low}
                          </span>
                        </div>
                      )}
                      
                      <ArrowRight size={14} className="arrow-hover-icon" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Widget 2: Top Threat Vulnerabilities */}
          <div className="dashboard-widget list-widget">
            <div className="widget-header">
              <div className="widget-header-title">
                <h3>Top Threat Vulnerabilities</h3>
                <p className="widget-description">Actionable, highest likelihood risks prioritized across your models.</p>
              </div>
              <div className="flex items-center gap-2">
                {strideFilter && (
                  <button className="btn-filter-clear flex items-center gap-1" onClick={() => setStrideFilter(null)}>
                    <span>Category: {strideFilter}</span>
                    <X size={12} />
                  </button>
                )}
                <button className="btn-link flex items-center gap-1" onClick={() => navigate("/threat-catalog")}>
                  <span>View all</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {filteredTopThreats.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 border border-dashed border-line-soft rounded-xl">
                <Shield size={36} className="text-indigo-400/60 mb-3" />
                <strong className="text-sm font-semibold text-white">
                  {strideFilter ? `No ${strideFilter} threats found` : "No threat vulnerabilities found"}
                </strong>
                <span className="text-xs text-muted-foreground mt-1">
                  {strideFilter ? "Try selecting a different STRIDE category profile bar." : "Generate a threat model to identify risks."}
                </span>
                {strideFilter && (
                  <button className="btn-improve-coverage text-xs mt-3 py-1.5 px-3" onClick={() => setStrideFilter(null)}>
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="threats-list">
                {filteredTopThreats.map((threat, index) => {
                  const LikelihoodIcon = threat.likelihood.toLowerCase() === "high" 
                    ? AlertTriangle 
                    : threat.likelihood.toLowerCase() === "medium" 
                      ? Clock 
                      : CheckCircle2;

                  return (
                    <div 
                      className="threat-item interactive-row" 
                      key={index}
                      onClick={() => threat.model_id && navigate(`/${threat.model_id}`)}
                    >
                      <div className="threat-item-left">
                        <LikelihoodIcon size={14} className={`threat-item-icon ${threat.likelihood.toLowerCase()}`} />
                        <div className="threat-item-details">
                          <strong className="threat-item-name">{threat.name}</strong>
                          <span className="threat-item-model">
                            {threat.target} | <span className="model-link-text">{threat.model_title}</span>
                            {threat.stride_category && <span className="stride-tag-subtle">{threat.stride_category}</span>}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`risk-indicator-pill ${threat.likelihood.toLowerCase()}`}>
                          <span className="dot"></span>
                          <span className="text">{threat.likelihood}</span>
                        </span>
                        <ArrowRight size={14} className="arrow-hover-icon text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget 3: Active Spaces */}
          <div className="dashboard-widget list-widget">
            <div className="widget-header">
              <div className="widget-header-title">
                <h3>Active Knowledge Spaces</h3>
                <p className="widget-description">RAG knowledge repositories storing architecture notes and requirements.</p>
              </div>
              <button className="btn-link flex items-center gap-1" onClick={() => navigate("/spaces")}>
                <span>Manage Spaces</span>
                <ArrowRight size={14} />
              </button>
            </div>
            {spaces.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 border border-dashed border-line-soft rounded-xl">
                <Layers size={36} className="text-indigo-400/60 mb-3" />
                <strong className="text-sm font-semibold text-white">No knowledge spaces yet</strong>
                <span className="text-xs text-muted-foreground mt-1">Create a Space to organize security guidelines, checklists, and compliance requirements.</span>
                <button className="btn-improve-coverage text-xs mt-4 py-2 px-4" onClick={() => navigate("/spaces")}>
                  Create First Space
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
                      <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Layers size={14} />
                      </div>
                      <div className="flex flex-col">
                        <strong className="text-sm font-semibold text-white">{space.name}</strong>
                        <span className="text-xs text-muted-foreground truncate max-w-[280px]">{space.description || "Security architecture workspace"}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="arrow-hover-icon text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Metrics, AI Advisory, Documents */}
        <section className="grid-column-right">
          
          {/* STRIDE Threat Profile Widget */}
          <div className="dashboard-widget stride-profile-widget">
            <h3 className="widget-title">STRIDE Threat Profile</h3>
            <p className="text-xs text-muted-foreground -mt-2">Click categories below to filter vulnerabilities list.</p>
            <div className="stride-bars-container">
              {strideData.map((item, index) => {
                const isFiltered = strideFilter === item.category;
                return (
                  <div 
                    className={`stride-bar-row interactive-bar-row ${isFiltered ? "active-filter" : ""}`} 
                    key={item.category}
                    onClick={() => handleStrideClick(item.category)}
                  >
                    <div className="stride-bar-info text-sm">
                      <span className="font-semibold text-white">{item.category}</span>
                      <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="stride-bar-track bg-slate-950/50 rounded-full h-1.5 w-full overflow-hidden border border-line-soft">
                      <div 
                        className="stride-bar-fill rounded-full h-full"
                        style={{ 
                          width: `${item.percentage}%`,
                          background: isFiltered
                            ? "linear-gradient(to right, #818cf8, #a78bfa)"
                            : `linear-gradient(to right, #4f46e5, ${index === 0 ? "#8b5cf6" : "#6366f1"})`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Security Recommendations */}
          <div className="dashboard-widget advisories-widget">
            <h3 className="widget-title">AI Security Recommendations</h3>
            <p className="text-xs text-muted-foreground -mt-2">Realtime mitigations driven by identified risk profiles.</p>
            <div className="advisories-list flex flex-col gap-3">
              {advisories.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-line-soft rounded-xl h-full min-h-[140px]">
                  <ShieldAlert size={28} className="text-indigo-400/60 mb-2" />
                  <strong className="text-sm text-white">No active advisories</strong>
                  <span className="text-xs text-muted-foreground mt-1">Recommendations will populate based on your workspace STRIDE risk concentration.</span>
                </div>
              ) : (
                advisories.map((adv, index) => {
                  const SeverityIcon = adv.severity?.toLowerCase() === "high" ? AlertTriangle : Clock;
                  return (
                    <div className="advisory-card p-3 rounded-lg border border-red-500/20 bg-red-950/10 flex flex-col gap-1.5" key={index}>
                      <div className="flex items-center gap-2">
                        <SeverityIcon size={14} className={adv.severity?.toLowerCase() === "high" ? "text-red-400" : "text-amber-400"} />
                        <strong className="text-xs font-bold text-white">{adv.title}</strong>
                        <span className={`risk-indicator-pill ${adv.severity?.toLowerCase() === "high" ? "high" : "medium"} shrink-0 scale-90 ml-auto`}>
                          <span className="dot"></span>
                          <span className="text">{adv.severity}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed m-0">{adv.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Security Guidelines & PDFs */}
          <div className="dashboard-widget list-widget">
            <div className="widget-header">
              <div className="widget-header-title">
                <h3>Security Guidelines</h3>
                <p className="widget-description">RAG Compliance knowledge base documents.</p>
              </div>
            </div>
            {recentDocuments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-line-soft rounded-xl min-h-[140px]">
                <FileText size={28} className="text-indigo-400/60 mb-2" />
                <strong className="text-sm text-white">No guidelines uploaded</strong>
                <span className="text-xs text-muted-foreground mt-1">Compliance policies uploaded to Spaces will show up here.</span>
              </div>
            ) : (
              <div className="documents-list flex flex-col gap-3">
                {recentDocuments.map((doc) => (
                  <div 
                    className="doc-card-item p-3 rounded-lg border border-line-soft bg-slate-950/30 flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-colors" 
                    key={doc.document_id}
                    onClick={() => navigate(`/spaces/${doc.space_id}`)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={16} className="text-indigo-400 shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <strong className="text-xs font-semibold text-white truncate max-w-[150px]">{doc.filename}</strong>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{doc.space_name}</span>
                      </div>
                    </div>
                    <span className={`status-indicator-pill ${doc.status === "READY" ? "success" : "progress"} scale-90`}>
                      <span className="dot"></span>
                      <span className="text">{doc.status === "READY" ? "READY" : "INGEST"}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
