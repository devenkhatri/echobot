'use server';

import { generateResponse, type GenerateResponseInput, type MessageHistoryItem } from '@/ai/flows/generate-response';
import type { Message as FrontendMessage } from '@/components/ChatMessage';

// This server action does not need explicit auth checking here because 
// the page calling it (/chat) is already protected client-side.
// For a production app with sensitive data, you might add server-side auth checks too.
export async function getBotResponse(userInput: string, chatHistory: FrontendMessage[]) {
  try {
    // Map frontend message format to the Genkit history format
    const mappedHistory: MessageHistoryItem[] = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const input: GenerateResponseInput = { 
      message: userInput,
      history: mappedHistory,
    };
    // Artificial delay to simulate network latency and show loading state
    // await new Promise(resolve => setTimeout(resolve, 1500)); 
    const output = await generateResponse(input);
    return { response: output.response, error: null };
  } catch (error) {
    console.error('Error getting bot response:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { response: null, error: `Failed to get response from AI: ${errorMessage}` };
  }
}
