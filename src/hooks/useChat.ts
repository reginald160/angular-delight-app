import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createConversation = async () => {
    if (!user) return null;
    
    try {
      // Check if user already has an open conversation
      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .single();

      if (existing) {
        setCurrentConversation(existing);
        await fetchMessages(existing.id);
        return existing;
      }

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentConversation(data);
      setConversations(prev => [data, ...prev]);
      return data;
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
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: convId,
          sender_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
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
