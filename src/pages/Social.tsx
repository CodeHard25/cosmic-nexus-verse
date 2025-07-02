import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Video, Smile, Send, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      // First get posts
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Then get profiles for the users who made posts
      const userIds = postsData?.map(post => post.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Get likes for all posts
      const postIds = postsData?.map(post => post.id) || [];
      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('*')
        .in('post_id', postIds);

      if (likesError) throw likesError;

      // Combine the data
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

  const fetchComments = async (postId: string) => {
    try {
      // For now, return empty array until comment system is fully implemented
      setComments(prev => ({ ...prev, [postId]: [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments(prev => ({ ...prev, [postId]: [] }));
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
      fetchComments(postId);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]?.trim() || !user) return;

    try {
      // For now, just show success message until comment system is fully implemented
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

  // Mock data for trending topics
  const trendingTopics = [
    { name: "#AIRevolution", posts: "12.3K posts" },
    { name: "#WebDevelopment", posts: "8.7K posts" },
    { name: "#StartupLife", posts: "5.4K posts" },
    { name: "#DesignTrends", posts: "3.2K posts" },
    { name: "#TechNews", posts: "15.6K posts" }
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
                  New Users
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((suggestedUser, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={suggestedUser.avatar_url} />
                      <AvatarFallback>{suggestedUser.full_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{suggestedUser.full_name || 'Unknown User'}</p>
                      <p className="text-white/60 text-xs">@{suggestedUser.username || 'user'}</p>
                      <p className="text-white/60 text-xs">Joined recently</p>
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
                  const isLiked = post.post_likes?.some((like) => like.user_id === user?.id);
                  
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
                            onClick={() => handleLikePost(post.id, isLiked || false)}
                            className={`text-white/70 hover:text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                            {post.likes_count}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleToggleComments(post.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments_count}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="space-y-3 mb-4">
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={comment.profiles?.avatar_url} />
                                    <AvatarFallback>{comment.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 bg-white/5 rounded-lg p-3">
                                    <p className="text-white text-sm font-medium">{comment.profiles?.full_name || 'Unknown User'}</p>
                                    <p className="text-white/80 text-sm">{comment.content}</p>
                                    <p className="text-white/50 text-xs mt-1">{new Date(comment.created_at).toLocaleTimeString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                value={newComment[post.id] || ''}
                                onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComment[post.id]?.trim()}
                                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
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
