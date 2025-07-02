
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp } from "lucide-react";

interface SocialSidebarProps {
  suggestedUsers: any[];
}

const SocialSidebar = ({ suggestedUsers }: SocialSidebarProps) => {
  const trendingTopics = [
    { name: "#AIRevolution", posts: "12.3K posts" },
    { name: "#WebDevelopment", posts: "8.7K posts" },
    { name: "#StartupLife", posts: "5.4K posts" },
    { name: "#DesignTrends", posts: "3.2K posts" },
    { name: "#TechNews", posts: "15.6K posts" }
  ];

  return (
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
  );
};

export default SocialSidebar;
