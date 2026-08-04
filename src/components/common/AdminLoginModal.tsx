import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, X, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAdmin } = useAdminAuth();
  const { showToast } = useToast();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

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
      showToast('Admin Authenticated', 'Access granted to edit and delete responses', 'success');
    } else {
      setError('Invalid admin passcode. Verified via Firestore database.');
      showToast('Authentication Failed', 'Invalid admin passcode', 'alert');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl relative">
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-slate-500">Verified via Firestore admin configuration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Admin Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="Enter passcode..."
                autoFocus
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-slate-400 focus:bg-white outline-none font-sans"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              Passcode is verified securely against Firestore database.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeLoginModal}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              Authenticate Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
