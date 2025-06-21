
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Wand2, Code, FileText, Image, Zap, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import TextGenerator from "@/components/ai/TextGenerator";
import CodeGenerator from "@/components/ai/CodeGenerator";

const AITools = () => {
  const [activeTab, setActiveTab] = useState("text");

  const aiTools = [
    {
      id: "text-generator",
      name: "AI Text Generator",
      description: "Generate high-quality content, articles, and copy with advanced AI",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      category: "Content"
    },
    {
      id: "image-generator",
      name: "AI Image Creator",
      description: "Create stunning images and artwork from text descriptions",
      icon: Image,
      gradient: "from-purple-500 to-pink-500",
      category: "Visual"
    },
    {
      id: "code-assistant",
      name: "Code Assistant",
      description: "Generate, debug, and optimize code in multiple programming languages",
      icon: Code,
      gradient: "from-green-500 to-emerald-500",
      category: "Development"
    },
    {
      id: "chat-bot",
      name: "AI Chat Assistant",
      description: "Intelligent conversational AI for questions and assistance",
      icon: Bot,
      gradient: "from-orange-500 to-red-500",
      category: "Assistant"
    },
    {
      id: "data-analyzer",
      name: "Data Analyzer",
      description: "Analyze and visualize complex datasets with AI insights",
      icon: Zap,
      gradient: "from-indigo-500 to-purple-500",
      category: "Analytics"
    },
    {
      id: "content-optimizer",
      name: "Content Optimizer",
      description: "Optimize content for SEO and engagement using AI",
      icon: Sparkles,
      gradient: "from-yellow-500 to-orange-500",
      category: "Marketing"
    }
  ];

  const recentGenerations = [
    { type: "Text", prompt: "Write a blog post about AI", timestamp: "2 minutes ago" },
    { type: "Image", prompt: "Futuristic cityscape at sunset", timestamp: "5 minutes ago" },
    { type: "Code", prompt: "React component for user profile", timestamp: "10 minutes ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            AI Tools Hub
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Unlock your creativity with our powerful AI-driven tools for content, code, and design
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Tools Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {aiTools.map((tool) => (
                <Card key={tool.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{tool.name}</CardTitle>
                    <CardDescription className="text-white/70">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                        {tool.category}
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab(tool.id.includes('text') ? 'text' : tool.id.includes('code') ? 'code' : 'image')}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Try Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Generation Interface */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  AI Generator
                </CardTitle>
                <CardDescription className="text-white/70">
                  Select a tool and start creating with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
                    <TabsTrigger value="text" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
                      Text Generator
                    </TabsTrigger>
                    <TabsTrigger value="image" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
                      Image Creator
                    </TabsTrigger>
                    <TabsTrigger value="code" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
                      Code Assistant
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-6">
                    <TextGenerator />
                  </TabsContent>

                  <TabsContent value="image" className="mt-6">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Image className="w-5 h-5" />
                          AI Image Creator
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center py-12">
                        <Image className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Image Generation</h3>
                        <p className="text-white/70 mb-6">
                          Advanced image generation coming soon with DALL-E integration.
                        </p>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          Coming Soon
                        </Badge>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="code" className="mt-6">
                    <CodeGenerator />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Generations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentGenerations.map((item, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                        {item.type}
                      </Badge>
                      <span className="text-white/60 text-xs">{item.timestamp}</span>
                    </div>
                    <p className="text-white/80 text-sm line-clamp-2">{item.prompt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Usage Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/80">Monthly Credits</span>
                    <span className="text-white">750/1000</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
