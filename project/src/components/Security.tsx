import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye,
  Download,
  RefreshCw,
  UserCheck,
  Clock,
  Globe,
  Smartphone
} from 'lucide-react';

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const securityMetrics = [
    {
      title: 'Security Score',
      value: '94%',
      status: 'excellent',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Active Sessions',
      value: '3',
      status: 'normal',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Failed Logins',
      value: '2',
      status: 'warning',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'API Keys',
      value: '5',
      status: 'normal',
      icon: Key,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const recentActivity = [
    {
      action: 'Successful login',
      location: 'San Francisco, CA',
      device: 'Chrome on macOS',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      action: 'API key generated',
      location: 'San Francisco, CA',
      device: 'Chrome on macOS',
      time: '1 hour ago',
      status: 'info'
    },
    {
      action: 'Failed login attempt',
      location: 'Unknown',
      device: 'Unknown browser',
      time: '3 hours ago',
      status: 'warning'
    },
    {
      action: 'Password changed',
      location: 'San Francisco, CA',
      device: 'Chrome on macOS',
      time: '2 days ago',
      status: 'success'
    }
  ];

  const activeSessions = [
    {
      device: 'Chrome on macOS',
      location: 'San Francisco, CA',
      ip: '192.168.1.100',
      lastActive: 'Active now',
      current: true
    },
    {
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      ip: '192.168.1.101',
      lastActive: '2 hours ago',
      current: false
    },
    {
      device: 'Firefox on Windows',
      location: 'New York, NY',
      ip: '10.0.0.50',
      lastActive: '1 day ago',
      current: false
    }
  ];

  const apiKeys = [
    {
      name: 'Production API Key',
      key: 'adk_prod_••••••••••••••••',
      created: '2024-01-15',
      lastUsed: '2 minutes ago',
      permissions: ['read', 'write', 'admin']
    },
    {
      name: 'Development API Key',
      key: 'adk_dev_••••••••••••••••',
      created: '2024-01-10',
      lastUsed: '1 hour ago',
      permissions: ['read', 'write']
    },
    {
      name: 'Analytics API Key',
      key: 'adk_analytics_••••••••••••••••',
      created: '2024-01-05',
      lastUsed: '1 day ago',
      permissions: ['read']
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'sessions', label: 'Active Sessions', icon: Activity },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'audit-log', label: 'Audit Log', icon: Eye }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  metric.status === 'excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                  metric.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {metric.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-sm text-slate-400">{metric.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Security Recommendations */}
      <div className="bg-slate-700/30 rounded-2xl border border-slate-600/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Security Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-emerald-300">Two-Factor Authentication Enabled</h4>
              <p className="text-sm text-emerald-200 mt-1">Your account is protected with 2FA</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-300">Review API Key Permissions</h4>
              <p className="text-sm text-yellow-200 mt-1">Some API keys have broad permissions that could be restricted</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300">Enable Session Timeout</h4>
              <p className="text-sm text-blue-200 mt-1">Consider enabling automatic session timeout for enhanced security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Active Sessions</h3>
        <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
          Terminate All Sessions
        </button>
      </div>

      <div className="space-y-4">
        {activeSessions.map((session, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  {session.device.includes('iPhone') ? (
                    <Smartphone className="w-5 h-5 text-white" />
                  ) : (
                    <Globe className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{session.device}</h4>
                  <p className="text-sm text-slate-400">{session.location} • {session.ip}</p>
                  <p className="text-xs text-slate-500">{session.lastActive}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {session.current && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                    Current Session
                  </span>
                )}
                {!session.current && (
                  <button className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium hover:bg-red-500/20 transition-all">
                    Terminate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">API Keys</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all">
          Generate New Key
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-white">{apiKey.name}</h4>
                <p className="text-sm text-slate-400 font-mono">{apiKey.key}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Created:</span>
                <span className="text-white ml-2">{apiKey.created}</span>
              </div>
              <div>
                <span className="text-slate-400">Last Used:</span>
                <span className="text-white ml-2">{apiKey.lastUsed}</span>
              </div>
              <div>
                <span className="text-slate-400">Permissions:</span>
                <div className="flex space-x-1 mt-1">
                  {apiKey.permissions.map((permission, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAuditLog = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Security Audit Log</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all">
          <Download className="w-4 h-4" />
          <span>Export Log</span>
        </button>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg border ${getStatusColor(activity.status)}`}>
                  {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                  {activity.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                  {activity.status === 'info' && <Activity className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-medium text-white">{activity.action}</h4>
                  <p className="text-sm text-slate-400">{activity.device}</p>
                  <p className="text-xs text-slate-500">{activity.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">{activity.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
          <p className="text-slate-400">Monitor and manage your ADK platform security</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-8">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'sessions' && renderSessions()}
            {activeTab === 'api-keys' && renderApiKeys()}
            {activeTab === 'audit-log' && renderAuditLog()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Security;