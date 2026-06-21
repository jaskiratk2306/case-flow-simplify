import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";

function Calendar() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchHearings = async () => {
      try {
        const response = await fetch("/api/hearings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setHearings(await response.json());
        }
      } catch (err) {
        console.error("Failed to fetch hearings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHearings();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  // Group hearings by date string YYYY-MM-DD
  const hearingsByDate = hearings.reduce((acc, h) => {
    if (!acc[h.hearingDate]) acc[h.hearingDate] = [];
    acc[h.hearingDate].push(h);
    return acc;
  }, {});

  const renderDays = () => {
    const days = [];
    // Empty slots before 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-border/30 bg-muted/20 min-h-[100px]" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayHearings = hearingsByDate[dateStr] || [];
      const isToday = dateStr === new Date().toISOString().split("T")[0];

      days.push(
        <div key={day} className={`p-2 border border-border/50 min-h-[120px] transition-colors ${isToday ? 'bg-primary/5 border-primary/30' : 'bg-background hover:bg-muted/30'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {day}
            </span>
            {dayHearings.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/10 text-accent">
                {dayHearings.length}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {dayHearings.map(h => (
              <Link
                key={h.id}
                to={`/cases/${h.caseId}`}
                className="block text-xs p-1.5 rounded bg-muted/60 border border-border hover:border-primary/50 hover:shadow-sm transition-all truncate"
                title={`${h.caseItem.title} - ${h.purpose}`}
              >
                <span className="font-semibold text-foreground truncate block">{h.caseItem.title}</span>
                <span className="text-[10px] text-muted-foreground truncate block">{h.purpose}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl animate-fade-in-up">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="btn-primary p-3 rounded-xl">
              <CalendarIcon className="h-6 w-6" style={{ color: "white" }} />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Hearing Calendar</h1>
          </div>
          <Link to="/cases" className="btn-primary px-4 py-2 text-sm rounded-xl">
            View All Cases
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8">
          {/* Header controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {monthName} <span className="text-muted-foreground">{year}</span>
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-colors">
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted border border-border text-sm font-semibold text-foreground transition-colors">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-colors">
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-muted/40 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
        </div>
        
        {/* Upcoming list view below calendar for quick reference */}
        <div className="mt-8">
           <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
             <Clock className="h-5 w-5 text-muted-foreground" /> Upcoming Hearings Next 7 Days
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hearings
                .filter(h => {
                  const hDate = new Date(h.hearingDate);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const nextWeek = new Date(today);
                  nextWeek.setDate(today.getDate() + 7);
                  return hDate >= today && hDate <= nextWeek;
                })
                .map(h => (
                  <Link key={h.id} to={`/cases/${h.caseId}`} className="glass-card p-4 rounded-xl hover:shadow-glow-primary transition-shadow">
                    <p className="text-xs font-mono font-bold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded mb-2">{h.hearingDate}</p>
                    <p className="font-bold text-foreground truncate">{h.caseItem.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{h.purpose}</p>
                  </Link>
                ))
              }
           </div>
        </div>

      </div>
    </div>
  );
}

export default Calendar;
