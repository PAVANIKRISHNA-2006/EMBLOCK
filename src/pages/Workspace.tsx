import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Cpu, Globe, Send, Terminal, Settings, 
  ChevronLeft, Layout, Share2, Maximize2, 
  Loader2, Check, ExternalLink, Save, Zap, Database, AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { knowledgeService } from '../lib/knowledgeService';
import ReactMarkdown from 'react-markdown';

type Tab = 'editor' | 'tech-lab' | 'web' | 'report';

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const [isDeploying, setIsDeploying] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  
  // Tech-Lab State (Reused logic)
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  const handleResearch = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await knowledgeService.generateKnowledge(`Detailed technical research for internal project ${id}. Context: ${prompt}`);
      setOutput(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReport = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      alert("Technical report submitted to Admin successully.");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1117] flex flex-col font-sans overflow-hidden">
      {/* VSCode-style Header */}
      <header className="h-12 bg-[#161B22] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/internal-base')}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-400" />
          </button>
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-gray-300 tracking-tight">Workspace://Sanctum/{id}</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center space-x-1">
             <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-bold uppercase tracking-tighter">Live Session</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1.5 mr-2">
            <div className="h-6 w-6 rounded-full border-2 border-[#161B22] bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
              {profile?.displayName?.charAt(0) || user?.displayName?.charAt(0)}
            </div>
            <div className="h-6 w-6 rounded-full border-2 border-[#161B22] bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400">
              AI
            </div>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded-md text-gray-400"><Share2 className="h-4 w-4" /></button>
          <button className="p-1.5 hover:bg-white/10 rounded-md text-gray-400"><Settings className="h-4 w-4" /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (Left Icons) */}
        <aside className="w-14 bg-[#0D1117] border-r border-white/5 flex flex-col items-center py-4 space-y-6 shrink-0">
          <button 
            onClick={() => setActiveTab('editor')}
            className={cn("p-2 transition-all rounded-lg", activeTab === 'editor' ? "text-indigo-400 bg-white/5" : "text-gray-500 hover:text-gray-300")}
          >
            <FileText className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setActiveTab('tech-lab')}
            className={cn("p-2 transition-all rounded-lg", activeTab === 'tech-lab' ? "text-indigo-400 bg-white/5" : "text-gray-500 hover:text-gray-300")}
          >
            <Cpu className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setActiveTab('web')}
            className={cn("p-2 transition-all rounded-lg", activeTab === 'web' ? "text-indigo-400 bg-white/5" : "text-gray-500 hover:text-gray-300")}
          >
            <Globe className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <button 
            onClick={() => setActiveTab('report')}
            className={cn("p-2 transition-all rounded-lg", activeTab === 'report' ? "text-indigo-400 bg-white/5" : "text-gray-500 hover:text-gray-300")}
          >
            <Send className="h-6 w-6" />
          </button>
        </aside>

        {/* Dynamic Sidebar per Tab */}
        <aside className="w-64 bg-[#0D1117] border-r border-white/5 flex flex-col overflow-y-auto shrink-0 animate-in slide-in-from-left duration-300">
          <div className="p-4 flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {activeTab === 'editor' ? 'Document Explorer' : 
               activeTab === 'tech-lab' ? 'Model Research' : 
               activeTab === 'web' ? 'Sanctioned Web' : 'Sync reporting'}
            </span>
            <Layout className="h-3 w-3 text-gray-500" />
          </div>
          
          <div className="px-2 space-y-1">
            {activeTab === 'editor' && (
              <>
                <div className="flex items-center px-3 py-2 bg-white/5 rounded-md text-xs text-gray-300 font-medium">
                  <ChevronLeft className="h-3 w-3 mr-1 -rotate-90" />
                  <FileText className="h-3 w-3 mr-2 text-indigo-400" />
                  Main_Spec.md
                </div>
                <div className="flex items-center px-3 py-2 hover:bg-white/5 rounded-md text-xs text-gray-500 font-medium transition-colors cursor-pointer">
                  <ChevronLeft className="h-3 w-3 mr-1 -rotate-90" />
                  <FileText className="h-3 w-3 mr-2 text-indigo-900" />
                  Technical_Map.json
                </div>
              </>
            )}
            {activeTab === 'tech-lab' && (
              <div className="p-3 space-y-3">
                {['Logic Archetypes', 'Schema Builder', 'Auth Map'].map(m => (
                  <div key={m} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer">
                    <p className="text-[10px] font-bold text-indigo-400 mb-1">Module</p>
                    <p className="text-sm font-bold text-gray-200">{m}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'web' && (
               <div className="p-3 space-y-3">
                  <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-xs font-bold text-indigo-400">Proxied Access</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-1">Research is monitored for security compliance.</p>
                  </div>
               </div>
            )}
          </div>
        </aside>

        {/* Main Editor Pane */}
        <main className="flex-1 flex flex-col bg-[#0D1117] overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'editor' && (
              <motion.div 
                key="editor" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex-1 p-12 overflow-y-auto max-w-4xl mx-auto w-full text-gray-400 leading-relaxed font-mono text-sm"
              >
                <div className="mb-12 border-b border-white/10 pb-8">
                  <h1 className="text-3xl font-bold text-gray-100 mb-4 tracking-tight">Main Specification - {id}</h1>
                  <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    <span className="flex items-center"><Check className="h-3 w-3 mr-1" /> Authenticated</span>
                    <span className="flex items-center"><Check className="h-3 w-3 mr-1" /> Read/Write Enabled</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-100 font-bold"># Executive Summary</p>
                  <p>The neural mapping for {id} requires a multi-threaded approach to asynchronous data processing. This document outlines the sanctioned architecture for implementation in Q3 2026.</p>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-indigo-400 mb-2">/* TO-DO: Research requested */</p>
                    <p>Integrate v4 Logic Flow into the existing production schema while maintaining zero-downtime availability for legacy clients.</p>
                  </div>
                  <p className="text-gray-100 font-bold"># Component Structure</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Core Gateway: Entry point for all authenticated requests.</li>
                    <li>Mesh Coordinator: Handles distributed data consistency.</li>
                    <li>Sanctum Storage: Encrypted long-term persistence layer.</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'tech-lab' && (
              <motion.div 
                key="tech-lab" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex-1 p-8 overflow-y-auto flex flex-col"
              >
                <div className="flex-1 max-w-4xl mx-auto w-full space-y-6">
                  <div className="bg-[#161B22] rounded-3xl border border-white/5 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-indigo-600 rounded-lg">
                        <Cpu className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-100 tracking-tight">Technical Model Research</h2>
                        <p className="text-xs text-gray-500">AI-powered architectural synthesis for {id}</p>
                      </div>
                    </div>

                    <textarea 
                      className="w-full h-40 bg-white/5 rounded-2xl p-5 text-gray-100 placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
                      placeholder="Specify the technical logic you want to research or model..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleResearch}
                        disabled={isGenerating || !prompt}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-indigo-500/20 shadow-xl disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Zap className="h-5 w-5 mr-2" />}
                        Synthesize Model
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {output && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-[#161B22] rounded-3xl border border-white/5 p-8 mb-12"
                      >
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{output}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'web' && (
               <motion.div key="web" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                  <div className="h-10 bg-[#161B22] border-b border-white/5 flex items-center px-4 space-x-4 shrink-0">
                    <div className="flex space-x-1.5 mr-4">
                      <div className="w-3 h-3 bg-red-500/20 rounded-full" />
                      <div className="w-3 h-3 bg-amber-500/20 rounded-full" />
                      <div className="w-3 h-3 bg-emerald-500/20 rounded-full" />
                    </div>
                    <div className="flex-1 bg-white/5 h-6 rounded-md flex items-center px-4 text-[10px] text-gray-500">
                      https://lab.emblock.ai/research/internal/{id}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                    <Globe className="h-20 w-20 text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold text-gray-100">Company Research Portal</h2>
                    <p className="text-sm text-gray-500 mt-2">Connecting to secure web terminal...</p>
                  </div>
               </motion.div>
            )}

            {activeTab === 'report' && (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-12 flex flex-col items-center">
                <div className="max-w-xl w-full bg-[#161B22] rounded-[2.5rem] p-12 text-center border border-white/5">
                  <div className="h-16 w-16 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-100 mb-2">Sync to Administration</h2>
                  <p className="text-gray-500 text-sm mb-8">Submit your session research and generated models to the company audit log for production review.</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl text-left">
                       <div className="flex items-center space-x-3">
                         <Check className="h-5 w-5 text-emerald-400" />
                         <span className="text-sm font-bold text-gray-200">Main Specification Logs</span>
                       </div>
                    </div>
                    {output && (
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl text-left">
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-emerald-400" />
                          <span className="text-sm font-bold text-gray-200">Synthesized Tech Models</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleReport}
                    disabled={isDeploying}
                    className="w-full py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-white transition-all shadow-xl active:scale-95 flex items-center justify-center"
                  >
                    {isDeploying ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Maximize2 className="h-5 w-5 mr-2" />}
                    Submit Production Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Toggle */}
          <div className={cn(
            "absolute bottom-0 inset-x-0 bg-[#0D1117] border-t border-white/5 p-4 transition-all duration-300",
            showTerminal ? "h-32" : "h-10 overflow-hidden"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div 
                onClick={() => setShowTerminal(!showTerminal)}
                className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-gray-300"
              >
                <Terminal className="h-3 w-3 mr-2" />
                Terminal Console
              </div>
              <div className="flex space-x-4 text-[10px] font-bold text-gray-600">
                <span>Output</span>
                <span>Debug</span>
                <span>Session: Active</span>
              </div>
            </div>
            {showTerminal && (
              <div className="font-mono text-[11px] text-emerald-400/80 space-y-1">
                <p><span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> Connected to Sanctum Repository...</p>
                <p><span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> Access Token Verified: SESSION_{id}.</p>
                <p><span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> Initializing high-precision research environment...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
