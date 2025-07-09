import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  X,
  MessageSquare,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithAI } from '@/lib/ai-services';
import { AI_CONFIG } from '@/lib/ai-config';
import { enhanceResponse, calculateQuickROI } from '@/lib/solar-knowledge-base';

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
      text: "Good to meet you! I'm Sunny from SunEdge Power. ☀️ With 18 years in commercial solar, I'm here to help you save money and go green. What's your facility type and location?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Smooth scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive or loading state changes
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      // Focus input
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Scroll to bottom when chat opens
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [isOpen]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setInput(transcript);

          if (event.results[current].isFinal) {
            setIsListening(false);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      // Speech Synthesis - Sunny's voice
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.rate = 0.9; // Slightly slower for clarity and authority
        utterance.pitch = 0.8; // Lower pitch for masculine voice
        utterance.volume = 1.0;

        // Find a suitable male voice
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          // Look for American English male voices
          const maleVoices = voices.filter(
            (voice) =>
              voice.lang.includes('en-US') &&
              (voice.name.toLowerCase().includes('male') ||
                voice.name.includes('David') ||
                voice.name.includes('Mark') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('James')),
          );

          if (maleVoices.length > 0) {
            utterance.voice = maleVoices[0];
          } else {
            // Fallback to any US English voice
            const usVoice = voices.find((voice) => voice.lang === 'en-US');
            if (usVoice) utterance.voice = usVoice;
          }
        };

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.getVoices().length > 0) {
          setVoice();
        } else {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        speechSynthesisRef.current = utterance;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      // Get enhanced context based on the query
      const enhancedContext = enhanceResponse(input);

      const context = `You are Sunny, the commercial solar expert mascot for SunEdge Power. Keep responses CONCISE (2-3 sentences) but informative.
        
        ${enhancedContext}
        
        Instructions:
        - Focus on commercial, industrial, and utility-scale solar (100kW to 100MW+)
        - Provide specific numbers and calculations when relevant
        - If asked about costs/ROI, use the data provided to give real estimates
        - Be enthusiastic but professional
        - Use ☀️ emoji occasionally but not excessively
        - For quotes: Get location, facility type, monthly electric bill or usage
        - Mention relevant incentives (30% ITC, depreciation, etc.)
        
        Current query: ${input}`;

      const response = await chatWithAI(input, context);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Speak the response
      speakMessage(response);
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

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        // If already started, restart
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      }
    }
  };

  const speakMessage = (text: string) => {
    if (!speechSynthesisRef.current || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Update the text with Sunny's personality
    speechSynthesisRef.current.text = text;

    // Speak with Sunny's voice
    window.speechSynthesis.speak(speechSynthesisRef.current);
  };

  if (!AI_CONFIG.enableChat) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20, rotateX: -20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed inset-x-4 top-[20%] mx-auto max-w-lg z-50 md:inset-x-auto md:right-8 md:left-auto"
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        >
          <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-solar-500/30">
            {/* Header with Sunny */}
            <div className="bg-gradient-to-r from-solar-600 to-solar-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <motion.img
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                    alt="Sunny"
                    className="h-12 w-auto"
                  />
                  <AnimatePresence>
                    {isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
                      >
                        <Volume2 className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Chat with Sunny!</h3>
                  <p className="text-solar-100 text-sm">
                    {isSpeaking
                      ? 'Speaking...'
                      : isListening
                        ? 'Listening...'
                        : 'Your Solar Energy Expert'}
                  </p>
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
                {/* Invisible div to maintain scroll position */}
                <div ref={messagesEndRef} className="h-2" />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {[
                  '💰 ROI for 500kW system?',
                  '🏭 Manufacturing facility solar',
                  '🔋 Battery storage options',
                  '📊 Calculate my savings',
                ].map((action) => (
                  <motion.button
                    key={action}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(action.replace(/^[^\s]+ /, ''))}
                    className="text-xs bg-gray-800 hover:bg-solar-600/20 text-gray-300 hover:text-solar-400 px-3 py-1 rounded-full transition-all duration-200 border border-gray-700 hover:border-solar-500/50"
                  >
                    {action}
                  </motion.button>
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
                  placeholder={isListening ? 'Listening...' : 'Ask Sunny about solar energy...'}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isLoading || isListening}
                />
                {speechSupported && (
                  <Button
                    type="button"
                    size="icon"
                    onClick={toggleVoiceInput}
                    className={`${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
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
  const [isHovered, setIsHovered] = useState(false);

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

  const handleMascotClick = () => {
    setIsChatOpen(true);
    setShowTooltip(false);
  };

  if (!AI_CONFIG.enableChat) {
    console.log('Chat is disabled in AI_CONFIG');
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect when hovered */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-solar-400/30 rounded-full blur-xl"
            />
          )}
        </AnimatePresence>

        {/* Sparkle effects */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 30],
                    y: [0, -20 - i * 10],
                  }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Sparkles className="h-4 w-4 text-solar-400" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.img
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMascotClick}
          src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
          alt="Sunny - Click to chat!"
          className="h-32 w-auto drop-shadow-2xl cursor-pointer relative z-10"
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
