
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";

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

interface PostsFeedProps {
  posts: Post[];
  loading: boolean;
  user: any;
  showComments: { [key: string]: boolean };
  comments: { [key: string]: Comment[] };
  newComment: { [key: string]: string };
  setNewComment: (value: { [key: string]: string }) => void;
  onLikePost: (postId: string, isLiked: boolean) => void;
  onToggleComments: (postId: string) => void;
  onAddComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const PostsFeed = ({ 
  posts, 
  loading, 
  user, 
  showComments, 
  comments, 
  newComment, 
  setNewComment,
  onLikePost,
  onToggleComments,
  onAddComment,
  onShare
}: PostsFeedProps) => {
  if (loading) {
    return <div className="text-center text-white">Loading posts...</div>;
  }

  return (
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
                  onClick={() => onLikePost(post.id, isLiked || false)}
                  className={`text-white/70 hover:text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {post.likes_count}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => onToggleComments(post.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.comments_count}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => onShare(post.id)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

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
                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      onKeyPress={(e) => e.key === 'Enter' && onAddComment(post.id)}
                    />
                    <Button
                      size="sm"
                      onClick={() => onAddComment(post.id)}
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
  );
};

export default PostsFeed;
