import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Activity, Cpu, RefreshCw, Upload, Download, Plus, Trash2, Save, Play, Pause, Users } from 'lucide-react';
import Papa from 'papaparse';

interface Agent {
  id: string;
  name: string;
  type: string;
  version: string;
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

const updateLocalStorageAndNotify = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storageUpdated'));
  }
};

const AgentMonitor: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgentData, setNewAgentData] = useState({
    name: '',
    type: 'collector'
  });

  useEffect(() => {
    const loadAgents = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedAgents = localStorage.getItem('agents');
          if (savedAgents) {
            setAgents(JSON.parse(savedAgents));
          }
        } catch (error) {
          console.error('Error loading agents from localStorage:', error);
        }
      }
    };
    loadAgents();
    if (typeof window !== 'undefined') {
        window.addEventListener('storageUpdated', loadAgents);
        return () => {
          window.removeEventListener('storageUpdated', loadAgents);
        };
    }
  }, []);

  const handleDownloadTemplate = () => {
    const csvContent = "id,name,type,version,status,currentTask\nagent-1,Sample Collector,collector,v1.0.1,idle,\"Waiting for data\"\nagent-2,Sample Processor,processor,v1.2.0,running,\"Processing batch #123\"";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "agents_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddAgent = () => {
    if (newAgentData.name && newAgentData.type) {
      const newAgent: Agent = {
        id: newAgentData.name.toLowerCase().replace(/\s+/g, '-'), name: newAgentData.name, type: newAgentData.type,
        version: 'v1.0.0', status: 'idle', currentTask: 'Waiting for tasks',
        stats: { cpu: 10, memory: 20, network: 15, tasksCompleted: 0, uptime: '0m' }
      };
      const updatedAgents = [...agents, newAgent];
      setAgents(updatedAgents);
      updateLocalStorageAndNotify('agents', updatedAgents);
      setShowAddAgentModal(false);
      setNewAgentData({ name: '', type: 'collector' });
    }
  };

  const handleDeleteAgent = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      const updatedAgents = agents.filter(agent => agent.id !== id);
      setAgents(updatedAgents);
      updateLocalStorageAndNotify('agents', updatedAgents);
    }
  };
  
  const handleStartAgent = (id: string) => {
    const updatedAgents = agents.map(agent => agent.id === id ? { ...agent, status: 'running' as const } : agent);
    setAgents(updatedAgents);
    updateLocalStorageAndNotify('agents', updatedAgents);
  };
  
  const handleStopAgent = (id: string) => {
    const updatedAgents = agents.map(agent => agent.id === id ? { ...agent, status: 'idle' as const } : agent);
    setAgents(updatedAgents);
    updateLocalStorageAndNotify('agents', updatedAgents);
  };
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateInterval = setInterval(() => {
      let updated = false;
      setAgents(prevAgents => {
          const newAgents = prevAgents.map(agent => {
            if (agent.status === 'running') {
              updated = true;
              return { ...agent, stats: {
                  ...agent.stats,
                  cpu: Math.floor(Math.random() * 80 + 20),
                  memory: Math.floor(Math.random() * 70 + 30),
                  network: Math.floor(Math.random() * 60 + 20),
                  tasksCompleted: agent.stats.tasksCompleted + Math.floor(Math.random() * 2),
                  uptime: `${(parseInt(agent.stats.uptime) || 0) + 2}s`
              }};
            }
            return agent;
          });
          if(updated) updateLocalStorageAndNotify('agents', newAgents);
          return newAgents;
      });
    }, 2000);
    return () => clearInterval(updateInterval);
  }, []);

  const handleFileChangeAndImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImportFile(file);
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const requiredFields = ['id', 'name', 'type', 'version', 'status', 'currentTask'];
            const parsedAgents = results.data as any[];

            if (!parsedAgents.length || !requiredFields.every(field => field in parsedAgents[0])) {
              alert(`Invalid CSV format. Please ensure the file includes the following columns: ${requiredFields.join(', ')}`);
              return;
            }

            const newAgents: Agent[] = parsedAgents.map((row: any) => ({
              id: row.id,
              name: row.name,
              type: row.type,
              version: row.version,
              status: row.status as 'idle' | 'running' | 'error',
              currentTask: row.currentTask,
              stats: { cpu: 0, memory: 0, network: 0, tasksCompleted: 0, uptime: '0m' }
            }));

            const updatedAgents = [...agents, ...newAgents];
            setAgents(updatedAgents);
            updateLocalStorageAndNotify('agents', updatedAgents);
            setShowUploadModal(false);
            setImportFile(null);

          } catch (error) {
            alert('Error processing imported agents.');
            console.error("Import processing error: ", error);
          }
        },
        error: (error: any) => {
          alert('Error parsing CSV file.');
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold text-white mb-2">Agent Monitor</h1>
             <p className="text-slate-400">Real-time monitoring and management of ADK agents
               {agents.length > 0 && <span className="ml-2 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-sm">{agents.length} agents active</span>}
             </p>
           </div>
           {agents.length > 0 && 
             <div className="flex items-center space-x-3">
               <button onClick={() => setShowAddAgentModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"><Plus className="w-4 h-4" /><span>Create Agent</span></button>
             </div>
           }
        </motion.div>

        {agents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-xl"
          >
            <Users className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 text-lg font-medium text-white">No Agents Active</h3>
            <p className="mt-1 text-sm text-slate-400">Get started by creating your first agent or importing existing ones.</p>
            <div className="mt-6 flex justify-center space-x-3">
              <button 
                onClick={() => setShowAddAgentModal(true)} 
                className="flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Agent</span>
              </button>
              <button 
                onClick={() => setShowUploadModal(true)} 
                className="flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Upload className="w-5 h-5" />
                <span>Import Agents</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {agents.map(agent => (
               <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                 <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center space-x-4">
                     <div className="p-3 bg-blue-500/20 rounded-xl"><Cpu className="w-6 h-6 text-blue-400" /></div>
                     <div>
                       <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                       <p className="text-sm text-slate-400">{agent.type} • {agent.version}</p>
                     </div>
                     <span className={`px-2 py-1 rounded-full text-xs ${agent.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : agent.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{agent.status}</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     {agent.status === 'idle' ? (<button onClick={() => handleStartAgent(agent.id)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Start Agent"><Play className="w-4 h-4 text-emerald-400" /></button>) : (<button onClick={() => handleStopAgent(agent.id)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Stop Agent"><Pause className="w-4 h-4 text-orange-400" /></button>)}
                     <button onClick={() => handleDeleteAgent(agent.id)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Delete Agent"><Trash2 className="w-4 h-4 text-red-400" /></button>
                   </div>
                 </div>
                 <div className="text-sm text-slate-400 mb-4">Current Task: {agent.currentTask}</div>
                 <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <div className="flex items-center justify-between text-sm"><span className="text-slate-400">CPU</span><span className="text-white">{agent.stats.cpu}%</span></div>
                     <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${agent.stats.cpu}%` }} /></div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Memory</span><span className="text-white">{agent.stats.memory}%</span></div>
                     <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${agent.stats.memory}%` }} /></div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Network</span><span className="text-white">{agent.stats.network}%</span></div>
                     <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${agent.stats.network}%` }} /></div>
                   </div>
                 </div>
               </motion.div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Import Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Agent File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChangeAndImport}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                />
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300 mb-2">Expected CSV format:</p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• <span className="text-red-400 font-medium">id*</span> - Unique agent identifier</li>
                  <li>• <span className="text-red-400 font-medium">name</span> - Display name for the agent</li>
                  <li>• <span className="text-red-400 font-medium">type</span> - Type of agent (e.g., collector, processor)</li>
                  <li>• <span className="text-red-400 font-medium">version</span> - Agent version</li>
                  <li>• <span className="text-red-400 font-medium">status</span> - Initial agent status (idle, running)</li>
                  <li>• <span className="text-red-400 font-medium">currentTask</span> - Description of the current task</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-blue-500/20">
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    Download CSV Template
                  </button>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showAddAgentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-[400px]">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Agent</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Agent Name</label>
                <input type="text" value={newAgentData.name} onChange={(e) => setNewAgentData({ ...newAgentData, name: e.target.value })} className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white" placeholder="Enter agent name" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Agent Type</label>
                <select value={newAgentData.type} onChange={(e) => setNewAgentData({ ...newAgentData, type: e.target.value })} className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"><option value="collector">Collector</option><option value="processor">Processor</option><option value="analyzer">Analyzer</option></select>
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <button onClick={() => setShowAddAgentModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all">Cancel</button>
                <button onClick={handleAddAgent} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">Add Agent</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AgentMonitor; 