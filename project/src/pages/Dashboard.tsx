import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardHome from '../components/DashboardHome';
import Workflows from '../components/Workflows';
import AgentMonitor from '../components/AgentMonitor';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';
import Security from '../components/Security';
import DataSources from '../components/DataSources';
import NotificationsPage from '../components/NotificationsPage';
import { MessageSquare } from 'lucide-react';
import { AgentProvider, useAgent } from '../context/AgentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8009';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Hello! How can I help you with the ADK platform today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChatModal]);

  const handleSendMessage = async () => {
    if (chatInput.trim() === '' || chatLoading) return;
    const newMessages = [...chatMessages, { sender: 'user', text: chatInput }];
    setChatMessages(newMessages);
    const currentChatInput = chatInput;
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch(`${API_URL}/invoke_agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentChatInput
        })
      });
      const data = await res.json();
      if (data.response) {
        setChatMessages(msgs => [...msgs, { sender: 'support', text: data.response }]);
      } else {
        setChatMessages(msgs => [...msgs, { sender: 'support', text: 'Sorry, the AI agent returned an empty response.' }]);
      }
    } catch (err) {
      console.error('FETCH FAILED:', err);
      setChatMessages(msgs => [...msgs, { sender: 'support', text: 'The AI server is not responding. Please ensure it is running.' }]);
    }
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showHelpModal={showHelpModal}
        setShowHelpModal={(val) => {
          setShowHelpModal(val);
          if (val) setShowChatModal(false);
        }}
        showChatModal={showChatModal}
        setShowChatModal={(val) => {
          setShowChatModal(val);
          if (val) setShowHelpModal(false);
        }}
      />
      {/* Render modals at the root, outside the header */}
      {(showHelpModal || showChatModal) && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-3">
          {/* Help Modal - larger, scrollable if needed */}
          {showHelpModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-xl min-w-[22rem] shadow-2xl pointer-events-auto`}
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.45)', maxHeight: '32rem', overflowY: 'auto' }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Help & Support</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h4 className="font-medium text-blue-300 mb-1">Getting Started</h4>
                  <p className="text-sm text-blue-200">
                    Import your agent data using CSV or JSON files to begin monitoring and orchestrating your multi-agent workflows.
                  </p>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <h4 className="font-medium text-emerald-300 mb-1">Documentation</h4>
                  <p className="text-sm text-emerald-200">
                    Visit our comprehensive documentation for detailed guides on ADK platform features and capabilities.
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <h4 className="font-medium text-purple-300 mb-1">Support</h4>
                  <p className="text-sm text-purple-200">
                    Contact our support team for technical assistance and platform guidance.
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all text-base"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
          {/* Chat Modal - even larger, functional chat */}
          {showChatModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl pointer-events-auto"
              style={{ 
                boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.45)', 
                width: '600px', 
                height: '500px', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'fixed',
                bottom: '2rem',
                right: '2rem'
              }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Chat Support</h3>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-3 rounded-xl text-sm max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-500/80 text-white' : 'bg-slate-700 text-slate-200'}`}>{msg.text}</div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-sm text-slate-400 text-center mb-2">AI is typing...</div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex space-x-3 mt-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                >
                  Send
                </button>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowChatModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all text-base"
                >
                  Close Chat
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
      
      <div className="flex">
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar onClose={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/agents" element={<AgentMonitor />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<Security />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Dashboard;