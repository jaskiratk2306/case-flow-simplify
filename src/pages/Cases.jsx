import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  FileText,
  X,
  AlertCircle,
  ChevronRight,
  Layers,
  Clock,
  CheckCircle2,
  BarChart2,
} from "lucide-react";

function Cases() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrack, setFilterTrack] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    track: "STANDARD",
    parties: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCases = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (filterTrack && filterTrack !== "all") queryParams.append("track", filterTrack);
      if (filterStatus && filterStatus !== "all") queryParams.append("status", filterStatus);

      const response = await fetch(`/api/cases?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load case registry");
      const data = await response.json();
      setCases(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cases from server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const handler = setTimeout(() => { fetchCases(); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, filterTrack, filterStatus, token, navigate]);

  const handleAddCase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCase),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to register case");
      }
      setNewCase({ title: "", description: "", track: "STANDARD", parties: "" });
      setShowAddModal(false);
      fetchCases();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackConfig = {
    FAST: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      border: "border-emerald-500/20",
      label: "Fast Track",
      dot: "bg-emerald-500",
    },
    STANDARD: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-500/20",
      label: "Standard",
      dot: "bg-blue-500",
    },
    COMPLEX: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-500/20",
      label: "Complex",
      dot: "bg-amber-500",
    },
  };

  const statusConfig = {
    ACTIVE: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary", label: "Active" },
    PENDING: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground", label: "Pending" },
    RESOLVED: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500", label: "Resolved" },
  };

  const statCards = [
    {
      label: "Total Cases",
      value: cases.length,
      icon: Layers,
      gradient: "from-primary/10 to-accent/10",
      textColor: "text-foreground",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: cases.filter((c) => c.status === "ACTIVE").length,
      icon: BarChart2,
      gradient: "from-blue-500/10 to-indigo-500/10",
      textColor: "text-primary",
      iconColor: "text-primary",
    },
    {
      label: "Pending Review",
      value: cases.filter((c) => c.status === "PENDING").length,
      icon: Clock,
      gradient: "from-amber-500/10 to-orange-500/10",
      textColor: "text-amber-600",
      iconColor: "text-amber-500",
    },
    {
      label: "Resolved",
      value: cases.filter((c) => c.status === "RESOLVED").length,
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-teal-500/10",
      textColor: "text-emerald-600",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Case Registry
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">
              Manage, track, and resolve all registered legal cases
            </p>
          </div>
          <button
            id="open-add-case-modal"
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-6 py-3 rounded-xl text-sm w-fit"
          >
            <Plus className="h-4 w-4" />
            Register New Case
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 bg-destructive/8 text-destructive text-sm p-4 rounded-xl border border-destructive/20 mb-6 animate-fade-in">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-5 border border-border/50 bg-gradient-to-br ${s.gradient} hover:-translate-y-0.5 transition-transform`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4.5 w-4.5 ${s.iconColor}`} />
              </div>
              <p className={`text-3xl font-extrabold ${s.textColor}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="cases-search-input"
              type="text"
              placeholder="Search cases by title, ID, or parties…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 py-2.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <select
                id="cases-track-filter"
                value={filterTrack}
                onChange={(e) => setFilterTrack(e.target.value)}
                className="bg-transparent text-sm text-foreground focus:outline-none font-medium cursor-pointer"
              >
                <option value="all">All Tracks</option>
                <option value="fast">Fast Track</option>
                <option value="standard">Standard</option>
                <option value="complex">Complex</option>
              </select>
            </div>
            <div className="bg-card border border-border/60 rounded-xl px-3 py-2.5">
              <select
                id="cases-status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm text-foreground focus:outline-none font-medium cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Cases Table ── */}
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Case ID
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Title & Parties
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Track
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Filed Date
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Judge
                  </th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-border border-t-primary mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm font-medium">Loading registry…</p>
                    </td>
                  </tr>
                ) : cases.length > 0 ? (
                  cases.map((caseItem, idx) => {
                    const tc = trackConfig[caseItem.track] || {};
                    const sc = statusConfig[caseItem.status] || {};
                    return (
                      <tr
                        key={caseItem.id}
                        id={`case-row-${caseItem.id}`}
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                        className={`cursor-pointer transition-colors hover:bg-primary/3 border-b border-border/30 last:border-0 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-primary font-bold bg-primary/8 px-2 py-1 rounded-lg">
                            {caseItem.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-foreground text-sm leading-tight">
                            {caseItem.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {caseItem.parties}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${tc.bg} ${tc.text} ${tc.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                            {tc.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {caseItem.filedDate}
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            {caseItem.assignedJudge?.name || (
                              <span className="text-muted-foreground italic">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-16">
                      <div className="w-16 h-16 bg-muted/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="font-semibold text-foreground mb-1">No cases found</p>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your filters or register a new case.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add Case Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card bg-card rounded-3xl p-7 w-full max-w-md shadow-2xl border border-border/60 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Register New Case</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Fill in the case details below</p>
              </div>
              <button
                id="close-add-case-modal"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCase} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Case Title
                </label>
                <input
                  id="new-case-title"
                  type="text"
                  required
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="Enter case title"
                  className="input-premium px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Parties Involved
                </label>
                <input
                  id="new-case-parties"
                  type="text"
                  required
                  value={newCase.parties}
                  onChange={(e) => setNewCase({ ...newCase, parties: e.target.value })}
                  placeholder="e.g., Smith vs. Johnson"
                  className="input-premium px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description
                </label>
                <textarea
                  id="new-case-description"
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Summarize the core legal complaint or subject…"
                  rows="3"
                  className="input-premium px-4 py-3 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Case Track
                </label>
                <select
                  id="new-case-track"
                  value={newCase.track}
                  onChange={(e) => setNewCase({ ...newCase, track: e.target.value })}
                  className="input-premium px-4 py-3 text-sm"
                >
                  <option value="FAST">⚡ Fast Track — Simple cases (≤ 30 days)</option>
                  <option value="STANDARD">📋 Standard Track — Regular cases (≤ 90 days)</option>
                  <option value="COMPLEX">⚖️ Complex Track — Multi-party cases (90+ days)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-border/60 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="submit-new-case"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 py-3 rounded-xl text-sm disabled:opacity-60 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering…
                    </>
                  ) : (
                    "Register Case"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cases;
