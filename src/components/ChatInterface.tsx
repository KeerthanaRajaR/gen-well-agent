import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { User } from "@/types/user";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  user: User;
  onDataUpdate?: (type: string, data: any) => void;
}

export const ChatInterface = ({ user, onDataUpdate }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello ${user.first_name}! 👋 I'm your personal health assistant. I'm here to help you track your glucose levels, log your meals, monitor your mood, and create personalized meal plans. How can I assist you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual agent logic)
    setTimeout(() => {
      const response = generateResponse(input.toLowerCase(), user);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (input: string, user: User): string => {
    if (input.includes("glucose") || input.includes("cgm") || input.includes("sugar")) {
      return `Your latest glucose reading is ${user.latest_cgm} mg/dL. ${
        user.latest_cgm > 180 ? "This is above the normal range. Let's work on getting this under control with proper meal planning." : 
        user.latest_cgm < 80 ? "This is below the normal range. You may need to eat something soon." :
        "This is within the normal range. Great job!"
      }`;
    }
    
    if (input.includes("mood") || input.includes("feeling")) {
      return `Your current mood is recorded as ${user.mood}. How are you feeling right now? I can help track your mood patterns over time.`;
    }
    
    if (input.includes("meal") || input.includes("food") || input.includes("eat")) {
      return `I can help you log your meals and create a personalized meal plan. Your dietary preference is ${user.dietary_preference}${
        user.medical_conditions !== "None" ? `, and I'll take into account your ${user.medical_conditions}` : ""
      }. What would you like to do?`;
    }
    
    if (input.includes("plan")) {
      return `I can create a meal plan tailored to your needs. Based on your profile (${user.dietary_preference}, ${user.medical_conditions}), I'll suggest balanced meals. Would you like me to generate a meal plan for today?`;
    }
    
    return `I can help you with:\n• Tracking glucose (CGM) readings\n• Logging meals and food intake\n• Monitoring your mood\n• Creating personalized meal plans\n• Answering general health questions\n\nWhat would you like to do?`;
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-lg">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Health Assistant Chat
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {message.role === "user" ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend}
            size="icon"
            className="gradient-primary text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
