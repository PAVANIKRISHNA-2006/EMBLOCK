import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, ArrowRight, User, Briefcase, Building, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

type Step = 'details' | 'face' | 'confirm' | 'success';

export default function Registration() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    role: '',
    department: '',
    displayName: user?.displayName || '',
  });
  const [isScanning, setIsScanning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);

  // Handle Camera for Face Step
  useEffect(() => {
    if (step === 'face') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setFaceDetected(true);
      setTimeout(() => setStep('confirm'), 1000);
    }, 3000);
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        registeredAt: serverTimestamp(),
        isRegistered: true,
      });
      setStep('success');
      setTimeout(() => window.location.reload(), 2000); // Reload to trigger layout/dashboard
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between items-center px-4">
          {['Details', 'Face ID', 'Confirm'].map((s, i) => {
            const currentIdx = ['details', 'face', 'confirm', 'success'].indexOf(step);
            const isActive = i <= currentIdx;
            return (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                  isActive ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                )}>
                  {i < currentIdx ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < 2 && (
                  <div className={cn(
                    "h-1 w-16 mx-2 rounded-full",
                    i < currentIdx ? "bg-indigo-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Complete Registration</h1>
                <p className="text-gray-500 mt-2">Help us set up your workspace by providing your professional details.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        placeholder="e.g. Lead Dev"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Department</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        placeholder="e.g. Design"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep('face')}
                  disabled={!formData.displayName || !formData.role || !formData.department}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center group disabled:opacity-50"
                >
                  Continue to Biometrics
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'face' && (
            <motion.div 
              key="face"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Identity Verification</h1>
                <p className="text-gray-500 mt-2">Position your face in the frame for secure registration.</p>
              </div>

              <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden mb-8 border-4 border-white shadow-inner">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover grayscale brightness-110"
                />
                
                {/* Scanner Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-indigo-400/50 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-indigo-500 rounded-full animate-ping opacity-20" />
                  </div>
                </div>

                {isScanning && (
                  <motion.div 
                    initial={{ y: -200 }} 
                    animate={{ y: 200 }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  />
                )}

                {faceDetected && (
                  <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="bg-white p-4 rounded-full shadow-2xl"
                    >
                      <Check className="h-12 w-12 text-indigo-600" />
                    </motion.div>
                  </div>
                )}
              </div>

              {!isScanning && !faceDetected && (
                <button 
                  onClick={simulateScanning}
                  className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center mx-auto"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Capture & Scan
                </button>
              )}
              {isScanning && (
                <div className="flex items-center justify-center text-indigo-600 font-bold animate-pulse">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Biometrics...
                </div>
              )}
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">One Final Step</h1>
                <p className="text-gray-500 mt-2">Confirm your details to activate your Emblock workspace.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name</span>
                  <span className="font-bold text-gray-900">{formData.displayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</span>
                  <span className="font-bold text-indigo-600">{formData.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</span>
                  <span className="font-bold text-gray-900">{formData.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                  <span className="text-emerald-600 font-bold flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> Verified
                  </span>
                </div>
              </div>

              <button 
                onClick={handleComplete}
                disabled={loading}
                className={cn(
                  "w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg active:scale-95",
                  loading && "opacity-80"
                )}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Activate Workspace'}
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
            >
              <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Aboard!</h1>
              <p className="text-gray-500 mt-2">Registration successful. Initializing your secure workspace...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
