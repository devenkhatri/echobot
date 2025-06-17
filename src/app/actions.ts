'use server';

import { generateResponse, type GenerateResponseInput } from '@/ai/flows/generate-response';

// This server action does not need explicit auth checking here because 
// the page calling it (/chat) is already protected client-side.
// For a production app with sensitive data, you might add server-side auth checks too.
export async function getBotResponse(userInput: string) {
  try {
    const input: GenerateResponseInput = { message: userInput };
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
