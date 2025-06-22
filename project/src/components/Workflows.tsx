import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Pause, Save, Settings, GitBranch, Zap, Bot, Database, MessageSquare, Upload, Download, Trash2, Edit, Copy } from 'lucide-react';
import Papa from 'papaparse';

// @ts-ignore
// eslint-disable-next-line
// For dynamic import of xlsx

function getRandomPosition(canvasWidth: number, canvasHeight: number) {
  const padding = 40;
  const x = padding + Math.random() * (canvasWidth - 200);
  const y = padding + Math.random() * (canvasHeight - 100);
  return { x, y };
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

function isOverlapping(newPos: {x: number, y: number}, existingNodes: any[]) {
  for (const node of existingNodes) {
    if (
      newPos.x < node.position.x + NODE_WIDTH &&
      newPos.x + NODE_WIDTH > node.position.x &&
      newPos.y < node.position.y + NODE_HEIGHT &&
      newPos.y + NODE_HEIGHT > node.position.y
    ) {
      return true;
    }
  }
  return false;
}

function getNonOverlappingRandomPosition(canvasWidth: number, canvasHeight: number, existingNodes: any[]) {
  let position;
  let attempts = 0;
  const maxAttempts = 50; 

  do {
    position = getRandomPosition(canvasWidth, canvasHeight);
    attempts++;
  } while (isOverlapping(position, existingNodes) && attempts < maxAttempts);

  return position;
}

const Workflows: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(() => localStorage.getItem('selectedWorkflow') || '');
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [showNodeModal, setShowNodeModal] = useState<string | false>(false);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectFrom, setConnectFrom] = useState('');
  const [connectTo, setConnectTo] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const executionState = useRef<{ isRunning: boolean; a_id: string | null }>({ isRunning: false, a_id: null });
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);

  const [workflows, setWorkflows] = useState<any[]>([]);

  // Find selected workflow and its nodes/connections
  const selectedWfIndex = workflows.findIndex((w: any, i: number) => (w.id || `wf-${i}`) === selectedWorkflow);
  const selectedWf = selectedWfIndex >= 0 ? workflows[selectedWfIndex] : null;
  // SAFER: Always use arrays for nodes/connections
  const wfNodes = Array.isArray(selectedWf?.nodes) ? selectedWf.nodes : [];
  const wfConnections = Array.isArray(selectedWf?.connections) ? selectedWf.connections : [];

  // Immediately after, insert:
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    }
  }, [showUploadModal, selectedWorkflow, wfNodes.length]);

  useEffect(() => {
    const loadWorkflows = () => {
      const savedWorkflows = localStorage.getItem('workflows');
      if (savedWorkflows) {
        setWorkflows(JSON.parse(savedWorkflows));
      }
    };
    loadWorkflows();
    window.addEventListener('storageUpdated', loadWorkflows);
    return () => window.removeEventListener('storageUpdated', loadWorkflows);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedWorkflow', selectedWorkflow);
  }, [selectedWorkflow]);

  const workflowNodes = [
    {
      id: 'start',
      type: 'trigger',
      name: 'Start',
      description: 'Trigger workflow',
      icon: Zap,
      position: { x: 50, y: 50 },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'data-collector',
      type: 'agent',
      name: 'Data Collector',
      description: 'Collect customer data',
      icon: Database,
      position: { x: 250, y: 50 },
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'validator',
      type: 'agent',
      name: 'Validator',
      description: 'Validate information',
      icon: Bot,
      position: { x: 250, y: 150 },
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'notifier',
      type: 'agent',
      name: 'Notifier',
      description: 'Send notifications',
      icon: MessageSquare,
      position: { x: 450, y: 100 },
      color: 'from-orange-500 to-red-500'
    }
  ];

  const connections = [
    { from: 'start', to: 'data-collector' },
    { from: 'data-collector', to: 'validator' },
    { from: 'validator', to: 'notifier' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-emerald-500/50 bg-emerald-500/10';
      case 'completed':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'paused':
        return 'border-orange-500/50 bg-orange-500/10';
      case 'running':
      case 'error':
        return 'border-slate-500/50 bg-slate-500/10';
      default:
        return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  const updateLocalStorageAndNotify = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storageUpdated'));
  };

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      const newWorkflow = {
        id: newWorkflowName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: newWorkflowName,
        description: newWorkflowDescription || '',
        status: 'draft',
        nodes: [
          { 
            id: 'node-1', 
            name: 'Start', 
            description: 'Start node', 
            type: 'trigger', 
            position: getNonOverlappingRandomPosition(canvasSize.width, canvasSize.height, []), 
            color: 'from-blue-500 to-cyan-500' 
          }
        ],
        connections: [],
        created: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };

      setWorkflows([...workflows, newWorkflow]);
      setSelectedWorkflow(newWorkflow.id);
      setNewWorkflowName('');
      setNewWorkflowDescription('');
      setShowNewWorkflowModal(false);
    }
  };

  const handleSaveWorkflow = () => {
    if (selectedWorkflow) {
      const updatedWorkflows = workflows.map((w: any) => 
        w.id === selectedWorkflow 
          ? { ...w, lastModified: new Date().toISOString().split('T')[0] }
          : w
      );
      setWorkflows(updatedWorkflows);
      updateLocalStorageAndNotify('workflows', updatedWorkflows);
      alert('Workflow saved successfully!');
    } else {
      alert('Please select a workflow to save.');
    }
  };

  const handleDeleteWorkflow = (workflowKey: string) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) return;
    const updatedWorkflows = workflows.filter((w: any, i: number) => (w.id || `wf-${i}`) !== workflowKey);
    setWorkflows(updatedWorkflows);
    updateLocalStorageAndNotify('workflows', updatedWorkflows);
    // If the deleted workflow was selected, clear selection
    if (selectedWorkflow === workflowKey) {
        setSelectedWorkflow('');
      localStorage.removeItem('selectedWorkflow');
    }
  };

  const handleDuplicateWorkflow = (workflow: any) => {
    const duplicatedWorkflow = {
      ...workflow,
      id: `${workflow.id}-copy-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    const updated = [...workflows, duplicatedWorkflow];
    setWorkflows(updated);
    setSelectedWorkflow(duplicatedWorkflow.id);
    localStorage.setItem('selectedWorkflow', duplicatedWorkflow.id);
    alert('Workflow duplicated successfully!');
  };

  const handleDownloadTemplate = () => {
    try {
      // Create CSV content with headers and examples
      const csvContent = `workflow_name,workflow_description,node_id,node_name,node_description,node_type,node_color,node_position_x,node_position_y,connection_from,connection_to
Sample Workflow,A sample workflow with multiple nodes,start-node,Start,Workflow trigger node,trigger,from-blue-500 to-cyan-500,100,100,,
Sample Workflow,A sample workflow with multiple nodes,process-node,Process Data,Data processing node,agent,from-purple-500 to-pink-500,300,100,start-node,
Sample Workflow,A sample workflow with multiple nodes,end-node,End,Workflow completion node,notifier,from-emerald-500 to-teal-500,500,100,process-node,`;

      // Create blob
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      // Create download URL
      const url = window.URL.createObjectURL(blob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'workflow-template.csv';
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up URL
      window.URL.revokeObjectURL(url);
      
      console.log('CSV template download completed');
      
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error downloading template. Please try again or check your browser settings.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file. Only CSV files are supported for workflow import.');
      event.target.value = '';
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.error('CSV parsing errors:', results.errors);
            alert('Error parsing CSV file. Please check the format and try again.');
            return;
          }

          const rows = results.data as any[];
          if (rows.length === 0) {
            alert('CSV file is empty. Please add some data and try again.');
            return;
          }

          const workflowMap: Record<string, any> = {};
          
          rows.forEach((row, index) => {
            const wfName = row.workflow_name || `Imported Workflow ${Date.now()}`;
            
            if (!workflowMap[wfName]) {
              workflowMap[wfName] = {
                id: wfName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
                name: wfName,
                description: row.workflow_description || 'Imported workflow',
                status: 'draft',
                nodes: [],
                connections: [],
                created: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0]
              };
            }
            
            // Add node if node_id is present
            if (row.node_id && row.node_name) {
              const nodePosition = row.node_position_x && row.node_position_y
                ? { 
                    x: parseInt(row.node_position_x) || 100, 
                    y: parseInt(row.node_position_y) || 100 
                  }
                : getNonOverlappingRandomPosition(canvasSize.width, canvasSize.height, workflowMap[wfName].nodes);

              const nodeType = row.node_type || 'agent';
              const nodeColor = row.node_color || 'from-blue-500 to-cyan-500';

              workflowMap[wfName].nodes.push({
                id: row.node_id,
                name: row.node_name,
                description: row.node_description || '',
                type: nodeType,
                position: nodePosition,
                color: nodeColor
              });
            }
            
            // Add connection if both from and to are present
            if (row.connection_from && row.connection_to) {
              workflowMap[wfName].connections.push({
                from: row.connection_from,
                to: row.connection_to
              });
            }
          });

          const importedWorkflows = Object.values(workflowMap);
          const updatedWorkflows = [...workflows, ...importedWorkflows];
          setWorkflows(updatedWorkflows);
          updateLocalStorageAndNotify('workflows', updatedWorkflows);
          
          setShowUploadModal(false);
          event.target.value = '';
          
          alert(`Successfully imported ${importedWorkflows.length} workflow(s) from ${file.name}`);
          
        } catch (error) {
          console.error('Error processing CSV:', error);
          alert('Error processing CSV file. Please check the format and try again.');
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        alert('Error reading CSV file. Please check the file and try again.');
      }
    });
  };

  const handleExportWorkflow = () => {
    if (workflows.length === 0) {
      alert('No workflows to export. Please create workflows first.');
      return;
    }
    const workflowData = selectedWorkflow 
      ? workflows.find((w: any) => w.id === selectedWorkflow)
      : workflows;
    
    if (workflowData) {
      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedWorkflow 
        ? `${workflows.find((w: any) => w.id === selectedWorkflow)?.name || 'workflow'}.json`
        : 'all-workflows.json';
      link.click();
    }
  };

  const handleConfigureNode = (nodeId: string) => {
    alert(`Configure ${nodeId} node - This would open a configuration modal for the selected node.`);
  };

  const handleRemoveNode = (nodeId: string) => {
    if (confirm(`Are you sure you want to remove this node?`)) {
      if (selectedWfIndex >= 0) {
        const updatedNodes = wfNodes.filter((n: any) => n.id !== nodeId);
        const updatedConnections = wfConnections.filter((c: any) => c.from !== nodeId && c.to !== nodeId);
        
        const updatedWorkflows = [...workflows];
        updatedWorkflows[selectedWfIndex] = { 
            ...workflows[selectedWfIndex], 
            nodes: updatedNodes, 
            connections: updatedConnections 
        };
        
        setWorkflows(updatedWorkflows);
        updateLocalStorageAndNotify('workflows', updatedWorkflows);
        setSelectedNode(null);
      }
    }
  };

  const updateWorkflowStatus = (workflowId: string, status: 'running' | 'paused' | 'error') => {
    setWorkflows(currentWorkflows => {
      const updatedWorkflows = currentWorkflows.map(w =>
        w.id === workflowId ? { ...w, status, lastModified: new Date().toISOString() } : w
      );
      updateLocalStorageAndNotify('workflows', updatedWorkflows);
      return updatedWorkflows;
    });
  };

  const getCurrentWorkflowStatus = () => {
    if (!selectedWorkflow) return null;
    const workflow = workflows.find((wf: any, i: number) => (wf.id || `wf-${i}`) === selectedWorkflow);
    return workflow?.status || 'paused';
  };

  const currentStatus = getCurrentWorkflowStatus();

  // If there are 0 nodes, ensure connections are empty
  if (wfNodes.length === 0 && wfConnections.length > 0 && selectedWfIndex >= 0) {
    const updatedWf = { ...workflows[selectedWfIndex], connections: [] };
    const updatedWorkflows = [...workflows];
    updatedWorkflows[selectedWfIndex] = updatedWf;
    setWorkflows(updatedWorkflows);
  }

  const handleConnectNodes = () => {
    console.log('handleConnectNodes called with:', { connectFrom, connectTo });
    console.log('Current wfConnections:', wfConnections);
    console.log('Current wfNodes:', wfNodes);
    
    if (!connectFrom || !connectTo || connectFrom === connectTo) {
      alert('Please select different nodes to connect.');
      return;
    }

    // Check if connection already exists
    const connectionExists = wfConnections.some((conn: any) => 
      conn.from === connectFrom && conn.to === connectTo
    );

    if (connectionExists) {
      alert('This connection already exists.');
      return;
    }

    if (selectedWfIndex >= 0) {
      const newConnection = { from: connectFrom, to: connectTo };
      const updatedConnections = [...wfConnections, newConnection];
      
      console.log('Creating new connection:', newConnection);
      console.log('Updated connections:', updatedConnections);
      
      const updatedWorkflows = [...workflows];
      updatedWorkflows[selectedWfIndex] = {
        ...updatedWorkflows[selectedWfIndex],
        connections: updatedConnections
      };
      
      setWorkflows(updatedWorkflows);
      updateLocalStorageAndNotify('workflows', updatedWorkflows);
      
      console.log('Workflows after update:', updatedWorkflows);
      
      setConnectFrom('');
      setConnectTo('');
      setShowConnectModal(false);
      alert('Nodes connected successfully!');
    }
  };

  const pauseWorkflow = (workflowId: string) => {
    if (executionState.current.a_id === workflowId) {
      executionState.current.isRunning = false;
      console.log(`⏸️ Pausing workflow: ${workflowId}`);
      updateWorkflowStatus(workflowId, 'paused');
      setExecutingNodeId(null);
    }
  };
  
  const toggleWorkflowLoop = (workflowId: string) => {
    const updatedWorkflows = workflows.map(w =>
      w.id === workflowId ? { ...w, isLooping: !w.isLooping } : w
    );
    setWorkflows(updatedWorkflows);
    updateLocalStorageAndNotify('workflows', updatedWorkflows);
  };

  const executeWorkflow = async (workflow: any) => {
    if (!workflow || !workflow.nodes || !workflow.connections) {
      alert('Invalid workflow configuration');
      return;
    }
    
    updateWorkflowStatus(workflow.id, 'running');

    const wfId = workflow.id;
    executionState.current = { isRunning: true, a_id: wfId };
    setExecutingNodeId(null); // Clear any previous execution

    // Find start nodes (nodes with type 'trigger')
    const startNodes = workflow.nodes.filter((node: any) => node.type === 'trigger');

    if (startNodes.length === 0) {
      alert('No "Trigger" node found. A workflow must have at least one trigger node to start.');
      updateWorkflowStatus(workflow.id, 'paused');
      setExecutingNodeId(null);
      return;
    }

    // Create a map of node dependencies
    const nodeMap = new Map();
    workflow.nodes.forEach((node: any) => {
      nodeMap.set(node.id, {
        ...node,
        executed: false,
        dependencies: workflow.connections
          .filter((conn: any) => conn.to === node.id)
          .map((conn: any) => conn.from)
      });
    });

    // Execute nodes in order
    const executeNode = async (node: any, isStartNode: boolean = false) => {
      const nodeInfo = nodeMap.get(node.id);
      
      if (nodeInfo.executed) {
        return; // Node has already been run in this cycle
      }

      if (!executionState.current.isRunning || executionState.current.a_id !== wfId) {
        console.log(`Workflow ${workflow.name} execution stopped or paused.`);
        setExecutingNodeId(null);
        return;
      }
      
      // Check if all dependencies are executed (unless it's a designated start node)
      if (!isStartNode) {
        const dependenciesExecuted = nodeInfo.dependencies.every(
          (depId: string) => nodeMap.get(depId).executed
        );
        
        if (!dependenciesExecuted) {
          return;
        }
      }

      // Set the current executing node for visual feedback
      setExecutingNodeId(node.id);
      console.log(`🟢 Executing node: ${node.name} (${node.id})`);

      // Update node status to 'running' and persist
      setWorkflows(currentWorkflows => {
        const workflowsWithRunningNode = currentWorkflows.map(wf => {
          if (wf.id === workflow.id) {
            const updatedNodes = wf.nodes.map((n: any) =>
              n.id === node.id ? { ...n, status: 'running' } : n
            );
            return { ...wf, nodes: updatedNodes };
          }
          return wf;
        });
        updateLocalStorageAndNotify('workflows', workflowsWithRunningNode);
        return workflowsWithRunningNode;
      });

      // Simulate node execution based on type
      switch (node.type) {
        case 'trigger':
          console.log(`Executing trigger node: ${node.name}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          break;
        case 'agent':
          console.log(`Executing agent node: ${node.name}`);
          // Update node UI to show progress
          setWorkflows(currentWorkflows => {
            const newWorkflows = currentWorkflows.map(w => {
              if (w.id === workflow.id) {
                const newNodes = w.nodes.map((n: any) =>
                  n.id === node.id
                    ? { ...n, status: 'running', currentTask: 'Processing...' }
                    : n
                );
                return { ...w, nodes: newNodes };
              }
              return w;
            });
            return newWorkflows;
          });
          
          // Simulate agent work
          await new Promise(resolve => setTimeout(resolve, 2000));
          break;
        case 'notifier':
          console.log(`Executing notifier node: ${node.name}`);
          alert(`Notification from ${node.name}: Task completed`);
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        default:
          console.log(`Executing custom node: ${node.name}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Mark node as executed
      nodeMap.get(node.id).executed = true;
      console.log(`✅ Completed node: ${node.name} (${node.id})`);
      
      // Update node status to 'completed' and persist
      setWorkflows(currentWorkflows => {
        const workflowsWithCompletedNode = currentWorkflows.map(wf => {
          if (wf.id === workflow.id) {
            const updatedNodes = wf.nodes.map((n: any) =>
              n.id === node.id ? { ...n, status: 'completed' } : n
            );
            return { ...wf, nodes: updatedNodes };
          }
          return wf;
        });
        updateLocalStorageAndNotify('workflows', workflowsWithCompletedNode);
        return workflowsWithCompletedNode;
      });

      // Find and execute next nodes
      const nextNodes = workflow.connections
        .filter((conn: any) => conn.from === node.id)
        .map((conn: any) => workflow.nodes.find((n: any) => n.id === conn.to))
        .filter((n: any) => n);

      for (const nextNode of nextNodes) {
        await executeNode(nextNode, false);
      }
    };

    try {
      // Start execution from start nodes
      for (const startNode of startNodes) {
        await executeNode(startNode, true);
      }
      
      if (executionState.current.isRunning && executionState.current.a_id === wfId) {
        console.log('🎉 Workflow execution completed successfully!');
        
        let shouldLoop = false;
        let workflowToLoop: any = null;

        setWorkflows(currentWorkflows => {
          const currentWorkflow = currentWorkflows.find(w => w.id === wfId);
          if (currentWorkflow?.isLooping) {
            shouldLoop = true;
            const updatedWorkflows = currentWorkflows.map(w => {
              if (w.id === wfId) {
                const resetNodes = w.nodes.map((node: any) => ({ ...node, status: 'idle' }));
                workflowToLoop = { ...w, nodes: resetNodes };
                return workflowToLoop;
              }
              return w;
            });
            updateLocalStorageAndNotify('workflows', updatedWorkflows);
            return updatedWorkflows;
          }
          return currentWorkflows;
        });

        if (shouldLoop && executionState.current.isRunning && workflowToLoop) {
          console.log(`🔁 Looping workflow: ${workflowToLoop.name}`);
          // Only loop once, then stop
          setTimeout(() => {
            executeWorkflow(workflowToLoop);
            // After this execution, disable looping
            setWorkflows(currentWorkflows => {
              return currentWorkflows.map(w => {
                if (w.id === wfId) {
                  return { ...w, isLooping: false };
                }
                return w;
              });
            });
          }, 1000);
        } else {
          updateWorkflowStatus(workflow.id, 'paused');
        }
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
      alert('Workflow execution failed. Check console for details.');
      
      if (executingNodeId) {
        setWorkflows(currentWorkflows => {
          const updatedWorkflows = currentWorkflows.map(wf => {
            if (wf.id === workflow.id) {
              const updatedNodes = wf.nodes.map((n: any) =>
                n.id === executingNodeId ? { ...n, status: 'error' } : n
              );
              return { ...wf, nodes: updatedNodes, status: 'error' };
            }
            return wf;
          });
          updateLocalStorageAndNotify('workflows', updatedWorkflows);
          return updatedWorkflows;
        });
      }

      if (executionState.current.a_id === wfId) {
        updateWorkflowStatus(workflow.id, 'paused');
      }
    } finally {
      // Don't auto-clear for looping workflows
      const finalWorkflow = workflows.find(w => w.id === wfId);
      if (!finalWorkflow?.isLooping || !executionState.current.isRunning) {
        setExecutingNodeId(null);
        executionState.current = { isRunning: false, a_id: null };
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workflow Canvas</h1>
          <p className="text-slate-400">
            Design and orchestrate multi-agent workflows
            <span className="ml-2 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-sm">
              {workflows.length} workflows
            </span>
          </p>
        </div>
      </motion.div>

      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-4 bg-slate-800/50 rounded-full mb-4">
            <GitBranch className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Workflows Created</h2>
          <p className="text-slate-400 mb-8">Get started by creating your first workflow or importing existing ones</p>
          <div className="flex items-center space-x-4">
          <button 
              onClick={() => setShowNewWorkflowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
              Create New Workflow
          </button>
          <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Import Workflows
          </button>
        </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workflow List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Workflows</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowNewWorkflowModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New</span>
                </button>
              </div>
            </div>
          <div className="space-y-3">
              {workflows.map((workflow: any, index: number) => {
                const workflowKey = workflow.id || `wf-${index}`;
                const isSelected = selectedWorkflow === workflowKey;
                return (
              <motion.div
                    key={workflowKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                      isSelected
                        ? 'border-blue-500/70 bg-gradient-to-r from-blue-900/70 to-blue-700/40'
                        : 'border-slate-600/30 bg-slate-800/40 hover:bg-slate-700/50'
                    }`}
                    onClick={() => {
                      setSelectedWorkflow(workflowKey);
                      localStorage.setItem('selectedWorkflow', workflowKey);
                    }}
              >
                <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white cursor-pointer">
                    {workflow.name}
                  </h3>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                          onClick={(e) => { e.stopPropagation(); handleDuplicateWorkflow(workflow); }}
                      className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteWorkflow(workflowKey); }}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">{workflow.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{Array.isArray(workflow.nodes) ? workflow.nodes.length : 0} nodes</span>
                      <span>{Array.isArray(workflow.connections) ? workflow.connections.length : 0} connections</span>
                </div>
                    <div className="mt-2 flex items-center space-x-2 text-xs">
                      <span className="text-slate-500">Modified: {workflow.lastModified}</span>
                      {workflow.status && (
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                          workflow.status === 'running' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' :
                          workflow.status === 'paused' ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                          'border-slate-600 text-slate-400 bg-slate-700/20'
                        }`}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </span>
                      )}
                </div>
              </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Canvas Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-gradient-to-br from-blue-950/80 via-slate-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl"
        >
            <div className="flex items-center justify-between p-8 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">
                {selectedWorkflow ? (workflows.find((w: any, i: number) => (w.id || `wf-${i}`) === selectedWorkflow)?.name || 'Select a Workflow') : 'Select a Workflow'}
            </h2>
              {selectedWorkflow && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </button>
                  <button
                    onClick={handleExportWorkflow}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button 
                    onClick={handleSaveWorkflow}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
            <div className="flex items-center space-x-2">
              <button 
                      onClick={() => {
                        if (!selectedWorkflow) {
                          alert('Please select a workflow to start.');
                        } else {
                          const workflow = workflows.find((w: any) => w.id === selectedWorkflow);
                          if (workflow) {
                            updateWorkflowStatus(selectedWorkflow, 'running');
                            executeWorkflow(workflow);
                          }
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        currentStatus === 'running' 
                          ? 'text-emerald-400 bg-emerald-500/20' 
                          : 'text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                      disabled={currentStatus === 'running'}
              >
                <Play className="w-4 h-4" />
              </button>
              <button 
                      onClick={() => {
                        if (!selectedWorkflow) {
                          alert('Please select a workflow to pause.');
                        } else {
                          executionState.current = { isRunning: false, a_id: null };
                          setExecutingNodeId(null);
                          updateWorkflowStatus(selectedWorkflow, 'paused');
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        currentStatus === 'paused' 
                          ? 'text-yellow-400 bg-yellow-500/20' 
                          : 'text-yellow-400 hover:bg-yellow-500/10'
                      }`}
                      disabled={currentStatus === 'paused'}
              >
                <Pause className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowNodeModal('add')}
                className="p-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-700/50"
                title="Add Node"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowConnectModal(true)}
                className="p-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-700/50"
                title="Connect Nodes"
              >
                <GitBranch className="w-4 h-4" />
              </button>
            </div>
                </div>
              )}
          </div>

          {/* Workflow Canvas */}
            <div className="flex-1 relative bg-slate-900/50 rounded-2xl overflow-hidden" ref={canvasRef}>
                {/* Grid Background */}
              <div className="absolute inset-0 grid grid-cols-[repeat(auto-fit,minmax(1rem,1fr))] gap-4 opacity-10 pointer-events-none">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} className="border-r border-t border-slate-500/20" />
                ))}
                </div>

              {/* Main Canvas Area */}
              <div className="p-10 h-[38rem] relative">
                {selectedWorkflow ? (
                  <>
                {/* Connection Lines */}
                    {wfNodes.length > 1 && wfConnections.length > 0 && (
                      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5, width: '100%', height: '100%' }}>
                        {wfConnections.map((connection: any, index: number) => {
                          const fromNode = wfNodes.find((n: any) => n.id === connection.from);
                          const toNode = wfNodes.find((n: any) => n.id === connection.to);
                    if (!fromNode || !toNode) return null;
                          const fromX = fromNode.position.x + 40;
                          const fromY = fromNode.position.y + 24;
                          const toX = toNode.position.x + 40;
                          const toY = toNode.position.y + 24;
                          
                          // Check if this connection is part of the current execution path
                          const isExecutingPath = executingNodeId === connection.from || executingNodeId === connection.to;
                          
                    return (
                            <g key={`connection-${index}`}>
                              <line
                                x1={fromX}
                                y1={fromY}
                                x2={toX}
                                y2={toY}
                                stroke={isExecutingPath ? "#fbbf24" : "#60a5fa"}
                                strokeWidth={isExecutingPath ? "3" : "2"}
                                strokeDasharray={isExecutingPath ? "8" : "4"}
                                className={isExecutingPath ? "animate-pulse" : ""}
                              />
                              {/* Arrow head for direction */}
                              <defs>
                                <marker
                                  id={`arrowhead-${index}`}
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="9"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    fill={isExecutingPath ? "#fbbf24" : "#60a5fa"}
                                  />
                                </marker>
                              </defs>
                              <line
                                x1={fromX}
                                y1={fromY}
                                x2={toX}
                                y2={toY}
                                stroke="transparent"
                                strokeWidth="2"
                                markerEnd={`url(#arrowhead-${index})`}
                              />
                            </g>
                    );
                  })}
                </svg>
                    )}

                {/* Workflow Nodes */}
                    {wfNodes.length > 0 ? wfNodes.map((node: any, index: number) => {
                      const getTypeIcon = (type: string) => {
                        switch (type) {
                          case 'agent': return '🤖';
                          case 'trigger': return '⚡';
                          case 'notifier': return '🔔';
                          case 'custom': return '⚙️';
                          default: return '🔷';
                        }
                      };

                  return (
                    <motion.div
                      key={node.id}
                          animate={{
                            opacity: 1,
                            scale: executingNodeId === node.id ? 1.1 : 1,
                            transition: { duration: 0.3 }
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          className={`absolute p-2 bg-gradient-to-r ${node.color || 'from-blue-500 to-cyan-500'} text-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all group border-2 ${
                            executingNodeId === node.id 
                              ? 'border-yellow-400 shadow-yellow-400/50 shadow-2xl animate-pulse' 
                              : 'border-white/20'
                          }`}
                          style={{ left: node.position.x, top: node.position.y, zIndex: 10, minWidth: '80px' }}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getTypeIcon(node.type)}</span>
                            <span className="font-medium text-xs truncate w-16">{node.name}</span>
                      </div>
                          <p className="text-xs opacity-90 truncate w-32">{node.description}</p>
                          {executingNodeId === node.id && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                          )}
                          {selectedNode === node.id && (
                            <div className="absolute top-0 right-0 mt-1 mr-1 flex items-center space-x-1 bg-slate-900/50 rounded-full p-1 z-20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const nodeToEdit = wfNodes.find((n: any) => n.id === node.id);
                                        const nodeIndex = wfNodes.findIndex((n: any) => n.id === node.id);
                                        if (nodeToEdit) {
                                            setEditingNode({ ...nodeToEdit, index: nodeIndex });
                                            setShowNodeModal('edit');
                                        }
                                    }}
                                    className="p-1 text-slate-300 hover:text-white"
                                    title="Edit Node"
                                >
                                    <Edit className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveNode(node.id);
                                    }}
                                    className="p-1 text-slate-300 hover:text-red-400"
                                    title="Remove Node"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    }) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">No nodes in this workflow. Use the + button to add your first node.</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Select a workflow to view its canvas</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Node Modal - Moved outside canvas container */}
      {showNodeModal === 'add' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Add Node</h3>
            <p className="text-sm text-slate-400 mb-4">Adding node to workflow: {selectedWorkflow}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Node Name</label>
                <input
                  type="text"
                  value={editingNode?.name || ''}
                  onChange={e => setEditingNode({ ...editingNode, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter node name"
                />
                            </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={editingNode?.description || ''}
                  onChange={e => setEditingNode({ ...editingNode, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Enter node description"
                />
                            </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <select
                  value={editingNode?.type || 'agent'}
                  onChange={e => setEditingNode({ ...editingNode, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                >
                  <option value="agent">Agent</option>
                  <option value="trigger">Trigger</option>
                  <option value="notifier">Notifier</option>
                  <option value="custom">Custom</option>
                </select>
                            </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                <select
                  value={editingNode?.color || 'from-blue-500 to-cyan-500'}
                  onChange={e => setEditingNode({ ...editingNode, color: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                >
                  <option value="from-blue-500 to-cyan-500">Blue → Cyan</option>
                  <option value="from-purple-500 to-pink-500">Purple → Pink</option>
                  <option value="from-emerald-500 to-teal-500">Emerald → Teal</option>
                  <option value="from-orange-500 to-red-500">Orange → Red</option>
                </select>
                          </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  // Add node to workflow
                  if (selectedWfIndex >= 0 && editingNode?.name) {
                    // Calculate position for new node
                    const position = getNonOverlappingRandomPosition(canvasSize.width, canvasSize.height, wfNodes);

                    const newNode = {
                      id: `node-${Date.now()}`,
                      name: editingNode.name,
                      description: editingNode.description || '',
                      type: editingNode.type || 'agent',
                      position: position,
                      color: editingNode.color || 'from-blue-500 to-cyan-500'
                    };
                    const updatedNodes = [...wfNodes, newNode];
                    const updatedWf = { ...workflows[selectedWfIndex], nodes: updatedNodes };
                    const updatedWorkflows = [...workflows];
                    updatedWorkflows[selectedWfIndex] = updatedWf;
                    setWorkflows(updatedWorkflows);
                    setShowNodeModal(false);
                    setEditingNode(null);
                  }
                }}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Add Node
                            </button>
              <button
                onClick={() => { setShowNodeModal(false); setEditingNode(null); }}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
                            </button>
                          </div>
                        </motion.div>
        </div>
      )}

      {/* Node edit modal */}
      {showNodeModal === 'edit' && editingNode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Edit Node</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Node Name</label>
                <input
                  type="text"
                  value={editingNode.name}
                  onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter node name"
                />
                </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={editingNode.description}
                  onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Enter node description"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  // Save node changes
                  if (selectedWfIndex >= 0 && editingNode) {
                    const updatedNodes = [...wfNodes];
                    const { index, ...nodeToSave } = editingNode; // Don't save index property
                    updatedNodes[index] = nodeToSave;
            
                    const updatedWorkflows = [...workflows];
                    updatedWorkflows[selectedWfIndex] = {
                        ...workflows[selectedWfIndex],
                        nodes: updatedNodes,
                    };
                    
                    setWorkflows(updatedWorkflows);
                    updateLocalStorageAndNotify('workflows', updatedWorkflows);
                    setShowNodeModal(false);
                    setEditingNode(null);
                  }
                }}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Save
              </button>
              <button
                onClick={() => { setShowNodeModal(false); setEditingNode(null); }}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
          </div>
        </motion.div>
      </div>
      )}

      {/* Workflow settings modal */}
      {showWorkflowModal && selectedWf && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Edit Workflow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Workflow Name</label>
                <input
                  type="text"
                  value={selectedWf.name}
                  onChange={(e) => {
                    const updatedWf = { ...selectedWf, name: e.target.value };
                    const updatedWorkflows = [...workflows];
                    updatedWorkflows[selectedWfIndex] = updatedWf;
                    setWorkflows(updatedWorkflows);
                  }}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={selectedWf.description}
                  onChange={(e) => {
                    const updatedWf = { ...selectedWf, description: e.target.value };
                    const updatedWorkflows = [...workflows];
                    updatedWorkflows[selectedWfIndex] = updatedWf;
                    setWorkflows(updatedWorkflows);
                  }}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Enter workflow description"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowWorkflowModal(false);
                  // Save is already handled by onChange above
                }}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setShowWorkflowModal(false)}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Connect Nodes Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Connect Nodes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">From Node</label>
                <select
                  value={connectFrom}
                  onChange={e => setConnectFrom(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                >
                  <option value="">Select node</option>
                  {wfNodes.map((n: any) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">To Node</label>
                <select
                  value={connectTo}
                  onChange={e => setConnectTo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                >
                  <option value="">Select node</option>
                  {wfNodes.map((n: any) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleConnectNodes}
                className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Connect
              </button>
              <button
                onClick={() => { setShowConnectModal(false); setConnectFrom(''); setConnectTo(''); }}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showNewWorkflowModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Create New Workflow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Workflow Name</label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Enter workflow description"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateWorkflow}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Create Workflow
              </button>
              <button
                onClick={() => { setShowNewWorkflowModal(false); setNewWorkflowName(''); setNewWorkflowDescription(''); }}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Import Workflow Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Import Workflow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Workflow File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                />
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300 mb-2">Expected CSV format:</p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• <span className="text-red-400 font-medium">workflow_name*</span> - Workflow name (required)</li>
                  <li>• <span className="text-red-400 font-medium">workflow_description</span> - Workflow description</li>
                  <li>• <span className="text-red-400 font-medium">node_id</span> - Unique node identifier</li>
                  <li>• <span className="text-red-400 font-medium">node_name</span> - Display name for the node</li>
                  <li>• <span className="text-red-400 font-medium">node_description</span> - Node description</li>
                  <li>• <span className="text-red-400 font-medium">node_type</span> - Node type (trigger, agent, notifier, custom)</li>
                  <li>• <span className="text-red-400 font-medium">node_color</span> - Node color gradient (e.g., from-blue-500 to-cyan-500)</li>
                  <li>• <span className="text-red-400 font-medium">node_position_x</span> - X coordinate for node position</li>
                  <li>• <span className="text-red-400 font-medium">node_position_y</span> - Y coordinate for node position</li>
                  <li>• <span className="text-red-400 font-medium">connection_from</span> - Source node ID for connection</li>
                  <li>• <span className="text-red-400 font-medium">connection_to</span> - Target node ID for connection</li>
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
    </div>
  );
};

export default Workflows;