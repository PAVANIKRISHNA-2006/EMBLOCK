import {Mail, Globe, Linkedin, Github} from 'lucide-react';

const people = [
  { name: 'Alice Johnson', role: 'Head of Engineering', dept: 'Development', email: 'alice@company.com', avatar: 'AJ' },
  { name: 'Bob Smith', role: 'Senior Designer', dept: 'Design', email: 'bob@company.com', avatar: 'BS' },
  { name: 'Charlie Davis', role: 'Product Manager', dept: 'Product', email: 'charlie@company.com', avatar: 'CD' },
  { name: 'Dana White', role: 'QA Lead', dept: 'Engineering', email: 'dana@company.com', avatar: 'DW' },
  { name: 'Edward Norton', role: 'Security Analyst', dept: 'Operations', email: 'edward@company.com', avatar: 'EN' },
  { name: 'Fiona Gallagher', role: 'Frontend Developer', dept: 'Development', email: 'fiona@company.com', avatar: 'FG' },
  { name: 'George Miller', role: 'DevOps Engineer', dept: 'Engineering', email: 'george@company.com', avatar: 'GM' },
  { name: 'Helen Mirren', role: 'UX Researcher', dept: 'Design', email: 'helen@company.com', avatar: 'HM' },
  { name: 'Ian Wright', role: 'Database Architect', dept: 'Development', email: 'ian@company.com', avatar: 'IW' },
  { name: 'Jenny Kim', role: 'Marketing Lead', dept: 'Marketing', email: 'jenny@company.com', avatar: 'JK' },
  { name: 'Kevin Hart', role: 'HR Manager', dept: 'Corporate', email: 'kevin@company.com', avatar: 'KH' },
  { name: 'Laura Palmer', role: 'Backend Developer', dept: 'Development', email: 'laura@company.com', avatar: 'LP' },
];

export default function People() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">People & Roles</h2>
        <p className="text-gray-500 mt-1 text-lg">Connect with your team and find shared workspace links.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {people.map((person) => (
          <div key={person.name} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:scale-[1.02] transition-transform duration-200" id={`person-${person.name.toLowerCase().replace(' ', '-')}`}>
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl mb-4 mx-auto">
              {person.avatar}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">{person.name}</h3>
              <p className="text-indigo-600 text-sm font-semibold mb-1">{person.role}</p>
              <p className="text-gray-500 text-xs uppercase tracking-tighter">{person.dept}</p>
            </div>
            
            <div className="mt-6 flex justify-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Email">
                <Mail className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Workspace">
                <Globe className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="GitHub">
                <Github className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="w-full text-xs font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                View Workspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
