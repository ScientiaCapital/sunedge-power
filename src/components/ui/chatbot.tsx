import React, { useState, useRef, useEffect } from 'react';

/**
 * Sunny Chatbot Widget
 * Now with conversational context (memory)
 */

// Sunny mascot SVG
const SunnySVG = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="8" fill="#FFD600" />
    <g stroke="#FFB300" strokeWidth="2">
      <line x1="16" y1="2" x2="16" y2="7" />
      <line x1="16" y1="25" x2="16" y2="30" />
      <line x1="2" y1="16" x2="7" y2="16" />
      <line x1="25" y1="16" x2="30" y2="16" />
      <line x1="6.22" y1="6.22" x2="9.54" y2="9.54" />
      <line x1="22.46" y1="22.46" x2="25.78" y2="25.78" />
      <line x1="6.22" y1="25.78" x2="9.54" y2="22.46" />
      <line x1="22.46" y1="9.54" x2="25.78" y2="6.22" />
    </g>
    <circle cx="16" cy="16" r="8" fill="#FFD600" />
    <ellipse cx="16" cy="19" rx="4" ry="2" fill="#FFF9C4" />
    <ellipse cx="13" cy="15" rx="1.2" ry="1.5" fill="#fff" />
    <ellipse cx="19" cy="15" rx="1.2" ry="1.5" fill="#fff" />
    <ellipse cx="13" cy="15.5" rx="0.5" ry="0.7" fill="#333" />
    <ellipse cx="19" cy="15.5" rx="0.5" ry="0.7" fill="#333" />
    <path d="M14 18c.5.5 1.5.5 2 0" stroke="#333" strokeWidth=".5" strokeLinecap="round" />
  </svg>
);

type Message = { from: 'user' | 'sunny'; text: string };

type ChatRequest = {
  messages: { role: 'user' | 'assistant'; content: string }[];
};

