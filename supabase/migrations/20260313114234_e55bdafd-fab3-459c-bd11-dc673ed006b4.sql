
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sub_categories table
CREATE TABLE public.sub_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Create product_variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sub_category_id UUID NOT NULL REFERENCES public.sub_categories(id) ON DELETE CASCADE,
  model_no TEXT NOT NULL UNIQUE,
  height_retracted NUMERIC NOT NULL DEFAULT 0,
  height_erected NUMERIC NOT NULL DEFAULT 0,
  head_load NUMERIC NOT NULL DEFAULT 0,
  wind_area NUMERIC NOT NULL DEFAULT 0,
  wind_speed_operational NUMERIC NOT NULL DEFAULT 0,
  wind_speed_survival NUMERIC NOT NULL DEFAULT 0,
  sway TEXT NOT NULL DEFAULT '',
  weight NUMERIC NOT NULL DEFAULT 0,
  sections INT NOT NULL DEFAULT 1,
  tube_dia TEXT NOT NULL DEFAULT '',
  guy_ropes TEXT NOT NULL DEFAULT '',
  tripod_weight NUMERIC NOT NULL DEFAULT 0,
  base_price NUMERIC NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 1,
  message TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  product_model TEXT NOT NULL,
  estimated_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Public read access for product data
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view sub_categories" ON public.sub_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view product_variants" ON public.product_variants FOR SELECT USING (true);

-- Anyone can submit quotes
CREATE POLICY "Anyone can submit quotes" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Anyone can update quotes" ON public.quotes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete quotes" ON public.quotes FOR DELETE USING (true);

-- Full CRUD for product tables
CREATE POLICY "Anyone can insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Anyone can insert sub_categories" ON public.sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sub_categories" ON public.sub_categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sub_categories" ON public.sub_categories FOR DELETE USING (true);

CREATE POLICY "Anyone can insert product_variants" ON public.product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product_variants" ON public.product_variants FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete product_variants" ON public.product_variants FOR DELETE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sub_categories_updated_at BEFORE UPDATE ON public.sub_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
