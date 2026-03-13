import { FileText } from "lucide-react";

const AdminQuotes = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground">
          Quote Requests
        </h1>
        <button className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted">
          Export CSV
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-heading text-lg font-bold uppercase text-foreground mb-2">No Quotes Yet</h3>
        <p className="text-sm text-muted-foreground">
          Quote requests will appear here once customers submit enquiries. Connect a database to enable persistence.
        </p>
      </div>
    </div>
  );
};

export default AdminQuotes;
