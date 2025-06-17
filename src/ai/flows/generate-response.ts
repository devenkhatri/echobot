'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating chatbot responses.
 *
 * - generateResponse - A function that takes user input and chat history, then returns a chatbot response.
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
  // The input to this prompt object is just the current user message.
  // The history is passed in the options when calling this prompt.
  input: { schema: z.object({ message: z.string().describe('The user message to respond to.') }) },
  output: { schema: GenerateResponseOutputSchema },
  system: `You are EchoBot, a friendly and helpful AI assistant. Maintain a conversational tone. Use the provided conversation history to understand context and provide relevant, coherent responses. If the user asks a follow-up question, your answer should take into account what was said before.`,
  // The prompt for the model, using the 'message' from the input schema.
  prompt: `{{{message}}}`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema, // Flow input includes message and history
    outputSchema: GenerateResponseOutputSchema,
  },
  async (flowInput) => {
    const { output } = await generateResponsePrompt(
      { message: flowInput.message }, // Current message for the prompt's direct input
      { history: flowInput.history }    // Pass history as an option to the prompt execution
    );
    return output!;
  }
);
