
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const url = new URL(req.url);
  const roomId = url.searchParams.get("room");
  const authToken = url.searchParams.get("token");

  if (!roomId || !authToken) {
    return new Response("Missing room ID or auth token", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  // Verify user authentication
  const { data: { user }, error } = await supabase.auth.getUser(authToken);
  if (error || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Verify user has access to this room
  const { data: participant } = await supabase
    .from("chat_participants")
    .select("*")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .single();

  if (!participant) {
    return new Response("Access denied to this room", { status: 403 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  const clients = new Map();

  socket.onopen = () => {
    console.log(`User ${user.id} connected to room ${roomId}`);
    clients.set(user.id, socket);
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      
      if (message.type === "chat_message") {
        // Save message to database
        const { data: newMessage, error } = await supabase
          .from("messages")
          .insert({
            room_id: roomId,
            sender_id: user.id,
            content: message.content,
            message_type: message.message_type || "text"
          })
          .select(`
            *,
            sender:profiles(full_name, username, avatar_url)
          `)
          .single();

        if (!error && newMessage) {
          // Broadcast to all participants in the room
          const { data: participants } = await supabase
            .from("chat_participants")
            .select("user_id")
            .eq("room_id", roomId);

          const broadcastMessage = {
            type: "new_message",
            message: newMessage
          };

          // In a real implementation, you'd maintain active connections
          // and broadcast to all connected clients in this room
          socket.send(JSON.stringify(broadcastMessage));
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  socket.onclose = () => {
    console.log(`User ${user.id} disconnected from room ${roomId}`);
    clients.delete(user.id);
  };

  return response;
});
