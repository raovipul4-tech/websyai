import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Globe, Code, ExternalLink } from 'lucide-react';

const Widget: React.FC = () => {
  const [config, setConfig] = useState({
    phoneNumber: '15551234567',
    message: 'Hello! I have a question about Wabsy.',
    position: 'right',
    color: '#22c55e',
    ctaText: 'Chat with us'
  });

  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    return `<!-- Wabsy WhatsApp Widget -->
<a href="https://wa.me/${config.phoneNumber}?text=${encodeURIComponent(config.message)}" 
   target="_blank" 
   style="position: fixed; bottom: 20px; ${config.position}: 20px; background-color: ${config.color}; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-family: sans-serif; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; z-index: 9999; transition: transform 0.2s;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: white; stroke: white;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  ${config.ctaText}
</a>
<!-- End Wabsy Widget -->`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Website Widget</h1>
        <p className="text-slate-500">Connect Wabsy CRM to your website wabsy.io with a floating chat button.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Widget Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Phone Number</label>
                <input 
                  type="text" 
                  value={config.phoneNumber}
                  onChange={(e) => setConfig({...config, phoneNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                  placeholder="e.g. 15551234567"
                />
                <p className="text-xs text-slate-400 mt-1">Include country code, no symbols.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                <input 
                  type="text" 
                  value={config.ctaText}
                  onChange={(e) => setConfig({...config, ctaText: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Message</label>
                <input 
                  type="text" 
                  value={config.message}
                  onChange={(e) => setConfig({...config, message: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                  <select 
                    value={config.position}
                    onChange={(e) => setConfig({...config, position: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="left">Bottom Left</option>
                    <option value="right">Bottom Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={config.color}
                      onChange={(e) => setConfig({...config, color: e.target.value})}
                      className="h-10 w-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="text-sm text-slate-500 font-mono">{config.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 shadow-sm relative group">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Installation Code
                </h3>
                <button 
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
                >
                   {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                   <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
             </div>
             <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-all bg-black/30 p-4 rounded-lg border border-white/10">
               {generateCode()}
             </pre>
             <p className="text-xs text-slate-400 mt-4">
                Paste this code before the closing <code className="text-slate-300">&lt;/body&gt;</code> tag on your website 
                <a href="https://wabsy.io" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline ml-1">wabsy.io</a>.
             </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden min-h-[500px] flex flex-col shadow-inner">
            <div className="bg-white border-b border-slate-200 p-3 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-slate-100 rounded-md px-3 py-1 text-xs text-center text-slate-500">
                    wabsy.io
                </div>
            </div>
            
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400">
                 <div className="w-full max-w-md space-y-4 opacity-30">
                     <div className="h-8 bg-slate-300 rounded w-3/4 mx-auto"></div>
                     <div className="h-4 bg-slate-300 rounded w-1/2 mx-auto"></div>
                     <div className="h-32 bg-slate-300 rounded w-full"></div>
                     <div className="grid grid-cols-3 gap-4">
                         <div className="h-24 bg-slate-300 rounded"></div>
                         <div className="h-24 bg-slate-300 rounded"></div>
                         <div className="h-24 bg-slate-300 rounded"></div>
                     </div>
                 </div>
                 <p className="mt-8 font-medium">Website Preview</p>
            </div>

            {/* The Actual Widget Preview */}
            <div 
                className="absolute flex items-center space-x-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                style={{
                    bottom: '20px',
                    [config.position]: '20px',
                    backgroundColor: config.color,
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    zIndex: 10
                }}
            >
                <MessageCircle className="w-5 h-5 fill-white stroke-white" />
                <span>{config.ctaText}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;