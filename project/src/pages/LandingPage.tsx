import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Zap, 
  Shield, 
  BarChart3, 
  GitBranch, 
  Database, 
  Cloud, 
  ArrowRight, 
  Play,
  CheckCircle,
  Users,
  Cpu,
  Network,
  Activity,
  Sparkles,
  Globe,
  Lock,
  TrendingUp,
  MessageSquare,
  Settings,
  Code,
  Workflow,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Target,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  Brain,
  Lightbulb,
  Rocket,
  Gauge,
  Infinity,
  Puzzle,
  X
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({
    agents: 0,
    workflows: 0,
    tasks: 0,
    uptime: 0
  });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Animate stats on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        agents: 247,
        workflows: 1834,
        tasks: 89432,
        uptime: 99.9
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem('currentUser'));
  }, []);

  const features = [
    {
      icon: Bot,
      title: "Intelligent Agent Orchestration",
      description: "Deploy and manage multiple AI agents that work together seamlessly to automate complex business processes with unprecedented coordination and efficiency.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      details: ["Multi-agent coordination", "Intelligent task distribution", "Real-time communication", "Autonomous decision making"]
    },
    {
      icon: Workflow,
      title: "Visual Workflow Designer",
      description: "Create sophisticated multi-agent workflows with our intuitive drag-and-drop interface, real-time collaboration, and advanced process modeling capabilities.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      details: ["Drag-and-drop interface", "Real-time collaboration", "Process templates", "Version control"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Insights",
      description: "Monitor performance, track KPIs, and gain deep insights into your agent ecosystem with comprehensive analytics, predictive modeling, and custom dashboards.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
      details: ["Real-time monitoring", "Predictive analytics", "Custom dashboards", "Performance optimization"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built-in security features with role-based access control, end-to-end encryption, compliance monitoring, and comprehensive audit trails.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      details: ["Role-based access", "End-to-end encryption", "Compliance monitoring", "Audit trails"]
    }
  ];

  const capabilities = [
    { icon: Database, title: "Data Processing", desc: "Handle massive datasets with intelligent data pipelines and real-time processing" },
    { icon: MessageSquare, title: "Natural Language", desc: "Advanced NLP capabilities for human-like interactions and understanding" },
    { icon: Code, title: "Custom Integrations", desc: "Seamlessly integrate with existing systems, APIs, and third-party services" },
    { icon: Cloud, title: "Cloud Native", desc: "Built for scale with cloud-first architecture and auto-scaling capabilities" },
    { icon: Lock, title: "Secure by Design", desc: "Enterprise-grade security and compliance features built from the ground up" },
    { icon: TrendingUp, title: "Predictive Analytics", desc: "AI-powered insights and predictive modeling for proactive decision making" },
    { icon: Network, title: "Multi-Agent Coordination", desc: "Sophisticated agent communication and coordination protocols" },
    { icon: Layers, title: "Scalable Architecture", desc: "Horizontally scalable infrastructure that grows with your needs" },
    { icon: Monitor, title: "Real-time Monitoring", desc: "Comprehensive monitoring and alerting for all system components" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechCorp",
      content: "ADK transformed our automation capabilities. We've reduced manual processes by 85% and improved efficiency dramatically. The multi-agent orchestration is simply incredible.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      company: "TechCorp Inc."
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Operations, DataFlow",
      content: "The multi-agent orchestration is incredible. Our complex workflows now run autonomously with 99.9% reliability. ROI was achieved within 3 months.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      company: "DataFlow Systems"
    },
    {
      name: "Emily Watson",
      role: "VP Engineering, CloudScale",
      content: "ADK's visual workflow designer made it easy for our team to create sophisticated automation without extensive coding. Game-changing platform.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      company: "CloudScale Solutions"
    }
  ];

  const useCases = [
    {
      title: "Business Process Automation",
      description: "Automate complex, multi-step business processes across departments and systems with intelligent agent coordination.",
      icon: Zap,
      benefits: ["85% reduction in manual work", "99.9% process reliability", "Real-time process optimization"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Customer Service Excellence",
      description: "Deploy intelligent virtual assistants that handle complex customer inquiries with human-like understanding and empathy.",
      icon: MessageSquare,
      benefits: ["24/7 customer support", "90% query resolution", "Multilingual capabilities"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Data Analysis & Insights",
      description: "Analyze data from multiple sources, derive insights, and generate actionable reports automatically with AI-powered analytics.",
      icon: BarChart3,
      benefits: ["Real-time data processing", "Predictive insights", "Automated reporting"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Content Generation",
      description: "Create marketing materials, reports, and documentation through coordinated agent collaboration and intelligent content creation.",
      icon: GitBranch,
      benefits: ["Automated content creation", "Brand consistency", "Multi-format output"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams getting started with agent automation",
      features: [
        "Up to 5 agents",
        "10 workflows",
        "Basic analytics",
        "Email support",
        "Standard integrations"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing businesses with advanced automation needs",
      features: [
        "Up to 25 agents",
        "Unlimited workflows",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "API access"
      ],
      color: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations requiring maximum scale and customization",
      features: [
        "Unlimited agents",
        "Enterprise workflows",
        "Custom analytics",
        "24/7 dedicated support",
        "White-label options",
        "On-premise deployment"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  // Creative animated visualization components
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.MAX_SAFE_INTEGER,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );

  const AgentNetwork = () => (
    <div className="relative w-full h-96 lg:h-[500px]">
      {/* Central Brain */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ delay: 1, duration: 2, rotate: { duration: 20, repeat: Number.MAX_SAFE_INTEGER, repeatType: "loop", ease: "linear" } }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50"
      >
        <Brain className="w-12 h-12 text-white" />
      </motion.div>

      {/* Orbiting Agents with different orbits */}
      {[
        { icon: Bot, color: "from-emerald-500 to-teal-500", delay: 1.2, radius: 100, speed: 8 },
        { icon: Database, color: "from-orange-500 to-red-500", delay: 1.4, radius: 140, speed: 12 },
        { icon: Cpu, color: "from-purple-500 to-pink-500", delay: 1.6, radius: 180, speed: 16 },
        { icon: Activity, color: "from-yellow-500 to-orange-500", delay: 1.8, radius: 120, speed: 10 },
        { icon: Lightbulb, color: "from-blue-500 to-cyan-500", delay: 2.0, radius: 160, speed: 14 },
        { icon: Rocket, color: "from-pink-500 to-purple-500", delay: 2.2, radius: 200, speed: 18 }
      ].map((agent, index) => {
        const Icon = agent.icon;
        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 w-16 h-16"
            style={{ transformOrigin: '8px 8px' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotate: 360
            }}
            transition={{ 
              delay: agent.delay, 
              duration: 0.5,
              rotate: { duration: agent.speed, repeat: Number.MAX_SAFE_INTEGER, repeatType: "loop", ease: "linear" }
            }}
          >
            <div 
              className={`w-full h-full bg-gradient-to-r ${agent.color} rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer`}
              style={{
                transform: `translate(${agent.radius}px, -8px)`
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        );
      })}

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="connectionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={i}
            cx="50%"
            cy="50%"
            r={100 + i * 20}
            fill="none"
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 1 + i * 0.2, duration: 2 }}
          />
        ))}
      </svg>

      {/* Pulse Waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400/30 rounded-full"
          animate={{ 
            scale: [1, 2, 1], 
            opacity: [0.5, 0, 0.5] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Number.MAX_SAFE_INTEGER,
            repeatType: "loop",
            delay: i * 1,
            ease: "easeInOut"
          }}
          style={{ width: '200px', height: '200px' }}
        />
      ))}

      {/* Data Flow Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          initial={{ 
            x: Math.random() * 400 + 100,
            y: Math.random() * 400 + 100,
            scale: 0
          }}
          animate={{ 
            x: Math.random() * 400 + 100,
            y: Math.random() * 400 + 100,
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            repeat: Number.MAX_SAFE_INTEGER,
            repeatType: "loop",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ADK Platform</h1>
                <p className="text-xs text-slate-400">Agent Development Kit</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#capabilities" className="text-slate-300 hover:text-white transition-colors">Capabilities</a>
              <a href="#use-cases" className="text-slate-300 hover:text-white transition-colors">Use Cases</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <button 
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <FloatingElements />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Next-Generation AI Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Multi-Agent
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Orchestration</span>
                <span className="block text-4xl lg:text-5xl mt-2">Platform</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Build, deploy, and manage intelligent agent ecosystems that automate complex business processes with unprecedented efficiency, reliability, and scale. Transform your operations with AI-powered automation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{isLoggedIn ? 'Go to Dashboard' : 'Start Free Trial'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="group px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl font-semibold hover:bg-slate-700/50 transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Active Agents", value: stats.agents, suffix: "+" },
                  { label: "Workflows", value: stats.workflows, suffix: "+" },
                  { label: "Tasks Processed", value: stats.tasks, suffix: "+" },
                  { label: "Uptime", value: stats.uptime, suffix: "%" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div 
                      className="text-2xl font-bold text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1.5 + index * 0.1 }}
                      >
                        {stat.value.toLocaleString()}{stat.suffix}
                      </motion.span>
                    </motion.div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <AgentNetwork />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Modern Teams</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale intelligent agent systems that transform your business operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-8 bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-slate-600/50 transition-all group`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-400">{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Built for
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"> Enterprise Scale</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Advanced capabilities that power the next generation of intelligent automation and decision-making systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                >
                  <Icon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2">{capability.title}</h3>
                  <p className="text-slate-400 text-sm">{capability.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Business Operations</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover how ADK's multi-agent platform revolutionizes different aspects of your business with intelligent automation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"> Industry Leaders</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how organizations worldwide are transforming their operations with ADK's multi-agent platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    <p className="text-slate-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Perfect Plan</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Start with our free trial and scale as you grow. All plans include our core features with varying limits and support levels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border transition-all ${
                  plan.popular 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20 scale-105' 
                    : 'border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
                <p className="text-slate-400">{plan.description}</p>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    if (plan.name === 'Starter') {
                      navigate(isLoggedIn ? '/dashboard' : '/login');
                    } else if ((plan.name === 'Professional' || plan.name === 'Enterprise') && isLoggedIn) {
                      window.open('https://pay.example.com/upi', '_blank');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50'
                  }`}
                >
                  {plan.name === 'Starter'
                    ? (isLoggedIn ? 'Go to Dashboard' : 'Start Free Trial')
                    : (isLoggedIn ? 'Purchase' : 'Start Free Trial')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl border border-slate-700/50"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Operations?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations already using ADK to automate complex processes and drive unprecedented efficiency. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                className="group px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center justify-center space-x-3"
              >
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Start Free Trial'}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-10 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-2xl font-semibold text-lg hover:bg-slate-700/50 transition-all"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">ADK Platform</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                The next-generation multi-agent orchestration platform for intelligent automation.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-slate-400 hover:text-white transition-colors text-sm">Features</a>
                <a href="#capabilities" className="block text-slate-400 hover:text-white transition-colors text-sm">Capabilities</a>
                <a href="#pricing" className="block text-slate-400 hover:text-white transition-colors text-sm">Pricing</a>
                <button onClick={() => navigate('/login')} className="block text-slate-400 hover:text-white transition-colors text-sm">Dashboard</button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <button onClick={() => navigate('/about')} className="block text-slate-400 hover:text-white transition-colors text-sm">About</button>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Blog</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Documentation</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">API Reference</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Help Center</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Community</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 Agent Development Kit. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-4xl mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">ADK Platform Demo</h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-slate-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <iframe
                src="/demo-video.html"
                className="w-full h-full rounded-xl"
                title="ADK Platform Demo"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDemoModal(false)}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;