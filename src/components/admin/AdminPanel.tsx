
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, ShoppingCart, MessageSquare, Bot } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { BlogManagement } from './BlogManagement';
import { SocialManagement } from './SocialManagement';
import { AIUsageStats } from './AIUsageStats';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-white/70">Manage users, content, and platform features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
          <TabsTrigger value="users" className="data-[state=active]:bg-white/20 text-white">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="blogs" className="data-[state=active]:bg-white/20 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Blogs
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white/20 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-white/20 text-white">
            <Bot className="w-4 h-4 mr-2" />
            AI Usage
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white/20 text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="blogs" className="mt-6">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialManagement />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AIUsageStats />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">Order management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
