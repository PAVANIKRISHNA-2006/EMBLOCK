import {Upload, Key, History, Shield, Cpu, Save, Share2, Loader2, Check, Database, Globe, Zap, Lock, FileText, ExternalLink} from 'lucide-react';
import {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {knowledgeService} from '../lib/knowledgeService';
import {cn} from '../lib/utils';
import {useAuth} from '../context/AuthContext';

export default function KHub() {
  const {user, profile} = useAuth();
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // Check if user is admin (by flag or email)
  const isAdmin = profile?.isAdmin || user?.email === 'raokpavani@gmail.com';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const text = await knowledgeService.generateKnowledge(prompt);
      setOutput(text);
      await knowledgeService.logUsage(text.length);
    } catch (err) {
      setError('Failed to generate technical documentation. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!output) return;
    setIsSaving(true);
    try {
      await knowledgeService.createDocument({
        title: prompt.slice(0, 30) + '...',
        content: output,
        type: 'dept',
        department: profile?.department || 'General'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save document.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeploy = async () => {
    if (!output) return;
    setIsDeploying(true);
    // Simulate production deployment/licensing
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">K-Hub (Knowledge Hub)</h2>
          <p className="text-gray-500 mt-1 text-lg">AI-powered technical knowledge generation and architectural modeling.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95 text-sm font-bold" id="upload-doc-btn">
            <Upload className="mr-2 h-4 w-4" />
            Upload Research Context
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden" id="khub-main-container">
            <div className="bg-gray-50/50 p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg">
                  <Cpu className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">Technical Model Architect</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                <span>Core Engine: Gemini 3.0</span>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {['Logic Flow', 'Database Schema', 'API Design', 'Security Protocol', 'System Architecture'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setPrompt(`Generate a ${tag} for: `)}
                    className="px-3 py-1 bg-gray-100 hover:bg-white text-gray-600 border border-transparent hover:border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full h-48 p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none text-gray-900 placeholder-gray-400 transition-all"
                placeholder="Describe the technical logic or architectural model you want to research..."
                id="khub-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
              <div className="mt-4 flex justify-end items-center">
                <button 
                  className={cn(
                    "px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-indigo-100 shadow-xl active:scale-95 disabled:opacity-50 flex items-center",
                    isGenerating && "opacity-80"
                  )} 
                  id="generate-khub-btn"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Research Model
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden" id="khub-output-preview">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">Generated Technical Model</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  disabled={!output || isSaving}
                  className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-50"
                  title="Save to Dashboard"
                >
                  {saveSuccess ? <Check className="h-5 w-5 text-emerald-500" /> : <Save className="h-5 w-5" />}
                </button>
                <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Share2 className="h-5 w-5" /></button>
              </div>
            </div>
            <div className={cn(
              "prose prose-sm max-w-none text-gray-700 bg-[#FAFAFB] p-8 min-h-[300px]",
              !output && "flex items-center justify-center italic text-gray-400"
            )}>
              {output ? (
                <div className="markdown-content">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Cpu className="h-12 w-12 text-gray-100 mb-4" />
                  <p>Design your technical model and click research to see the synthesized logic here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar for Research Context */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6" id="khub-history-card">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center text-sm uppercase tracking-widest">
              <History className="mr-2 h-4 w-4 text-indigo-600" />
              Recent Research
            </h3>
            <div className="space-y-3">
              {[
                'API Gateway Mesh', 
                'Auth Flow v2', 
                'Database Sharding',
                'Neural Mapping v4',
                'Edge Security Vector',
                'Distributed Cache Specs',
                'Load Balancer Topology',
                'Quantum-Safe TLS'
              ].map(item => (
                <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white transition-all cursor-pointer group">
                  <FileText className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                  <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-900">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-white mb-6 flex items-center text-sm uppercase tracking-widest">
              <History className="mr-2 h-4 w-4" />
              Intelligence Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tighter">Models Built</p>
                <p className="text-2xl font-bold">142</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tighter">Sync Rate</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

