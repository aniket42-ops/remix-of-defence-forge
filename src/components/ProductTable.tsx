import { DbProductVariant } from "@/hooks/use-products";

interface ProductTableProps {
  variants: DbProductVariant[];
  onGetQuote: () => void;
}

const ProductTable = ({ variants, characteristicPrices, onGetQuote }: ProductTableProps) => {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="spec-table w-full text-left">
          <thead>
            <tr>
              <th>Model No</th>
              <th>Height Retracted (m)</th>
              <th>Height Erected (m)</th>
              <th>Head Load (kg)</th>
              <th>Wind Area (m²)</th>
              <th>Wind Speed Op./Surv. (km/h)</th>
              <th>Sway</th>
              <th>Weight (kg)</th>
              <th>Sections</th>
              <th>Tube Dia (mm)</th>
              <th>Guy Ropes</th>
              <th>Tripod Wt (kg)</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => {
              const heightKey = `${v.height_retracted}/${v.height_erected}`;
              return (
                <tr key={v.id}>
                  <td className="font-semibold text-primary whitespace-nowrap">{v.model_no}</td>
                  <td>
                    {v.height_retracted}
                    <PriceCell price={findPrice(characteristicPrices, "height", heightKey)} />
                  </td>
                  <td>{v.height_erected}</td>
                  <td>
                    {v.head_load}
                    <PriceCell price={findPrice(characteristicPrices, "head_load", v.head_load)} />
                  </td>
                  <td>
                    {v.wind_area}
                    <PriceCell price={findPrice(characteristicPrices, "wind_area", v.wind_area)} />
                  </td>
                  <td>{v.wind_speed_operational}/{v.wind_speed_survival}</td>
                  <td>{v.sway}</td>
                  <td>
                    {v.weight}
                    <PriceCell price={findPrice(characteristicPrices, "weight", v.weight)} />
                  </td>
                  <td>
                    {v.sections}
                    <PriceCell price={findPrice(characteristicPrices, "sections", v.sections)} />
                  </td>
                  <td>
                    {v.tube_dia}
                    <PriceCell price={findPrice(characteristicPrices, "tube_dia", v.tube_dia?.replace(/\s/g, ""))} />
                  </td>
                  <td>
                    {v.guy_ropes}
                    <PriceCell price={findPrice(characteristicPrices, "guy_ropes_ground", v.guy_ropes?.replace(/\s/g, ""))} />
                  </td>
                  <td>
                    {v.tripod_weight}
                    <PriceCell price={findPrice(characteristicPrices, "tripod_weight", v.tripod_weight)} />
                  </td>
                </tr>
              );
            })}
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
