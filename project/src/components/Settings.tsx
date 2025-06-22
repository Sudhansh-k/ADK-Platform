import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Database, 
  Shield,
  Save,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Building,
  Monitor,
  Smartphone,
  Tablet,
  Lock,
  Key,
  Clock,
  Zap,
  HardDrive,
  Wifi,
  Download,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Briefcase,
  Users
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      timezone: 'America/Los_Angeles',
      avatar: '',
      jobTitle: '',
      department: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      agentAlerts: true,
      workflowUpdates: true,
      systemMaintenance: false,
      weeklyReports: true,
      securityAlerts: true,
      performanceReports: false,
      dataBackupNotifications: true
    },
    appearance: {
      theme: 'dark',
      accentColor: 'blue',
      compactMode: false,
      animations: true,
      fontSize: 'medium',
      sidebarCollapsed: false
    },
    system: {
      autoSave: true,
      dataRetention: '90',
      maxAgents: '50',
      apiRateLimit: '1000',
      sessionTimeout: '30',
      backupFrequency: 'daily',
      logLevel: 'info',
      cacheSize: '512'
    },
    security: {
      twoFactorAuth: true,
      sessionManagement: true,
      ipWhitelist: false,
      auditLogging: true,
      passwordExpiry: '90',
      loginAttempts: '5'
    },
    integrations: {
      slackWebhook: '',
      emailService: 'smtp',
      storageProvider: 's3',
      monitoringService: 'datadog'
    }
  });

  // Load user data from session storage
  useEffect(() => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.companyName || '',
          location: userData.location || '',
          jobTitle: userData.jobTitle || '',
          department: userData.department || ''
        }
      }));
    }
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'account', label: 'Account', icon: User }
  ];

  const handleSave = () => {
    // Update session storage with new profile data
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const updatedUser = {
        ...userData,
        firstName: settings.profile.firstName,
        lastName: settings.profile.lastName,
        email: settings.profile.email,
        phone: settings.profile.phone,
        companyName: settings.profile.company,
        location: settings.profile.location,
        jobTitle: settings.profile.jobTitle,
        department: settings.profile.department
      };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adk-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings({ ...settings, ...importedSettings });
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.')) {
      sessionStorage.removeItem('currentUser');
      alert('Account deletion initiated. Redirecting to home page...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      setShowDeleteConfirm(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {settings.profile.firstName.charAt(0)}{settings.profile.lastName.charAt(0)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
          <p className="text-slate-400 text-sm">Update your profile image</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
          <input
            type="text"
            value={settings.profile.firstName}
            onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, firstName: e.target.value } }))}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
          <input
            type="text"
            value={settings.profile.lastName}
            onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, lastName: e.target.value } }))}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, email: e.target.value } }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, phone: e.target.value } }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter phone number"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={settings.profile.company}
              onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, company: e.target.value } }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter company name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={settings.profile.location}
              onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, location: e.target.value } }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter location"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={settings.profile.jobTitle}
              onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, jobTitle: e.target.value } }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter job title"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={settings.profile.department}
              onChange={(e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, department: e.target.value } }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter department"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-slate-700/30  rounded-xl">
          <div>
            <h4 className="text-white font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <p className="text-slate-400 text-sm">
              {key === 'emailNotifications' && 'Receive notifications via email'}
              {key === 'pushNotifications' && 'Browser push notifications'}
              {key === 'agentAlerts' && 'Alerts when agents encounter issues'}
              {key === 'workflowUpdates' && 'Updates on workflow status changes'}
              {key === 'systemMaintenance' && 'Maintenance and downtime notifications'}
              {key === 'weeklyReports' && 'Weekly performance summary reports'}
              {key === 'securityAlerts' && 'Security-related notifications'}
              {key === 'performanceReports' && 'Monthly performance analysis'}
              {key === 'dataBackupNotifications' && 'Data backup status updates'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, [key]: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-slate-700/30 rounded-xl">
        <h4 className="text-white font-medium mb-3">Theme</h4>
        <div className="grid grid-cols-3 gap-3">
          {['dark', 'light', 'auto'].map((theme) => (
            <button
              key={theme}
              onClick={() => setSettings({
                ...settings,
                appearance: { ...settings.appearance, theme }
              })}
              className={`p-3 rounded-lg border-2 transition-all capitalize ${
                settings.appearance.theme === theme
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <span className="text-white">{theme}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
          <div>
            <h4 className="text-white font-medium">Compact Mode</h4>
            <p className="text-slate-400 text-sm">Reduce spacing and padding</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.compactMode}
              onChange={(e) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, compactMode: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
          <div>
            <h4 className="text-white font-medium">Animations</h4>
            <p className="text-slate-400 text-sm">Enable smooth transitions and animations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.animations}
              onChange={(e) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, animations: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-xl">
          <h4 className="text-white font-medium mb-3">Font Size</h4>
          <select
            value={settings.appearance.fontSize}
            onChange={(e) => setSettings({
              ...settings,
              appearance: { ...settings.appearance, fontSize: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Data Retention (days)</label>
          <input
            type="number"
            value={settings.system.dataRetention}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, dataRetention: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Concurrent Agents</label>
          <input
            type="number"
            value={settings.system.maxAgents}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, maxAgents: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">API Rate Limit (requests/hour)</label>
          <input
            type="number"
            value={settings.system.apiRateLimit}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, apiRateLimit: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.system.sessionTimeout}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, sessionTimeout: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cache Size (MB)</label>
          <input
            type="number"
            value={settings.system.cacheSize}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, cacheSize: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Log Level</label>
          <select
            value={settings.system.logLevel}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, logLevel: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
          <div>
            <h4 className="text-white font-medium">Auto-save</h4>
            <p className="text-slate-400 text-sm">Automatically save changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.system.autoSave}
              onChange={(e) => setSettings({
                ...settings,
                system: { ...settings.system, autoSave: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-xl">
          <h4 className="text-white font-medium mb-3">Backup Frequency</h4>
          <select
            value={settings.system.backupFrequency}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, backupFrequency: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password Expiry (days)</label>
          <input
            type="number"
            value={settings.security.passwordExpiry}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, passwordExpiry: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.loginAttempts}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, loginAttempts: e.target.value }
            })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(settings.security).filter(([key]) => typeof settings.security[key as keyof typeof settings.security] === 'boolean').map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
            <div>
              <h4 className="text-white font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-slate-400 text-sm">
                {key === 'twoFactorAuth' && 'Enable two-factor authentication'}
                {key === 'sessionManagement' && 'Advanced session management'}
                {key === 'ipWhitelist' && 'Restrict access to specific IP addresses'}
                {key === 'auditLogging' && 'Log all security-related events'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, [key]: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-700/30 rounded-xl">
        <h4 className="text-white font-medium mb-3">API Key</h4>
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value="adk_sk_1234567890abcdef"
              readOnly
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Slack Webhook URL</label>
        <input
          type="url"
          value={settings.integrations.slackWebhook}
          onChange={(e) => setSettings({
            ...settings,
            integrations: { ...settings.integrations, slackWebhook: e.target.value }
          })}
          placeholder="https://hooks.slack.com/services/..."
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email Service</label>
        <select
          value={settings.integrations.emailService}
          onChange={(e) => setSettings({
            ...settings,
            integrations: { ...settings.integrations, emailService: e.target.value }
          })}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="smtp">SMTP</option>
          <option value="sendgrid">SendGrid</option>
          <option value="mailgun">Mailgun</option>
          <option value="ses">Amazon SES</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Storage Provider</label>
        <select
          value={settings.integrations.storageProvider}
          onChange={(e) => setSettings({
            ...settings,
            integrations: { ...settings.integrations, storageProvider: e.target.value }
          })}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="s3">Amazon S3</option>
          <option value="gcs">Google Cloud Storage</option>
          <option value="azure">Azure Blob Storage</option>
          <option value="local">Local Storage</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Monitoring Service</label>
        <select
          value={settings.integrations.monitoringService}
          onChange={(e) => setSettings({
            ...settings,
            integrations: { ...settings.integrations, monitoringService: e.target.value }
          })}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="datadog">Datadog</option>
          <option value="newrelic">New Relic</option>
          <option value="prometheus">Prometheus</option>
          <option value="grafana">Grafana</option>
        </select>
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <h4 className="text-blue-300 font-medium mb-2">Integration Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-200">Slack</span>
            <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-200">Email Service</span>
            <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-200">Storage</span>
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="p-6 bg-slate-700/30 rounded-xl">
        <h4 className="text-white font-medium mb-4">Account Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Account Created:</span>
            <span className="text-white">January 15, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Login:</span>
            <span className="text-white">2 hours ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Account Type:</span>
            <span className="text-white">Professional</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Storage Used:</span>
            <span className="text-white">2.4 GB / 10 GB</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-700/30 rounded-xl">
        <h4 className="text-white font-medium mb-4">Data Management</h4>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 hover:bg-blue-500/20 transition-all">
            <span>Download Account Data</span>
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={handleExportSettings}
            className="w-full flex items-center justify-between p-4 bg-slate-600/30 border border-slate-600/50 rounded-xl text-slate-300 hover:bg-slate-600/50 transition-all"
          >
            <span>Export Settings</span>
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
        <h4 className="text-red-300 font-medium mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone</span>
        </h4>
        <p className="text-red-200 text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-red-500/50 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Delete Account</h3>
            </div>
            <p className="text-slate-300 mb-6">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your ADK platform preferences and configuration</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-600/50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-8">
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'system' && renderSystemSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'integrations' && renderIntegrationsSettings()}
            {activeTab === 'account' && renderAccountSettings()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;