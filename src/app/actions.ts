
'use server';

import { generateResponse, type GenerateResponseInput, type MessageHistoryItem } from '@/ai/flows/generate-response';
import type { Message as FrontendMessage } from '@/components/ChatMessage';

export async function getBotResponse(userInput: string, chatHistory: FrontendMessage[], language: string) {
  try {
    const mappedHistory: MessageHistoryItem[] = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const input: GenerateResponseInput = { 
      message: userInput,
      history: mappedHistory,
      language: language,
    };
    const output = await generateResponse(input);
    return { response: output.response, error: null };
  } catch (error) {
    console.error('Error getting bot response:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { response: null, error: `Failed to get response from AI: ${errorMessage}` };
  }
}
