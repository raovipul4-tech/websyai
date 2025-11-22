import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MessageSquare, CheckCircle, Users, Wallet, AlertTriangle } from 'lucide-react';
import { AnalyticsData } from '../types';
import { getStoredCredentials } from '../services/metaService';

const data: AnalyticsData[] = [
  { name: 'Mon', sent: 4000, delivered: 2400, read: 2400 },
  { name: 'Tue', sent: 3000, delivered: 1398, read: 2210 },
  { name: 'Wed', sent: 2000, delivered: 9800, read: 2290 },
  { name: 'Thu', sent: 2780, delivered: 3908, read: 2000 },
  { name: 'Fri', sent: 1890, delivered: 4800, read: 2181 },
  { name: 'Sat', sent: 2390, delivered: 3800, read: 2500 },
  { name: 'Sun', sent: 3490, delivered: 4300, read: 2100 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; subtext?: string }> = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const creds = getStoredCredentials();
    setIsConnected(!!creds && creds.verified);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Overview of your WhatsApp performance</p>
        </div>
        <div className={`px-4 py-1 rounded-full text-sm font-medium flex items-center ${isConnected ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {isConnected ? (
                <>
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                    API Connected
                </>
            ) : (
                <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Demo Mode
                </>
            )}
        </div>
      </div>

      {!isConnected && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-blue-900">Connect your WhatsApp API</h3>
                      <p className="text-sm text-blue-700">Enter your Meta Developer credentials in Settings to start sending real messages.</p>
                  </div>
              </div>
              <a href="#/settings" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                  Connect Now
              </a>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Messages" value="24,500" icon={MessageSquare} color="bg-blue-500" />
        <StatCard title="Delivered" value="23,100" icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Credits Balance" value="$45.20" icon={Wallet} color="bg-purple-500" subtext="~900 conversations" />
        <StatCard title="Active Contacts" value="12,403" icon={Users} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Message Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sent" stroke="#22c55e" fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="read" stroke="#3b82f6" fillOpacity={0} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Delivery Status</h2>
           <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend />
                <Bar dataKey="delivered" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="read" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;