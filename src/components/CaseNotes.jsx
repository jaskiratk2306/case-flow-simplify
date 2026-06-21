import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function CaseNotes({ caseId }) {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [caseId]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/cases/${caseId}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setNotes(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newNote })
      });
      if (!res.ok) throw new Error("Failed to add note");
      setNewNote("");
      fetchNotes();
      addToast("Note added", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-border/50 shadow-lg flex flex-col" style={{ height: '400px' }}>
      <div className="p-5 border-b border-border/50">
        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" /> Notes & Discussion
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading ? (
          <div className="flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : notes.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground mt-4">No notes yet. Start the discussion.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className={`flex flex-col ${note.authorId === user.id ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${note.authorId === user.id ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm"}`}>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                {note.author.name} • {new Date(note.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddNote} className="p-4 border-t border-border/50 bg-muted/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type a note..."
            className="flex-1 input-premium px-4 py-2 text-sm rounded-full"
          />
          <button
            type="submit"
            disabled={sending || !newNote.trim()}
            className="btn-primary w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
