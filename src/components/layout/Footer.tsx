
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                UniVerse
              </span>
            </Link>
            <p className="text-white/70 mb-6 max-w-md text-sm sm:text-base">
              The complete digital ecosystem for modern creators and entrepreneurs. Build, connect, and grow with powerful integrated tools.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-10 h-10">
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-10 h-10">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-10 h-10">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Links sections */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Platform</h3>
            <ul className="space-y-2">
              {["Shop", "Blog", "Social", "AI Tools", "Dashboard"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="text-white/70 hover:text-white transition-colors text-sm sm:text-base">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Support</h3>
            <ul className="space-y-2">
              {["Documentation", "Help Center", "Contact", "Status", "Privacy"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors text-sm sm:text-base">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
            © 2025 UniVerse. Built with ❤️ for creators and innovators.
          </p>
          <div className="text-center sm:text-right">
            <p className="text-white/60 text-xs sm:text-sm">
              Powered by React, Node.js, and AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
