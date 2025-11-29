"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Image, X } from 'lucide-react';
import { ChatMessage } from '@/types';

const quickReplies = [
  "On the way",
  "Reaching in 5 mins",
  "Almost there",
  "Need more time",
  "See you soon!",
];

interface ChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  workerName?: string;
}

export function ChatUI({ messages, currentUserId, onSendMessage, isTyping, workerName }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleQuickReply = (reply: string) => {
    onSendMessage(reply);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`chat-bubble ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
              <p>{msg.message}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble received">
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{workerName} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="quick-reply whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
            <Image className="w-5 h-5 text-[var(--text-tertiary)]" />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="form-input flex-1 py-3"
          />
          
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 gradient-primary rounded-xl text-white disabled:opacity-50 transition-all hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

