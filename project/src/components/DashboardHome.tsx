import React from 'react';
import { motion } from 'framer-motion';
import StatsCards from './dashboard/StatsCards';
import WorkflowStatus from './dashboard/WorkflowStatus';
import AgentActivity from './dashboard/AgentActivity';
import RecentTasks from './dashboard/RecentTasks';
import SystemHealth from './dashboard/SystemHealth';
import { Download } from 'lucide-react';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        
          <h1 className="text-3xl font-bold text-white mb-2">
            Multi-Agent Orchestration Dashboard
          </h1>
          <p className="text-slate-400">
            Monitor and manage your ADK agent ecosystem in real-time
          </p>
        

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('Exporting all dashboard data...')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkflowStatus />
        <AgentActivity />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTasks />
        </div>
        <SystemHealth />
      </div>
    </div>
  );
};

export default DashboardHome;