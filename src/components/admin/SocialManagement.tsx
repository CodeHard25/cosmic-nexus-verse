
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Heart, Trash2, Flag } from 'lucide-react';

interface SocialPost {
  id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export const SocialManagement = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          id,
          content,
          likes_count,
          comments_count,
          created_at,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch social posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully"
      });

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-white">Loading social posts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Social Posts Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{post.profiles.full_name}</h4>
                  <p className="text-white/50 text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-white/80 mb-3">{post.content}</p>
              <div className="flex items-center space-x-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.likes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments_count || 0}
                </span>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center text-white/60 py-8">
              No social posts found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
