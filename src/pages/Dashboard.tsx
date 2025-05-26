
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, BookOpen, MessageCircle, Bot, BarChart3, Users, TrendingUp, DollarSign, Eye, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { 
      title: "Total Revenue", 
      value: "$12,484", 
      change: "+12.5%", 
      icon: DollarSign, 
      color: "text-green-500" 
    },
    { 
      title: "Blog Views", 
      value: "8,429", 
      change: "+8.2%", 
      icon: Eye, 
      color: "text-blue-500" 
    },
    { 
      title: "Social Followers", 
      value: "2,156", 
      change: "+15.3%", 
      icon: Users, 
      color: "text-purple-500" 
    },
    { 
      title: "AI Generations", 
      value: "1,247", 
      change: "+23.1%", 
      icon: Bot, 
      color: "text-orange-500" 
    },
  ];

  const recentActivity = [
    { type: "sale", message: "New order #1234 - $89.99", time: "2 minutes ago", icon: ShoppingCart },
    { type: "blog", message: "Blog post published: 'AI in 2025'", time: "1 hour ago", icon: BookOpen },
    { type: "social", message: "Your post received 50 likes", time: "3 hours ago", icon: Heart },
    { type: "ai", message: "AI image generated successfully", time: "5 hours ago", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Welcome back, Creator! 
              </span>
            </h1>
            <p className="text-white/70 text-lg">
              Here's what's happening in your universe today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.title} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <p className="text-xs text-green-400">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/10 border-white/20 p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="shop" 
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                E-commerce
              </TabsTrigger>
              <TabsTrigger 
                value="blog" 
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                Blog
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                Social
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-white/70">
                      Your latest updates across all platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <activity.icon className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{activity.message}</p>
                          <p className="text-white/60 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription className="text-white/70">
                      Jump right into creating and managing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add New Product
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Write Blog Post
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Create Social Post
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                      <Bot className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shop" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    E-commerce Dashboard
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Manage your online store and track sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">E-commerce Module</h3>
                    <p className="text-white/70 mb-6">
                      Complete product management, inventory tracking, and order processing coming soon.
                    </p>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      Coming Soon
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Blog Management
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Create and manage your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Blog CMS</h3>
                    <p className="text-white/70 mb-6">
                      Rich text editor, SEO optimization, and content analytics coming soon.
                    </p>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      Coming Soon
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Social Hub
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Connect and engage with your community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Social Features</h3>
                    <p className="text-white/70 mb-6">
                      Real-time chat, posts, followers, and social analytics coming soon.
                    </p>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      Coming Soon
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
