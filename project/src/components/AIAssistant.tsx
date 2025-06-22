import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        content: "Welcome to the ADK Multi-Agent Platform! I am your AI assistant. I can help you with a variety of tasks. For example, you can ask me to 'summarize agent activity', 'check workflow status', or 'analyze system health'.",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.toLowerCase();
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm sorry, I can only provide simulated responses at the moment. Please try one of the suggested commands.";
      
      if (currentInput.includes('hello') || currentInput.includes('hi')) {
        response = "Hello! As an AI assistant for the ADK platform, I can help you with various tasks. What would you like to explore?";
      } else if (currentInput.includes('help')) {
        response = "You can ask me to 'summarize agent activity', 'check workflow status', or 'analyze system health'. Which of these would you like to know more about?";
      } else if (currentInput.includes('status') || currentInput.includes('workflow')) {
        response = "All workflows are currently running as expected in our simulation. No anomalies detected.";
      } else if (currentInput.includes('summarize') || currentInput.includes('activity')) {
        response = "Agent activity has been nominal for the past 24 hours. The translation agent has processed 15 documents and the data analysis agent has completed 3 major tasks.";
      } else if (currentInput.includes('analyze') || currentInput.includes('health')) {
        response = "System health is optimal. CPU usage is at 45%, memory at 60%, and network latency is less than 50ms. All services are running smoothly.";
      }

      const aiMessage: ChatMessage = {
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="bg-slate-700/30 px-6 py-4 border-b border-slate-600/30">
        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        <p className="text-sm text-slate-400">Powered by Google ADK</p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-600/30">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isProcessing}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 