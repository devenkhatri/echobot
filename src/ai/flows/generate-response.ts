
'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating chatbot responses.
 *
 * - generateResponse - A function that takes user input, chat history, and language, then returns a chatbot response.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 * - MessageHistoryItem - The type for a single item in the conversation history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageHistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});
export type MessageHistoryItem = z.infer<typeof MessageHistoryItemSchema>;

const GenerateResponseInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  history: z.array(MessageHistoryItemSchema).optional().describe('The conversation history.'),
  language: z.string().optional().default('en').describe('The language for the bot response (e.g., "en" for English, "gu" for Gujarati).'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const generateResponsePrompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: { schema: z.object({ 
    message: z.string().describe('The user message to respond to.'),
    language: z.string().describe('The target language for the response.')
  }) },
  output: { schema: GenerateResponseOutputSchema },
  system: `You are EchoBot, a friendly and helpful AI assistant. Maintain a conversational tone. Use the provided conversation history to understand context and provide relevant, coherent responses.
Respond in the language specified by the 'language' input field (e.g., "en" for English or "gu" for Gujarati). The user's input will also be in this language.
If the language is Gujarati, ensure your entire response is in Gujarati script.
Current language for response: {{language}}.`,
  prompt: `{{{message}}}`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async (flowInput) => {
    const { output } = await generateResponsePrompt(
      { message: flowInput.message, language: flowInput.language || 'en' }, 
      { history: flowInput.history }
    );
    return output!;
  }
);
