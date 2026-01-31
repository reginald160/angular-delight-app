// import { useState, useEffect, useRef, useCallback } from 'react';
// import * as signalR from '@microsoft/signalr';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';
// import {chatService} from '@/services/ChatService';

// export interface ChatMessage {
//   id: string;
//   conversation_id: string;
//   sender_id: string;
//   content: string;
//   is_read: boolean;
//   created_at: string;
// }

// export interface ChatConversation {
//   id: string;
//   user_id: string;
//   admin_id: string | null;
//   created_at: string;
//   updated_at: string;
//   last_message_at: string;
//   status: string;
// }


// export const useSignalRChat = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [conversations, setConversations] = useState<ChatConversation[]>([]);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [connected, setConnected] = useState(false);
//   const connectionRef = useRef<signalR.HubConnection | null>(null);

//   // Initialize SignalR connection
//   const initializeConnection = useCallback(async () => {
//     if (!user || !SIGNALR_HUB_URL || connectionRef.current) return;

//     try {
//       const connection = new signalR.HubConnectionBuilder()
//         .withUrl(SIGNALR_HUB_URL, {
//           accessTokenFactory: async () => {
//             const { data } = await supabase.auth.getSession();
//             return data.session?.access_token || '';
//           }
//         })
//         .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
//         .configureLogging(signalR.LogLevel.Warning)
//         .build();

//       // Handle incoming messages
//       connection.on('ReceiveChatMessage', (message: ChatMessage) => {
//         if (message.sender_id !== user.id) {
//           setMessages(prev => {
//             // Avoid duplicates
//             if (prev.some(m => m.id === message.id)) return prev;
//             return [...prev, message];
//           });
          
//           // Show toast for new messages
//           toast({
//             title: 'New Message',
//             description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
//           });
//         }
//       });

//       // Handle conversation updates
//       connection.on('ConversationUpdated', (conversation: ChatConversation) => {
//         setConversations(prev => {
//           const index = prev.findIndex(c => c.id === conversation.id);
//           if (index >= 0) {
//             const updated = [...prev];
//             updated[index] = conversation;
//             return updated.sort((a, b) => 
//               new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
//             );
//           }
//           return [conversation, ...prev];
//         });
//       });

//       // Handle connection state changes
//       connection.onreconnecting(() => {
//         console.log('SignalR reconnecting...');
//         setConnected(false);
//       });

//       connection.onreconnected(() => {
//         console.log('SignalR reconnected');
//         setConnected(true);
//         // Rejoin conversation if one is selected
//         if (currentConversation) {
//           connection.invoke('JoinConversation', currentConversation.id).catch(console.error);
//         }
//       });

//       connection.onclose(() => {
//         console.log('SignalR connection closed');
//         setConnected(false);
//       });

//       await connection.start();
//       connectionRef.current = connection;
//       setConnected(true);
//       console.log('SignalR chat connected');

//     } catch (error) {
//       console.error('Failed to connect to SignalR chat hub:', error);
//       // Fallback: connection failed, we'll rely on polling or Supabase realtime
//     }
//   }, [user, toast, currentConversation]);

//   // Cleanup connection on unmount
//   useEffect(() => {
//     return () => {
//       if (connectionRef.current) {
//         connectionRef.current.stop();
//         connectionRef.current = null;
//       }
//     };
//   }, []);

//   // Initialize connection when user changes
//   useEffect(() => {
//     if (user) {
//       initializeConnection();
//     }
//   }, [user, initializeConnection]);

//   const fetchConversations = async () => {
//     if (!user) return;
    
//     try {
      
//         const { data, error } = await chatService.GetAllConversation();
        
//               if (data && Array.isArray(data)) {
//               const mappedConversations: ChatConversation[] = data.map((item: any) => ({
//                 // Use || to fallback if the API uses different casing
//                 id: item.id || item.Id,
//                 sender_id: item.senderId || item.SenderId,
//                 user_id: item.userId || item.UserId,
//                 admin_id: item.adminId || item.AdminId,
//                 created_at: item.createdAt || item.CreatedAt,
//                 updated_at: item.updatedAt || item.UpdatedAt,
//                 last_message_at: item.lastMessageAt || item.LastMessageAt,
//                 status: item.status || item.Status
//               }));
//                  if (error) throw error;
//               setConversations(mappedConversations || []);
//             }

//     } catch (error) {
//       console.error('Error fetching conversations:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (conversationId: string) => {
//     try {
      
//         const { data, error } =  await chatService.GetMessagesByConversationId(conversationId);
//         const mappedMessages: ChatMessage[] = (data || []).map((item: any) => ({
//                 id: item.Id,
//                 conversation_id: item.ConversationId,
//                 sender_id: item.SenderId,
//                 content: item.Content,
//                 is_read: item.IsRead,
//                 created_at: item.CreatedAt
//               }));

