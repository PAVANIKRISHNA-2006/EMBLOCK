import { motion, AnimatePresence } from 'motion/react';
import { Database, Lock, Key, Calendar, Map, Check, ChevronRight, Search, ShieldAlert, Zap, Clock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface BaseDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  securityLevel: 'Low' | 'Medium' | 'High' | 'Restricted';
  lastUpdated: string;
}

const BASE_DOCS: BaseDoc[] = [
  { id: 'bd-001', title: 'Neural Core Architecture v4', category: 'Engineering', description: 'Complete logic flow and neural mapping for the proprietary engine.', securityLevel: 'Restricted', lastUpdated: '2 days ago' },
  { id: 'bd-002', title: 'Global Infra Topology', category: 'Ops', description: 'Network distribution specs and server cluster locations.', securityLevel: 'High', lastUpdated: '1 week ago' },
  { id: 'bd-003', title: 'Product Market Alignment', category: 'Strategy', description: 'Confidential research on competitor technical gaps.', securityLevel: 'Medium', lastUpdated: '4h ago' },
  { id: 'bd-004', title: 'Security Protocol 2026', category: 'Security', description: 'Updated zero-trust implementation details.', securityLevel: 'Restricted', lastUpdated: 'Just now' },
  { id: 'bd-005', title: 'Quantum Encryption Specs', category: 'Security', description: 'Next-gen lattice-based cryptography standards.', securityLevel: 'Restricted', lastUpdated: '3 days ago' },
  { id: 'bd-006', title: 'Edge Node Deployment Map', category: 'Ops', description: 'Geospatial distribution of edge computing nodes.', securityLevel: 'High', lastUpdated: '2 weeks ago' },
  { id: 'bd-007', title: 'User Behavioral Modeling', category: 'Data', description: 'Advanced cohort analysis and predictive modeling results.', securityLevel: 'Medium', lastUpdated: '1 day ago' },
  { id: 'bd-008', title: 'Hybrid Cloud Orchestration', category: 'Engineering', description: 'Kubernetes configuration for cross-cloud clusters.', securityLevel: 'High', lastUpdated: '5 days ago' },
  { id: 'bd-009', title: 'Ethics in AI Framework', category: 'Corporate', description: 'Policy on algorithmic bias and data privacy.', securityLevel: 'Low', lastUpdated: '1 month ago' },
  { id: 'bd-010', title: 'Supply Chain Vectoring', category: 'Ops', description: 'Logistics visualization and vendor vulnerability maps.', securityLevel: 'Medium', lastUpdated: '6h ago' },
];

export default function InternalBase() {
  const [selectedDoc, setSelectedDoc] = useState<BaseDoc | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [requestDate, setRequestDate] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRequestAccess = () => {
    setIsRequesting(true);
    // Simulate approval and code generation
    setTimeout(() => {
      setIsRequesting(false);
      setRequestCode('EMB-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }, 2000);
  };

  const startSession = () => {
    if (selectedDoc) {
      navigate(`/workspace/${selectedDoc.id}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <Database className="h-5 w-5 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Sanctioned Repository</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Emblock Access</h1>
        <p className="text-gray-500 mt-1 max-w-2xl">Browse company assets, schedule research sessions, and generate secure EMBLOCK codes for production environments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center px-6">
              <Search className="h-4 w-4 text-gray-400 mr-3" />
              <input type="text" placeholder="Search sanctioned docs..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <div className="divide-y divide-gray-50">
              {BASE_DOCS.map((doc) => (
                <div 
                  key={doc.id} 
                  onClick={() => setSelectedDoc(doc)}
                  className={cn(
                    "p-6 cursor-pointer transition-all hover:bg-gray-50 group",
                    selectedDoc?.id === doc.id && "bg-indigo-50/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-tighter">
                          {doc.category}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-tighter",
                          doc.securityLevel === 'Restricted' ? "bg-red-50 text-red-600" :
                          doc.securityLevel === 'High' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {doc.securityLevel} Level
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{doc.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 sticky top-8"
              >
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{selectedDoc.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {selectedDoc.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-indigo-400 mr-3" />
                    <span className="text-gray-300">Last updated {selectedDoc.lastUpdated}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Map className="h-4 w-4 text-indigo-400 mr-3" />
                    <span className="text-gray-300 text-xs">Internal ID: {selectedDoc.id}</span>
                  </div>
                </div>

                {!requestCode ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Schedule Research Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleRequestAccess}
                      disabled={!requestDate || isRequesting}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                      {isRequesting ? <Zap className="h-5 w-5 animate-spin mr-2" /> : <Key className="h-5 w-5 mr-2" />}
                      Request Code
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Access Code Granted</p>
                      <p className="text-2xl font-mono font-bold text-white tracking-widest">{requestCode}</p>
                    </div>
                    <button 
                      onClick={startSession}
                      className="w-full py-4 bg-emerald-500 text-gray-900 font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      Start Workspace Session
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                    <p className="text-[10px] text-gray-500 text-center flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1" /> Session expires in 4 hours
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-12 flex flex-col items-center justify-center text-center opacity-60 h-full min-h-[400px]">
                <ShieldAlert className="h-16 w-16 text-gray-200 mb-4" />
                <h3 className="font-bold text-gray-400">Select a Sanctioned File</h3>
                <p className="text-xs text-gray-400 mt-2">Pick a document from the repository to initiate an access request and start research.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
