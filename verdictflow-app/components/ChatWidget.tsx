"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatWidget({ tenantId }: { tenantId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "ASSISTANT" | "USER"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate simple session ID
    let sid = localStorage.getItem("vf_session_id");
    if (!sid) {
      sid = Math.random().toString(36).substring(7);
      localStorage.setItem("vf_session_id", sid);
    }
    setSessionId(sid);
    
    // Initial greeting
    setMessages([{ role: "ASSISTANT", content: "Hello! I'm the VerdictFlow AI assistant. How can I help you today? Please tell me your name." }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "USER", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          externalId: sessionId,
          message: userMessage,
        }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "ASSISTANT", content: data.response }]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-black">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg text-white hover:bg-blue-700 transition-all"
        >
          <MessageCircle size={28} />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <h3 className="font-bold">VerdictFlow AI</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)}><Minus size={18} /></button>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg text-sm",
                  m.role === "USER"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-800 mr-auto"
                )}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 text-gray-800 mr-auto max-w-[80%] p-3 rounded-lg text-sm italic">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-sm outline-none bg-gray-50 p-2 rounded-lg"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
