import { useState } from "react";
import { useQuotes } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Loader2, Trash2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type ConfigRow = {
  label: string;
  value: string;
  price?: string;
};

const parseQuoteMessage = (message: string) => {
  const [customerMessagePart = "", configPart = ""] = message.split("--- Configuration ---");

  const configRows: ConfigRow[] = configPart
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const priced = line.match(/^(.+?):\s*(.+?)\s*\((₹[\d,]+)\)$/);
      if (priced) {
        return { label: priced[1].trim(), value: priced[2].trim(), price: priced[3].trim() };
      }

      const basic = line.match(/^(.+?):\s*(.+)$/);
      if (basic) {
        return { label: basic[1].trim(), value: basic[2].trim() };
      }

      return { label: "Detail", value: line };
    });

  return {
    customerMessage: customerMessagePart.trim(),
    configRows,
  };
};

const AdminQuotes = () => {
  const { data: quotes, isLoading } = useQuotes();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    const headers = ["Date", "Name", "Company", "Email", "Phone", "Country", "Category", "Sub Category", "Product", "Qty", "Est. Price", "Status", "Message"];
    const rows = quotes.map((q) => [
      new Date(q.created_at).toLocaleDateString(),
      q.name, q.company, q.email, q.phone, q.country,
      q.category, q.sub_category, q.product_model,
      q.quantity, q.estimated_price, q.status, q.message,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
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
        <div className="space-y-3">
          {quotes.map((q) => {
            const isExpanded = expandedId === q.id;
            // Parse configuration from message
            const configMatch = q.message?.match(/--- Configuration ---\n([\s\S]*)/);
            const configLines = configMatch ? configMatch[1].trim().split("\n") : [];

            return (
              <div key={q.id} className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Summary row */}
                <div
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
                      <p className="text-foreground">{new Date(q.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</p>
                      <p className="text-foreground font-medium">{q.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Company</p>
                      <p className="text-foreground">{q.company}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Product</p>
                      <p className="font-mono text-primary">{q.product_model}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Qty</p>
                      <p className="text-foreground">{q.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Price</p>
                      <p className="font-mono text-primary font-bold">₹{Number(q.estimated_price).toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${q.status === "contacted" ? "bg-tech-green/20 text-tech-green" : "bg-primary/20 text-primary"}`}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {q.status !== "contacted" && (
                      <button onClick={() => handleStatusUpdate(q.id, "contacted")} className="rounded p-1.5 text-muted-foreground hover:text-tech-green hover:bg-tech-green/10">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(q.id)} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 px-4 py-4 space-y-4">
                    {/* Contact details */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Contact Details</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</p>
                          <p className="text-foreground">{q.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Company</p>
                          <p className="text-foreground">{q.company}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
                          <a href={`mailto:${q.email}`} className="text-primary hover:underline">{q.email}</a>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone</p>
                          <a href={`tel:${q.phone}`} className="text-primary hover:underline">{q.phone}</a>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</p>
                          <p className="text-foreground">{q.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Product details */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Product Details</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</p>
                          <p className="text-foreground">{q.category}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sub Category</p>
                          <p className="text-foreground">{q.sub_category}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Model</p>
                          <p className="font-mono text-primary font-bold">{q.product_model}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Quantity</p>
                          <p className="text-foreground">{q.quantity}</p>
                        </div>
                      </div>
                    </div>

                    {/* Configuration breakdown */}
                    {configLines.length > 0 && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Configuration & Pricing</h4>
                        <div className="rounded border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-secondary">
                                <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground">Specification</th>
                                <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground">Value</th>
                                <th className="text-right px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {configLines.map((line, idx) => {
                                const match = line.match(/^(.+?):\s*(.+?)\s*\((₹[\d,]+)\)$/);
                                if (!match) return null;
                                return (
                                  <tr key={idx} className="border-b border-border last:border-0">
                                    <td className="px-3 py-1.5 text-foreground">{match[1]}</td>
                                    <td className="px-3 py-1.5 font-mono text-muted-foreground">{match[2]}</td>
                                    <td className="px-3 py-1.5 font-mono text-primary text-right">{match[3]}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-primary/30 bg-primary/5">
                                <td className="px-3 py-2 font-bold text-foreground" colSpan={2}>
                                  Total {q.quantity > 1 ? `(× ${q.quantity} units)` : ""}
                                </td>
                                <td className="px-3 py-2 font-mono font-bold text-primary text-right">
                                  ₹{Number(q.estimated_price).toLocaleString("en-IN")}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Additional message */}
                    {q.message && !q.message.startsWith("\n\n---") && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Customer Message</h4>
                        <p className="text-sm text-foreground bg-muted/30 rounded border border-border p-3 whitespace-pre-wrap">
                          {q.message.split("--- Configuration ---")[0].trim() || "—"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
