
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Smile, Send } from "lucide-react";

interface CreatePostCardProps {
  user: any;
  newPost: string;
  setNewPost: (value: string) => void;
  onCreatePost: () => void;
}

const CreatePostCard = ({ user, newPost, setNewPost, onCreatePost }: CreatePostCardProps) => {
  return (
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
                onClick={onCreatePost}
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
  );
};

export default CreatePostCard;
