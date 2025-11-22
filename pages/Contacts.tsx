import React from 'react';
import { Filter, Download, Plus, MoreHorizontal } from 'lucide-react';
import { Contact } from '../types';

const contacts: Contact[] = [
  { id: '1', name: 'Alice Freeman', phoneNumber: '+1 555-0123', avatar: 'https://picsum.photos/200/200?random=1', tags: ['VIP', 'New'], unreadCount: 0 },
  { id: '2', name: 'Bob Smith', phoneNumber: '+1 555-0124', avatar: 'https://picsum.photos/200/200?random=2', tags: ['Lead'], unreadCount: 0 },
  { id: '3', name: 'Charlie Brown', phoneNumber: '+1 555-0125', avatar: 'https://picsum.photos/200/200?random=3', tags: ['Customer'], unreadCount: 0 },
  { id: '4', name: 'Diana Prince', phoneNumber: '+1 555-0126', avatar: 'https://picsum.photos/200/200?random=4', tags: ['Influencer'], unreadCount: 0 },
  { id: '5', name: 'Evan Wright', phoneNumber: '+1 555-0127', avatar: 'https://picsum.photos/200/200?random=5', tags: ['New'], unreadCount: 0 },
];

const Contacts: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contacts</h1>
          <p className="text-slate-500">Manage your audience and segmentation.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg flex items-center hover:bg-slate-50 text-sm font-medium">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
           <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg flex items-center hover:bg-slate-50 text-sm font-medium">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <img src={contact.avatar} alt="" className="w-8 h-8 rounded-full mr-3 object-cover" />
                        <span className="font-medium text-slate-900">{contact.name}</span>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono text-sm">{contact.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                        {contact.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">
                            {tag}
                        </span>
                        ))}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Opted-in
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
             <span className="text-sm text-slate-500">Showing 1-5 of 1,200</span>
             <div className="flex space-x-2">
                 <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 disabled:opacity-50">Previous</button>
                 <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600">Next</button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;