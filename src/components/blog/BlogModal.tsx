
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
}

const BlogModal = ({ post, isOpen, onClose, onLike }: BlogModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white mb-4">{post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <p className="text-white/60 text-sm">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-500/80 text-white">{post.category}</Badge>
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-white/10 border-white/20 text-white">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-white/80 leading-relaxed">{post.content}</p>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={() => onLike(post.id)}
              className="text-white/70 hover:text-red-400 hover:bg-white/10"
            >
              <Heart className="w-4 h-4 mr-2" />
              {post.likes} Likes
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {post.comments} Comments
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;
