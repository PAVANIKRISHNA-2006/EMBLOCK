import { useAuth } from "../context/AuthContext";
import { User, Shield, Key, Bell, Briefcase, Building, Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    displayName: profile?.displayName || user?.displayName || '',
    role: profile?.role || '',
    department: profile?.department || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8 text-sans">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h2>
        <p className="text-gray-500 mt-1">Manage your professional profile and workspace preferences.</p>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {!isEditing ? (
          <div className="flex flex-col md:flex-row items-center gap-8 animate-in fade-in">
            <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-xl shadow-indigo-100 shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold">{(user?.displayName || 'U').charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900">{profile?.displayName || user?.displayName}</h3>
              <p className="text-gray-500">{user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center">
                  <Briefcase className="h-3 w-3 mr-1.5" /> {profile?.role || 'Member'}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center">
                  <Building className="h-3 w-3 mr-1.5" /> {profile?.department || 'Unassigned'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 text-sm shrink-0"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Professional Profile</h3>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Public Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  value={editData.displayName}
                  onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Role</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  value={editData.department}
                  onChange={(e) => setEditData({...editData, department: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] divide-y divide-gray-100">
        {[
          { title: 'Profile Information', desc: 'Update your personal details and avatar' },
          { title: 'Department Access', desc: 'Manage which departments you can view' },
          { title: 'API & Tokens', desc: 'Configure developer access and technical tokens' },
          { title: 'Security', desc: 'Two-factor authentication and session management' },
        ].map(item => (
          <div key={item.title} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </div>
            <div className="text-gray-300 group-hover:text-indigo-400">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
