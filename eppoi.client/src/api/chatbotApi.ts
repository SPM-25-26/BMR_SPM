import { invokeApi, type ApiResponse, getClient, type ChatMessage } from './apiUtils';

const API_BASE = '/api/ChatBot';

const apiClient = getClient(API_BASE, true);

interface AskChatBotInput {
  contents: Array<{
    role: "user" | "model",
    parts: Array<{ text: string; }>
  }>;  
}

export interface AskChatBotResponse extends ApiResponse {
  success: boolean;
  result: string;
}

export async function askChatBot(chatMessages: Array<ChatMessage>): Promise<AskChatBotResponse> {
  // Convert chat messages in a format expected by the backend
  const apiInput: AskChatBotInput = { contents: [] };

  chatMessages.forEach((chatMessage) => {
    apiInput.contents.push({ role: chatMessage.isUser ? 'user' : 'model', parts: [{ text: chatMessage.text }] });
  });

  return invokeApi(async () => {
    return await apiClient.post<ApiResponse>('/AskChatBot', apiInput);
  }, 'Errore durante l\'interrogazione del Chatbot');
}
