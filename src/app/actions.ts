'use server';

import { generateResponse, type GenerateResponseInput } from '@/ai/flows/generate-response';

export async function getBotResponse(userInput: string) {
  try {
    const input: GenerateResponseInput = { message: userInput };
    // Artificial delay to simulate network latency and show loading state
    // await new Promise(resolve => setTimeout(resolve, 1500)); 
    const output = await generateResponse(input);
    return { response: output.response, error: null };
  } catch (error) {
    console.error('Error getting bot response:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { response: null, error: `Failed to get response from AI: ${errorMessage}` };
  }
}
