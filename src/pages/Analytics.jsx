import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BarChart, PieChart, Activity, Calendar, ArrowRight } from "lucide-react";

function Analytics() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setData(await response.json());
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const totalTracks = Object.values(data.tracks).reduce((a, b) => a + b, 0) || 1;
  const trackPercentages = {
    fast: (data.tracks.fast / totalTracks) * 100,
    standard: (data.tracks.standard / totalTracks) * 100,
    complex: (data.tracks.complex / totalTracks) * 100,
  };

  const totalStatus = Object.values(data.counts).reduce((a, b) => a + b, 0) - data.counts.total || 1;
  let currentAngle = 0;
  const createPieSegment = (value, color) => {
    if (value === 0) return null;
    const percentage = value / totalStatus;
    const angle = percentage * 360;
    const startX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
    const startY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
    currentAngle += angle;
    const endX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
    const endY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
    const largeArc = percentage > 0.5 ? 1 : 0;
    return (
      <path
        d={`M50,50 L${startX},${startY} A40,40 0 ${largeArc},1 ${endX},${endY} Z`}
        fill={color}
        stroke="hsl(var(--background))"
        strokeWidth="1.5"
      />
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="btn-primary p-3 rounded-xl">
            <Activity className="h-6 w-6" style={{ color: "white" }} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Analytics Dashboard</h1>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Cases</p>
            <p className="text-4xl font-extrabold text-foreground">{data.counts.total}</p>
          </div>
          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-primary">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Active</p>
            <p className="text-4xl font-extrabold text-primary">{data.counts.active}</p>
          </div>
          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-amber-500">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Pending</p>
            <p className="text-4xl font-extrabold text-amber-500">{data.counts.pending}</p>
          </div>
          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-emerald-500">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Resolved</p>
            <p className="text-4xl font-extrabold text-emerald-500">{data.counts.resolved}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Status Pie Chart ── */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6 w-full">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Case Status Breakdown</h2>
            </div>
            {totalStatus > 0 ? (
              <div className="relative w-48 h-48 mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-md">
                  {createPieSegment(data.counts.active, "hsl(337, 87%, 27%)")}
                  {createPieSegment(data.counts.pending, "hsl(38, 92%, 50%)")}
                  {createPieSegment(data.counts.resolved, "hsl(142, 76%, 36%)")}
                  <circle cx="50" cy="50" r="22" fill="hsl(var(--card))" />
                </svg>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-muted-foreground bg-muted/30 rounded-full mb-6">
                No Data
              </div>
            )}
            <div className="flex gap-4 text-sm font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning" /> Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success" /> Resolved</span>
            </div>
          </div>

          {/* ── Track Bar Chart ── */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-8">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Cases by Track</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-foreground">Fast Track</span>
                  <span className="text-muted-foreground">{data.tracks.fast}</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${trackPercentages.fast}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-foreground">Standard Track</span>
                  <span className="text-muted-foreground">{data.tracks.standard}</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${trackPercentages.standard}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-foreground">Complex Track</span>
                  <span className="text-muted-foreground">{data.tracks.complex}</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${trackPercentages.complex}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Hearings ── */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Upcoming Hearings</h2>
            </div>
          </div>
          {data.recentHearings?.length > 0 ? (
            <div className="space-y-3">
              {data.recentHearings.map(hearing => (
                <Link key={hearing.id} to={`/cases/${hearing.caseId}`} className="flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-xl transition-colors group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{hearing.hearingDate}</span>
                      <p className="text-sm font-bold text-foreground">{hearing.caseItem.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{hearing.purpose}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-border/50">
              No upcoming hearings scheduled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
