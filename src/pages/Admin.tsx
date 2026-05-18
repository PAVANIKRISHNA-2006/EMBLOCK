import { Shield, Database, Globe, Lock, Key, Users, FileCheck, ExternalLink, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Admin() {
  const { profile, user } = useAuth();
  const isAdmin = profile?.isAdmin || user?.email === 'raokpavani@gmail.com';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <div className="p-4 bg-red-50 rounded-full">
          <Lock className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
        <p className="text-gray-500 max-w-md">This area is reserved for system administrators. Please contact your IT department for access.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Company Management</h1>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-sm font-bold shadow-lg shadow-gray-200">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Database Management */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Database className="mr-2 h-5 w-5 text-indigo-600" />
              Company Technical Database
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search specs..." 
                className="pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document / Spec</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'Core Engine v4.0.2 Specs', cat: 'Logic Flow', status: 'Protected', color: 'indigo' },
                  { name: 'Production Topology 2024', cat: 'Infra', status: 'Verified', color: 'emerald' },
                  { name: 'Security Audit Logs - Q2', cat: 'SecOps', status: 'Locked', color: 'amber' },
                  { name: 'API Gateway Manifest', cat: 'Protocol', status: 'Active', color: 'indigo' },
                  { name: 'Quantum Key Distribution', cat: 'SecOps', status: 'Draft', color: 'amber' },
                  { name: 'Edge Node Status Report', cat: 'Infra', status: 'Verified', color: 'emerald' },
                  { name: 'Customer PII Buffer', cat: 'Data', status: 'Encrypted', color: 'indigo' },
                  { name: 'Training Vector Sets', cat: 'AI/ML', status: 'Authorized', color: 'emerald' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileCheck className="h-4 w-4 text-gray-400 mr-3 group-hover:text-indigo-600" />
                        <span className="text-sm font-bold text-gray-900">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-500">{row.cat}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                        row.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                        row.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-900"><ExternalLink className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* License & Domain Management */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-3xl shadow-xl p-8 text-white">
            <h3 className="font-bold text-white mb-6 flex items-center text-sm uppercase tracking-widest">
              <Globe className="mr-2 h-4 w-4 text-emerald-400" />
              Production Domains
            </h3>
            <div className="space-y-4">
              {[
                { site: 'Company Wiki', url: 'wiki.emblock.com', users: 124 },
                { site: 'Eng Portal', url: 'eng.emblock.io', users: 48 },
              ].map(item => (
                <div key={item.site} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-white">{item.site}</p>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-lg">Active</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{item.url}</p>
                  <div className="mt-3 flex items-center text-[10px] text-gray-500">
                    <Users className="h-3 w-3 mr-1" /> {item.users} Licensed Users
                  </div>
                </div>
              ))}
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all">
                Manage Licenses
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center text-sm uppercase tracking-widest">
              <Key className="mr-2 h-4 w-4" />
              Security tokens
            </h3>
            <p className="text-xs text-indigo-600/70 mb-4 leading-relaxed font-medium">Control API access tokens and research environment licensing.</p>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
              <span className="text-xs font-mono font-bold text-indigo-900">ELC_PROD_******</span>
              <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
