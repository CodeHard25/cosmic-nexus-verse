
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Bot, Code, Image as ImageIcon, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
}

const AiChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const sendChatMessage = async (isCodeRequest = false) => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { 
          message: currentMessage,
          isCodeRequest 
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || 'No response received',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Track AI generation
      await supabase
        .from('ai_generations')
        .insert({
          user_id: user?.id,
          type: isCodeRequest ? 'code' : 'text',
          tokens_used: data.tokens_used || 0
        });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;

    setGeneratingImage(true);
    const currentPrompt = imagePrompt;

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: currentPrompt,
          size: "1024x1024"
        }
      });

      if (error) {
        console.error('Image generation error:', error);
        throw error;
      }

      const imageMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Generated image: "${currentPrompt}"`,
        isUser: false,
        timestamp: new Date(),
        imageUrl: data.imageUrl || data.url
      };

      setMessages(prev => [...prev, imageMessage]);
      setImagePrompt("");

      // Track AI generation
      await supabase
        .from('ai_generations')
        .insert({
          user_id: user?.id,
          type: 'image',
          tokens_used: 0
        });

      toast({
        title: "Success",
        description: "Image generated successfully!"
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              AI Assistant
            </h1>
            
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="chat">
                  <Bot className="w-4 h-4 mr-2" />
                  General Chat
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="w-4 h-4 mr-2" />
                  Code Assistant
                </TabsTrigger>
                <TabsTrigger value="image">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image Generator
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-[calc(100vh-16rem)]">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Messages */}
                    <ScrollArea className="flex-1 pr-4 mb-4">
                      <div className="space-y-4">
                        {messages.length === 0 && (
                          <div className="text-center text-white/70 py-8">
                            <Bot className="w-12 h-12 mx-auto mb-4" />
                            <p>Start a conversation with the AI assistant!</p>
                          </div>
                        )}
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {message.isUser ? user?.email?.[0]?.toUpperCase() || 'U' : <Bot className="w-4 h-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`rounded-lg p-3 ${
                                message.isUser 
                                  ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                                  : 'bg-white/20'
                              }`}>
                                <pre className="text-white text-sm whitespace-pre-wrap font-sans">
                                  {message.content}
                                </pre>
                                {message.imageUrl && (
                                  <img 
                                    src={message.imageUrl} 
                                    alt="Generated image"
                                    className="mt-2 rounded-lg max-w-full h-auto"
                                  />
                                )}
                                <p className="text-white/60 text-xs mt-2">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {loading && (
                          <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[80%]">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                              </Avatar>
                              <div className="bg-white/20 rounded-lg p-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <TabsContent value="chat" className="mt-0">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Ask me anything..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                          rows={2}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage())}
                        />
                        <Button
                          onClick={() => sendChatMessage()}
                          disabled={!newMessage.trim() || loading}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code" className="mt-0">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Ask me about coding, get code examples, or request help with debugging..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                          rows={2}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage(true))}
                        />
                        <Button
                          onClick={() => sendChatMessage(true)}
                          disabled={!newMessage.trim() || loading}
                          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                        >
                          <Code className="w-4 h-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="image" className="mt-0">
                      <div className="flex gap-2">
                        <Textarea
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          placeholder="Describe the image you want to generate..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                          rows={2}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateImage())}
                        />
                        <Button
                          onClick={generateImage}
                          disabled={!imagePrompt.trim() || generatingImage}
                          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                        >
                          {generatingImage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AiChat;
