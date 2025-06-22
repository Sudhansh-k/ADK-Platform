import React, { createContext, useContext, useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'error';
  currentTask?: string;
  tasksCompleted: number;
  cpu: number;
  memory: number;
  lastActivity: string;
}

interface AgentContextType {
  agents: Agent[];
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  getAgentById: (id: string) => Agent | undefined;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
};

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'data-collector',
      name: 'Data Collector',
      type: 'Collector',
      status: 'running',
      currentTask: 'Processing customer data',
      tasksCompleted: 1247,
      cpu: 45,
      memory: 32,
      lastActivity: '2 seconds ago'
    },
    {
      id: 'document-parser',
      name: 'Document Parser',
      type: 'Processor',
      status: 'running',
      currentTask: 'Parsing invoice documents',
      tasksCompleted: 892,
      cpu: 78,
      memory: 56,
      lastActivity: '1 second ago'
    },
    {
      id: 'validator',
      name: 'Validator',
      type: 'Validator',
      status: 'idle',
      currentTask: 'Waiting for input',
      tasksCompleted: 543,
      cpu: 12,
      memory: 18,
      lastActivity: '5 minutes ago'
    },
    {
      id: 'notifier',
      name: 'Notifier',
      type: 'Communication',
      status: 'running',
      currentTask: 'Sending notifications',
      tasksCompleted: 324,
      cpu: 23,
      memory: 25,
      lastActivity: '3 seconds ago'
    }
  ]);

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
    ));
  };

  const getAgentById = (id: string) => {
    return agents.find(agent => agent.id === id);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        tasksCompleted: agent.tasksCompleted + Math.floor(Math.random() * 3),
        cpu: Math.max(10, Math.min(90, agent.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(10, Math.min(80, agent.memory + (Math.random() - 0.5) * 8))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    agents,
    updateAgent,
    getAgentById
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};