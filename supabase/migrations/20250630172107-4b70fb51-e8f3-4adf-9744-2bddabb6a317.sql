
-- Create user_roles table with proper enum type
CREATE TYPE public.user_role_enum AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  USING (true);

-- Create blogs table for the admin panel
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Authors can manage their blogs" 
  ON public.blogs 
  FOR ALL 
  USING (auth.uid() = author_id);

-- Create AI generations table for tracking usage
CREATE TABLE public.ai_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'code', 'image')),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for ai_generations
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generations" 
  ON public.ai_generations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations" 
  ON public.ai_generations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Fix the accept_friend_request function to handle UUID properly
CREATE OR REPLACE FUNCTION accept_friend_request(request_id UUID)
RETURNS VOID AS $$
DECLARE
  req RECORD;
  new_room_id UUID;
BEGIN
  -- Get the friend request
  SELECT * INTO req FROM public.friend_requests WHERE id = request_id AND receiver_id = auth.uid();
  
  IF req IS NULL THEN
    RAISE EXCEPTION 'Friend request not found or unauthorized';
  END IF;
  
  -- Update request status
  UPDATE public.friend_requests SET status = 'accepted', updated_at = now() WHERE id = request_id;
  
  -- Create friendship (ensure user1_id < user2_id for uniqueness)
  INSERT INTO public.friendships (user1_id, user2_id)
  VALUES (
    LEAST(req.sender_id, req.receiver_id),
    GREATEST(req.sender_id, req.receiver_id)
  );
  
  -- Create a chat room for the two friends and get the UUID
  INSERT INTO public.chat_rooms (created_by, is_group)
  VALUES (auth.uid(), false)
  RETURNING id INTO new_room_id;
  
  -- Add both users to the chat room using the returned UUID
  INSERT INTO public.chat_participants (room_id, user_id)
  VALUES 
    (new_room_id, req.sender_id),
    (new_room_id, req.receiver_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign user role when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'preferred_username',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Also create default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;
