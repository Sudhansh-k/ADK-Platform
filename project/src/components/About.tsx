import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  ArrowLeft, 
  Zap, 
  Shield, 
  Database, 
  Network, 
  Cpu, 
  GitBranch,
  MessageSquare,
  BarChart3,
  Cloud,
  Lock,
  Users,
  Workflow,
  CheckCircle,
  Target,
  Award,
  Globe
} from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: "Multi-Agent Orchestration",
      description: "Deploy and coordinate multiple AI agents that work together to solve complex problems autonomously with intelligent task distribution and real-time communication."
    },
    {
      icon: Workflow,
      title: "Visual Workflow Designer",
      description: "Create sophisticated workflows with drag-and-drop interface, connecting agents and defining process flows with real-time collaboration and version control."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor agent performance, track KPIs, and gain insights into your automation ecosystem with predictive analytics and custom dashboards."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built-in security features with role-based access control, end-to-end encryption, compliance monitoring, and comprehensive audit trails."
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "Connect to multiple data sources and enable agents to access and process information seamlessly with real-time synchronization and intelligent caching."
    },
    {
      icon: Cloud,
      title: "Cloud-Native Architecture",
      description: "Scalable, resilient infrastructure designed for enterprise-grade deployments with auto-scaling, load balancing, and global distribution."
    }
  ];

  const useCases = [
    {
      title: "Business Process Automation",
      description: "Automate complex, multi-step business processes across departments and systems with intelligent coordination and exception handling.",
      icon: Zap,
      benefits: ["85% reduction in manual work", "99.9% process reliability", "Real-time optimization"]
    },
    {
      title: "Customer Service Excellence",
      description: "Deploy intelligent virtual assistants that handle complex customer inquiries with human-like understanding, empathy, and multilingual support.",
      icon: MessageSquare,
      benefits: ["24/7 availability", "90% query resolution", "Seamless escalation"]
    },
    {
      title: "Data Analysis & Insights",
      description: "Analyze data from multiple sources, derive insights, and generate actionable reports automatically with AI-powered pattern recognition.",
      icon: BarChart3,
      benefits: ["Real-time processing", "Predictive insights", "Automated reporting"]
    },
    {
      title: "Content Generation",
      description: "Create marketing materials, reports, and documentation through coordinated agent collaboration with brand consistency and quality control.",
      icon: GitBranch,
      benefits: ["Consistent branding", "Multi-format output", "Quality assurance"]
    }
  ];

  const stats = [
    { label: "Enterprise Clients", value: "500+", icon: Users },
    { label: "Processes Automated", value: "10K+", icon: Zap },
    { label: "Hours Saved Daily", value: "50K+", icon: Target },
    { label: "Success Rate", value: "99.9%", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Agent Development Kit
            <span className="block text-3xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
              Multi-Agent Orchestration Platform
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            ADK is a comprehensive platform for building, deploying, and managing intelligent multi-agent systems. 
            It enables organizations to create sophisticated automation workflows where multiple AI agents collaborate 
            to solve complex business challenges with unprecedented efficiency and reliability.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* What is ADK */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">What is ADK?</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  The Agent Development Kit (ADK) is a next-generation platform that revolutionizes how organizations 
                  approach automation and intelligent process management. Unlike traditional single-agent systems, 
                  ADK enables the creation of multi-agent ecosystems where specialized AI agents work together 
                  to accomplish complex, multi-faceted tasks.
                </p>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  Built with enterprise needs in mind, ADK provides the tools, infrastructure, and governance 
                  capabilities needed to deploy AI agents at scale while maintaining security, reliability, 
                  and observability.
                </p>
                <div className="space-y-3">
                  {[
                    "Enterprise-grade security and compliance",
                    "Scalable cloud-native architecture",
                    "Real-time monitoring and analytics",
                    "Visual workflow designer"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Network, title: "Orchestration", color: "from-blue-500 to-cyan-500" },
                    { icon: Cpu, title: "Processing", color: "from-purple-500 to-pink-500" },
                    { icon: Database, title: "Data Access", color: "from-emerald-500 to-teal-500" },
                    { icon: Shield, title: "Security", color: "from-orange-500 to-red-500" }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`p-6 bg-gradient-to-br ${item.color}/10 rounded-2xl border border-slate-700/50 text-center hover:scale-105 transition-transform`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
                        <p className="text-sm text-slate-300 font-medium">{item.title}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Use Cases</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                      <p className="text-slate-400 mb-4">{useCase.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Architecture Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">How ADK Works</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Agent Creation</h3>
                <p className="text-slate-400">
                  Define specialized agents with unique capabilities, roles, and responsibilities within your workflow ecosystem.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Workflow Design</h3>
                <p className="text-slate-400">
                  Use the visual designer to create complex workflows that orchestrate agent interactions and optimize data flow.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Execution & Monitoring</h3>
                <p className="text-slate-400">
                  Deploy workflows and monitor agent performance with real-time analytics, comprehensive logging, and predictive insights.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl font-semibold text-lg hover:bg-slate-700/50 transition-all"
            >
              Explore Features
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;