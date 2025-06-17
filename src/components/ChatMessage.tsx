'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date; // Keep for potential future use, not displayed currently
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-border shadow-sm">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-xl px-4 py-2.5 shadow-sm break-words text-sm', // Applied text-sm here for consistency
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none border border-border'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />,
              pre: ({node, ...props}) => <pre {...props} className="bg-muted p-2 my-2 rounded-md overflow-x-auto text-xs" />,
              code: ({node, inline, className, children, ...props}) => {
                return !inline ? (
                  <code {...props} className={cn(className, "font-mono")}>
                    {children}
                  </code>
                ) : (
                  <code {...props} className={cn(className, "bg-muted px-1 py-0.5 rounded-sm font-mono")}>
                    {children}
                  </code>
                );
              },
              ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 my-2 space-y-1" />,
              ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 my-2 space-y-1" />,
              p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
              h1: ({node, ...props}) => <h1 {...props} className="text-xl font-semibold mt-4 mb-2" />,
              h2: ({node, ...props}) => <h2 {...props} className="text-lg font-semibold mt-3 mb-1" />,
              h3: ({node, ...props}) => <h3 {...props} className="text-base font-semibold mt-2 mb-1" />,
              blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-border pl-3 italic my-2 text-muted-foreground" />,
              hr: ({node, ...props}) => <hr {...props} className="my-4 border-border" />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 border border-border shadow-sm">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
