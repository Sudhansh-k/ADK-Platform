import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, CheckCircle, AlertCircle, Clock, MoreVertical, GitBranch } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  status: string;
  progress: number;
  nodes: any[];
  tasksCompleted: number;
  totalTasks: number;
  estimatedTime: string;
}

const WorkflowStatus: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    const loadWorkflows = () => {
      try {
        const savedWorkflows = localStorage.getItem('workflows');
        if (savedWorkflows) {
          const parsedWorkflows = JSON.parse(savedWorkflows);
          const processedWorkflows = parsedWorkflows.map((wf: any) => ({
            id: wf.id,
            name: wf.name,
            status: wf.status || 'paused',
            progress: wf.nodes ? (wf.nodes.filter((n: any) => n.status === 'completed').length / wf.nodes.length) * 100 : 0,
            nodes: wf.nodes || [],
            tasksCompleted: wf.nodes?.filter((n: any) => n.status === 'completed').length || 0,
            totalTasks: wf.nodes?.length || 0,
            estimatedTime: `${Math.ceil((wf.nodes?.length || 0) * 1.5)}s`,
          }));
          setWorkflows(processedWorkflows);
        }
      } catch (error) {
        console.error('Error loading workflows from localStorage:', error);
      }
    };
    loadWorkflows();

    const handleStorageChange = () => {
      loadWorkflows();
    };

    window.addEventListener('storageUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storageUpdated', handleStorageChange);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-emerald-500 to-teal-500';
      case 'error':
        return 'from-red-500 to-pink-500';
      case 'paused':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  // Show empty state when no workflows
  if (workflows.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Active Workflows</h2>
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="text-center py-8">
          <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Active Workflows</h3>
          <p className="text-slate-400 text-sm">No workflows are currently running or configured</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Active Workflows</h2>
        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(workflow.status)}
                <h3 className="font-medium text-white">{workflow.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
            </div>

            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>{workflow.tasksCompleted}/{workflow.totalTasks} tasks</span>
              <span>{workflow.progress}%</span>
            </div>
            <div className="w-full bg-slate-600/30 rounded-full h-2 mb-3">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(workflow.status)}`}
                initial={{ width: 0 }}
                animate={{ width: `${workflow.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex -space-x-1">
                {(workflow.nodes || []).slice(0, 3).map((node, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-slate-800 flex items-center justify-center"
                    title={node.name}
                  >
                    <span className="text-xs text-white font-medium">
                      {node.name.charAt(0)}
                    </span>
                  </div>
                ))}
                {workflow.nodes && workflow.nodes.length > 3 && (
                  <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      +{workflow.nodes.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-slate-400">ETA: {workflow.estimatedTime}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WorkflowStatus;