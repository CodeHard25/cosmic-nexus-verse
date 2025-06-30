
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminPanel } from "@/components/admin/AdminPanel";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { role, isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="pt-24">
          {isAdmin ? (
            <AdminPanel />
          ) : (
            <div className="container mx-auto px-4 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">User Dashboard</h1>
                <p className="text-white/70">Welcome back, {user?.user_metadata?.full_name || 'User'}!</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    {role?.charAt(0).toUpperCase() + role?.slice(1)} User
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Social Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">Connect with friends and share updates</p>
                    <Button asChild className="w-full">
                      <Link to="/social">Go to Social</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      AI Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">Access powerful AI generation tools</p>
                    <Button asChild className="w-full">
                      <Link to="/ai-tools">Explore AI Tools</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">Manage your account settings</p>
                    <Button asChild className="w-full">
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
