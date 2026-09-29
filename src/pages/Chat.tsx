import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Info } from "lucide-react";
import { Chat } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Fetch chat messages
  const { data: chats = [], isLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
    refetchOnWindowFocus: false,
  });
  
  // Send chat message mutation
  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/chats", {
        message,
        isUser: true
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage.mutate(message);
  };
  
  const handleQuickPrompt = (promptText: string) => {
    sendMessage.mutate(promptText);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-sm flex items-center">
        <h1 className="text-xl font-bold text-neutral-dark flex-1">Carmelina</h1>
        <button className="text-neutral-dark p-2 hover:bg-neutral rounded-full">
          <Info className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto" id="chat-messages">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <svg 
              className="animate-spin h-8 w-8 text-primary" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : chats?.length > 0 ? (
          <>
            {chats.map((chat) => (
              <ChatMessage key={chat.id} chat={chat} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary mb-4"
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
            <h3 className="text-lg font-semibold text-neutral-dark mb-2">
              Carmelina
            </h3>
            <p className="text-neutral-dark mb-4">
              I'm Carmelina, your plant assistant! I'm here to help you stay motivated, organize tasks, and grow your virtual garden. 
              How can I help you today?
            </p>
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 bg-white border-t border-neutral">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-neutral rounded-full px-4 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sendMessage.isPending}
            />
            <Button
              type="submit"
              className="ml-2 bg-primary hover:bg-primary-dark text-white rounded-full w-10 h-10 flex items-center justify-center"
              disabled={sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm mt-2">
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 bg-primary-light text-primary-dark rounded-full hover:bg-primary hover:text-white transition"
              onClick={() => handleQuickPrompt("Help me organize my tasks")}
              disabled={sendMessage.isPending}
            >
              Help with tasks
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 bg-primary-light text-primary-dark rounded-full hover:bg-primary hover:text-white transition"
              onClick={() => handleQuickPrompt("Tell me how to care for my current plant")}
              disabled={sendMessage.isPending}
            >
              Plant care tips
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 bg-primary-light text-primary-dark rounded-full hover:bg-primary hover:text-white transition"
              onClick={() => handleQuickPrompt("Give me productivity advice")}
              disabled={sendMessage.isPending}
            >
              Productivity advice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
