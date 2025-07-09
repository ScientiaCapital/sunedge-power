import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithAI } from '@/lib/ai-services';
import { AI_CONFIG } from '@/lib/ai-config';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SunnyChatIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SunnyChatIntegration = ({ isOpen, onClose }: SunnyChatIntegrationProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm Sunny! ☀️ Ask me about commercial solar savings or get a quick quote!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const context = `You are Sunny, the friendly solar energy mascot for SunEdge Power. Keep responses VERY CONCISE - aim for 1-3 sentences max.
        SunEdge Power: Commercial solar only (100kW to MW+), 18+ years experience, 12 states.
        Specialties: Solar farms, C&I, apartments, large venues.
        Be friendly, use emojis sparingly. Get to the point quickly.
        For quotes: Ask location, facility size, energy usage.`;

      const response = await chatWithAI(input, context);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops! I'm having trouble connecting right now. ☁️ Please call us at 1-888-SUN-EDGE for immediate assistance!",
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed inset-x-4 top-[20%] mx-auto max-w-lg z-50 md:inset-x-auto md:right-8 md:left-auto"
        >
          <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-solar-500/30">
            {/* Header with Sunny */}
            <div className="bg-gradient-to-r from-solar-600 to-solar-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.img
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                  alt="Sunny"
                  className="h-12 w-auto"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">Chat with Sunny!</h3>
                  <p className="text-solar-100 text-sm">Your Solar Energy Expert</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-solar-700 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
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
                          <motion.img
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                            alt="Sunny"
                            className="h-6 w-auto mt-0.5 flex-shrink-0"
                          />
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
                    <div className="bg-gray-800 rounded-2xl px-4 py-2 border border-gray-700 flex items-center space-x-2">
                      <motion.img
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                        alt="Sunny thinking"
                        className="h-6 w-auto"
                      />
                      <Loader2 className="h-4 w-4 animate-spin text-solar-400" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {['Get a Solar Quote', 'How much can I save?', 'Solar for my business'].map(
                  (action) => (
                    <button
                      key={action}
                      onClick={() => setInput(action)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
                    >
                      {action}
                    </button>
                  ),
                )}
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
                  placeholder="Ask Sunny about solar energy..."
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mascot component that triggers the chat
export const SunnyMascot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    // Hide tooltip after 8 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!AI_CONFIG.enableChat) {
    // If chat is disabled, just show the mascot without interaction
    return (
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <img
          src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
          alt="Sunny - SunEdge Power Mascot"
          className="h-32 w-auto drop-shadow-2xl"
        />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <motion.img
          whileHover={{ scale: 1.1, rotate: 5 }}
          onClick={() => setIsChatOpen(true)}
          src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
          alt="Sunny - Click to chat!"
          className="h-32 w-auto drop-shadow-2xl cursor-pointer"
        />

        {/* Animated chat bubble tooltip */}
        <AnimatePresence>
          {showTooltip && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, scale: 0, x: '-50%' }}
              className="absolute -top-12 left-1/2 transform bg-white rounded-2xl px-4 py-2 shadow-lg"
            >
              <div className="relative">
                <p className="text-sm font-medium text-gray-800">Click me to chat! 💬</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing indicator */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
        >
          <span className="text-sm font-medium text-white flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Chat with Sunny!
          </span>
        </motion.div>
      </motion.div>

      <SunnyChatIntegration isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
