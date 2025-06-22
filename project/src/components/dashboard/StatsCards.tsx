import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsCards: React.FC = () => {
  const [statsData, setStatsData] = useState({
    agentCount: 0,
    workflowCount: 0,
    tasksCompleted: 0,
    avgResponseTime: '0s',
    successRate: '0%',
    alertCount: 0
  });

  useEffect(() => {
    const loadStatsData = () => {
      try {
        const savedWorkflows = localStorage.getItem('workflows');
        const savedAgents = localStorage.getItem('agents');

        const workflows = savedWorkflows ? JSON.parse(savedWorkflows) : [];
        const agents = savedAgents ? JSON.parse(savedAgents) : [];

        const tasksCompleted = workflows.reduce((sum: number, wf: any) => sum + (wf.nodes?.filter((n: any) => n.status === 'completed').length || 0), 0);
        const totalTasks = workflows.reduce((sum: number, wf: any) => sum + (wf.nodes?.length || 0), 0);
        const failedTasks = workflows.reduce((sum: number, wf: any) => sum + (wf.nodes?.filter((n: any) => n.status === 'error').length || 0), 0);
        
        setStatsData({
          agentCount: agents.filter((a: any) => a.status === 'running').length,
          workflowCount: workflows.filter((w: any) => w.status === 'running').length,
          tasksCompleted,
          avgResponseTime: '0s', // Placeholder
          successRate: totalTasks > 0 ? `${((tasksCompleted / totalTasks) * 100).toFixed(1)}%` : '0%',
          alertCount: failedTasks
        });
      } catch (error) {
        console.error('Error loading stats data from localStorage:', error);
      }
    };

    loadStatsData();
    window.addEventListener('storageUpdated', loadStatsData);
    return () => {
      window.removeEventListener('storageUpdated', loadStatsData);
    };
  }, []);
  
  const stats = [
    {
      title: 'Active Agents',
      value: statsData.agentCount.toString(),
      change: statsData.agentCount > 0 ? `+${statsData.agentCount}` : '0',
      changeType: 'increase',
      icon: Bot,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Running Workflows',
      value: statsData.workflowCount.toString(),
      change: statsData.workflowCount > 0 ? `+${statsData.workflowCount}` : '0',
      changeType: 'increase',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Completed Tasks',
      value: statsData.tasksCompleted.toLocaleString(),
      change: statsData.tasksCompleted > 0 ? `+${statsData.tasksCompleted}` : '0',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Avg Response Time',
      value: statsData.avgResponseTime,
      change: statsData.avgResponseTime !== '0s' ? '-0.3s' : '0s',
      changeType: 'decrease',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Success Rate',
      value: statsData.successRate,
      change: statsData.successRate !== '0%' ? '+0.8%' : '0%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Alerts',
      value: statsData.alertCount.toString(),
      change: statsData.alertCount > 0 ? `+${statsData.alertCount}` : '0',
      changeType: 'increase',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-500/20'
    }
  ];

  // Show message when no data is available
  if (statsData.agentCount === 0 && statsData.workflowCount === 0 && statsData.tasksCompleted === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-2xl border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform opacity-50`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                  No data
                </div>
              </div>
              
              <p className="text-2xl font-bold text-slate-400 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.title}</p>

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-2xl border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.changeType === 'increase' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.title}</p>

            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;