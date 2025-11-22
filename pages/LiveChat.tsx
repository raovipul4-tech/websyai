import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Send, Sparkles, Check, CheckCheck, Phone, Video, BrainCircuit, MessageSquare, AlertCircle } from 'lucide-react';
import { Contact, Message, MessageDirection } from '../types';
import { generateSmartReply, analyzeSentiment } from '../services/geminiService';
import { sendWhatsAppMessage, getStoredCredentials } from '../services/metaService';

// Mock Data
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Freeman', phoneNumber: '+1 555-0123', avatar: 'https://picsum.photos/200/200?random=1', tags: ['VIP', 'New'], unreadCount: 2 },
  { id: '2', name: 'Bob Smith', phoneNumber: '+1 555-0124', avatar: 'https://picsum.photos/200/200?random=2', tags: ['Lead'], unreadCount: 0 },
  { id: '3', name: 'Charlie Brown', phoneNumber: '+1 555-0125', avatar: 'https://picsum.photos/200/200?random=3', tags: ['Customer'], unreadCount: 0 },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', text: 'Hi, I have a question about my order #12345.', timestamp: new Date(Date.now() - 86400000), direction: MessageDirection.INBOUND, status: 'read' },
    { id: 'm2', text: 'Sure, Alice. Let me check that for you.', timestamp: new Date(Date.now() - 86300000), direction: MessageDirection.OUTBOUND, status: 'read' },
    { id: 'm3', text: 'It seems delayed. Can you expedite it?', timestamp: new Date(Date.now() - 1000 * 60 * 5), direction: MessageDirection.INBOUND, status: 'delivered' },
  ],
  '2': [
    { id: 'm4', text: 'Do you have the Nike Air Max in stock?', timestamp: new Date(Date.now() - 400000), direction: MessageDirection.INBOUND, status: 'read' },
  ],
  '3': [],
};

