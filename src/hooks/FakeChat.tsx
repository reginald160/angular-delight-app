import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {chatService} from '@/services/ChatService';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  sender_id: string;
  user_id: string;
  admin_id: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  status: string;
}

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await chatService.GetAllConversation();

      if (data && Array.isArray(data)) {
      const mappedConversations: ChatConversation[] = data.map((item: any) => ({
        // Use || to fallback if the API uses different casing
        id: item.id || item.Id,
        sender_id: item.senderId || item.SenderId,
        user_id: item.userId || item.UserId,
        admin_id: item.adminId || item.AdminId,
        created_at: item.createdAt || item.CreatedAt,
        updated_at: item.updatedAt || item.UpdatedAt,
        last_message_at: item.lastMessageAt || item.LastMessageAt,
        status: item.status || item.Status
      }));
         if (error) throw error;
      setConversations(mappedConversations);
    }

    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } =  await chatService.GetMessagesByConversationId(conversationId);

      const mappedMessages: ChatMessage[] = (data || []).map((item: any) => ({
        id: item.Id,
        conversation_id: item.ConversationId,
        sender_id: item.SenderId,
        content: item.Content,
        is_read: item.IsRead,
        created_at: item.CreatedAt
      }));
      if (error) throw error;
      setMessages( mappedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createConversation = async () => {
    if (!user) return null;
    
    try {
      // Check if user already has an open conversation
      const { data: existing } = await chatService.GetUserConversation(user.id);

      if(existing == null) {
        const { data: conversation, error: conversationError } = await chatService.CreateConversation(user.id);
        if (conversationError) throw conversationError;
      }

      if (existing != null) 
      { const conversation = {
        id: existing.id || existing.id,
        sender_id: existing.senderId || existing.senderId,
        user_id: existing.userId || existing.userId,
        admin_id: existing.adminId || existing.adminId,
        created_at: existing.createdAt || existing.createdAt,
        updated_at: existing.updatedAt || existing.updatedAt,
        last_message_at: existing.lastMessageAt || existing.lastMessageAt,
        status: existing.status || existing.status

      };       
        const MappedConversations = conversation;
        setCurrentConversation(MappedConversations);
        await fetchMessages(MappedConversations.id);
        return MappedConversations;
      }
          else {
        toast({
          title: 'Error',
          description: 'Failed to start conversation',
          variant: 'destructive'
        });
       }
       return null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive'
      });
      return null;
    }
  };

  const sendMessage = async (content: string, conversationId?: string) => {
    if (!user) return;
    
    const convId = conversationId || currentConversation?.id;
    if (!convId) {
      const newConv = await createConversation();
      if (!newConv) return;
      return sendMessage(content, newConv.id);
    }

    try {
      const { data, error } =  await chatService.SendMessage(content, user.id);
      
      if (error) throw error;
      
      setMessages(prev => [...prev, {
        id: data.MessageId || '',
        conversation_id: convId,
        sender_id: user.id,
        content,
        is_read: false,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const selectConversation = async (conversation: ChatConversation) => {
    setCurrentConversation(conversation);
    await fetchMessages(conversation.id);
    
    // Mark messages as read
    if (user) {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversation.id)
        .neq('sender_id', user.id);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!currentConversation) return;

    const channel = supabase
      .channel('chat-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (newMessage.sender_id !== user?.id) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation, user]);

  return {
    conversations,
    messages,
    currentConversation,
    loading,
    unreadCount,
    createConversation,
    sendMessage,
    selectConversation,
    refresh: fetchConversations
  };
};
