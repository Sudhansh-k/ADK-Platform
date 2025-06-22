import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Activity, Cpu, Database, MessageSquare } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'error';
  currentTask: string;
  stats: {
    cpu: number;
    memory: number;
    network: number;
    tasksCompleted: number;
    uptime: string;
  };
}

const AgentActivity: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const loadAgents = () => {
      try {
        const savedAgents = localStorage.getItem('agents');
        if (savedAgents) {
          setAgents(JSON.parse(savedAgents));
        }
      } catch (error) {
        console.error('Error loading agents from localStorage:', error);
      }
    };

    loadAgents();

    const handleStorageChange = () => {
      loadAgents();
    };

    window.addEventListener('storageUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storageUpdated', handleStorageChange);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'idle':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Collector':
        return <Database className="w-4 h-4 text-white" />;
      case 'Processor':
        return <Cpu className="w-4 h-4 text-white" />;
      case 'Communication':
        return <MessageSquare className="w-4 h-4 text-white" />;
      default:
        return <Bot className="w-4 h-4 text-white" />;
    }
  };

  const getResourceColor = (usage: number) => {
    if (usage < 30) return 'from-emerald-500 to-teal-500';
    if (usage < 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  // Show empty state when no agents
  if (agents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Agent Activity</h2>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 font-medium">No activity</span>
          </div>
        </div>

        <div className="text-center py-8">
          <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Agents Active</h3>
          <p className="text-slate-400 text-sm">No agents are currently running or configured</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Agent Activity</h2>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  {getTypeIcon(agent.type)}
                </div>
                
                  <h3 className="font-medium text-white">{agent.name}</h3>
                  <p className="text-sm text-slate-400">{agent.type}</p>
                
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-3">{agent.currentTask}</p>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>CPU</span>
                  <span>{agent.stats.cpu}%</span>
                </div>
                <div className="w-full bg-slate-600/30 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getResourceColor(agent.stats.cpu)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.stats.cpu}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Memory</span>
                  <span>{agent.stats.memory}%</span>
                </div>
                <div className="w-full bg-slate-600/30 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getResourceColor(agent.stats.memory)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.stats.memory}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400">
              <span>Messages: {agent.stats.tasksCompleted.toLocaleString()}</span>
              <span>Uptime: {agent.stats.uptime}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AgentActivity;