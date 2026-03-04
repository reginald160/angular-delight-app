import { authApi, AuthError } from "./AuthService";

export interface ChatResponse 
    {
     MessageId: string;
    ConversationId: string;
    }

    export interface GetConversationResponse {
  id: string;
  status: string;
  senderId: string;
  userId: string;
  adminId: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  name: string

}

export interface ChatMessageResponse {
  Id: string;
  IsRead: boolean;
  SenderId: string;
  Content: string;
  CreatedAt: string;
  ConversationId: string;
}

 
class ChatService{

      async SendMessage(content: string,userId: string, time:string): Promise<{ data: ChatResponse | null; error: AuthError | null }> {
        return authApi.request<ChatResponse>('/Chat/SendMessage', {
          method: 'POST',
          body: JSON.stringify({ senderId: userId, content : content, time: time}),
        });
      }
       async ReadMessage(conversationId: string,userId: string): Promise<{ data: ChatMessageResponse | null; error: AuthError | null }> {
        return authApi.request<ChatMessageResponse>('/Chat/ReadMessage', {
          method: 'POST',
          body: JSON.stringify({ senderId: userId, conversationId : conversationId }),
        });
      }


      async CreateConversation(userId: string): Promise<{ data: GetConversationResponse | null; error: AuthError | null }> {
        
        return authApi.request<GetConversationResponse>('/Chat/CreateConversation', {
          method: 'POST',
          body: JSON.stringify({ userId: userId}),
        });
      }

        async GetAllConversation(): Promise<{ data: GetConversationResponse [] | null; error: AuthError | null }> {
        return authApi.request<GetConversationResponse []>('/Chat/GetMessages', {
          method: 'GET'
        });
      }
       async GetUserConversation(userId: string): Promise<{ data: GetConversationResponse | null; error: AuthError | null }> {
        return authApi.request<GetConversationResponse>('/Chat/GetConversations?userId=' + userId, {
          method: 'GET'
        });
      }
      
        async GetMessagesByConversationId(converationId: string): Promise<{ data: ChatMessageResponse [] | null; error: AuthError | null }> {
        return authApi.request<ChatMessageResponse[]>('/Chat/GetMessageByconversationId?conversationId=' + converationId, {
          method: 'GET'
        });
      }

}

export const chatService = new ChatService();