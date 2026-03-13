
CREATE TABLE public.characteristic_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_category_id uuid NOT NULL REFERENCES public.sub_categories(id) ON DELETE CASCADE,
  characteristic_key text NOT NULL,
  characteristic_label text NOT NULL,
  option_value text NOT NULL,
  option_label text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  is_customizable boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.characteristic_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view characteristic_prices" ON public.characteristic_prices FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert characteristic_prices" ON public.characteristic_prices FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update characteristic_prices" ON public.characteristic_prices FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete characteristic_prices" ON public.characteristic_prices FOR DELETE TO public USING (true);

CREATE TRIGGER update_characteristic_prices_updated_at
  BEFORE UPDATE ON public.characteristic_prices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