//       if (error) throw error;
//       setMessages(mappedMessages || []);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const createConversation = async () => {
//     if (!user) return null;
    
//     try {
//       // Check if user already has an open conversation
//       const { data: existing } =  await chatService.GetUserConversation(user.id);

//       if (existing != null) {
//         const conversation = {
//         id: existing.id || existing.id,
//         sender_id: existing.senderId || existing.senderId,
//         user_id: existing.userId || existing.userId,
//         admin_id: existing.adminId || existing.adminId,
//         created_at: existing.createdAt || existing.createdAt,
//         updated_at: existing.updatedAt || existing.updatedAt,
//         last_message_at: existing.lastMessageAt || existing.lastMessageAt,
//         status: existing.status || existing.status
//         }
//         setCurrentConversation(conversation);
//         await fetchMessages(conversation.id);
//         // Join the conversation via SignalR
//         if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
//           await connectionRef.current.invoke('JoinConversation', conversation.id);
//         }
//         return conversation;
//       }

//       const { data, error } = await chatService.CreateConversation(user.id);

//       const newConversation = {
//         id: data?.id || data.id,
//         sender_id: data?.senderId || data?.senderId,
//         user_id: data?.userId || data?.userId,
//         admin_id: data?.adminId || data?.adminId,
//         created_at: data?.createdAt || data.createdAt,
//         updated_at: data?.updatedAt || data.updatedAt,
//         last_message_at: data?.lastMessageAt || data.lastMessageAt,
//         status: data?.status || data.status
//       };



//       if (error) throw error;
      
//       setCurrentConversation(newConversation);
//       setConversations(prev => [newConversation, ...prev]);
      
//       // Join the new conversation via SignalR
//       if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
//         await connectionRef.current.invoke('JoinConversation', data.id);
//       }
      
//       return data;
//     } catch (error) {
//       console.error('Error creating conversation:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to start conversation',
//         variant: 'destructive'
//       });
//       return null;
//     }
//   };

//   const sendMessage = async (content: string, conversationId?: string) => {
//     if (!user) return;
    
//     const convId = conversationId || currentConversation?.id;
//     if (!convId) {
//       const newConv = await createConversation();
//       if (!newConv) return;
//       return sendMessage(content, newConv.id);
//     }

//     try {
//       // Insert message to database
//       const { data, error } = await chatService.SendMessage(content, user.id);

//       if (error) throw error;
//       const newMessage: ChatMessage = {
//         id: data.MessageId || '',
//         conversation_id: convId,
//         sender_id: user.id,
//         content: content,
//         is_read: false,
//         created_at: new Date().toISOString()
//       };
      
//       // Add message to local state immediately
//       setMessages(prev => [...prev, newMessage]);

//       // Send via SignalR for real-time delivery to other participants
//       if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
//         await connectionRef.current.invoke('SendChatMessage', convId, data);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to send message',
//         variant: 'destructive'
//       });
//     }
//   };

//   const selectConversation = async (conversation: ChatConversation) => {
//     // Leave previous conversation if any
//     if (currentConversation && connectionRef.current?.state === signalR.HubConnectionState.Connected) {
//       await connectionRef.current.invoke('LeaveConversation', currentConversation.id).catch(console.error);
//     }

//     setCurrentConversation(conversation);
//     await fetchMessages(conversation.id);
    
//     // Join the new conversation via SignalR
//     if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
//       await connectionRef.current.invoke('JoinConversation', conversation.id);
//     }
    
//     // Mark messages as read
//     if (user) {
//         await chatService.ReadMessage(conversation.id, user.id);

//     }
//   };

//   useEffect(() => {
//     fetchConversations();
//   }, [user]);

//   // Fallback: Subscribe to Supabase realtime if SignalR is not connected
//   useEffect(() => {
//     if (!currentConversation || connected) return;

//     const channel = supabase
//       .channel('chat-messages-fallback')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'chat_messages',
//           filter: `conversation_id=eq.${currentConversation.id}`
//         },
//         (payload) => {
//           const newMessage = payload.new as ChatMessage;
//           if (newMessage.sender_id !== user?.id) {
//             setMessages(prev => {
//               if (prev.some(m => m.id === newMessage.id)) return prev;
//               return [...prev, newMessage];
//             });
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [currentConversation, user, connected]);

//   return {
//     conversations,
//     messages,
//     currentConversation,
//     loading,
//     unreadCount,
//     connected,
//     createConversation,
//     sendMessage,
//     selectConversation,
//     refresh: fetchConversations
//   };
// };
