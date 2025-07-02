
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Users, MessageCircle, User, Bot, ShoppingBag, BookOpen, CreditCard, Sparkles, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/shop/CartContext";
import { AuthButton } from "@/components/auth/AuthButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { getItemCount } = useCart();

  // Handle mouse movement to show/hide navbar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show navbar when mouse is within 100px of the top
      if (e.clientY <= 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Social", href: "/social", icon: Users },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "AI Chat", href: "/ai-chat", icon: Bot },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Pricing", href: "/pricing", icon: CreditCard }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Invisible hover trigger area at the top */}
      <div className="fixed top-0 left-0 right-0 h-20 z-40 pointer-events-none" />
      
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-white font-bold text-xl">SocialAI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={`text-white hover:text-purple-300 ${
                      isActive(item.href) ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-white hover:text-purple-300 relative">
                <Link to="/cart" className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
              </Button>
              {user && (
                <Button asChild variant="ghost" className="text-white hover:text-purple-300">
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </Button>
              )}
              <AuthButton />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900/95 backdrop-blur-lg border-white/10">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.name}
                          asChild
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className={`justify-start text-white ${
                            isActive(item.href) ? "bg-white/20" : "hover:bg-white/10"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to={item.href} className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        </Button>
                      );
                    })}
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start text-white hover:bg-white/10 relative"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/cart" className="flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Cart</span>
                        {getItemCount() > 0 && (
                          <span className="ml-auto bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {getItemCount()}
                          </span>
                        )}
                      </Link>
                    </Button>
                    {user && (
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start text-white hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link to="/profile" className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                      </Button>
                    )}
                    <div className="pt-4 border-t border-white/10">
                      <AuthButton />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
