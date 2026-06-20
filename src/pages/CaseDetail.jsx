import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Scale,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  Plus,
  FileText,
  CheckCircle,
  Settings,
} from "lucide-react";

function CaseDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [caseItem, setCaseItem] = useState(null);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit fields
  const [status, setStatus] = useState("");
  const [track, setTrack] = useState("");
  const [assignedJudgeId, setAssignedJudgeId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Schedule Hearing fields
  const [hearingDate, setHearingDate] = useState("");
  const [hearingPurpose, setHearingPurpose] = useState("Initial Hearing");
  const [hearingNotes, setHearingNotes] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCaseDetails = async () => {
      try {
        const response = await fetch(`/api/cases/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch case details");
        }

        const data = await response.json();
        setCaseItem(data);
        setStatus(data.status);
        setTrack(data.track);
        setAssignedJudgeId(data.assignedJudgeId || "");
      } catch (err) {
        console.error(err);
        setError("Error loading case details. Please verify the ID.");
      } finally {
        setLoading(false);
      }
    };

    const fetchJudges = async () => {
      try {
        const response = await fetch("/api/judges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setJudges(data);
        }
      } catch (err) {
        console.error("Error fetching judges list", err);
      }
    };

    fetchCaseDetails();
    if (user?.role === "JUDGE") {
      fetchJudges();
    }
  }, [id, token, user, navigate]);

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          track,
          assignedJudgeId: assignedJudgeId || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update case");
      }

      const updatedData = await response.json();
      setCaseItem(updatedData);
      alert("Case updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleScheduleHearing = async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    setError("");

    try {
      const response = await fetch(`/api/cases/${id}/hearings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hearingDate,
          purpose: hearingPurpose,
          notes: hearingNotes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to schedule hearing");
      }

      const newHearing = await response.json();
      setCaseItem((prev) => ({
        ...prev,
        hearings: [...(prev.hearings || []), newHearing].sort(
          (a, b) => new Date(a.hearingDate) - new Date(b.hearingDate)
        ),
      }));

      // Reset Form
      setHearingDate("");
      setHearingPurpose("Initial Hearing");
      setHearingNotes("");
      setShowScheduleForm(false);
      alert("Hearing scheduled successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error && !caseItem) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
          Unable to Load Case
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Registry
        </Link>
      </div>
    );
  }

  const isJudge = user?.role === "JUDGE";

  const trackColors = {
    FAST: { bg: "bg-success/10", text: "text-success", border: "border-success/20", label: "Fast Track" },
    STANDARD: { bg: "bg-info/10", text: "text-info", border: "border-info/20", label: "Standard Track" },
    COMPLEX: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", label: "Complex Track" },
  };

  const statusColors = {
    ACTIVE: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
    PENDING: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
    RESOLVED: { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  };

  return (
    <div className="min-h-screen bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Link */}
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Registry
        </Link>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-center gap-3 border border-destructive/20 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Case Info Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="font-mono text-sm font-semibold text-primary bg-primary/5 px-3 py-1 rounded-md">
                  {caseItem.id}
                </span>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                      trackColors[caseItem.track]?.bg
                    } ${trackColors[caseItem.track]?.text} ${trackColors[caseItem.track]?.border}`}
                  >
                    {trackColors[caseItem.track]?.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      statusColors[caseItem.status]?.bg
                    } ${statusColors[caseItem.status]?.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusColors[caseItem.status]?.dot}`} />
                    {caseItem.status}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
                {caseItem.title}
              </h1>
              <p className="text-muted-foreground font-medium text-sm mb-4">
                <span className="text-foreground">Parties:</span> {caseItem.parties}
              </p>

              {caseItem.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-2 text-sm">Description / Details</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {caseItem.description}
                  </p>
                </div>
              )}
            </div>

            {/* Hearing Timeline */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Hearing Dockets
                </h2>
                {isJudge && (
                  <button
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                    className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule Hearing
                  </button>
                )}
              </div>

              {/* Add Hearing Form */}
              {showScheduleForm && (
                <form
                  onSubmit={handleScheduleHearing}
                  className="mb-6 p-4 border border-border rounded-xl bg-muted/40 space-y-4 animate-fade-in"
                >
                  <h3 className="font-semibold text-foreground text-sm">New Hearing Date</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Hearing Date
                      </label>
                      <input
                        type="date"
                        required
                        value={hearingDate}
                        onChange={(e) => setHearingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Purpose
                      </label>
                      <select
                        value={hearingPurpose}
                        onChange={(e) => setHearingPurpose(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Initial Hearing">Initial Hearing</option>
                        <option value="Evidence Submission">Evidence Submission</option>
                        <option value="Pre-Trial Conference">Pre-Trial Conference</option>
                        <option value="Final Arguments">Final Arguments</option>
                        <option value="Judgement Delivery">Judgement Delivery</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Notes
                    </label>
                    <textarea
                      value={hearingNotes}
                      onChange={(e) => setHearingNotes(e.target.value)}
                      placeholder="Add agenda items, court room location, etc..."
                      rows="2"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowScheduleForm(false)}
                      className="px-3 py-1.5 border border-border rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isScheduling}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {isScheduling ? "Scheduling..." : "Schedule"}
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline List */}
              {caseItem.hearings && caseItem.hearings.length > 0 ? (
                <div className="relative border-l border-border pl-6 ml-3 space-y-6">
                  {caseItem.hearings.map((hearing, idx) => (
                    <div key={hearing.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1.5 bg-background border-2 border-primary w-4 h-4 rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono font-medium">
                            {hearing.hearingDate}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {hearing.purpose}
                          </span>
                        </div>
                        {hearing.notes && (
                          <p className="text-sm text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border mt-1">
                            {hearing.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No hearings scheduled yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Metadata & Control Panel */}
          <div className="space-y-6">
            {/* General Metadata */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Case Logistics</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Filed Date</p>
                  <p>{caseItem.filedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <User className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Assigned Judge</p>
                  <p>{caseItem.assignedJudge?.name || "To be assigned"}</p>
                </div>
              </div>
            </div>

            {/* Judge Control Panel */}
            {isJudge && (
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="font-heading font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Judicial Actions
                </h3>
                <form onSubmit={handleUpdateCase} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Case Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="PENDING">Pending Review</option>
                      <option value="ACTIVE">Active Litigation</option>
                      <option value="RESOLVED">Resolved / Terminated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Case Track
                    </label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="FAST">Fast Track</option>
                      <option value="STANDARD">Standard Track</option>
                      <option value="COMPLEX">Complex Track</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Assign Judicial Bench
                    </label>
                    <select
                      value={assignedJudgeId}
                      onChange={(e) => setAssignedJudgeId(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Unassigned --</option>
                      {judges.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {isUpdating ? "Saving changes..." : "Apply Judicial Order"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseDetail;
