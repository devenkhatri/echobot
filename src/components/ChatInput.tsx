
'use client';

import { useState, type FormEvent, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // You can make this configurable

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false); // Automatically stop visual indication after result
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'An error occurred during speech recognition.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech was detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Microphone problem. Please ensure it is enabled and working.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Permission to use microphone was denied. Please enable it in your browser settings.';
        }
        toast({ variant: 'destructive', title: 'Voice Input Error', description: errorMessage });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        // This onend can be triggered by stop() or by speech recognition service itself.
        // Ensure isRecording is false if it's not already set by onresult or onerror.
        if (isRecording) {
          setIsRecording(false);
        }
      };
      setSpeechApiSupported(true);
    } else {
      setSpeechApiSupported(false);
      console.warn("Speech recognition not supported by this browser.");
    }

    const currentRecognition = recognitionRef.current;
    return () => {
      if (currentRecognition) {
        currentRecognition.onresult = null;
        currentRecognition.onerror = null;
        currentRecognition.onend = null;
        currentRecognition.onstart = null;
        currentRecognition.stop(); // Stop recognition if active
      }
    };
    // isRecording is intentionally omitted from deps to avoid re-running on its change,
    // as onend should handle its state. Cleanup logic is for unmount.
  }, [toast]);


  const handleVoiceInputClick = () => {
    if (!recognitionRef.current || !speechApiSupported) {
      toast({ variant: 'destructive', title: 'Voice input not supported', description: 'Your browser does not support speech recognition.' });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputValue(''); // Clear input before starting new recording
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        // Handle cases where start() might fail (e.g. already started, rare)
        console.error('Could not start voice recognition:', e);
        toast({ variant: 'destructive', title: 'Voice Input Error', description: 'Could not start voice recognition.' });
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isLoading) return;
    
    setInputValue(''); 
    await onSendMessage(trimmedValue);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 sm:p-4 bg-card" 
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
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handleVoiceInputClick}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-11 w-11 shrink-0",
                isRecording && "bg-destructive/10 text-destructive animate-pulse"
              )}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
              disabled={isLoading || !speechApiSupported}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{!speechApiSupported ? "Voice input not supported by your browser." : (isRecording ? "Stop recording" : "Start voice input")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        type="submit"
        variant="default"
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

