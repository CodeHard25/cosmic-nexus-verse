
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, MessageCircle, Heart, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  image: string;
}

interface BlogCardProps {
  post: BlogPost;
  onLike: (id: string) => void;
  onReadMore: (post: BlogPost) => void;
}

const BlogCard = ({ post, onLike, onReadMore }: BlogCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 left-2 bg-blue-500/80 text-white">
            {post.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-white mb-2 line-clamp-2">{post.title}</CardTitle>
        <CardDescription className="text-white/70 mb-3 line-clamp-3">
          {post.excerpt}
        </CardDescription>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="text-xs">{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white/80 text-sm">{post.author.name}</span>
        </div>

        <div className="flex items-center justify-between text-white/60 text-sm mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <span>{post.readTime}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <button 
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 hover:text-red-400 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {post.likes}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onReadMore(post)}
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
