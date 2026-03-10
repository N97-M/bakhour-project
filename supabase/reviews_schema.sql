-- Create Reviews Table
CREATE TABLE public.reviews (
    review_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id INTEGER NOT NULL, -- Assuming your products use integer IDs from the mock data
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID, -- Optional foreign key to verify purchase
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    image_urls TEXT[] DEFAULT '{}',
    user_name TEXT,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified_purchase BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Setup Storage for Review Images
INSERT INTO storage.buckets (id, name, public) VALUES ('review_images', 'review_images', true);

-- Storage Policies
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'review_images');

CREATE POLICY "Authenticated users can upload review images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'review_images');
