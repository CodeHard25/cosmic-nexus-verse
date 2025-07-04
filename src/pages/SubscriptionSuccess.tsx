
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('razorpay_payment_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-green-500 rounded-full w-fit">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-white text-3xl">Subscription Successful!</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-white/80 text-lg">
                Welcome to your premium plan! Your subscription has been activated successfully.
              </p>
              
              {paymentId && (
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-2">Payment ID:</p>
                  <p className="text-white font-mono text-sm break-all">{paymentId}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
