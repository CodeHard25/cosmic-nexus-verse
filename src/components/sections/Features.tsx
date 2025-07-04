
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, BookOpen, MessageCircle, Bot, BarChart3, Shield, Users, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "E-commerce Powerhouse",
      description: "Complete online store with product management, cart, checkout, and payment processing.",
      badges: ["Stripe", "Inventory", "Orders"],
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: BookOpen,
      title: "Advanced Blog CMS",
      description: "Rich text editor, categories, tags, comments, and SEO optimization for content creators.",
      badges: ["Rich Editor", "SEO", "Analytics"],
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: MessageCircle,
      title: "Social Media Hub",
      description: "Connect with others, share posts, real-time chat, and build your community.",
      badges: ["Real-time", "Posts", "Chat"],
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Bot,
      title: "AI Tools Integration",
      description: "Text generation, image creation, and code assistance powered by cutting-edge AI.",
      badges: ["OpenAI", "Stable Diffusion", "Smart"],
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your business, content, and user engagement.",
      badges: ["Charts", "Insights", "Reports"],
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "JWT authentication, role-based access, rate limiting, and data protection.",
      badges: ["JWT", "RBAC", "Secure"],
      gradient: "from-slate-500 to-gray-600"
    }
  ];

  return (
    <section className="py-12 sm:py-24 px-4">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/20 mb-4 sm:mb-6">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-white/90 text-xs sm:text-sm font-medium">Everything You Need</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto px-4">
            From e-commerce to AI tools, UniVerse provides everything you need to build and scale your digital presence.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-white/70 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {feature.badges.map((badge) => (
                    <Badge 
                      key={badge}
                      variant="secondary"
                      className="bg-white/10 text-white/90 border-white/20 hover:bg-white/20 transition-colors text-xs"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {[
            { number: "10+", label: "Core Features" },
            { number: "100%", label: "Mobile Ready" },
            { number: "24/7", label: "AI Powered" },
            { number: "∞", label: "Possibilities" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-white/70 font-medium text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
