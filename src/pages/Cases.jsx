import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  FileText,
  Clock,
  X,
} from "lucide-react";

function Cases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrack, setFilterTrack] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [cases, setCases] = useState([
    {
      id: "CF-2024-001",
      title: "Smith vs. Johnson Property Dispute",
      track: "standard",
      status: "active",
      filedDate: "2024-01-15",
      assignedJudge: "Hon. Maria Garcia",
      parties: "Smith, Johnson",
    },
    {
      id: "CF-2024-002",
      title: "ABC Corp Contract Breach",
      track: "complex",
      status: "pending",
      filedDate: "2024-01-20",
      assignedJudge: "Hon. Robert Chen",
      parties: "ABC Corp, XYZ Ltd",
    },
    {
      id: "CF-2024-003",
      title: "Traffic Violation - Minor",
      track: "fast",
      status: "resolved",
      filedDate: "2024-01-10",
      assignedJudge: "Hon. Sarah Williams",
      parties: "State vs. Davis",
    },
    {
      id: "CF-2024-004",
      title: "Consumer Protection Complaint",
      track: "standard",
      status: "active",
      filedDate: "2024-01-25",
      assignedJudge: "Hon. Maria Garcia",
      parties: "Brown vs. TechStore Inc",
    },
    {
      id: "CF-2024-005",
      title: "Multi-Party Construction Dispute",
      track: "complex",
      status: "active",
      filedDate: "2024-02-01",
      assignedJudge: "Hon. Robert Chen",
      parties: "Multiple Parties",
    },
    {
      id: "CF-2024-006",
      title: "Document Authentication",
      track: "fast",
      status: "resolved",
      filedDate: "2024-01-05",
      assignedJudge: "Hon. Sarah Williams",
      parties: "State Registry",
    },
  ]);

  const [newCase, setNewCase] = useState({
    title: "",
    track: "standard",
    parties: "",
  });

  const trackColors = {
    fast: { bg: "bg-success/10", text: "text-success", label: "Fast Track" },
    standard: { bg: "bg-info/10", text: "text-info", label: "Standard Track" },
    complex: {
      bg: "bg-warning/10",
      text: "text-warning",
      label: "Complex Track",
    },
  };

  const statusColors = {
    active: { bg: "bg-primary/10", text: "text-primary" },
    pending: { bg: "bg-muted", text: "text-muted-foreground" },
    resolved: { bg: "bg-accent/10", text: "text-accent" },
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = filterTrack === "all" || c.track === filterTrack;
    return matchesSearch && matchesTrack;
  });

  const handleAddCase = (e) => {
    e.preventDefault();
    const newId = `CF-2024-${String(cases.length + 1).padStart(3, "0")}`;
    const caseToAdd = {
      id: newId,
      title: newCase.title,
      track: newCase.track,
      status: "pending",
      filedDate: new Date().toISOString().split("T")[0],
      assignedJudge: "To be assigned",
      parties: newCase.parties,
    };
    setCases([caseToAdd, ...cases]);
    setNewCase({ title: "", track: "standard", parties: "" });
    setShowAddModal(false);
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
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
          >
            <Plus className="h-4 w-4" />
            Register New Case
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Total Cases</p>
            <p className="text-2xl font-bold text-foreground">{cases.length}</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Active</p>
            <p className="text-2xl font-bold text-primary">
              {cases.filter((c) => c.status === "active").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Pending</p>
            <p className="text-2xl font-bold text-warning">
              {cases.filter((c) => c.status === "pending").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">Resolved</p>
            <p className="text-2xl font-bold text-accent">
              {cases.filter((c) => c.status === "resolved").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by case ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tracks</option>
              <option value="fast">Fast Track</option>
              <option value="standard">Standard Track</option>
              <option value="complex">Complex Track</option>
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
                {filteredCases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className="hover:bg-muted/30 transition-colors"
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
                          trackColors[caseItem.track].bg
                        } ${trackColors[caseItem.track].text}`}
                      >
                        {trackColors[caseItem.track].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          statusColors[caseItem.status].bg
                        } ${statusColors[caseItem.status].text}`}
                      >
                        {caseItem.status}
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
                        {caseItem.assignedJudge}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCases.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No cases found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md animate-fade-in">
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
                  Case Track
                </label>
                <select
                  value={newCase.track}
                  onChange={(e) =>
                    setNewCase({ ...newCase, track: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="fast">Fast Track (Simple Cases)</option>
                  <option value="standard">Standard Track (Regular Cases)</option>
                  <option value="complex">Complex Track (Multi-Party Cases)</option>
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
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Register Case
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
