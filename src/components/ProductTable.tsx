import { DbProductVariant } from "@/hooks/use-products";
import { FileText } from "lucide-react";

interface ProductTableProps {
  variants: DbProductVariant[];
  onGetQuote: (variant: DbProductVariant) => void;
}

const ProductTable = ({ variants, onGetQuote }: ProductTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="spec-table w-full text-left">
        <thead>
          <tr>
            <th>Model No</th>
            <th>Height Retracted (m)</th>
            <th>Height Erected (m)</th>
            <th>Head Load (kg)</th>
            <th>Wind Area (m²)</th>
            <th>Wind Speed Op. (km/h)</th>
            <th>Wind Speed Surv. (km/h)</th>
            <th>Sway</th>
            <th>Weight (kg)</th>
            <th>Sections</th>
            <th>Tube Dia (mm)</th>
            <th>Guy Ropes</th>
            <th>Tripod Wt (kg)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id}>
              <td className="font-semibold text-primary whitespace-nowrap">{v.model_no}</td>
              <td>{v.height_retracted}</td>
              <td>{v.height_erected}</td>
              <td>{v.head_load}</td>
              <td>{v.wind_area}</td>
              <td>{v.wind_speed_operational}</td>
              <td>{v.wind_speed_survival}</td>
              <td>{v.sway}</td>
              <td>{v.weight}</td>
              <td>{v.sections}</td>
              <td>{v.tube_dia}</td>
              <td>{v.guy_ropes}</td>
              <td>{v.tripod_weight}</td>
              <td>
                <button
                  onClick={() => onGetQuote(v)}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/80 whitespace-nowrap"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Get Quote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
