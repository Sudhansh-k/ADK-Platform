import React from 'react';
import { motion } from 'framer-motion';
import StatsCards from './dashboard/StatsCards';
import WorkflowStatus from './dashboard/WorkflowStatus';
import AgentActivity from './dashboard/AgentActivity';
import RecentTasks from './dashboard/RecentTasks';
import SystemHealth from './dashboard/SystemHealth';
import AIAssistant from './AIAssistant';
import Analytics from './Analytics';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Multi-Agent Orchestration Dashboard
        </h1>
        <p className="text-slate-400">
          Monitor and manage your ADK agent ecosystem in real-time
        </p>
      </motion.div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkflowStatus />
        <AgentActivity />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTasks />
        <SystemHealth />
      </div>

      <div className="mt-6">
        <Analytics />
      </div>

      <div className="mt-6">
        <AIAssistant />
      </div>
    </div>
  );
};

export default Dashboard;