
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, MessageCircle, Check, X, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface Profile {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_profile?: Profile;
  receiver_profile?: Profile;
}

interface Friendship {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  friend_profile?: Profile;
}

const Friends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user suggestions (profiles who aren't friends and haven't been sent requests)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      // Fetch existing friend requests
      const { data: requestsData } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      // Fetch friendships
      const { data: friendshipsData } = await supabase
        .from('friendships')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      // Filter suggestions
      const connectedUserIds = new Set([
        ...(requestsData?.map(r => r.sender_id === user.id ? r.receiver_id : r.sender_id) || []),
        ...(friendshipsData?.map(f => f.user1_id === user.id ? f.user2_id : f.user1_id) || [])
      ]);

      const filteredSuggestions = allProfiles?.filter(profile => 
        !connectedUserIds.has(profile.id)
      ) || [];

      setSuggestions(filteredSuggestions);

      // Process requests with proper typing
      const sent = (requestsData?.filter(r => r.sender_id === user.id) || []) as FriendRequest[];
      const received = (requestsData?.filter(r => r.receiver_id === user.id && r.status === 'pending') || []) as FriendRequest[];

      // Get profiles for requests
      const senderIds = received.map(r => r.sender_id);
      const receiverIds = sent.map(r => r.receiver_id);
      const allRequestUserIds = [...senderIds, ...receiverIds];

      if (allRequestUserIds.length > 0) {
        const { data: requestProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', allRequestUserIds);

        sent.forEach(request => {
          request.receiver_profile = requestProfiles?.find(p => p.id === request.receiver_id);
        });

        received.forEach(request => {
          request.sender_profile = requestProfiles?.find(p => p.id === request.sender_id);
        });
      }

      setSentRequests(sent);
      setReceivedRequests(received);

      // Process friendships
      const friendUserIds = friendshipsData?.map(f => 
        f.user1_id === user.id ? f.user2_id : f.user1_id
      ) || [];

      if (friendUserIds.length > 0) {
        const { data: friendProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', friendUserIds);

        const friendsWithProfiles = friendshipsData?.map(friendship => ({
          ...friendship,
          friend_profile: friendProfiles?.find(p => 
            p.id === (friendship.user1_id === user.id ? friendship.user2_id : friendship.user1_id)
          )
        })) || [];

        setFriends(friendsWithProfiles);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load friends data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request sent!"
      });

      fetchData();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive"
      });
    }
  };

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      if (action === 'accept') {
        const { error } = await supabase.rpc('accept_friend_request', {
          request_id: requestId
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('friend_requests')
          .update({ status: 'declined' })
          .eq('id', requestId);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Friend request ${action}ed!`
      });

      fetchData();
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} friend request`,
        variant: "destructive"
      });
    }
  };

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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Friends</h1>
            
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="received">
                  Requests
                  {receivedRequests.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {receivedRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="suggestions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((profile) => (
                    <Card key={profile.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar>
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback>{profile.full_name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{profile.full_name || 'Unknown User'}</p>
                            <p className="text-white/60 text-sm">@{profile.username || 'user'}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => sendFriendRequest(profile.id)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Friend
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="received" className="space-y-4">
                {receivedRequests.map((request) => (
                  <Card key={request.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={request.sender_profile?.avatar_url} />
                            <AvatarFallback>{request.sender_profile?.full_name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">
                              {request.sender_profile?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-white/60 text-sm">
                              @{request.sender_profile?.username || 'user'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleFriendRequest(request.id, 'accept')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFriendRequest(request.id, 'decline')}
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {receivedRequests.length === 0 && (
                  <div className="text-center text-white/70 py-8">
                    No pending friend requests
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sent" className="space-y-4">
                {sentRequests.map((request) => (
                  <Card key={request.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={request.receiver_profile?.avatar_url} />
                            <AvatarFallback>{request.receiver_profile?.full_name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">
                              {request.receiver_profile?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-white/60 text-sm">
                              @{request.receiver_profile?.username || 'user'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={request.status === 'pending' ? 'secondary' : 'outline'}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {sentRequests.length === 0 && (
                  <div className="text-center text-white/70 py-8">
                    No sent friend requests
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="friends" className="space-y-4">
                {friends.map((friendship) => (
                  <Card key={friendship.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={friendship.friend_profile?.avatar_url} />
                            <AvatarFallback>{friendship.friend_profile?.full_name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">
                              {friendship.friend_profile?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-white/60 text-sm">
                              @{friendship.friend_profile?.username || 'user'}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {friends.length === 0 && (
                  <div className="text-center text-white/70 py-8">
                    No friends yet. Send some friend requests!
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Friends;
