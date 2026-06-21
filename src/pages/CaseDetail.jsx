import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Scale,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  AlertCircle,
  Plus,
  FileText,
  Settings,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

function CaseDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [caseItem, setCaseItem] = useState(null);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [track, setTrack] = useState("");
  const [assignedJudgeId, setAssignedJudgeId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [hearingDate, setHearingDate] = useState("");
  const [hearingPurpose, setHearingPurpose] = useState("Initial Hearing");
  const [hearingNotes, setHearingNotes] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    const fetchCaseDetails = async () => {
      try {
        const response = await fetch(`/api/cases/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch case details");
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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) setJudges(await response.json());
      } catch (err) {
        console.error("Error fetching judges list", err);
      }
    };

    fetchCaseDetails();
    if (user?.role === "JUDGE") fetchJudges();
  }, [id, token, user, navigate]);

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");
    setUpdateSuccess(false);
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, track, assignedJudgeId: assignedJudgeId || null }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update case");
      }
      const updatedData = await response.json();
      setCaseItem(updatedData);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
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
        body: JSON.stringify({ hearingDate, purpose: hearingPurpose, notes: hearingNotes }),
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
      setHearingDate("");
      setHearingPurpose("Initial Hearing");
      setHearingNotes("");
      setShowScheduleForm(false);
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
          <div className="w-12 h-12 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading case details…</p>
        </div>
      </div>
    );
  }

  if (error && !caseItem) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Unable to Load Case</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link
          to="/cases"
          className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Registry
        </Link>
      </div>
    );
  }

  const isJudge = user?.role === "JUDGE";

  const trackConfig = {
    FAST: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      border: "border-emerald-500/25",
      label: "Fast Track",
      barColor: "from-emerald-400 to-teal-400",
    },
    STANDARD: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-500/25",
      label: "Standard Track",
      barColor: "from-blue-400 to-indigo-400",
    },
    COMPLEX: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-500/25",
      label: "Complex Track",
      barColor: "from-amber-400 to-orange-400",
    },
  };

  const statusConfig = {
    ACTIVE: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary", label: "Active" },
    PENDING: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground", label: "Pending" },
    RESOLVED: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500", label: "Resolved" },
  };

  const tc = trackConfig[caseItem?.track] || {};
  const sc = statusConfig[caseItem?.status] || {};

  return (
    <div className="min-h-screen bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Back nav */}
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-7 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Registry
        </Link>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-destructive/8 text-destructive text-sm p-4 rounded-xl border border-destructive/20 mb-6 animate-fade-in">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Case header card */}
            <div className="glass-card rounded-3xl border border-border/50 overflow-hidden shadow-lg">
              {/* Gradient top strip */}
              <div className={`h-1.5 bg-gradient-to-r ${tc.barColor || "from-primary to-accent"}`} />
              <div className="p-7">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/8 px-3 py-1.5 rounded-xl">
                    {caseItem.id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tc.bg} ${tc.text} ${tc.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full`} style={{ background: "currentColor" }} />
                    {tc.label}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-2">
                  {caseItem.title}
                </h1>
                <p className="text-sm text-muted-foreground font-medium mb-4">
                  <span className="text-foreground font-semibold">Parties:</span>{" "}
                  {caseItem.parties}
                </p>

                {caseItem.description && (
                  <div className="mt-5 pt-5 border-t border-border/40">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {caseItem.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Hearing Dockets */}
            <div className="glass-card rounded-3xl border border-border/50 shadow-lg">
              <div className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="btn-primary p-2.5 rounded-xl">
                      <Calendar className="h-4.5 w-4.5 text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold text-foreground">Hearing Dockets</h2>
                  </div>
                  {isJudge && (
                    <button
                      id="toggle-schedule-form"
                      onClick={() => setShowScheduleForm(!showScheduleForm)}
                      className={`btn-primary px-4 py-2 rounded-xl text-xs ${showScheduleForm ? "opacity-80" : ""}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Schedule Hearing
                    </button>
                  )}
                </div>

                {/* Schedule Form */}
                {showScheduleForm && (
                  <form
                    onSubmit={handleScheduleHearing}
                    className="mb-7 p-5 border border-border/50 rounded-2xl bg-muted/30 space-y-4 animate-fade-in"
                  >
                    <h3 className="text-sm font-bold text-foreground">New Hearing Date</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2">
                          Hearing Date
                        </label>
                        <input
                          id="hearing-date-input"
                          type="date"
                          required
                          value={hearingDate}
                          onChange={(e) => setHearingDate(e.target.value)}
                          className="input-premium px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2">
                          Purpose
                        </label>
                        <select
                          id="hearing-purpose-select"
                          value={hearingPurpose}
                          onChange={(e) => setHearingPurpose(e.target.value)}
                          className="input-premium px-3 py-2.5 text-sm"
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
                      <label className="block text-xs font-semibold text-muted-foreground mb-2">
                        Notes (optional)
                      </label>
                      <textarea
                        id="hearing-notes-input"
                        value={hearingNotes}
                        onChange={(e) => setHearingNotes(e.target.value)}
                        placeholder="Agenda items, courtroom number, etc."
                        rows="2"
                        className="input-premium px-3 py-2.5 text-sm resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowScheduleForm(false)}
                        className="px-4 py-2 text-xs font-semibold border border-border/60 rounded-xl text-foreground hover:bg-muted/60 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-hearing-btn"
                        type="submit"
                        disabled={isScheduling}
                        className="btn-primary px-5 py-2 text-xs rounded-xl disabled:opacity-60 disabled:transform-none"
                      >
                        {isScheduling ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Scheduling…
                          </>
                        ) : (
                          "Schedule"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Timeline */}
                {caseItem.hearings && caseItem.hearings.length > 0 ? (
                  <div className="relative pl-7 ml-2 border-l-2 border-border/40 space-y-6">
                    {caseItem.hearings.map((hearing, idx) => (
                      <div key={hearing.id} className="relative animate-fade-in">
                        {/* Timeline node */}
                        <span className="absolute -left-[33px] top-1 w-5 h-5 btn-primary rounded-full flex items-center justify-center shadow-glow-primary">
                          <span className="w-2 h-2 bg-white rounded-full" />
                        </span>
                        <div className="ml-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-lg font-mono font-semibold">
                              {hearing.hearingDate}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {hearing.purpose}
                            </span>
                          </div>
                          {hearing.notes && (
                            <p className="text-sm text-muted-foreground bg-muted/40 border border-border/40 p-3 rounded-xl mt-1.5">
                              {hearing.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-muted/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">No hearings scheduled</p>
                    <p className="text-muted-foreground text-sm">
                      {isJudge ? "Use the button above to schedule the first hearing." : "A judge will schedule hearings for this case."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Case Logistics card */}
            <div className="glass-card rounded-3xl border border-border/50 p-6 shadow-lg">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-widest mb-5">
                Case Logistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filed Date</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{caseItem.filedDate}</p>
                  </div>
                </div>
                <div className="section-divider" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Judge</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {caseItem.assignedJudge?.name || (
                        <span className="text-muted-foreground italic font-normal">To be assigned</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="section-divider" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hearings</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {(caseItem.hearings || []).length} scheduled
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Judicial Actions — Judge only */}
            {isJudge && (
              <div className="glass-card rounded-3xl border border-border/50 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="btn-primary p-2 rounded-xl">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-widest">
                    Judicial Actions
                  </h3>
                </div>

                {updateSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5 mb-4 animate-fade-in">
                    <CheckCircle className="h-4 w-4" />
                    Case updated successfully
                  </div>
                )}

                <form onSubmit={handleUpdateCase} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Case Status
                    </label>
                    <select
                      id="judge-status-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input-premium px-3 py-2.5 text-sm"
                    >
                      <option value="PENDING">Pending Review</option>
                      <option value="ACTIVE">Active Litigation</option>
                      <option value="RESOLVED">Resolved / Terminated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Case Track
                    </label>
                    <select
                      id="judge-track-select"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="input-premium px-3 py-2.5 text-sm"
                    >
                      <option value="FAST">Fast Track</option>
                      <option value="STANDARD">Standard Track</option>
                      <option value="COMPLEX">Complex Track</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Assign Judicial Bench
                    </label>
                    <select
                      id="judge-assign-select"
                      value={assignedJudgeId}
                      onChange={(e) => setAssignedJudgeId(e.target.value)}
                      className="input-premium px-3 py-2.5 text-sm"
                    >
                      <option value="">— Unassigned —</option>
                      {judges.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="apply-judicial-order-btn"
                    type="submit"
                    disabled={isUpdating}
                    className="btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-60 disabled:transform-none"
                  >
                    {isUpdating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        Apply Judicial Order
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
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
