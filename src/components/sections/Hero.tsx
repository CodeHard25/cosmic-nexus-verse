
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Zap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">
              The Complete Digital Ecosystem
            </span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              UniVerse
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            E-commerce, Social Media, Blogging, AI Tools, and Analytics — all in one powerful platform.
            <br />
            <span className="text-lg text-white/60">Built for creators, entrepreneurs, and innovators.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/auth?tab=register")}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/demo")}
            >
              <Globe className="w-5 h-5 mr-2" />
              Explore Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "🛒", label: "E-commerce", desc: "Sell anything" },
              { icon: "📝", label: "Blog CMS", desc: "Share stories" },
              { icon: "💬", label: "Social Hub", desc: "Connect & chat" },
              { icon: "🤖", label: "AI Tools", desc: "Smart features" },
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-1">{feature.label}</h3>
                <p className="text-white/60 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/60" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
