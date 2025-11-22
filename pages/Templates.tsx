import React, { useState } from 'react';
import { Template } from '../types';
import { CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

const templates: Template[] = [
    { id: '1', name: 'welcome_message_v2', category: 'MARKETING', language: 'en_US', status: 'APPROVED', content: 'Hello {{1}}, welcome to Wabsy! We are excited to have you on board. Check out our latest catalog here: {{2}}' },
    { id: '2', name: 'order_confirmation', category: 'UTILITY', language: 'en_US', status: 'APPROVED', content: 'Hi {{1}}, your order #{{2}} has been confirmed and will ship shortly.' },
    { id: '3', name: 'diwali_offer_2025', category: 'MARKETING', language: 'en_US', status: 'PENDING', content: 'Happy Diwali {{1}}! Get 50% off on all items using code DIWALI50. Valid till {{2}}.' },
    { id: '4', name: 'otp_verification', category: 'AUTHENTICATION', language: 'en_US', status: 'REJECTED', content: 'Your OTP is {{1}}. Do not share this with anyone.' },
];

const Templates: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Message Templates</h1>
                    <p className="text-slate-500">Create and manage approved WhatsApp templates.</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 text-sm font-medium shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">{t.name}</div>
                            {t.status === 'APPROVED' && <span className="flex items-center text-green-600 text-xs font-bold"><CheckCircle className="w-4 h-4 mr-1"/> Approved</span>}
                            {t.status === 'PENDING' && <span className="flex items-center text-yellow-600 text-xs font-bold"><Clock className="w-4 h-4 mr-1"/> Pending</span>}
                            {t.status === 'REJECTED' && <span className="flex items-center text-red-600 text-xs font-bold"><XCircle className="w-4 h-4 mr-1"/> Rejected</span>}
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 mb-4 h-24 overflow-y-auto">
                            {t.content}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                             <span className="text-xs text-slate-400 font-medium uppercase">{t.category}</span>
                             <span className="text-xs text-slate-400">{t.language}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Templates;