import { DbProductVariant } from "@/hooks/use-products";

interface ProductTableProps {
  variants: DbProductVariant[];
  onGetQuote: () => void;
}

const ProductTable = ({ variants, onGetQuote }: ProductTableProps) => {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="spec-table w-full text-left">
          <thead>
            <tr>
              <th colSpan={2} className="text-center border-b border-border">Height (m)</th>
              <th rowSpan={2}>Head Load (Kg)</th>
              <th rowSpan={2}>Wind Area (m²)</th>
              <th rowSpan={2}>Wind Speed (Operational/ Survival) (kmph)</th>
              <th rowSpan={2}>Sway (°)</th>
              <th rowSpan={2}>Weight of Mast (Kg)</th>
              <th rowSpan={2}>No. of Sections</th>
              <th rowSpan={2}>Tube Dia</th>
              <th className="text-center border-b border-border">Ground Mount</th>
              <th colSpan={2} className="text-center border-b border-border">Tripod Mount</th>
            </tr>
            <tr>
              <th>Retracted</th>
              <th>Erected</th>
              <th>No. of Guy Ropes</th>
              <th>No. of Guy Ropes</th>
              <th>Tripod Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id}>
                <td>{v.height_retracted}</td>
                <td>{v.height_erected}</td>
                <td>{v.head_load}</td>
                <td>{v.wind_area}</td>
                <td>{v.wind_speed_operational}/{v.wind_speed_survival}</td>
                <td>{v.sway}</td>
                <td>{v.weight}</td>
                <td>{v.sections}</td>
                <td>{v.tube_dia}</td>
                <td>{v.guy_ropes}</td>
                <td>{(v as any).tripod_guy_ropes || v.guy_ropes}</td>
                <td>{v.tripod_weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onGetQuote}
          className="inline-flex items-center gap-2 rounded bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Get Quote
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
