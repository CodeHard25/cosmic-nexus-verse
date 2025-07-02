
-- Update the user with admin rights
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::user_role_enum 
FROM auth.users 
WHERE email = 'hardiktyagi007@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::user_role_enum;

-- Add excerpt column to blogs table for better display
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Update blogs RLS policies to allow public reading of published blogs
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
CREATE POLICY "Anyone can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (published = true);

-- Allow authenticated users to create their own blogs
CREATE POLICY "Users can create their own blogs" 
  ON public.blogs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own blogs
CREATE POLICY "Users can update their own blogs" 
  ON public.blogs 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Allow users to delete their own blogs
CREATE POLICY "Users can delete their own blogs" 
  ON public.blogs 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Add RLS policies for chat functionality
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies
CREATE POLICY "Users can view rooms they participate in" 
  ON public.chat_rooms 
  FOR SELECT 
  TO authenticated
  USING (
    id IN (
      SELECT room_id FROM public.chat_participants WHERE user_id = auth.uid()
    )
  );

-- Messages policies  
CREATE POLICY "Users can view messages in their rooms" 
  ON public.messages 
  FOR SELECT 
  TO authenticated
  USING (
    room_id IN (
      SELECT room_id FROM public.chat_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their rooms" 
  ON public.messages 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    room_id IN (
      SELECT room_id FROM public.chat_participants WHERE user_id = auth.uid()
    )
  );

-- Chat participants policies
CREATE POLICY "Users can view participants in their rooms" 
  ON public.chat_participants 
  FOR SELECT 
  TO authenticated
  USING (
    room_id IN (
      SELECT room_id FROM public.chat_participants WHERE user_id = auth.uid()
    )
  );

-- Add comments table for blog posts
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments" 
  ON public.post_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON public.post_comments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.post_comments 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.post_comments 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);
