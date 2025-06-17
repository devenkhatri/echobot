
# EchoBot: Your Smart Conversational AI Companion

![EchoBot Main Interface](https://placehold.co/800x400.png "EchoBot Chat Interface" "data-ai-hint=chat interface")

EchoBot is a modern, full-stack web application designed to provide a seamless and engaging conversational AI experience. Built with Next.js, React, Genkit, and styled with Tailwind CSS and ShadCN UI components, EchoBot allows users to log in and have intelligent, context-aware conversations.

## Key Features

*   **Conversational AI Chat**: Powered by Genkit and Google's AI models (like Gemini), EchoBot understands context and remembers previous parts of the conversation, leading to more natural interactions.
*   **User Authentication**: A simple yet effective login page protects the chat interface, ensuring that conversations are private.
*   **Markdown Message Formatting**: Bot responses are beautifully rendered with full Markdown support, including lists, code blocks, bold/italic text, links, and more.
*   **Responsive Design**: The application looks and works great on all devices, from desktops to mobile phones, thanks to Tailwind CSS and ShadCN UI.
*   **Modern Tech Stack**: Leverages the latest technologies like Next.js 15 (App Router), React 18, TypeScript, and Genkit for optimal performance and developer experience.
*   **Toast Notifications**: User-friendly notifications for login, logout, and error states.
*   **Protected Routes**: The chat interface is accessible only after successful authentication.
*   **Loading States**: Clear visual feedback while the bot is processing or authentication is being verified.

## Getting Started with EchoBot

To run EchoBot locally, you'll typically need Node.js and npm installed.

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**: Create a `.env` file in the project root and add your Google AI API key:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
4.  **Run the development servers**:
    *   Next.js frontend:
        ```bash
        npm run dev
        ```
        (Usually available at `http://localhost:9002`)
    *   Genkit development server:
        ```bash
        npm run genkit:watch
        ```
        (Genkit Inspector usually at `http://localhost:4000`)

## Using EchoBot: A Walkthrough

Let's explore how to use EchoBot.

### 1. The Login Experience

Upon navigating to the application, you'll be greeted by the login page.

![EchoBot Login Page](https://placehold.co/600x500.png "EchoBot Login Page" "data-ai-hint=login form")

Simply enter any non-empty username and password to proceed. This mock authentication system is designed for ease of demonstration.

```tsx
// src/app/login/page.tsx - Snippet of the form
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="username">Username</Label>
    <Input
      id="username"
      type="text"
      placeholder="Enter your username"
      // ...
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <Input
      id="password"
      type="password"
      placeholder="••••••••"
      // ...
    />
  </div>
  <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
  </Button>
</form>
```

### 2. The Chat Interface

After logging in, you'll land on the main chat interface.

![EchoBot Chat UI](https://placehold.co/800x700.png "EchoBot Chat UI" "data-ai-hint=chat ui")

The interface is clean and intuitive:
*   A welcome message from EchoBot.
*   An input field at the bottom to type your messages.
*   A send button.
*   A logout button in the header.

Type your message and hit Enter or click the send button. Your message will appear on the right, and EchoBot's response will appear on the left.

### 3. Conversational Context in Action

EchoBot isn't just a simple question-and-answer bot; it remembers the flow of your conversation.

**User:** "What's the weather like in London?"
**EchoBot:** "The weather in London is currently [provides weather details]."
**User:** "What about in Paris?"
**EchoBot:** (Understanding the context of "weather") "In Paris, the weather is [provides Paris weather details]."

![EchoBot Conversational Context](https://placehold.co/700x450.png "EchoBot Conversation Flow" "data-ai-hint=chat conversation")

This is made possible by sending the conversation history along with each new message to the AI model.

```typescript
// src/ai/flows/generate-response.ts - Genkit prompt definition
const generateResponsePrompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: { schema: z.object({ message: z.string().describe('The user message to respond to.') }) },
  output: { schema: GenerateResponseOutputSchema },
  system: `You are EchoBot, a friendly and helpful AI assistant. Maintain a conversational tone. Use the provided conversation history to understand context and provide relevant, coherent responses. If the user asks a follow-up question, your answer should take into account what was said before.`,
  prompt: `{{{message}}}`, // Current message
});

// src/app/actions.ts - Passing history to the flow
export async function getBotResponse(userInput: string, chatHistory: FrontendMessage[]) {
  // ...
  const mappedHistory: MessageHistoryItem[] = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const input: GenerateResponseInput = { 
    message: userInput,
    history: mappedHistory, // History is included here
  };
  const output = await generateResponse(input);
  // ...
}
```

### 4. Rich Markdown Formatting

EchoBot's responses can include various Markdown elements, which are rendered correctly in the chat window. This makes the information easier to read and understand.

For example, if you ask for a list or a code snippet, EchoBot can provide it in a well-formatted way.

**User:** "Can you give me a short Python script to print 'Hello, World!'?"
**EchoBot:**
"Certainly! Here's a simple Python script:
```python
print(\"Hello, World!\")
```
You can run this in any Python environment."

![EchoBot Markdown Rendering](https://placehold.co/700x350.png "EchoBot Markdown Example" "data-ai-hint=markdown chat")

This is handled by the `react-markdown` library in the `ChatMessage` component.

```tsx
// src/components/ChatMessage.tsx - Using ReactMarkdown for bot messages
// ...
{isUser ? (
  <p className="whitespace-pre-wrap">{message.text}</p>
) : (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      // Custom renderers for styling (e.g., links, code blocks)
      a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />,
      pre: ({node, ...props}) => <pre {...props} className="bg-muted p-2 my-2 rounded-md overflow-x-auto text-xs" />,
      // ... other components
    }}
  >
    {message.text}
  </ReactMarkdown>
)}
// ...
```

### 5. Logging Out

When you're done, simply click the "Log Out" icon in the top-right corner of the chat header. You'll be redirected back to the login page.

## Under the Hood: Key Technical Aspects

EchoBot combines several powerful technologies:

*   **Genkit (`src/ai/flows/generate-response.ts`)**: Orchestrates the AI interaction. The core flow defines how user input and history are processed to generate a response.
    ```typescript
    // src/ai/flows/generate-response.ts
    const generateResponseFlow = ai.defineFlow(
      {
        name: 'generateResponseFlow',
        inputSchema: GenerateResponseInputSchema, // Includes message and history
        outputSchema: GenerateResponseOutputSchema,
      },
      async (flowInput) => {
        const { output } = await generateResponsePrompt(
          { message: flowInput.message }, // Current message
          { history: flowInput.history }  // Pass history as an option
        );
        return output!;
      }
    );
    ```

*   **Next.js Server Actions (`src/app/actions.ts`)**: Handle the communication between the client-side React components and the server-side Genkit flow.
    ```typescript
    // src/app/actions.ts
    'use server';
    import { generateResponse, type GenerateResponseInput, type MessageHistoryItem } from '@/ai/flows/generate-response';
    // ...
    export async function getBotResponse(userInput: string, chatHistory: FrontendMessage[]) {
      try {
        const mappedHistory: MessageHistoryItem[] = /* ... map history ... */;
        const input: GenerateResponseInput = { message: userInput, history: mappedHistory };
        const output = await generateResponse(input);
        return { response: output.response, error: null };
      } catch (error) {
        // ... error handling ...
      }
    }
    ```

*   **React Frontend (`src/app/chat/page.tsx`)**: Manages the UI state, user input, and displays messages.
    ```tsx
    // src/app/chat/page.tsx
    const handleSendMessage = async (userInput: string) => {
      // ...
      const historyForAI = [...messages]; // Snapshot of current messages for history
      // ... add user message to UI ...
      setIsLoading(true);
      const result = await getBotResponse(userInput, historyForAI); // Call server action
      // ... handle result and add bot message to UI ...
      setIsLoading(false);
    };
    ```

## Conclusion

EchoBot serves as a powerful example of building a modern, conversational AI application. With its clean interface, contextual understanding, and robust tech stack, it provides a solid foundation for more advanced AI-driven chat solutions. Whether for customer service, information retrieval, or simply a friendly chat, EchoBot showcases the potential of combining Next.js with Genkit for intelligent applications.

---

Feel free to explore the code, experiment with different prompts, and extend EchoBot's capabilities!
