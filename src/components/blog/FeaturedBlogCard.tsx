
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  author: {
    full_name: string;
    avatar_url?: string;
  };
  likes: number;
  comments: number;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
}

interface FeaturedBlogCardProps {
  post: BlogPost;
  onReadMore: (post: BlogPost) => void;
}

const FeaturedBlogCard = ({ post, onReadMore }: FeaturedBlogCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <img
            src="/placeholder.svg"
            alt={post.title}
            className="w-full h-64 md:h-full object-cover rounded-l-lg"
          />
          <Badge className="absolute top-4 left-4 bg-purple-500/80 text-white">
            Featured
          </Badge>
        </div>
        <CardContent className="p-6">
          <Badge className="mb-3 bg-blue-500/80 text-white">
            Technology
          </Badge>
          <CardTitle className="text-2xl text-white mb-3">
            {post.title}
          </CardTitle>
          <CardDescription className="text-white/70 mb-4">
            {post.excerpt}
          </CardDescription>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.author.avatar_url} />
                <AvatarFallback>{post.author.full_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium">{post.author.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
          <Button 
            onClick={() => onReadMore(post)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Read More
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default FeaturedBlogCard;