// Add a simple markdown parser for images, links, and tables
function renderRichText(text: string) {
  // Images: ![alt](url)
  const imageMatch = text.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (imageMatch) {
    return <img src={imageMatch[2]} alt={imageMatch[1]} className="max-w-full rounded shadow" />;
  }
  // Links: [text](url)
  const linkMatch = text.match(/^\[(.*?)\]\((.*?)\)$/);
  if (linkMatch) {
    return (
      <a
        href={linkMatch[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {linkMatch[1]}
      </a>
    );
  }
  // Tables: | col1 | col2 |\n|------|------|\n| val1 | val2 |
  if (text.includes('|') && text.includes('\n')) {
    const lines = text.split('\n').filter(Boolean);
    if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('|')) {
      const headers = lines[0]
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean);
      const rows = lines.slice(2).map((row) =>
        row
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean),
      );
      return (
        <table className="min-w-full text-xs border mt-2 mb-2">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border px-2 py-1 bg-yellow-100">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((c, j) => (
                  <td key={j} className="border px-2 py-1">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }
  // Fallback: plain text
  return <span>{text}</span>;
}

// Type declarations for browser SpeechRecognition APIs (if not present)
declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: unknown;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Guided project data collection state
  const [estimateStep, setEstimateStep] = useState<null | 'location' | 'roof' | 'usage' | 'done'>(
    null,
  );
  const [estimateData, setEstimateData] = useState<{
    location?: string;
    roof?: string;
    usage?: string;
  }>({});

  // Voice input/output state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Detect if user asks for an estimate
  useEffect(() => {
    if (messages.length > 0 && estimateStep === null) {
      const last = messages[messages.length - 1];
      if (last.from === 'user' && /estimate|quote|how much|cost|price|system/i.test(last.text)) {
        setEstimateStep('location');
        setMessages((msgs) => [
          ...msgs,
          {
            from: 'sunny',
            text: 'Great! To provide an estimate, what is your project location (city, state)?',
          },
        ]);
      }
    }
  }, [messages, estimateStep]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [open, messages]);

  const handleToggle = () => setOpen((v) => !v);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');
    try {
      // Prepare context for backend
      const context = newMessages.map((msg) => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: context }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { from: 'sunny', text: data.response || 'Sorry, I could not answer that.' },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'sunny', text: 'Sorry, there was an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages((msgs) => [...msgs, { from: 'user', text: `Uploaded file: ${file.name}` }]);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'sunny',
          text: data.summary || 'File received. I will use this info for your project.',
        },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'sunny', text: 'Sorry, there was an error processing your file.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice input (speech-to-text)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognitionClass = (window.webkitSpeechRecognition ??
      window.SpeechRecognition) as new () => SpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: unknown) => {
      const transcript = (event as SpeechRecognitionEvent).results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // Voice output (text-to-speech)
  const handleVoiceOutput = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
    setIsSpeaking(true);
  };

  // Handle guided input
  const handleGuidedInput = async (value: string) => {
    if (estimateStep === 'location') {
      setEstimateData((d) => ({ ...d, location: value }));
      setEstimateStep('roof');
      setMessages((msgs) => [
        ...msgs,
        { from: 'user', text: value },
        { from: 'sunny', text: 'What is your roof size (in sq ft or m²)?' },
      ]);
    } else if (estimateStep === 'roof') {
      setEstimateData((d) => ({ ...d, roof: value }));
      setEstimateStep('usage');
      setMessages((msgs) => [
        ...msgs,
        { from: 'user', text: value },
        { from: 'sunny', text: 'What is your average monthly energy usage (in kWh)?' },
      ]);
    } else if (estimateStep === 'usage') {
      setEstimateData((d) => ({ ...d, usage: value }));
      setEstimateStep('done');
      setMessages((msgs) => [
        ...msgs,
        { from: 'user', text: value },
        { from: 'sunny', text: 'Thanks! Calculating your estimate...' },
      ]);
      // Send all info to backend for estimate
      setIsLoading(true);
      try {
        const context = [
          ...messages.map((msg) => ({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          { role: 'user', content: `Location: ${estimateData.location}` },
          { role: 'user', content: `Roof size: ${estimateData.roof}` },
          { role: 'user', content: `Energy usage: ${value}` },
        ];
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: context }),
        });
        const data = await res.json();
        setMessages((msgs) => [
          ...msgs,
          { from: 'sunny', text: data.response || 'Sorry, I could not generate an estimate.' },
        ]);
      } catch (err) {
        setMessages((msgs) => [
          ...msgs,
          { from: 'sunny', text: 'Sorry, there was an error calculating your estimate.' },
        ]);
      } finally {
        setIsLoading(false);
        setEstimateStep(null);
        setEstimateData({});
      }
    }
  };

  // Add analytics placeholder
  function trackChatEvent(event: string, data?: unknown) {
    // TODO: Integrate with Plausible, Umami, or Google Analytics
    // Example: plausible('chat_event', { props: { event, ...data } });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Button */}
      {!open && (
        <button
          aria-label="Open Sunny Chatbot"
          className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg p-4 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 animate-bounce"
          onClick={handleToggle}
        >
          {SunnySVG}
          <span className="font-bold text-lg hidden sm:inline">Chat with Sunny</span>
        </button>
      )}
      {/* Chat Window */}
      {open && (
        <div className="w-80 max-w-xs sm:max-w-sm bg-white border border-yellow-300 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center bg-yellow-400 px-4 py-2">
            {SunnySVG}
            <span className="font-bold text-lg text-white">Sunny</span>
            <button
              aria-label="Close chat"
              className="ml-auto text-white hover:text-yellow-100 focus:outline-none"
              onClick={handleToggle}
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div
            className="flex-1 p-3 space-y-2 overflow-y-auto bg-yellow-50"
            style={{ maxHeight: 320 }}
          >
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm text-center mt-8">
                Ask me anything about solar, clean energy, or get a quick estimate!
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.from === 'user' ? 'text-right' : 'text-left flex items-center'}
              >
                {msg.from === 'sunny' && SunnySVG}
                <span
                  className={
                    'inline-block rounded-lg px-3 py-2 ' +
                    (msg.from === 'user'
                      ? 'bg-yellow-200 text-gray-800 ml-auto'
                      : 'bg-white text-gray-800 border border-yellow-200')
                  }
                  aria-label={msg.from === 'sunny' ? 'Sunny says' : 'You said'}
                >
                  {msg.from === 'sunny' ? renderRichText(msg.text) : msg.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center text-gray-400 text-sm">
                {SunnySVG}
                Sunny is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="flex items-center border-t border-yellow-200 bg-white px-2 py-2">
            {/* Voice input button */}
            <button
              onClick={handleVoiceInput}
              aria-label={isListening ? 'Stop listening' : 'Speak to Sunny'}
              className={`mr-2 rounded-full p-2 ${isListening ? 'bg-yellow-300' : 'bg-yellow-100'} text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              disabled={isLoading}
              tabIndex={0}
            >
              <span role="img" aria-label="Microphone">
                🎤
              </span>
            </button>
            {/* Speaker button for last Sunny message */}
            <button
              onClick={() => {
                const lastSunny = [...messages].reverse().find((m) => m.from === 'sunny');
                if (lastSunny) handleVoiceOutput(lastSunny.text);
              }}
              aria-label={isSpeaking ? 'Stop speaking' : 'Read Sunny response aloud'}
              className={`mr-2 rounded-full p-2 ${isSpeaking ? 'bg-yellow-300' : 'bg-yellow-100'} text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              disabled={isLoading || !messages.some((m) => m.from === 'sunny')}
              tabIndex={0}
            >
              <span role="img" aria-label="Speaker">
                🔊
              </span>
            </button>
            {estimateStep ? (
              <input
                ref={inputRef}
                type="text"
                className="flex-1 rounded-lg border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder={
                  estimateStep === 'location'
                    ? 'Enter your project location...'
                    : estimateStep === 'roof'
                      ? 'Enter your roof size...'
                      : 'Enter your energy usage...'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleGuidedInput(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
                aria-label="Guided input for estimate"
                disabled={isLoading}
              />
            ) : (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 rounded-lg border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  aria-label="Type your message to Sunny"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                  aria-label="Send message"
                  disabled={isLoading || !input.trim()}
                >
                  Send
                </button>
                <label className="ml-2 cursor-pointer" aria-label="Upload file for Sunny">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    accept=".pdf,.jpg,.jpeg,.png,.csv,.txt"
                  />
                  <span className="inline-block bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg px-2 py-1 text-xs font-bold">
                    Upload
                  </span>
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
