import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8009';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages([
      { text: 'Welcome to the Multi-Agent Chat. How can I assist you today?', sender: 'agent' }
    ]);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/invoke_agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: messageToSend }),
      });

      if (!response.ok) {
        throw new Error('Error contacting AI server');
      }

      const data = await response.json();
      
      const agentMessage: Message = {
        text: data.response,
        sender: 'agent',
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('FETCH FAILED. FULL ERROR OBJECT:', error);
      const errorMessage: Message = {
        text: 'Sorry, the AI agent is not responding. Please ensure the backend server is running and try again.',
        sender: 'agent',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl flex flex-col h-[70vh]"
    >
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-white">Multi-Agent Chat</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 my-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 my-4"
          >
            <div className="max-w-md p-3 rounded-lg bg-slate-700">
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700/50 space-y-4">
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={isLoading || input.trim() === ''}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
                Send
            </button>
        </div>
        <button
          className="w-full py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all"
        >
          Close Chat
        </button>
      </div>
    </motion.div>
  );
};

export default ChatInterface; 