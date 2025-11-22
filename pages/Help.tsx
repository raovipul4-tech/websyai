import React from 'react';
import { Globe, Server, Rocket, HelpCircle, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Help & Deployment Guide</h1>
        <p className="text-slate-500">How to publish Wabsy CRM and connect it to wabsy.io</p>
      </div>

      {/* Deployment Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-purple-600" />
            Step 1: Deploying the App
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            To make the app accessible at your domain, you must host the code on a server.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Option A: Vercel (Recommended)</h3>
              <p className="text-sm text-slate-600 mb-3">Easiest for React apps.</p>
              <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                <li>Push your code to <strong>GitHub</strong>.</li>
                <li>Log in to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">Vercel</a>.</li>
                <li>Click "Add New Project" and import your repo.</li>
                <li>Keep default settings and click <strong>Deploy</strong>.</li>
              </ol>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Option B: Standard Hosting</h3>
              <p className="text-sm text-slate-600 mb-3">For cPanel, Apache, Nginx, etc.</p>
              <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                <li>Run <code className="bg-slate-200 px-1 rounded">npm run build</code> in your terminal.</li>
                <li>Locate the created <code className="bg-slate-200 px-1 rounded">dist</code> or <code className="bg-slate-200 px-1 rounded">build</code> folder.</li>
                <li>Upload the <strong>contents</strong> of that folder to your server's <code className="bg-slate-200 px-1 rounded">public_html</code> directory.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-green-600" />
            Step 2: Pointing to wabsy.io
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure your DNS records at your domain registrar (e.g., GoDaddy, Namecheap).
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase">Name / Host</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase">Value / Points To</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase">TTL</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-mono font-bold">A Record</td>
                  <td className="p-3 font-mono">@</td>
                  <td className="p-3 font-mono text-blue-600">76.76.21.21 (Example for Vercel)</td>
                  <td className="p-3">Auto</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold">CNAME</td>
                  <td className="p-3 font-mono">www</td>
                  <td className="p-3 font-mono text-blue-600">cname.vercel-dns.com</td>
                  <td className="p-3">Auto</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> The IP address (Value) depends on your hosting provider. 
              Check your host's dashboard (Settings > Domains) for the exact IP to use for the A Record.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <Terminal className="w-5 h-5 mr-2 text-slate-600" />
            Troubleshooting "App Not Working"
          </h2>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                    <h4 className="font-medium text-slate-800">White Screen / 404 Errors</h4>
                    <p className="text-sm text-slate-600">If using React Router (which Wabsy uses), ensure your host is configured for <strong>Single Page Applications (SPA)</strong>. Redirect all requests to <code>index.html</code>.</p>
                </div>
            </div>
            <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                    <h4 className="font-medium text-slate-800">Meta API Not Sending</h4>
                    <p className="text-sm text-slate-600">Go to <strong>Settings</strong>. Ensure your Access Token is valid and hasn't expired (Temporary tokens expire in 24h). Ensure the Phone Number ID is correct.</p>
                </div>
            </div>
             <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                    <h4 className="font-medium text-slate-800">Localhost only?</h4>
                    <p className="text-sm text-slate-600">If you are running this code on your computer, nobody on the internet can see it. You must deploy it (Step 1 above) to connect it to your domain.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Help;