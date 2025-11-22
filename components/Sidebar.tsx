import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Send, FileText, Settings, Workflow, Globe, HelpCircle } from 'lucide-react';

const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (v: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Live Chat', path: '/chat' },
    { icon: Send, label: 'Broadcast', path: '/broadcast' },
    { icon: Workflow, label: 'Automation', path: '/automation' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: FileText, label: 'Templates', path: '/templates' },
    { icon: Globe, label: 'Website Widget', path: '/widget' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-green-600 rounded-lg mr-3 flex items-center justify-center">
                 <MessageSquare className="text-white w-5 h-5" />
            </div>
          <span className="text-xl font-bold text-slate-800">Wabsy</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-green-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
             <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Plan: <span className="font-semibold text-slate-700">Pro</span></p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-[10px] text-slate-400">650 / 1000 messages used</p>
             </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;