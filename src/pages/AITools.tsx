
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, FileText, Image, Code } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EnhancedTextGenerator } from "@/components/ai/EnhancedTextGenerator";
import { EnhancedImageGenerator } from "@/components/ai/EnhancedImageGenerator";

const AITools = () => {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              AI Tools Hub
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powered by OpenAI's latest models including GPT-4 and DALL-E 3
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20 max-w-md mx-auto">
              <TabsTrigger value="text" className="data-[state=active]:bg-white/20 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Text & Code
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-white/20 text-white">
                <Image className="w-4 h-4 mr-2" />
                Image Generation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-8">
              <EnhancedTextGenerator />
            </TabsContent>

            <TabsContent value="image" className="mt-8">
              <EnhancedImageGenerator />
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">
                  Check out our AI Chat for conversational assistance with any questions!
                </p>
                <div className="text-center">
                  <a
                    href="/ai-chat"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    Try AI Chat
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AITools;
