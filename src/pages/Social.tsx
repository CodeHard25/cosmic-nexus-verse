
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Video, Smile, Send, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Social = () => {
  const [newPost, setNewPost] = useState("");

  // Mock social data
  const posts = [
    {
      id: 1,
      author: {
        name: "Alex Rivera",
        username: "@alexr",
        avatar: "/placeholder.svg",
        verified: true
      },
      content: "Just launched my new AI-powered app! 🚀 Amazing what we can build with modern tools. The future is here and it's incredibly exciting. #AI #Innovation #TechLife",
      timestamp: "2 hours ago",
      likes: 156,
      comments: 23,
      shares: 12,
      image: "/placeholder.svg",
      liked: false
    },
    {
      id: 2,
      author: {
        name: "Sarah Design",
        username: "@sarahdesigns",
        avatar: "/placeholder.svg",
        verified: false
      },
      content: "Working on some new UI concepts for mobile apps. Clean, minimal, and user-focused. What do you think about the latest design trends?",
      timestamp: "4 hours ago",
      likes: 89,
      comments: 15,
      shares: 7,
      liked: true
    },
    {
      id: 3,
      author: {
        name: "Tech Insights",
        username: "@techinsights",
        avatar: "/placeholder.svg",
        verified: true
      },
      content: "The rise of decentralized applications is reshaping how we think about data ownership and privacy. What are your thoughts on the future of Web3?",
      timestamp: "6 hours ago",
      likes: 234,
      comments: 45,
      shares: 28,
      liked: false
    }
  ];

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
                {suggestedUsers.map((user, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-white/60 text-xs">{user.username}</p>
                      <p className="text-white/50 text-xs mt-1 line-clamp-2">{user.bio}</p>
                      <p className="text-white/60 text-xs">{user.followers} followers</p>
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
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>You</AvatarFallback>
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
                      <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{post.author.name}</p>
                            {post.author.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{post.author.username} • {post.timestamp}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-white mb-4">{post.content}</p>
                    
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-white/70 hover:text-white hover:bg-white/10 ${post.liked ? 'text-red-400' : ''}`}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                        <Share2 className="w-4 h-4 mr-2" />
                        {post.shares}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                    <span className="text-white font-medium">Sarah Design</span> liked your post
                  </p>
                  <p className="text-white/50 text-xs">2 minutes ago</p>
                </div>
                
                <div className="text-sm">
                  <p className="text-white/70">
                    <span className="text-white font-medium">Tech Insights</span> started following you
                  </p>
                  <p className="text-white/50 text-xs">1 hour ago</p>
                </div>
                
                <div className="text-sm">
                  <p className="text-white/70">
                    <span className="text-white font-medium">Alex Rivera</span> commented on your post
                  </p>
                  <p className="text-white/50 text-xs">3 hours ago</p>
                </div>
                
                <div className="text-sm">
                  <p className="text-white/70">
                    You have <span className="text-white font-medium">5 new</span> friend requests
                  </p>
                  <p className="text-white/50 text-xs">5 hours ago</p>
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
