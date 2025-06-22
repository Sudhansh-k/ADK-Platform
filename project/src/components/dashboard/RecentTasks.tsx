import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, FileText, Users, Mail, Database, ListTodo, GitBranch } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  agent: string;
  status: string;
  timestamp: string;
  duration: string;
  icon: any;
  details: string;
}

const RecentTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedWorkflows = localStorage.getItem('workflows');
        if (savedWorkflows) {
          const workflows = JSON.parse(savedWorkflows);
          const processedTasks = workflows
            .sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
            .slice(0, 5)
            .map((wf: any, index: number) => ({
              id: wf.id || `task-${index}`,
              title: wf.name,
              agent: `Run by ${wf.nodes?.[0]?.name || 'N/A'}`,
              status: wf.status === 'running' ? 'running' : (wf.status === 'error' ? 'failed' : 'completed'),
              timestamp: new Date(wf.lastModified).toLocaleTimeString(),
              duration: '0.5s', // Placeholder
              icon: GitBranch,
              details: `${wf.nodes?.length || 0} nodes, ${wf.connections?.length || 0} connections`,
            }));
          setTasks(processedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        setTasks([]);
      }
    };

    loadTasks();
    window.addEventListener('storageUpdated', loadTasks);

    return () => {
      window.removeEventListener('storageUpdated', loadTasks);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'running':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Show empty state when no tasks
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
          <button className="text-sm text-slate-400 hover:text-slate-300 font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="text-center py-8">
          <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Recent Tasks</h3>
          <p className="text-slate-400 text-sm">No tasks have been executed recently</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => {
          const Icon = task.icon;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-white truncate">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-2">{task.details}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-blue-400">{task.agent}</span>
                    <div className="flex items-center space-x-3">
                      <span>Duration: {task.duration}</span>
                      <span>{task.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentTasks;