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

  // Fetch Cases from API
  const fetchCases = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (filterTrack && filterTrack !== "all") queryParams.append("track", filterTrack);
      if (filterStatus && filterStatus !== "all") queryParams.append("status", filterStatus);

      const response = await fetch(`/api/cases?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load case registry");
      }

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
    if (!token) {
      navigate("/login");
      return;
    }
    // Debounce search/filter api calls
    const handler = setTimeout(() => {
      fetchCases();
    }, 300);

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
      fetchCases(); // Refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackColors = {
    FAST: { bg: "bg-success/10", text: "text-success", label: "Fast Track" },
    STANDARD: { bg: "bg-info/10", text: "text-info", label: "Standard Track" },
    COMPLEX: { bg: "bg-warning/10", text: "text-warning", label: "Complex Track" },
  };

  const statusColors = {
    ACTIVE: { bg: "bg-primary/10", text: "text-primary" },
    PENDING: { bg: "bg-muted", text: "text-muted-foreground" },
    RESOLVED: { bg: "bg-accent/10", text: "text-accent" },
  };

  return (
    <div className="min-h-screen bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Case Registry
            </h1>
            <p className="text-muted-foreground">
              Manage and track all registered cases
            </p>
          </div>
          {/* Anyone can register, but typically Lawyers register new cases */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
          >
            <Plus className="h-4 w-4" />
            Register New Case
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-center gap-3 border border-destructive/20 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Total Cases</p>
            <p className="text-2xl font-bold text-foreground">{cases.length}</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Active</p>
            <p className="text-2xl font-bold text-primary">
              {cases.filter((c) => c.status === "ACTIVE").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Pending Review</p>
            <p className="text-2xl font-bold text-warning">
              {cases.filter((c) => c.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Resolved</p>
            <p className="text-2xl font-bold text-accent">
              {cases.filter((c) => c.status === "RESOLVED").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by case ID, title, or parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterTrack}
                onChange={(e) => setFilterTrack(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Tracks</option>
                <option value="fast">Fast Track</option>
                <option value="standard">Standard Track</option>
                <option value="complex">Complex Track</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Case ID
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Track
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground hidden md:table-cell">
                    Filed Date
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground hidden lg:table-cell">
                    Assigned Judge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2 text-sm">Loading registry...</p>
                    </td>
                  </tr>
                ) : cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm text-primary font-medium">
                          {caseItem.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {caseItem.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {caseItem.parties}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            trackColors[caseItem.track]?.bg || "bg-muted"
                          } ${trackColors[caseItem.track]?.text || "text-muted-foreground"}`}
                        >
                          {trackColors[caseItem.track]?.label || caseItem.track}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            statusColors[caseItem.status]?.bg || "bg-muted"
                          } ${statusColors[caseItem.status]?.text || "text-muted-foreground"}`}
                        >
                          {caseItem.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {caseItem.filedDate}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {caseItem.assignedJudge?.name || "Unassigned"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No cases found in database</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md animate-fade-in border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Register New Case
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Case Title
                </label>
                <input
                  type="text"
                  required
                  value={newCase.title}
                  onChange={(e) =>
                    setNewCase({ ...newCase, title: e.target.value })
                  }
                  placeholder="Enter case title"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Parties Involved
                </label>
                <input
                  type="text"
                  required
                  value={newCase.parties}
                  onChange={(e) =>
                    setNewCase({ ...newCase, parties: e.target.value })
                  }
                  placeholder="e.g., Smith vs. Johnson"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  value={newCase.description}
                  onChange={(e) =>
                    setNewCase({ ...newCase, description: e.target.value })
                  }
                  placeholder="Summarize the core legal complaint or subject..."
                  rows="3"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Case Track
                </label>
                <select
                  value={newCase.track}
                  onChange={(e) =>
                    setNewCase({ ...newCase, track: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="FAST">Fast Track (Simple Cases)</option>
                  <option value="STANDARD">Standard Track (Regular Cases)</option>
                  <option value="COMPLEX">Complex Track (Multi-Party Cases)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Registering..." : "Register Case"}
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
