
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, BookOpen, MessageCircle, Bot, BarChart3, Users, TrendingUp, DollarSign, Eye, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/shop/CartContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { getItemCount, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: "Cart Total", 
      value: `$${getTotalPrice().toFixed(2)}`, 
      change: `${getItemCount()} items`, 
      icon: DollarSign, 
      color: "text-green-500" 
    },
    { 
      title: "Your Posts", 
      value: posts.length.toString(), 
      change: "Social posts", 
      icon: MessageCircle, 
      color: "text-blue-500" 
    },
    { 
      title: "Profile Views", 
      value: "156", 
      change: "+12% this week", 
      icon: Eye, 
      color: "text-purple-500" 
    },
    { 
      title: "AI Generations", 
      value: "23", 
      change: "This month", 
      icon: Bot, 
      color: "text-orange-500" 
    },
  ];

  const recentActivity = [
    { type: "cart", message: `${getItemCount()} items in your cart worth $${getTotalPrice().toFixed(2)}`, time: "Now", icon: ShoppingCart },
    { type: "social", message: `You have ${posts.length} posts published`, time: "Today", icon: MessageCircle },
    { type: "ai", message: "AI tools available for use", time: "Available", icon: Bot },
    { type: "blog", message: "Blog articles ready to read", time: "Updated", icon: BookOpen },
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
                Welcome back, {user?.user_metadata?.full_name || 'Creator'}! 
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
                  <p className="text-xs text-white/60">
                    {stat.change}
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
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Browse Shop
                    </Button>
                    <Button 
                      onClick={() => navigate('/blog')}
                      className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Blog Posts
                    </Button>
                    <Button 
                      onClick={() => navigate('/social')}
                      className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Create Social Post
                    </Button>
                    <Button 
                      onClick={() => navigate('/ai-tools')}
                      className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
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
                    Your Shopping Activity
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Track your purchases and cart items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {getItemCount() > 0 ? `${getItemCount()} items in cart` : 'Your cart is empty'}
                    </h3>
                    <p className="text-white/70 mb-6">
                      {getItemCount() > 0 
                        ? `Total value: $${getTotalPrice().toFixed(2)}` 
                        : 'Start shopping to see your items here'
                      }
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Go to Shop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Blog Activity
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Discover and read amazing content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Explore Our Blog</h3>
                    <p className="text-white/70 mb-6">
                      Discover insights, tutorials, and stories from our community.
                    </p>
                    <Button 
                      onClick={() => navigate('/blog')}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Read Articles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Your Social Activity
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Connect and engage with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {posts.length > 0 ? `You have ${posts.length} posts` : 'Start sharing your thoughts'}
                    </h3>
                    <p className="text-white/70 mb-6">
                      {posts.length > 0 
                        ? 'Keep engaging with the community!'
                        : 'Join the conversation and share your ideas with others.'
                      }
                    </p>
                    <Button 
                      onClick={() => navigate('/social')}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Go to Social
                    </Button>
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
