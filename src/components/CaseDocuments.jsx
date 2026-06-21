import { useState, useEffect } from "react";
import { Download, Trash2, File, Upload, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function CaseDocuments({ caseId }) {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [caseId]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/cases/${caseId}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setDocuments(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast("File must be less than 5MB", "error");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result.split(',')[1];
      try {
        const res = await fetch(`/api/cases/${caseId}/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            data: base64Data
          })
        });
        
        if (!res.ok) throw new Error(await res.text());
        addToast("Document uploaded successfully", "success");
        fetchDocuments();
      } catch (err) {
        addToast("Failed to upload document", "error");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (docId, filename) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Download failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      addToast("Failed to download document", "error");
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`/api/cases/${caseId}/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      addToast("Document deleted", "success");
      fetchDocuments();
    } catch (err) {
      addToast("Failed to delete document", "error");
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-border/50 shadow-lg p-7">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <File className="h-5 w-5 text-primary" /> Documents
        </h3>
        <label className="btn-primary px-3 py-1.5 text-xs rounded-xl cursor-pointer flex items-center gap-1.5">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
      ) : documents.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-xl">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate" title={doc.filename}>{doc.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedBy.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleDownload(doc.id, doc.filename)} className="p-1.5 text-muted-foreground hover:text-primary rounded-md transition-colors" title="Download">
                  <Download className="h-4 w-4" />
                </button>
                {(user.role === "JUDGE" || doc.uploadedById === user.id) && (
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
