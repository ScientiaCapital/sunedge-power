import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithAI } from '@/lib/ai-services';
import { AI_CONFIG } from '@/lib/ai-config';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Sunny, your solar energy assistant. SunEdge Power specializes in commercial solar, but we may be able to help with residential projects. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addressRegex = /\d+\s+\w+.*(street|st\.?|avenue|ave\.?|road|rd\.?|drive|dr\.?|lane|ln\.?|blvd|boulevard|court|ct\.?|parkway|pkwy|circle|cir\.?)/i;

  // Debug logging
  useEffect(() => {
    console.log('ChatBot mounted. AI_CONFIG.enableChat:', AI_CONFIG.enableChat);
    console.log('AI_CONFIG.geminiKey exists:', !!AI_CONFIG.geminiKey);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (addressRegex.test(input)) {
        // Address detected, call proposal API
        const res = await axios.post('/api/proposal', { address: input });
        const proposal = res.data;
        const summary = `Here's your custom solar proposal:\n- Address: ${proposal.address}\n- Location: (${proposal.lat}, ${proposal.lng})\n- Utility Rates: ${proposal.utilityRates ? JSON.stringify(proposal.utilityRates) : 'N/A'}`;
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: summary,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Normal AI chat flow
        const context = `You are Sunny, a helpful solar energy assistant for SunEdge Power. \nSunEdge Power specializes in commercial solar installations nationwide, including:\n- Solar farms and ground mount systems\n- Commercial & industrial solar (100kW to MW+ systems)\n- Multi-family and apartment complexes\n- Amusement parks and large venues\nWe have 18+ years of experience and operate in 12 states.\n\nInstructions:\n- If a user asks about residential solar, say: 'While SunEdge Power specializes in commercial solar, we may be able to help or refer you to a trusted residential installer in your area. Please share your location and project details, and we’ll do our best to assist or connect you with the right expert.'\n`;
        const response = await chatWithAI(input, context);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please call us at 1-888-SUN-EDGE for immediate assistance.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!AI_CONFIG.enableChat) return null;

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-solar-500 hover:bg-solar-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Open chat"
            >
              <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-800"
          >
            {/* Header */}
            <div className="bg-solar-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-8 w-8 text-white" />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sunny AI Assistant</h3>
                  <p className="text-solar-100 text-sm">Always here to help</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-solar-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-solar-500 text-white'
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-solar-400" />
                        )}
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.sender === 'user' && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800 rounded-2xl px-4 py-2 border border-gray-700">
                      <Loader2 className="h-4 w-4 animate-spin text-solar-400" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {['Get a Quote', 'Solar Savings', 'Our Services'].map((action) => (
                  <button
                    key={action}
                    onClick={() => setInput(action)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex space-x-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about solar solutions..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-solar-500 hover:bg-solar-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
