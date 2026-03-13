import { ProductVariant } from "@/data/products";
import { FileText } from "lucide-react";

interface ProductTableProps {
  variants: ProductVariant[];
  onGetQuote: (variant: ProductVariant) => void;
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
            <tr key={v.modelNo}>
              <td className="font-semibold text-primary whitespace-nowrap">{v.modelNo}</td>
              <td>{v.heightRetracted}</td>
              <td>{v.heightErected}</td>
              <td>{v.headLoad}</td>
              <td>{v.windArea}</td>
              <td>{v.windSpeedOperational}</td>
              <td>{v.windSpeedSurvival}</td>
              <td>{v.sway}</td>
              <td>{v.weight}</td>
              <td>{v.sections}</td>
              <td>{v.tubeDia}</td>
              <td>{v.guyRopes}</td>
              <td>{v.tripodWeight}</td>
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
