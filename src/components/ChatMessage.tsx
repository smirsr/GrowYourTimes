import { Chat } from "@shared/schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  chat: Chat;
  className?: string;
}

export default function ChatMessage({ chat, className }: ChatMessageProps) {
  const timestamp = new Date(chat.timestamp);
  
  if (chat.isUser) {
    return (
      <div className={cn(
        "chat-bubble user-bubble",
        className
      )}>
        <p>{chat.message}</p>
        <div className="text-xs text-right mt-1 text-gray-200">
          {format(timestamp, 'h:mm a')}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start mb-4">
      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-primary-dark h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      </div>
      <div className={cn(
        "chat-bubble ai-bubble",
        className
      )}>
        <p>{chat.message}</p>
        <div className="text-xs text-right mt-1 text-gray-500">
          {format(timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  );
}
