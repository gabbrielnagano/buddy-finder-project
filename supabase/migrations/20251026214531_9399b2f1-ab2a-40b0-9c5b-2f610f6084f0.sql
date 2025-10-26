-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('pequeno', 'medio', 'grande')),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  owner_id UUID NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view available pets"
  ON public.pets
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Authenticated users can create pets"
  ON public.pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their pets"
  ON public.pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their pets"
  ON public.pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true);

-- Storage policies
CREATE POLICY "Pet images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pet-images');

CREATE POLICY "Authenticated users can upload pet images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pet-images');

CREATE POLICY "Users can update their pet images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'pet-images');

CREATE POLICY "Users can delete their pet images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'pet-images');