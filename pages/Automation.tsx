import React, { useState } from 'react';
import { Plus, Trash2, Power, Zap, MessageCircle } from 'lucide-react';
import { AutomationRule } from '../types';

const Automation: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    { id: '1', keyword: 'hi', response: 'Welcome to Wabsy! How can we help you today?', matchType: 'CONTAINS', isActive: true },
    { id: '2', keyword: 'price', response: 'Our pricing starts at $29/month. Would you like to see the full plan details?', matchType: 'CONTAINS', isActive: true },
    { id: '3', keyword: 'stop', response: 'You have been unsubscribed from our mailing list.', matchType: 'EXACT', isActive: false },
  ]);

  const [newRule, setNewRule] = useState<{keyword: string, response: string}>({ keyword: '', response: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddRule = () => {
      if(newRule.keyword && newRule.response) {
          setRules([...rules, {
              id: Date.now().toString(),
              keyword: newRule.keyword,
              response: newRule.response,
              matchType: 'CONTAINS',
              isActive: true
          }]);
          setNewRule({ keyword: '', response: '' });
          setIsAdding(false);
      }
  };

  const toggleRule = (id: string) => {
      setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const deleteRule = (id: string) => {
      setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chatbot Automation</h1>
          <p className="text-slate-500">Set up keyword-based auto replies to handle FAQs 24/7.</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 text-sm font-medium shadow-sm transition-colors"
        >
            <Plus className="w-4 h-4 mr-2" />
            New Rule
        </button>
      </div>

      {/* Add New Rule Form */}
      {isAdding && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-green-100 shadow-sm animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Create New Auto-Reply</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">If message contains...</label>
                      <input 
                        type="text" 
                        value={newRule.keyword}
                        onChange={(e) => setNewRule({...newRule, keyword: e.target.value})}
                        placeholder="e.g. refund, price, hello"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Reply with...</label>
                      <input 
                        type="text" 
                        value={newRule.response}
                        onChange={(e) => setNewRule({...newRule, response: e.target.value})}
                        placeholder="Enter your automated response message"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                  </div>
              </div>
              <div className="flex justify-end space-x-3">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm">Cancel</button>
                  <button onClick={handleAddRule} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Save Rule</button>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 gap-4">
          {rules.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                  <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-slate-600 font-medium">No automation rules active</h3>
                  <p className="text-slate-400 text-sm mt-1">Add a keyword rule to get started.</p>
              </div>
          ) : (
              rules.map((rule) => (
                  <div key={rule.id} className={`bg-white p-5 rounded-xl border transition-all hover:shadow-md ${rule.isActive ? 'border-slate-200' : 'border-slate-100 opacity-75'}`}>
                      <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                              <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                  <MessageCircle className="w-5 h-5" />
                              </div>
                              <div>
                                  <div className="flex items-center space-x-2">
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">If says:</span>
                                      <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700">{rule.keyword}</span>
                                  </div>
                                  <p className="mt-2 text-slate-700">{rule.response}</p>
                              </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => toggleRule(rule.id)}
                                className={`p-2 rounded-full transition-colors ${rule.isActive ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                                title={rule.isActive ? "Disable Rule" : "Enable Rule"}
                              >
                                  <Power className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => deleteRule(rule.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Rule"
                              >
                                  <Trash2 className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default Automation;