-- Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences Table
CREATE TABLE public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Art', 'Nature', 'Food', etc.
  host_id UUID REFERENCES public.profiles(id) NOT NULL,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES public.experiences(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  booking_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
