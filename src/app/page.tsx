'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage, type Message } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { getBotResponse } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Bot, MessageSquareDashed } from 'lucide-react'; // Added MessageSquareDashed

export default function EchoBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial greeting message from bot
    setMessages([
      {
        id: crypto.randomUUID(),
        text: "Hello! I'm EchoBot, your friendly AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added or loading state changes
    setTimeout(() => { // Timeout to allow DOM update before scrolling
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    const result = await getBotResponse(userInput);
    

    if (result.error || !result.response) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.error || 'Failed to get a response from EchoBot. Please try again.',
      });
      const errorBotMessage: Message = {
        id: crypto.randomUUID(),
        text: "I seem to be having a little trouble right now. Please try sending your message again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
      setIsLoading(false);
      return;
    }

    const newBotMessage: Message = {
      id: crypto.randomUUID(),
      text: result.response,
      sender: 'bot',
      timestamp: new Date(),
    };
    // Add bot message after a slight delay to make it feel more natural
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-background antialiased">
      <div className="flex flex-col h-full max-w-2xl mx-auto w-full bg-card shadow-xl md:rounded-lg overflow-hidden md:my-4">
        <header className="flex items-center p-4 border-b bg-card sticky top-0 z-10 shadow-sm">
          <Bot className="h-7 w-7 sm:h-8 sm:w-8 text-primary mr-3 shrink-0" />
          <h1 className="text-xl sm:text-2xl font-headline font-semibold text-foreground truncate">EchoBot</h1>
        </header>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user' && ( // Show thinking only if last message was user
               <div className="flex items-start gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out">
                <Avatar className="h-8 w-8 border border-border shadow-sm">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[75%] rounded-xl px-4 py-2.5 shadow-sm bg-card text-card-foreground rounded-bl-none border border-border">
                  <p className="text-sm italic text-muted-foreground">EchoBot is thinking...</p>
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoading && ( // Placeholder for empty chat
              <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
                <MessageSquareDashed className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Conversation Cleared</p>
                <p className="text-sm text-muted-foreground">Send a message to start a new chat with EchoBot.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="mt-auto border-t border-border">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
