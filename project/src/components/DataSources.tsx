import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface DataSource {
  name: string;
  status: 'connected' | 'error' | 'pending';
  records: number;
  last_sync: string;
  error?: string;
}

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      name: 'Primary Database',
      status: 'connected',
      records: 150000,
      last_sync: '2 hours ago',
    },
    {
      name: 'CRM Connector',
      status: 'error',
      records: 54000,
      last_sync: '1 day ago',
      error: 'API key expired'
    },
    {
      name: 'Analytics Warehouse',
      status: 'pending',
      records: 0,
      last_sync: 'Never',
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch data from the backend API
    // setLoading(true);
    // fetch('/api/datasources')
    //   .then(res => res.json())
    //   .then(data => {
    //     setDataSources(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error("Failed to fetch data sources", err);
    //     setLoading(false);
    //   });
  }, []);

  const handleRefresh = () => {
    console.log("Refresh clicked");
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleAddNewSource = () => {
    const newSource: DataSource = {
      name: `New Source ${dataSources.length + 1}`,
      status: 'pending',
      records: 0,
      last_sync: 'Never',
    };
    setDataSources(prevSources => [...prevSources, newSource]);
  };

  const getStatusIndicator = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />;
      case 'error':
        return <div className="w-3 h-3 bg-red-500 rounded-full" />;
      case 'pending':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Sources</h1>
          <p className="text-slate-400">Manage connections to your data platforms.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className={`flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{'Refresh'}</span>
          </button>
          <button 
            onClick={handleAddNewSource}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Source</span>
          </button>
        </div>
      </motion.div>

      {dataSources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSources.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${source.status === 'connected' ? 'from-emerald-500/20 to-teal-500/20' : source.status === 'error' ? 'from-red-500/20 to-pink-500/20' : 'from-yellow-500/20 to-orange-500/20'}`}>
                    <Database className={`w-6 h-6 ${source.status === 'connected' ? 'text-emerald-400' : source.status === 'error' ? 'text-red-400' : 'text-yellow-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-400 capitalize">
                      {getStatusIndicator(source.status)}
                      <span>{source.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Records</span>
                  <span className="text-white font-medium">{source.records.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last Sync</span>
                  <span className="text-white font-medium">{source.last_sync}</span>
                </div>
              </div>

              {source.status === 'error' && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Error: {source.error}</span>
                  </div>
                </div>
              )}
               {source.status === 'connected' && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Connection healthy</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-slate-800/50 border border-slate-700/50 rounded-xl p-12">
          <Database className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white">No Data Sources Found</h3>
          <p className="text-slate-400 mt-2">Connect a new data source to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DataSources; 