
'use client';

import { useState, type FormEvent, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const { language, t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechApiSupported(false);
      console.warn("Speech recognition not supported by this browser.");
      return;
    }
    
    setSpeechApiSupported(true);
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'gu' ? 'gu-IN' : 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let errorMessageKey = 'chatInput.voiceInput.toast.errorTitle';
      if (event.error === 'no-speech') {
        errorMessageKey = 'chatInput.voiceInput.toast.noSpeechDesc';
      } else if (event.error === 'audio-capture') {
        errorMessageKey = 'chatInput.voiceInput.toast.micProblemDesc';
      } else if (event.error === 'not-allowed') {
        errorMessageKey = 'chatInput.voiceInput.toast.permissionDeniedDesc';
      }
      toast({ 
          variant: 'destructive', 
          title: t('chatInput.voiceInput.toast.errorTitle'), 
          description: t(errorMessageKey) 
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.onstart = () => {
      // setIsRecording(true) is handled in handleVoiceInputClick to provide immediate UI feedback
    };

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.onstart = null;
        if (isRecordingRef.current) { 
            try {
                recognition.stop();
            } catch (e) {
                console.warn("Error stopping recognition on cleanup:", e);
            }
        }
      }
    };
  }, [language, t, toast]);

  const handleVoiceInputClick = () => {
    if (!speechApiSupported) {
      toast({ 
          variant: 'destructive', 
          title: t('chatInput.voiceInput.toast.errorTitle'), 
          description: t('chatInput.voiceInput.toast.notSupportedDesc') 
      });
      return;
    }
    if (!recognitionRef.current) {
        toast({
            variant: 'destructive',
            title: t('chatInput.voiceInput.toast.errorTitle'),
            description: "Speech recognition service not ready. Please try again."
        });
        return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch(e) {
        console.warn("Error explicitly stopping recognition:", e);
        setIsRecording(false); 
      }
    } else {
      setInputValue(''); 
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Could not start voice recognition:', e);
        toast({ 
            variant: 'destructive', 
            title: t('chatInput.voiceInput.toast.errorTitle'), 
            description: t('chatInput.voiceInput.toast.couldNotStart') 
        });
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isLoading || isRecording) return;
    
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
        placeholder={t('chatInput.placeholder')}
        className="flex-1 rounded-full h-11 px-5 text-sm focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-0 border-border shadow-sm"
        aria-label={t('chatInput.placeholder')}
        disabled={isLoading || isRecording}
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
              aria-label={isRecording ? t('chatInput.voiceInput.tooltip.stop') : t('chatInput.voiceInput.tooltip.start')}
              disabled={isLoading || !speechApiSupported}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{!speechApiSupported ? t('chatInput.voiceInput.tooltip.notSupported') : (isRecording ? t('chatInput.voiceInput.tooltip.stop') : t('chatInput.voiceInput.tooltip.start'))}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        aria-label={t('chatInput.sendMessageButtonLabel')}
        disabled={isLoading || !inputValue.trim() || isRecording}
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
