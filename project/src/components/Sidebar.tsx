import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  Bot, 
  BarChart3, 
  Settings, 
  X,
  Workflow,
  Database,
  Shield
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/dashboard/workflows', label: 'Workflows', icon: GitBranch },
    { id: '/dashboard/agents', label: 'Agent Monitor', icon: Bot },
    { id: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const bottomItems = [
    { id: '/dashboard/settings', label: 'Settings', icon: Settings },
    { id: '/dashboard/security', label: 'Security', icon: Shield },
    { id: '/dashboard/data-sources', label: 'Data Sources', icon: Database },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname === path;
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 shadow-xl z-40"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-700/50 lg:hidden"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
          
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Workflow className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">ADK Status</span>
            </div>
            <p className="text-xs text-blue-200">
              All systems operational
            </p>
            <div className="mt-2 w-full bg-blue-900/30 rounded-full h-1">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;