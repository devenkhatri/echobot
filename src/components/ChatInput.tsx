'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isLoading) return;
    
    // Optimistically clear input before sending
    setInputValue(''); 
    await onSendMessage(trimmedValue);
    // If send fails, could restore inputValue, but usually not necessary for chat
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-3 sm:p-4 bg-card" // bg-card to match overall chat window
      aria-label="Chat message form"
    >
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Send a message to EchoBot..."
        className="flex-1 rounded-full h-11 px-5 text-sm focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-0 border-border shadow-sm"
        aria-label="Chat message input"
        disabled={isLoading}
        autoFocus
      />
      <Button
        type="submit"
        variant="default" // Will use primary color from theme
        size="icon"
        className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        aria-label="Send message"
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizontal className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
