import { useQuotes } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Loader2, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const AdminQuotes = () => {
  const { data: quotes, isLoading } = useQuotes();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Marked as ${status}`);
    queryClient.invalidateQueries({ queryKey: ["quotes"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote request?")) return;
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Quote deleted");
    queryClient.invalidateQueries({ queryKey: ["quotes"] });
  };

  const exportCSV = () => {
    if (!quotes?.length) return;
    const headers = ["Date", "Name", "Company", "Email", "Phone", "Product", "Qty", "Est. Price", "Status"];
    const rows = quotes.map((q) => [
      new Date(q.created_at).toLocaleDateString(),
      q.name, q.company, q.email, q.phone, q.product_model,
      q.quantity, q.estimated_price, q.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "quotes.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground">Quote Requests</h1>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted">
          Export CSV
        </button>
      </div>

      {!quotes?.length ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold uppercase text-foreground mb-2">No Quotes Yet</h3>
          <p className="text-sm text-muted-foreground">Quote requests will appear here once customers submit enquiries.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="spec-table w-full text-left">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Company</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Est. Price</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td className="whitespace-nowrap">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td>{q.name}</td>
                  <td>{q.company}</td>
                  <td className="font-mono text-primary">{q.product_model}</td>
                  <td>{q.quantity}</td>
                  <td className="font-mono">₹ {Number(q.estimated_price).toLocaleString("en-IN")}</td>
                  <td>{q.email}</td>
                  <td>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${q.status === "contacted" ? "bg-tech-green/20 text-tech-green" : "bg-primary/20 text-primary"}`}>
                      {q.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {q.status !== "contacted" && (
                        <button onClick={() => handleStatusUpdate(q.id, "contacted")} className="rounded p-1.5 text-muted-foreground hover:text-tech-green hover:bg-tech-green/10">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(q.id)} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
