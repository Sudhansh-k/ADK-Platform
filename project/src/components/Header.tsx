import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Activity, Home, MessageSquare, HelpCircle, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  showHelpModal: boolean;
  setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  showChatModal: boolean;
  setShowChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showHelpModal, setShowHelpModal, showChatModal, setShowChatModal }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'System Update',
      message: 'ADK Platform updated to version 2.1.4',
      time: '2 minutes ago',
      type: 'info',
      unread: true
    },
    {
      id: 2,
      title: 'Welcome to ADK',
      message: 'Complete your profile setup to get started',
      time: '5 minutes ago',
      type: 'success',
      unread: true
    },
    {
      id: 3,
      title: 'Getting Started',
      message: 'Import your first agent data to begin monitoring',
      time: '1 hour ago',
      type: 'info',
      unread: false
    }
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    // Clear user session data
    sessionStorage.removeItem('currentUser');
    // Force a reload to the home page to clear all state
    window.location.href = '/';
  };

  const handleHelp = () => {
    setShowHelpModal(true);
  };

  const handleChat = () => {
    setShowChatModal(true);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    }
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/dashboard/notifications');
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg sticky top-0 z-50"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 hover:bg-slate-700/30 rounded-lg p-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">ADK Orchestrator</h1>
              <p className="text-sm text-slate-400">Multi-Agent Development Kit</p>
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-400">Platform Ready</span>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={handleNotificationsClick}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{unreadCount}</span>
                </div>
              )}
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50"
              >
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <p className="text-sm text-slate-400">{unreadCount} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">No notifications</div>
                  ) : notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${
                        notification.unread ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-emerald-400' :
                          notification.type === 'info' ? 'bg-blue-400' :
                          'bg-yellow-400'
                        }`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                        </div>
                        {!notification.unread && (
                          <div className="w-2 h-2 bg-transparent rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-700/50">
                  <button 
                    className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={handleViewAllNotifications}
                  >
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Help */}
          <button 
            onClick={handleHelp}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-slate-300" />
          </button>

          {/* Chat Support */}
          <button 
            onClick={handleChat}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-slate-300" />
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <User className="w-4 h-4 text-white" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50"
              >
                <div className="p-4 border-b border-slate-700/50">
                  <p className="text-sm font-medium text-white">User Account</p>
                  <p className="text-xs text-slate-400">Manage your profile</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/dashboard/settings')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Back to Home</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;