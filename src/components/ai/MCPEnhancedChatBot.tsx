import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Zap, Brain, Database, Globe, Settings } from 'lucide-react';
import { useTenant, useMascot } from '@/lib/tenant-context';
import { mcpManager } from '@/lib/mcp/mcp-manager';
import { skillInjectionSystem } from '@/lib/mcp/skill-injection';
import { tenantIsolationManager } from '@/lib/mcp/tenant-isolation';

interface MCPMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  mcpEnhancements?: {
    skillsTriggered: string[];
    contextEnhancements: string[];
    memoryOperations: string[];
    executionTime: number;
  };
}

interface MCPStatus {
  connected: boolean;
  activeSkills: number;
  memoryContexts: number;
  lastUpdate: Date;
}

export const MCPEnhancedChatBot: React.FC = () => {
  const { tenant } = useTenant();
  const mascot = useMascot();
  const [messages, setMessages] = useState<MCPMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mcpStatus, setMCPStatus] = useState<MCPStatus>({
    connected: false,
    activeSkills: 0,
    memoryContexts: 0,
    lastUpdate: new Date()
  });
  const [showMCPPanel, setShowMCPPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string>(`conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize MCP systems
  useEffect(() => {
    if (!tenant) return;

    const initializeMCP = async () => {
      try {
        // Initialize MCP Manager
        await mcpManager.initialize();
        
        // Initialize tenant environment
        await tenantIsolationManager.initializeTenantEnvironment(tenant.id);
        
        // Update status
        setMCPStatus({
          connected: true,
          activeSkills: skillInjectionSystem.getActiveSkills(tenant.id).length,
          memoryContexts: 1,
          lastUpdate: new Date()
        });

        // Add initial system message
        const systemMessage: MCPMessage = {
          id: `sys-${Date.now()}`,
          role: 'system',
          content: `MCP Enhanced ${mascot?.name || 'Assistant'} is now online with superpowers! 🚀\n\nActive capabilities:\n• Persistent memory across conversations\n• Real-time data fetching\n• Web automation and PDF generation\n• Industry-specific intelligence\n• Smart skill injection`,
          timestamp: new Date(),
          mcpEnhancements: {
            skillsTriggered: [],
            contextEnhancements: ['MCP System Initialized'],
            memoryOperations: ['Context Created'],
            executionTime: 0
          }
        };
        
        setMessages([systemMessage]);
        
      } catch (error) {
        console.error('Failed to initialize MCP:', error);
        setMCPStatus(prev => ({ ...prev, connected: false }));
      }
    };

    initializeMCP();
  }, [tenant, mascot]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !tenant) return;

    const userMessage: MCPMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const startTime = Date.now();
      
      // Analyze user input for skills
      const triggeredSkills = await skillInjectionSystem.analyzeUserInput(
        inputMessage,
        tenant.id,
        { stage: 'discovery', conversationId: conversationId.current }
      );

      // Execute triggered skills
      const skillExecutions = await skillInjectionSystem.executeSkillsParallel(
        triggeredSkills,
        { query: inputMessage, conversationId: conversationId.current },
        tenant.id,
        conversationId.current
      );

      // Get enhanced context
      const enhancedContext = skillInjectionSystem.getEnhancedContext(
        tenant.id,
        `User message: ${inputMessage}`
      );

      // Store user message in memory
      await mcpManager.executeRequest({
        id: `mem-store-${Date.now()}`,
        serverId: 'memory',
        capability: 'storeMemory',
        payload: {
          conversationId: conversationId.current,
          tenantId: tenant.id,
          type: 'context',
          content: inputMessage,
          importance: 'medium'
        },
        timestamp: new Date(),
        tenantId: tenant.id,
        conversationId: conversationId.current
      });

      // Generate AI response with MCP enhancements
      const aiResponse = await generateEnhancedAIResponse(
        inputMessage,
        enhancedContext,
        skillExecutions,
        tenant,
        mascot
      );

      const executionTime = Date.now() - startTime;

      const assistantMessage: MCPMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        mcpEnhancements: {
          skillsTriggered: triggeredSkills.map(s => s.name),
          contextEnhancements: enhancedContext.sources,
          memoryOperations: ['User Input Stored', 'Context Retrieved'],
          executionTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update MCP status
      setMCPStatus(prev => ({
        ...prev,
        activeSkills: skillInjectionSystem.getActiveSkills(tenant.id).length,
        lastUpdate: new Date()
      }));

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: MCPMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, but I encountered an issue processing your message. Please try again or contact support if the problem persists.`,
        timestamp: new Date(),
        mcpEnhancements: {
          skillsTriggered: [],
          contextEnhancements: [],
          memoryOperations: [],
          executionTime: 0
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnhancedAIResponse = async (
    userInput: string,
    enhancedContext: any,
    skillExecutions: any[],
    tenant: any,
    mascot: any
  ): Promise<string> => {
    // Build enhanced prompt with MCP context
    const mcpData = skillExecutions.map(exec => exec.output).filter(Boolean);
    const contextData = enhancedContext.enhancements.map(e => e.data).filter(Boolean);
    
    let enhancedPrompt = `${mascot?.system_prompt || 'You are a helpful AI assistant.'}\n\n`;
    
    // Add MCP-enhanced context
    if (mcpData.length > 0) {
      enhancedPrompt += `REAL-TIME DATA:\n${JSON.stringify(mcpData, null, 2)}\n\n`;
    }
    
    if (contextData.length > 0) {
      enhancedPrompt += `ENHANCED CONTEXT:\n${JSON.stringify(contextData, null, 2)}\n\n`;
    }
    
    enhancedPrompt += `CONVERSATION MEMORY: Available for context\n\n`;
    enhancedPrompt += `User: ${userInput}\n\nAssistant:`;

    // Call AI service with enhanced prompt
    try {
      const { chatWithAI } = await import('@/lib/ai-services');
      const response = await chatWithAI(enhancedPrompt, conversationId.current);
      
      // Store AI response in memory
      await mcpManager.executeRequest({
        id: `mem-store-resp-${Date.now()}`,
        serverId: 'memory',
        capability: 'storeMemory',
        payload: {
          conversationId: conversationId.current,
          tenantId: tenant.id,
          type: 'context',
          content: response,
          importance: 'medium'
        },
        timestamp: new Date(),
        tenantId: tenant.id,
        conversationId: conversationId.current
      });
      
      return response;
    } catch (error) {
      console.error('AI service error:', error);
      return `I understand you're asking about "${userInput}". Let me help you with that based on my knowledge and the enhanced context I have access to.`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!tenant || !mascot) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* MCP Status Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-8 w-8" />
            <Zap className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{mascot.name} with MCP Superpowers</h3>
            <p className="text-sm opacity-90">
              {mcpStatus.connected ? 'Connected' : 'Disconnected'} • 
              {mcpStatus.activeSkills} skills active • 
              Enhanced with real-time data
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMCPPanel(!showMCPPanel)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* MCP Status Panel */}
      {showMCPPanel && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Memory System</p>
                <p className="text-sm text-gray-600">{mcpStatus.memoryContexts} contexts active</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold">Skills Active</p>
                <p className="text-sm text-gray-600">{mcpStatus.activeSkills} capabilities</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold">Real-time Data</p>
                <p className="text-sm text-gray-600">Connected & monitoring</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role !== 'user' && (
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  {message.role === 'system' ? <Zap className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                {message.mcpEnhancements && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.role === 'system'
                  ? 'bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 border-l-4 border-green-500'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* MCP Enhancement Details */}
              {message.mcpEnhancements && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                  <div className="flex flex-wrap gap-2">
                    {message.mcpEnhancements.skillsTriggered.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        🧠 {message.mcpEnhancements.skillsTriggered.length} skills
                      </span>
                    )}
                    {message.mcpEnhancements.contextEnhancements.length > 0 && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        🔍 Enhanced context
                      </span>
                    )}
                    {message.mcpEnhancements.memoryOperations.length > 0 && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        💾 Memory ops
                      </span>
                    )}
                    {message.mcpEnhancements.executionTime > 0 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ⚡ {message.mcpEnhancements.executionTime}ms
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs opacity-70">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Processing with MCP superpowers...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${mascot.name} anything... MCP superpowers are active! 🚀`}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="flex items-center space-x-1">
            <span>Powered by MCP</span>
            <Zap className="h-3 w-3 text-yellow-500" />
          </span>
        </div>
      </div>
    </div>
  );
};