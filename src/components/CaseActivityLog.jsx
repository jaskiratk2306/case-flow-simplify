import { useState, useEffect } from "react";
import { Activity, User, Edit, FileUp, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CaseActivityLog({ caseId }) {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/cases/${caseId}/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setActivities(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [caseId]);

  if (loading) return <div className="py-4 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>;

  if (activities.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-xl">No recent activity.</div>;
  }

  const getIcon = (action) => {
    switch (action) {
      case "STATUS_CHANGED": return <Activity className="h-3 w-3" />;
      case "TRACK_CHANGED": return <Edit className="h-3 w-3" />;
      case "JUDGE_ASSIGNED": return <User className="h-3 w-3" />;
      case "DOC_UPLOADED": return <FileUp className="h-3 w-3" />;
      case "NOTE_ADDED": return <MessageSquare className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getMessage = (act) => {
    switch (act.action) {
      case "STATUS_CHANGED": return `changed status from ${act.oldValue} to ${act.newValue}`;
      case "TRACK_CHANGED": return `changed track from ${act.oldValue} to ${act.newValue}`;
      case "JUDGE_ASSIGNED": return `assigned a new judge`;
      case "DOC_UPLOADED": return `uploaded document: ${act.newValue}`;
      case "NOTE_ADDED": return `added a note`;
      default: return `performed an action`;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map(act => (
        <div key={act.id} className="flex gap-3 text-sm">
          <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {getIcon(act.action)}
          </div>
          <div>
            <p className="text-foreground">
              <span className="font-semibold">{act.actor.name}</span> {getMessage(act)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              {new Date(act.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
