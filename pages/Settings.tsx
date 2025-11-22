import React, { useState, useEffect } from 'react';
import { Shield, Key, Smartphone, CheckCircle, AlertCircle, Save, ExternalLink, Loader2, Webhook, Copy, Check, Code, Server } from 'lucide-react';
import { validateCredentials, saveCredentials, getStoredCredentials } from '../services/metaService';

const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNumberId: '',
    wabaId: '',
    accessToken: ''
  });
  const [webhookConfig, setWebhookConfig] = useState({
      url: 'https://wabsy.io/webhook',
      token: 'wabsy_secure_token_2025'
  });
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showServerCode, setShowServerCode] = useState(false);

  useEffect(() => {
    const stored = getStoredCredentials();
    if (stored && stored.verified) {
      setFormData({
        phoneNumberId: stored.phoneNumberId,
        wabaId: stored.wabaId,
        accessToken: stored.accessToken
      });
      setIsConnected(true);
    }
    
    // Load stored webhook config if available
    const storedWebhook = localStorage.getItem('webhook_config');
    if (storedWebhook) {
        setWebhookConfig(JSON.parse(storedWebhook));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === 'success') setStatus('idle');
  };

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setWebhookConfig({ ...webhookConfig, [e.target.name]: e.target.value });
  };

  const saveWebhookSettings = () => {
      localStorage.setItem('webhook_config', JSON.stringify(webhookConfig));
      alert("Webhook configuration saved locally.");
  };

  const handleSave = async () => {
    if (!formData.accessToken || !formData.phoneNumberId) {
      setStatus('error');
      return;
    }

    setStatus('verifying');
    
    const isValid = await validateCredentials(formData.phoneNumberId, formData.accessToken);
    
    if (isValid) {
      saveCredentials({
        ...formData,
        verified: true
      });
      setStatus('success');
      setIsConnected(true);
    } else {
      setStatus('error');
      setIsConnected(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
  };

  const serverCodeSnippet = `
// Node.js / Express Example
const express = require('express');
const app = express();

app.get('/webhook', (req, res) => {
  // 1. Verify Token validation
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    // This must match the Verify Token you enter in Meta Dashboard
    if (mode === 'subscribe' && token === '${webhookConfig.token}') {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', express.json(), (req, res) => {
  // 2. Handle Incoming Messages
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Configure your WhatsApp Business API connection and webhooks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Connection Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                WhatsApp API Configuration
              </h2>
              {isConnected ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> Connected
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                  Not Connected
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="phoneNumberId"
                    value={formData.phoneNumberId}
                    onChange={handleChange}
                    placeholder="e.g. 108754123456789"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono text-sm"
                  />
                  <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Business Account ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="wabaId"
                    value={formData.wabaId}
                    onChange={handleChange}
                    placeholder="e.g. 112233445566778"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono text-sm"
                  />
                  <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Token</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="accessToken"
                    value={formData.accessToken}
                    onChange={handleChange}
                    placeholder="EAAG..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono text-sm"
                  />
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
               <a 
                 href="https://developers.facebook.com/apps" 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-sm text-green-600 hover:text-green-700 flex items-center font-medium"
               >
                 Open Meta Developers <ExternalLink className="w-3 h-3 ml-1" />
               </a>
               
               <button 
                 onClick={handleSave}
                 disabled={status === 'verifying'}
                 className={`px-6 py-2 rounded-lg text-white font-medium flex items-center shadow-sm transition-all ${
                   status === 'success' ? 'bg-green-600 hover:bg-green-700' : 
                   status === 'error' ? 'bg-red-600 hover:bg-red-700' : 
                   'bg-slate-900 hover:bg-slate-800'
                 }`}
               >
                 {status === 'verifying' ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                   </>
                 ) : status === 'success' ? (
                   <>
                     <CheckCircle className="w-4 h-4 mr-2" /> Saved
                   </>
                 ) : status === 'error' ? (
                   <>
                     <AlertCircle className="w-4 h-4 mr-2" /> Failed
                   </>
                 ) : (
                   <>
                     <Save className="w-4 h-4 mr-2" /> Save Configuration
                   </>
                 )}
               </button>
            </div>
          </div>

          {/* Webhook Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Webhook className="w-5 h-5 mr-2 text-purple-600" />
                    Webhook Configuration
                </h2>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                    <Server className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-amber-800">Server Required for Verification</h4>
                        <p className="text-sm text-amber-700 mt-1 mb-2">
                            Meta will send a verification request to your Callback URL. You must have a backend server running to respond with the challenge code.
                        </p>
                         <button 
                            onClick={() => setShowServerCode(!showServerCode)}
                            className="text-sm font-semibold text-amber-900 underline flex items-center"
                        >
                            <Code className="w-4 h-4 mr-1" />
                            {showServerCode ? 'Hide Server Code' : 'View Node.js Code Snippet'}
                        </button>
                    </div>
                </div>
            </div>

             {showServerCode && (
                <div className="bg-slate-900 rounded-lg p-4 mb-6 relative group animate-fade-in">
                     <div className="absolute top-2 right-2">
                         <button 
                            onClick={() => copyToClipboard(serverCodeSnippet, 'code')}
                            className="p-2 text-slate-400 hover:text-white bg-white/10 rounded"
                        >
                             {copiedField === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                     </div>
                    <pre className="text-xs text-green-400 font-mono overflow-x-auto p-2">
                        {serverCodeSnippet}
                    </pre>
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Callback URL</label>
                    <div className="flex items-center">
                        <input 
                            type="text"
                            name="url"
                            value={webhookConfig.url}
                            onChange={handleWebhookChange}
                            className="flex-1 bg-white border border-slate-300 rounded-l-lg px-3 py-2 text-sm font-mono text-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button 
                            onClick={() => copyToClipboard(webhookConfig.url, 'url')}
                            className="bg-white border border-l-0 border-slate-300 rounded-r-lg px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                        >
                            {copiedField === 'url' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Must be HTTPS and publicly accessible.</p>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Verify Token</label>
                    <div className="flex items-center">
                         <input 
                            type="text"
                            name="token"
                            value={webhookConfig.token}
                            onChange={handleWebhookChange}
                            className="flex-1 bg-white border border-slate-300 rounded-l-lg px-3 py-2 text-sm font-mono text-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button 
                            onClick={() => copyToClipboard(webhookConfig.token, 'token')}
                            className="bg-white border border-l-0 border-slate-300 rounded-r-lg px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                        >
                             {copiedField === 'token' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Create any secure string. Must match what you paste in Meta Dashboard.</p>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                 <button 
                    onClick={saveWebhookSettings}
                    className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                    Save Locally
                </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Setup Instructions</h3>
                <ol className="space-y-4 text-sm text-blue-800 list-decimal list-inside">
                    <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="underline font-semibold">Meta Developers</a>.</li>
                    <li>Select your Business App.</li>
                    <li>In the sidebar, find <span className="font-bold">WhatsApp</span> &gt; <span className="font-bold">Configuration</span>.</li>
                    <li>Click <span className="font-bold">Edit</span> in the Webhook section.</li>
                    <li>Paste your <span className="font-bold">Callback URL</span> (from your server) and <span className="font-bold">Verify Token</span>.</li>
                    <li>Click Verify and Save.</li>
                    <li>Click <span className="font-bold">Manage</span> Webhook fields and subscribe to <code>messages</code>.</li>
                </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">About Credentials</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Your credentials are used to authenticate direct requests to the Graph API for sending messages. 
                    <br/><br/>
                    Webhooks are used to receive data (incoming messages) from WhatsApp to this platform.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;