
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SocialSidebar from "@/components/social/SocialSidebar";
import CreatePostCard from "@/components/social/CreatePostCard";
import PostsFeed from "@/components/social/PostsFeed";
import ActivitySidebar from "@/components/social/ActivitySidebar";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  post_likes?: { user_id: string }[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const Social = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const userIds = postsData?.map(post => post.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const postIds = postsData?.map(post => post.id) || [];
      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('*')
        .in('post_id', postIds);

      if (likesError) throw likesError;

      const enrichedPosts = postsData?.map(post => {
        const profile = profilesData?.find(p => p.id === post.user_id);
        const postLikes = likesData?.filter(like => like.post_id === post.id) || [];
        
        return {
          ...post,
          profiles: profile ? {
            full_name: profile.full_name,
            username: profile.username,
            avatar_url: profile.avatar_url
          } : undefined,
          post_likes: postLikes
        };
      }) || [];

      setPosts(enrichedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const { data: newUsers, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSuggestedUsers(newUsers || []);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSuggestedUsers();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content: newPost,
          likes_count: 0,
          comments_count: 0
        });

      if (error) throw error;

      setNewPost("");
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleToggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (!comments[postId]) {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]?.trim() || !user) return;

    try {
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const handleShare = (postId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SocialSidebar suggestedUsers={suggestedUsers} />

          <div className="lg:col-span-2">
            <CreatePostCard 
              user={user}
              newPost={newPost}
              setNewPost={setNewPost}
              onCreatePost={handleCreatePost}
            />

            <PostsFeed 
              posts={posts}
              loading={loading}
              user={user}
              showComments={showComments}
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onLikePost={handleLikePost}
              onToggleComments={handleToggleComments}
              onAddComment={handleAddComment}
              onShare={handleShare}
            />
          </div>

          <ActivitySidebar />
        </div>
      </div>
    </div>
  );
};

export default Social;
