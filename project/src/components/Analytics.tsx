import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle, AlertTriangle, Upload, Download, Settings, Filter, Bot, GitBranch } from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [showDataUpload, setShowDataUpload] = useState(false);
  const [customData, setCustomData] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState('none');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const loadAnalyticsData = () => {
      try {
        const savedWorkflows = localStorage.getItem('workflows');
        const savedAgents = localStorage.getItem('agents');
        
        if (savedWorkflows) {
          setWorkflows(JSON.parse(savedWorkflows));
        }
        if (savedAgents) {
          setAgents(JSON.parse(savedAgents));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };
    
    loadAnalyticsData();

    const handleStorageChange = () => {
      loadAnalyticsData();
    };

    window.addEventListener('storageUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storageUpdated', handleStorageChange);
    };
  }, []);

  // Filter data based on time range
  const getFilteredData = () => {
    if (customData.length > 0) {
      return customData;
    }

    if (workflows.length === 0 && agents.length === 0) {
      return [];
    }

    // Process real data from workflows and agents
    // This is a simplified example; you might need to adjust based on your data structure
    const taskData = workflows.flatMap(w => 
      (w.nodes || []).map((n: any) => ({
        date: w.lastModified,
        tasks: 1, // Count each node as a task
        success: w.status !== 'error' ? 1 : 0,
        failed: w.status === 'error' ? 1 : 0,
        avgTime: (Math.random() * 2 + 0.5).toFixed(1), // Placeholder, as we don't have real task times
      }))
    );

    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '24h':
        cutoffDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        return taskData;
    }
    
    return taskData.filter(item => {
      if (item.date) {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
      }
      return true;
    });
  };

  const filteredData = getFilteredData();

  const kpis = [
    {
      title: 'Completed Tasks',
      value: filteredData.reduce((sum, item) => sum + (item.success || 0), 0).toLocaleString(),
      change: `+${filteredData.reduce((sum, item) => sum + (item.success || 0), 0)}`,
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Avg Response Time',
      value: filteredData.length > 0 ? `${(filteredData.reduce((sum, item) => sum + parseFloat(item.avgTime || 0), 0) / filteredData.length).toFixed(1)}s` : '0s',
      change: '-0.3s',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Success Rate',
      value: filteredData.length > 0 ? `${((filteredData.reduce((sum, item) => sum + (item.success || 0), 0) / filteredData.reduce((sum, item) => sum + (item.tasks || 0), 0)) * 100).toFixed(1)}%` : '0%',
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Alerts',
      value: filteredData.reduce((sum, item) => sum + (item.failed || 0), 0).toLocaleString(),
      change: `+${filteredData.reduce((sum, item) => sum + (item.failed || 0), 0)}`,
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          let data;
          
          if (file.name.endsWith('.json')) {
            data = JSON.parse(text);
          } else if (file.name.endsWith('.csv')) {
            const lines = text.split('\n');
            const headers = lines[0].split(',');
            data = lines.slice(1).map(line => {
              const values = line.split(',');
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header.trim()] = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
              });
              return obj;
            }).filter(item => Object.keys(item).length > 0);
          }
          
          if (data) {
            setCustomData(Array.isArray(data) ? data : [data]);
            setDataSource('custom');
            alert(`Successfully imported ${Array.isArray(data) ? data.length : 1} records from ${file.name}`);
          }
        } catch (error) {
          alert('Error parsing file. Please check the format.');
        }
      };
      reader.readAsText(file);
      setShowDataUpload(false);
    }
  };

  const handleExportData = () => {
    if (customData.length === 0) {
      alert('No data to export. Please import data first.');
      return;
    }
    const dataStr = JSON.stringify(customData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const resetData = () => {
    setCustomData([]);
    setDataSource('none');
  };

  const activityData = [
    { name: '08:00', "Greeting Agent": 12, "Data Source Agent": 24, "Translation Agent": 5 },
    { name: '09:00', "Greeting Agent": 19, "Data Source Agent": 13, "Translation Agent": 8 },
    { name: '10:00', "Greeting Agent": 4, "Data Source Agent": 9, "Translation Agent": 12 },
    { name: '11:00', "Greeting Agent": 22, "Data Source Agent": 18, "Translation Agent": 7 },
    { name: '12:00', "Greeting Agent": 8, "Data Source Agent": 28, "Translation Agent": 15 },
    { name: '13:00', "Greeting Agent": 15, "Data Source Agent": 21, "Translation Agent": 10 },
    { name: '14:00', "Greeting Agent": 11, "Data Source Agent": 23, "Translation Agent": 18 },
  ];

  const latencyData = [
    { name: 'Day 1', "Avg. Latency (ms)": 420 },
    { name: 'Day 2', "Avg. Latency (ms)": 380 },
    { name: 'Day 3', "Avg. Latency (ms)": 510 },
    { name: 'Day 4', "Avg. Latency (ms)": 450 },
    { name: 'Day 5', "Avg. Latency (ms)": 470 },
    { name: 'Day 6', "Avg. Latency (ms)": 410 },
    { name: 'Day 7', "Avg. Latency (ms)": 390 },
  ];

  const errorData = [
    { name: 'Day 1', "Error Rate (%)": 2.1 },
    { name: 'Day 2', "Error Rate (%)": 1.5 },
    { name: 'Day 3', "Error Rate (%)": 3.2 },
    { name: 'Day 4', "Error Rate (%)": 2.5 },
    { name: 'Day 5', "Error Rate (%)": 2.8 },
    { name: 'Day 6', "Error Rate (%)": 1.9 },
    { name: 'Day 7', "Error Rate (%)": 1.7 },
  ];

  if (customData.length === 0 && workflows.length === 0 && agents.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">
              Performance insights and metrics for your ADK agents and workflows
              <span className="ml-2 px-2 py-1 bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded text-sm">
                No Data Available
              </span>
            </p>
          </div>
        </motion.div>
        <div className="text-center py-20">
          <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Analytics Data Available</h3>
          <p className="text-slate-400 mb-6">Create workflows and agents to view performance insights and metrics</p>
          <button 
            onClick={() => setShowDataUpload(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Import Analytics Data
          </button>
        </div>

        {/* Upload Modal */}
        {showDataUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Import Analytics Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Data File
                  </label>
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                  />
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-300 mb-2">Expected format:</p>
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• JSON: Array of objects with numeric values</li>
                    <li>• CSV: Headers in first row, numeric data below</li>
                    <li>• Required fields: tasks, success, failed, avgTime</li>
                    <li>• Optional: date (YYYY-MM-DD format)</li>
                    <li>• Example: name,tasks,success,failed,avgTime,date</li>
                  </ul>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDataUpload(false)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">
            Performance insights and metrics for your ADK agents and workflows
            <span className="ml-2 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-sm">
              {workflows.length > 0 || agents.length > 0 ? 
                `${workflows.length} workflows, ${agents.length} agents` : 
                customData.length > 0 ? `Custom Data (${filteredData.length} records)` : 
                'No Data Available'
              }
            </span>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDataUpload(true)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={resetData}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-slate-700/50 border border-slate-600/50 text-white rounded-lg hover:bg-slate-600/50 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 text-sm bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const trendIcon = kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-gradient-to-r ${kpi.color} rounded-xl shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-xs ${
                  kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {trendIcon}
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>
              
              <div>
                <p className="text-3xl font-bold text-white mb-1">{kpi.value}</p>
                <p className="text-xs text-slate-400">{kpi.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Task Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Bar dataKey="success" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Response Time Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Average Response Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Agent Activity Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Agent Invocations (Today)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={activityData}>
            <defs>
                <linearGradient id="colorGreeting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
                 <linearGradient id="colorTranslate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} />
            <Legend wrapperStyle={{ color: '#e5e7eb' }}/>
            <Area type="monotone" dataKey="Greeting Agent" stroke="#8884d8" fillOpacity={1} fill="url(#colorGreeting)" />
            <Area type="monotone" dataKey="Data Source Agent" stroke="#82ca9d" fillOpacity={1} fill="url(#colorData)" />
            <Area type="monotone" dataKey="Translation Agent" stroke="#ffc658" fillOpacity={1} fill="url(#colorTranslate)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
        >
            <h3 className="text-lg font-semibold text-white mb-4">Average Agent Latency (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={latencyData}>
                    <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                    <Area type="monotone" dataKey="Avg. Latency (ms)" stroke="#38bdf8" fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>

        {/* Error Rate Chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
        >
            <h3 className="text-lg font-semibold text-white mb-4">System Error Rate (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={errorData}>
                    <defs>
                        <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                    <Area type="monotone" dataKey="Error Rate (%)" stroke="#f43f5e" fillOpacity={1} fill="url(#colorError)" />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showDataUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Import Analytics Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Data File
                </label>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                />
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300 mb-2">Expected format:</p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• JSON: Array of objects with numeric values</li>
                  <li>• CSV: Headers in first row, numeric data below</li>
                  <li>• Required fields: tasks, success, failed, avgTime</li>
                  <li>• Optional: date (YYYY-MM-DD format)</li>
                  <li>• Example: name,tasks,success,failed,avgTime,date</li>
                </ul>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDataUpload(false)}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Analytics;