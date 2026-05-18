import {FileText, Folder, Activity, Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import {knowledgeService, KBDocument} from '../lib/knowledgeService';
import {cn} from '../lib/utils';

export default function Dashboard() {
  const [docs, setDocs] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newDocData, setNewDocData] = useState({ title: '', type: 'dept' as const });

  useEffect(() => {
    const unsubscribe = knowledgeService.getDocuments(undefined, (fetchedDocs) => {
      setDocs(fetchedDocs);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocData.title) return;
    try {
      await knowledgeService.createDocument({
        ...newDocData,
        content: `New ${newDocData.type} document created via dashboard.`,
        department: 'General'
      });
      setNewDocData({ title: '', type: 'dept' });
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getDocsByType = (type: string) => docs.filter(d => d.type === type);

  const renderDocList = (type: string, placeholder: string[]) => {
    const typeDocs = getDocsByType(type);
    if (typeDocs.length === 0) {
      return placeholder.map(doc => (
        <li key={doc} className="text-gray-400 italic flex items-center py-1 border-b border-gray-50 last:border-0 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3" />
          {doc} (Sample)
        </li>
      ));
    }
    return typeDocs.map(doc => (
      <li key={doc.id} className="text-gray-600 hover:text-indigo-600 cursor-pointer flex items-center py-1 border-b border-gray-50 last:border-0">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3" />
        {doc.title}
      </li>
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace Dashboard</h2>
          <p className="text-gray-500 mt-1 text-lg">Central hub for your department's knowledge and activities.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95" id="new-doc-btn"
        >
          <Plus className="mr-2 h-5 w-5" />
          {isCreating ? 'Cancel' : 'New Document'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Title</label>
              <input 
                type="text" 
                value={newDocData.title}
                onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Enter doc title..."
                required
              />
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
              <select 
                value={newDocData.type}
                onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
              >
                <option value="dept">Department</option>
                <option value="rule">Rule/Workflow</option>
                <option value="shared">Shared Data</option>
              </select>
            </div>
            <button 
              type="submit"
              className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dept Docs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow" id="dept-docs-card">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="ml-3 font-bold text-gray-900 text-xl">Department Docs</h3>
          </div>
          <ul className="space-y-3">
            {renderDocList('dept', ['Product Strategy 2024', 'Q2 Roadmap Details', 'Design System V2'])}
          </ul>
        </div>

        {/* Work & Rules */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow" id="rules-docs-card">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="ml-3 font-bold text-gray-900 text-xl">Rules & Workflow</h3>
          </div>
          <ul className="space-y-3">
            {renderDocList('rule', ['Code Review Guidelines', 'Deployment Checklist', 'Emergency Procedures'])}
          </ul>
        </div>

        {/* Shared Data */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow" id="shared-data-card">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Folder className="h-6 w-6" />
            </div>
            <h3 className="ml-3 font-bold text-gray-900 text-xl">Shared Data</h3>
          </div>
          <ul className="space-y-3">
            {renderDocList('shared', ['User Research Repo', 'Marketing Assets', 'Legal Documents'])}
          </ul>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8" id="metrics-section">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Department Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Projects', val: '12', color: 'text-blue-600' },
            { label: 'Completed Tasks', val: '148', color: 'text-emerald-600' },
            { label: 'Docs Viewed', val: '1.2k', color: 'text-indigo-600' },
            { label: 'Team Progress', val: '84%', color: 'text-orange-600' },
          ].map(stat => (
            <div key={stat.label} className="text-center md:text-left border-r last:border-0 border-gray-100 pr-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className={cn("text-4xl font-black mt-2", stat.color)}>{stat.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