const LiveChat: React.FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(MOCK_CONTACTS[0].id);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<'Positive'|'Neutral'|'Negative'>('Neutral');
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = MOCK_CONTACTS.find(c => c.id === selectedContactId);
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  useEffect(() => {
    const creds = getStoredCredentials();
    setIsConnected(!!creds && creds.verified);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, selectedContactId]);

  useEffect(() => {
      if (currentMessages.length > 0 && selectedContactId) {
          const lastMsg = currentMessages[currentMessages.length - 1];
          if (lastMsg.direction === MessageDirection.INBOUND) {
             analyzeSentiment(lastMsg.text).then(setSentiment);
          }
      }
  }, [currentMessages, selectedContactId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedContactId || !activeContact) return;

    const textToSend = inputText;
    setInputText('');
    setAiSuggestion(null);

    // Optimistic UI Update
    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      text: textToSend,
      timestamp: new Date(),
      direction: MessageDirection.OUTBOUND,
      status: 'sent', // Initially sent
    };

    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));

    // Send via Meta API if connected
    if (isConnected) {
        // Use activeContact.phoneNumber but strip formatting for API (assuming US for mock)
        // Real implementation would require strict E.164 format from contact
        // For this demo, we mock the number or use the one provided
        const formattedNumber = activeContact.phoneNumber.replace(/[^0-9]/g, ''); 
        
        const success = await sendWhatsAppMessage(formattedNumber, textToSend);
        
        if (success) {
            setMessages(prev => {
                const contactMsgs = prev[selectedContactId] || [];
                return {
                    ...prev,
                    [selectedContactId]: contactMsgs.map(m => m.id === tempId ? { ...m, status: 'delivered' } : m)
                };
            });
        } else {
             // Handle error (visual indication)
        }
    }
  };

  const handleAiAssist = async () => {
    if (!activeContact || !selectedContactId) return;
    setIsAiThinking(true);
    const suggestion = await generateSmartReply(activeContact.name, currentMessages);
    setAiSuggestion(suggestion);
    setIsAiThinking(false);
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setInputText(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen bg-white overflow-hidden">
      {/* Contact List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONTACTS.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={`p-4 flex items-center cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 ${selectedContactId === contact.id ? 'bg-green-50' : ''}`}
            >
              <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-slate-800 truncate">{contact.name}</h3>
                  <span className="text-xs text-slate-400">12:30 PM</span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {messages[contact.id]?.[messages[contact.id].length - 1]?.text || "No messages yet"}
                </p>
                <div className="flex mt-1 space-x-1">
                  {contact.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {contact.unreadCount > 0 && (
                <div className="ml-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {contact.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContactId && activeContact ? (
        <div className="flex-1 flex flex-col bg-[#efeae2] relative">
           {/* Chat Header */}
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10">
             <div className="flex items-center">
               <button className="md:hidden mr-2" onClick={() => setSelectedContactId(null)}>
                 <MoreVertical className="w-5 h-5 text-slate-500 rotate-90" />
               </button>
               <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" />
               <div className="ml-3">
                 <h2 className="font-semibold text-slate-800">{activeContact.name}</h2>
                 <div className="flex items-center text-xs text-slate-500">
                    <span>{activeContact.phoneNumber}</span>
                    <span className="mx-1">•</span>
                    <span className={`${sentiment === 'Positive' ? 'text-green-600' : sentiment === 'Negative' ? 'text-red-500' : 'text-slate-400'}`}>
                        {sentiment} Sentiment
                    </span>
                 </div>
               </div>
             </div>
             <div className="flex items-center space-x-4 text-slate-500">
                <Phone className="w-5 h-5 cursor-pointer hover:text-green-600" />
                <Video className="w-5 h-5 cursor-pointer hover:text-green-600" />
                <Search className="w-5 h-5 cursor-pointer hover:text-green-600" />
                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-green-600" />
             </div>
          </div>

          {/* Notification Banner for Demo Mode */}
          {!isConnected && (
            <div className="bg-amber-50 px-4 py-2 text-xs text-amber-800 flex items-center justify-center border-b border-amber-100">
                <AlertCircle className="w-3 h-3 mr-2" />
                <span>Demo Mode: Messages are simulated. Connect API in Settings to send real messages.</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-opacity-50 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.direction === MessageDirection.OUTBOUND ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] md:max-w-[60%] rounded-lg p-3 shadow-sm relative ${
                  msg.direction === MessageDirection.OUTBOUND ? 'bg-[#d9fdd3]' : 'bg-white'
                }`}>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-[10px] text-slate-500">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.direction === MessageDirection.OUTBOUND && (
                      <span className="text-blue-400">
                        {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestion Panel */}
          {aiSuggestion && (
            <div className="absolute bottom-20 left-4 right-4 md:left-10 md:right-10 bg-purple-50 border border-purple-100 p-4 rounded-xl shadow-lg animate-fade-in z-20">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-purple-700 mb-1">AI Suggestion</p>
                    <p className="text-sm text-slate-700">{aiSuggestion}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                    <button onClick={applySuggestion} className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700">Apply</button>
                    <button onClick={() => setAiSuggestion(null)} className="px-3 py-1 bg-white text-slate-500 border border-slate-200 text-xs rounded-md hover:bg-slate-50">Dismiss</button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white p-3 md:p-4 border-t border-slate-200">
            <div className="flex items-end space-x-2">
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Smile className="w-6 h-6" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Paperclip className="w-6 h-6" />
              </button>
              
              <div className="flex-1 bg-white border border-slate-200 rounded-lg flex flex-col focus-within:border-green-500 transition-colors relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                      }
                  }}
                  placeholder="Type a message"
                  className="w-full p-3 max-h-32 bg-transparent border-none resize-none focus:ring-0 text-sm text-slate-800 scrollbar-hide"
                  rows={1}
                />
                <div className="flex justify-between items-center px-2 pb-2">
                    <button 
                        onClick={handleAiAssist}
                        disabled={isAiThinking}
                        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-purple-50 text-purple-600 text-xs font-medium transition-colors"
                        title="Generate Smart Reply"
                    >
                        {isAiThinking ? <BrainCircuit className="w-4 h-4 animate-pulse" /> : <Sparkles className="w-4 h-4" />}
                        <span>{isAiThinking ? 'Thinking...' : 'AI Assist'}</span>
                    </button>
                </div>
              </div>

              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`p-3 rounded-full flex-shrink-0 transition-colors ${
                    inputText.trim() ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-50 border-b-[6px] border-green-500">
          <div className="text-center space-y-4">
             <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                 <MessageSquare className="w-10 h-10 text-slate-400" />
             </div>
             <h1 className="text-3xl font-light text-slate-700">Wabsy Web</h1>
             <p className="text-slate-500 text-sm">Send and receive messages without keeping your phone online.<br/>Use Wabsy on multiple devices.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;