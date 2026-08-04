import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLockGate: React.FC = () => {
  const { loginAdmin } = useAdminAuth();
  const { showToast } = useToast();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter admin passcode');
      return;
    }

    const success = loginAdmin(passcode);
    if (success) {
      setPasscode('');
      setError('');
      showToast('Passcode Verified', 'Welcome to YODHA COMMAND CENTER', 'success');
    } else {
      setError('Invalid admin passcode. Verified via Firestore database.');
      showToast('Access Denied', 'Invalid admin passcode', 'alert');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#06080d] text-slate-100 bg-grid-cyber flex items-center justify-center p-4 font-mono relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-950/90 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center border-b border-cyan-500/20 pb-6 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-white flex items-center justify-center shadow-xl shadow-cyan-500/30 mb-4">
            <ShieldAlert className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>

          <h1 className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-white uppercase">
            YODHA COMMAND CENTER
          </h1>
          <p className="text-xs text-cyan-400/80 tracking-widest mt-1 uppercase font-bold">
            RESTRICTED ORGANIZER ACCESS
          </p>

          <div className="mt-3 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 🟢 FIRESTORE AUTHENTICATION ACTIVE
          </div>
        </div>

        {/* Passcode Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Enter Admin Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="Enter passcode to unlock..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-cyan-400 outline-none transition-all font-mono"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Enter the authorized organizer passcode to access the dashboard. Passcode is verified securely against Firestore.
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 group"
          >
            <span>AUTHENTICATE & ENTER DASHBOARD</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
