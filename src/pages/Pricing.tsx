
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const pricingPlans = [
  {
    name: "Basic",
    price: "₹799",
    amount: 799,
    planId: "plan_basic_monthly",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Up to 100 AI chats per month",
      "Basic image generation",
      "Standard support",
      "Friend messaging",
      "Profile customization"
    ]
  },
  {
    name: "Pro",
    price: "₹1,599",
    amount: 1599,
    planId: "plan_pro_monthly",
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    features: [
      "Unlimited AI chats",
      "Advanced image generation",
      "Priority support",
      "Group chats",
      "Advanced profile features",
      "Export conversations"
    ]
  },
  {
    name: "Enterprise",
    price: "₹3,999",
    amount: 3999,
    planId: "plan_enterprise_monthly",
    icon: <Star className="w-6 h-6" />,
    features: [
      "Everything in Pro",
      "Custom AI models",
      "API access",
      "Team management",
      "Analytics dashboard",
      "24/7 phone support"
    ]
  }
];

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId: string, planName: string, amount: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive"
      });
      return;
    }

    setLoading(planId);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { 
          planId, 
          planName,
          amount,
          period: "monthly"
        }
      });

      if (error) throw error;

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Your App',
        description: `${planName} Subscription`,
        subscription_id: data.subscriptionId,
        handler: function (response: any) {
          toast({
            title: "Subscription Successful!",
            description: `Welcome to ${planName}! Payment ID: ${response.razorpay_payment_id}`,
          });
          // Redirect to success page
          window.location.href = '/subscription-success';
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#8B5CF6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-white/70 text-lg mb-12">
              Unlock the full potential of our AI-powered social platform
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`bg-white/10 backdrop-blur-sm border-white/20 relative ${
                    plan.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-fit">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <div className="text-white text-3xl font-bold">{plan.price}</div>
                    <div className="text-white/60">per month</div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-white/80">
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSubscribe(plan.planId, plan.name, plan.amount)}
                      disabled={loading === plan.planId}
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' 
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {loading === plan.planId ? "Processing..." : `Subscribe to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Pricing;
