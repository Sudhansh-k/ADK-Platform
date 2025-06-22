import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'System Update',
    message: 'ADK Platform updated to version 2.1.4',
    time: '2 minutes ago',
    type: 'info',
    unread: false
  },
  {
    id: 2,
    title: 'Welcome to ADK',
    message: 'Complete your profile setup to get started',
    time: '5 minutes ago',
    type: 'success',
    unread: false
  },
  {
    id: 3,
    title: 'Getting Started',
    message: 'Import your first agent data to begin monitoring',
    time: '1 hour ago',
    type: 'info',
    unread: false
  }
];

const NotificationsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-10 bg-slate-800/90 border border-slate-700/50 rounded-2xl shadow-2xl p-8"
    >
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-blue-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">All Notifications</h2>
      </div>
      {notifications.length === 0 ? (
        <div className="text-center text-slate-400 py-12">No notifications.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-slate-700/30 rounded-xl bg-slate-700/30`}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsPage; 