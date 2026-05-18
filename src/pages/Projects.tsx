import {Activity, Code, Clock, UserCheck} from 'lucide-react';
import {cn} from '../lib/utils';

const activeProjects = [
  { name: 'Aurora Integration', progress: 65, team: 4, status: 'On Track' },
  { name: 'Data Pipeline V3', progress: 20, team: 2, status: 'Delayed' },
  { name: 'Frontend Refresh', progress: 90, team: 5, status: 'Nearly Done' },
  { name: 'Mobile API Mesh', progress: 45, team: 3, status: 'On Track' },
  { name: 'Security Audit Q2', progress: 100, team: 6, status: 'Completed' },
  { name: 'Cloud Migration', progress: 10, team: 8, status: 'Delayed' },
  { name: 'Neural Core v4', progress: 33, team: 4, status: 'In Progress' },
];

export default function Projects() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Project Collaboration</h2>
        <p className="text-gray-500 mt-1 text-lg">Real-time snapshots of company live projects.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeProjects.map((project) => (
          <div key={project.name} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow" id={`project-${project.name.toLowerCase().replace(' ', '-')}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Code className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" /> Updated 2h ago
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <UserCheck className="h-3 w-3 mr-1" /> {project.team} members active
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                  project.status === 'Delayed' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-600">Completion</span>
                <span className="font-bold text-indigo-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors">Documentation</button>
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-all active:scale-95 shadow-md">
                Launch Workspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
