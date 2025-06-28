import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useWebSocket } from "@/hooks/useWebSocket";

interface ChatRoom {
  id: string;
  name?: string;  
  is_group: boolean;
  created_at: string;
  other_user?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatRooms = async () => {
    if (!user) return;

    try {
      // Get rooms where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('chat_participants')
        .select(`
          room_id,
          chat_rooms (*)
        `)
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      const rooms = participantData?.map(p => p.chat_rooms).filter(Boolean) || [];

      // For each room, get the other participants (for non-group chats)
      const enrichedRooms = await Promise.all(
        rooms.map(async (room: any) => {
          if (!room.is_group) {
            // Get the other participant
            const { data: otherParticipants } = await supabase
              .from('chat_participants')
              .select(`
                user_id,
                profiles (*)
              `)
              .eq('room_id', room.id)
              .neq('user_id', user.id);

            const otherUser = otherParticipants?.[0]?.profiles;
            return {
              ...room,
              other_user: otherUser
            };
          }
          return room;
        })
      );

      setChatRooms(enrichedRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      // First get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Then get the profile information for each unique sender
      const senderIds = [...new Set(messagesData?.map(msg => msg.sender_id) || [])];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', senderIds);

      if (profilesError) throw profilesError;

      // Combine messages with profile data
      const messagesWithProfiles = messagesData?.map(message => ({
        ...message,
        sender: profilesData?.find(profile => profile.id === message.sender_id)
      })) || [];

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const { sendMessage: sendWebSocketMessage, isConnected } = useWebSocket({
    roomId: selectedRoom?.id || '',
    onMessage: (data) => {
      if (data.type === 'new_message') {
        setMessages(prev => [...prev, data.message]);
      }
    }
  });

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    // Send via WebSocket for real-time delivery
    if (isConnected) {
      sendWebSocketMessage({
        type: 'chat_message',
        content: newMessage.trim(),
        message_type: 'text'
      });
      setNewMessage("");
    } else {
      // Fallback to direct database insert
      try {
        const { error } = await supabase
          .from('messages')
          .insert({
            room_id: selectedRoom.id,
            sender_id: user.id,
            content: newMessage.trim()
          });

        if (error) throw error;

        setNewMessage("");
        fetchMessages(selectedRoom.id);
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
      
      // Set up real-time subscription for messages
      const channel = supabase
        .channel(`room_${selectedRoom.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${selectedRoom.id}`
          },
          () => {
            fetchMessages(selectedRoom.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRoom]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navbar />
          <div className="container mx-auto px-4 pt-24 pb-16">
            <div className="text-center text-white">Loading...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            {/* Chat Rooms Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                <CardHeader>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chats
                    {isConnected && selectedRoom && (
                      <div className="w-2 h-2 bg-green-400 rounded-full ml-auto" title="Connected" />
                    )}
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-12rem)]">
                    {chatRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 cursor-pointer border-b border-white/10 hover:bg-white/5 ${
                          selectedRoom?.id === room.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={room.other_user?.avatar_url} />
                            <AvatarFallback>
                              {room.is_group ? <Users className="w-4 h-4" /> : room.other_user?.full_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {room.is_group 
                                ? room.name || 'Group Chat'
                                : room.other_user?.full_name || 'Unknown User'
                              }
                            </p>
                            <p className="text-white/60 text-sm truncate">
                              {room.is_group 
                                ? 'Group conversation'
                                : `@${room.other_user?.username || 'user'}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full flex flex-col">
                {selectedRoom ? (
                  <>
                    <CardHeader className="border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedRoom.other_user?.avatar_url} />
                          <AvatarFallback>
                            {selectedRoom.is_group ? <Users className="w-4 h-4" /> : selectedRoom.other_user?.full_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {selectedRoom.is_group 
                              ? selectedRoom.name || 'Group Chat'
                              : selectedRoom.other_user?.full_name || 'Unknown User'
                            }
                          </h3>
                          <p className="text-white/60 text-sm">
                            {selectedRoom.is_group 
                              ? 'Group conversation'
                              : `@${selectedRoom.other_user?.username || 'user'}`
                            }
                          </p>
                        </div>
                        {isConnected && (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            Live
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-4 flex flex-col">
                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex gap-2 max-w-[70%] ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={message.sender?.avatar_url} />
                                  <AvatarFallback>{message.sender?.full_name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className={`rounded-lg p-3 ${
                                  message.sender_id === user?.id 
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                                    : 'bg-white/20'
                                }`}>
                                  <p className="text-white text-sm">{message.content}</p>
                                  <p className="text-white/60 text-xs mt-1">
                                    {new Date(message.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                      
                      <div className="flex gap-2 mt-4">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                      <p>Select a chat to start messaging</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Chat;
