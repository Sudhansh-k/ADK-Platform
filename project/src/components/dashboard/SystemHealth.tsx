import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Wifi, Shield, Zap } from 'lucide-react';

const SystemHealth: React.FC = () => {
  const metrics = [
    {
      name: 'CPU Usage',
      value: 45,
      status: 'good',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Memory',
      value: 67,
      status: 'warning',
      icon: Server,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Storage',
      value: 32,
      status: 'good',
      icon: HardDrive,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Network',
      value: 89,
      status: 'good',
      icon: Wifi,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Security',
      value: 95,
      status: 'excellent',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Performance',
      value: 78,
      status: 'good',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-400';
      case 'good':
        return 'text-blue-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const overallHealth = Math.round(metrics.reduce((acc, metric) => acc + metric.value, 0) / metrics.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-4">System Health</h2>
      
      {/* Overall Health Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-600"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              className="text-emerald-400"
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{ strokeDasharray: `${overallHealth * 2.512} 251.2` }}
              transition={{ duration: 2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{overallHealth}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-r ${metric.color} rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{metric.name}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-16 bg-slate-600/30 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                  {metric.value}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">All systems operational</span>
        </div>
        <p className="text-xs text-emerald-300 mt-1">
          Last health check: 30 seconds ago
        </p>
      </div>
    </motion.div>
  );
};

export default SystemHealth;