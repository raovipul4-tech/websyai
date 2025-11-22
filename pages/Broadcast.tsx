import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Image as ImageIcon, Clock, Wand2, AlertCircle } from 'lucide-react';
import { generateCampaignContent } from '../services/geminiService';
import { sendTemplateMessage, getStoredCredentials } from '../services/metaService';

const Broadcast: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Urgent'>('Friendly');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const creds = getStoredCredentials();
    setIsConnected(!!creds && creds.verified);
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const content = await generateCampaignContent(prompt, tone);
    setMessageContent(content);
    setIsGenerating(false);
  };

  const handleSend = async () => {
    if (!isConnected) {
        alert("Please connect your Meta Account in Settings first.");
        return;
    }
    setIsSending(true);
    // Demo: Send to a mock number for now, or user's own number if we had it input
    // In a real broadast, this loops through the contact list.
    // We will simulate sending to one number to verify the API works.
    await sendTemplateMessage('15550211234', 'hello_world'); 
    setTimeout(() => {
        setIsSending(false);
        alert("Broadcast sent to queue! (Demo: Triggered 1 template message via API)");
    }, 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">New Broadcast Campaign</h1>
        <p className="text-slate-500">Reach thousands of customers with a single click.</p>
      </div>

      {!isConnected && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-amber-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>You are in Demo Mode. Connect your WhatsApp API in Settings to send actual broadcasts.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Editor */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Diwali Sale 2025"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* AI Generator */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <div className="flex items-center mb-3 text-purple-800">
               <Sparkles className="w-5 h-5 mr-2" />
               <h3 className="font-semibold">AI Content Generator</h3>
            </div>
            <div className="space-y-3">
                <input 
                    type="text" 
                    placeholder="What is this campaign about?" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-400 text-sm"
                />
                <div className="flex items-center space-x-2">
                    {(['Professional', 'Friendly', 'Urgent'] as const).map(t => (
                        <button 
                            key={t}
                            onClick={() => setTone(t)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${tone === t ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                >
                    {isGenerating ? <Wand2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    Generate Message
                </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">Message Content</label>
            <div className="relative">
                <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg h-48 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-sans"
                placeholder="Type your message here or use AI to generate it..."
                />
                <div className="absolute bottom-3 right-3 flex space-x-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                        <ImageIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">Variables: {'{{1}}'}, {'{{2}}'}</p>
          </div>

          <div className="flex space-x-4">
             <button 
                onClick={handleSend}
                disabled={isSending}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center shadow-md transition-colors disabled:opacity-70"
             >
                {isSending ? (
                    <>Sending...</>
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        {isConnected ? 'Send Now' : 'Send Test (Demo)'}
                    </>
                )}
             </button>
             <button className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium flex items-center justify-center transition-colors">
                <Clock className="w-5 h-5 mr-2" />
                Schedule
             </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="hidden lg:block">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Preview</h3>
            <div className="w-[350px] mx-auto bg-black rounded-[3rem] p-3 border-[4px] border-slate-800 shadow-2xl relative">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-2xl z-10"></div>
                
                {/* Phone Screen */}
                <div className="bg-[#efeae2] w-full h-[650px] rounded-[2.2rem] overflow-hidden flex flex-col relative bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]">
                     <div className="bg-[#075e54] h-16 flex items-center px-4 pt-4 shrink-0">
                        <div className="w-8 h-8 bg-white rounded-full mr-3"></div>
                        <div className="text-white">
                            <div className="font-semibold text-sm">Wabsy</div>
                            <div className="text-[10px] opacity-80">Business Account</div>
                        </div>
                     </div>
                     
                     <div className="flex-1 p-4 overflow-y-auto">
                        {messageContent && (
                             <div className="bg-white p-3 rounded-lg shadow-sm rounded-tl-none max-w-[85%] mb-2">
                                <p className="text-sm text-slate-800 whitespace-pre-wrap">{messageContent}</p>
                                <div className="text-[10px] text-slate-400 text-right mt-1">Now</div>
                             </div>
                        )}
                     </div>

                     <div className="h-14 bg-white px-2 flex items-center shrink-0">
                        <div className="w-full h-9 bg-slate-100 rounded-full"></div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;