import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Video, Smile, Send, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Social = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('social_posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            avatar_url
          ),
          post_likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const { error } = await (supabase as any)
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
        await (supabase as any)
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await (supabase as any)
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

  // Mock data for trending and suggestions (replace with real data later)
  const trendingTopics = [
    { name: "#AIRevolution", posts: "12.3K posts" },
    { name: "#WebDevelopment", posts: "8.7K posts" },
    { name: "#StartupLife", posts: "5.4K posts" },
    { name: "#DesignTrends", posts: "3.2K posts" },
    { name: "#TechNews", posts: "15.6K posts" }
  ];

  const suggestedUsers = [
    {
      name: "John Doe",
      username: "@johndoe",
      avatar: "/placeholder.svg",
      followers: "2.3K",
      bio: "Full-stack developer & AI enthusiast"
    },
    {
      name: "Marie Claire",
      username: "@marieclaire",
      avatar: "/placeholder.svg",
      followers: "1.8K",
      bio: "UX Designer at TechCorp"
    },
    {
      name: "DevGuru",
      username: "@devguru",
      avatar: "/placeholder.svg",
      followers: "5.1K",
      bio: "Teaching code to the world"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Trending */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardHeader>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="cursor-pointer hover:bg-white/5 p-2 rounded">
                    <p className="text-purple-400 font-medium">{topic.name}</p>
                    <p className="text-white/60 text-sm">{topic.posts}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Suggested for You
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((suggestedUser, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={suggestedUser.avatar} />
                      <AvatarFallback>{suggestedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{suggestedUser.name}</p>
                      <p className="text-white/60 text-xs">{suggestedUser.username}</p>
                      <p className="text-white/50 text-xs mt-1 line-clamp-2">{suggestedUser.bio}</p>
                      <p className="text-white/60 text-xs">{suggestedUser.followers} followers</p>
                    </div>
                    <Button size="sm" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{user?.user_metadata?.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's happening in your universe?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={handleCreatePost}
                        disabled={!newPost.trim()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {loading ? (
              <div className="text-center text-white">Loading posts...</div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => {
                  const isLiked = post.post_likes?.some((like: any) => like.user_id === user?.id);
                  
                  return (
                    <Card key={post.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={post.profiles?.avatar_url} />
                              <AvatarFallback>{post.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium">
                                  {post.profiles?.full_name || 'Unknown User'}
                                </p>
                              </div>
                              <p className="text-white/60 text-sm">
                                @{post.profiles?.username || 'user'} • {new Date(post.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-white mb-4">{post.content}</p>
                        
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt="Post image"
                            className="w-full h-64 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id, isLiked)}
                            className={`text-white/70 hover:text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                            {post.post_likes?.length || 0}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments_count}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {posts.length === 0 && (
                  <div className="text-center text-white/70 py-8">
                    No posts yet. Be the first to share something!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Activity */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-white font-semibold">Recent Activity</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="text-white/70">
                    Welcome to UniVerse! Start connecting with others.
                  </p>
                  <p className="text-white/50 text-xs">Just now</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
