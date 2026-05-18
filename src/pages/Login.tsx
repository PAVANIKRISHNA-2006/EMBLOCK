import {useAuth} from '../context/AuthContext';
import {motion} from 'motion/react';
import {LogIn} from 'lucide-react';

export default function Login() {
  const {signIn} = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 border border-gray-100"
        id="login-card"
      >
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-2xl tracking-tighter">EL</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to Emblock</h1>
          <p className="text-gray-500 mt-2">Sign in with your company account to access the knowledge workspace.</p>
        </div>

        <button 
          onClick={signIn}
          className="w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:border-indigo-100 transition-all active:scale-[0.98] group"
          id="google-signin-btn"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5 mr-3" alt="Google" />
          Sign in with Google
          <LogIn className="ml-2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold font-mono">Internal Knowledge Base</p>
        </div>
      </motion.div>
    </div>
  );
}
