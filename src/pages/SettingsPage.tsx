import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Settings, Database, Save, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { isFirebaseConnected, saveAdminPasscodeToFirestore } = useCommandCenter();
  const { adminPasscode, updateAdminPasscode, isAdminAuthenticated, openLoginModal } = useAdminAuth();
  const { showToast } = useToast();

  const [newPasscode, setNewPasscode] = useState(adminPasscode);

  const handleSavePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminAuthenticated) {
      showToast('Admin Login Required', 'You must log in as Admin before changing the passcode', 'alert');
      openLoginModal();
      return;
    }

    if (newPasscode.trim().length < 4) {
      showToast('Invalid Passcode', 'Admin passcode must be at least 4 characters', 'alert');
      return;
    }

    const success = await updateAdminPasscode(newPasscode.trim(), saveAdminPasscodeToFirestore);
    if (success) {
      showToast('Passcode Updated in Firestore', `New passcode saved to stats/admin_config document`, 'success');
    } else {
      showToast('Passcode Update Failed', 'Must be authenticated as admin', 'alert');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" /> System Settings & Admin Auth
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Firestore authentication configuration and realtime database connection status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Realtime Listener Status */}
        <GlassCard variant="default" className="p-5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" /> Realtime Database Status
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isFirebaseConnected ? 'Firestore Active' : 'Local Mode'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-700">Collection: <code className="text-slate-900 font-semibold font-mono">registrations</code></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Subscribed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-700">Collection: <code className="text-slate-900 font-semibold font-mono">user_sessions</code></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Subscribed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-700">Document: <code className="text-slate-900 font-semibold font-mono">stats/admin_config</code></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Synced</span>
            </div>
          </div>
        </GlassCard>

        {/* Admin Passcode Config */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between bg-white border-slate-200 shadow-2xs">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700" /> Admin Passcode
            </h3>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${isAdminAuthenticated ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {isAdminAuthenticated ? 'Admin Authenticated' : 'Read-Only Mode'}
            </span>
          </div>

          <form onSubmit={handleSavePasscode} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Set New Admin Passcode in Firestore</label>
              <input
                type="password"
                disabled={!isAdminAuthenticated}
                value={newPasscode}
                onChange={e => setNewPasscode(e.target.value)}
                placeholder="Enter new admin passcode..."
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:border-slate-400 focus:bg-white outline-none font-sans disabled:opacity-50"
              />
              {!isAdminAuthenticated ? (
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Log in as Admin to edit the passcode.</span>
                  <button
                    type="button"
                    onClick={() => openLoginModal()}
                    className="ml-auto px-2.5 py-1 bg-slate-900 text-white font-semibold rounded text-[11px] cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Passcode stored securely in Firestore <code className="text-slate-800 font-semibold font-mono">stats/admin_config</code> document.
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!isAdminAuthenticated}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-40 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-300" /> Save Passcode Changes
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
