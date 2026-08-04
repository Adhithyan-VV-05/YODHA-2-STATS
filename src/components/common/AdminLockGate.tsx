import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      showToast('Passcode Verified', 'Welcome to YODHA Dashboard', 'success');
    } else {
      setError('Invalid passcode. Verified via Firestore database.');
      showToast('Access Denied', 'Invalid admin passcode', 'alert');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-slate-900 selection:text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center border-b border-slate-100 pb-6 mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md mb-3">
            <Shield className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            YODHA 2.0 Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Organizer Passcode Protected Access
          </p>

          <div className="mt-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Firestore Authentication Active
          </div>
        </div>

        {/* Passcode Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Enter Admin Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="Enter passcode to unlock..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-slate-400 focus:bg-white outline-none transition-all font-sans"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
              Enter authorized organizer passcode to view and manage hackathon responses.
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
          >
            <span>Authenticate & Enter Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
