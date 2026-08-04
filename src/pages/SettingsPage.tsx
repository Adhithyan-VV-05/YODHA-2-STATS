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
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" /> SYSTEM CONFIGURATION & ADMIN AUTH
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          FIRESTORE STORED PASSCODE & REALTIME TELEMETRY STATUS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Realtime Listener Status */}
        <GlassCard variant="glow" className="p-5">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Realtime Listener Status
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              {isFirebaseConnected ? 'FIRESTORE ACTIVE' : 'LOCAL MODE'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span>Collection: <code className="text-cyan-400">registrations</code></span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Subscribed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span>Collection: <code className="text-cyan-400">user_sessions</code></span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Subscribed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span>Document: <code className="text-cyan-400">stats/admin_config</code></span>
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passcode Sync</span>
            </div>
          </div>
        </GlassCard>

        {/* Admin Passcode Config */}
        <GlassCard variant="default" className="p-5 flex flex-col justify-between">
          <div className="border-b border-cyan-500/20 pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Firestore Admin Passcode
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isAdminAuthenticated ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-amber-400 border border-amber-500/30'}`}>
              {isAdminAuthenticated ? 'ADMIN AUTHENTICATED' : 'READ-ONLY MODE'}
            </span>
          </div>

          <form onSubmit={handleSavePasscode} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Set New Admin Passcode in Firestore</label>
              <input
                type="password"
                disabled={!isAdminAuthenticated}
                value={newPasscode}
                onChange={e => setNewPasscode(e.target.value)}
                placeholder="Enter new admin passcode..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-amber-500 outline-none font-mono disabled:opacity-50"
              />
              {!isAdminAuthenticated ? (
                <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-400 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Log in as Admin to edit the passcode stored in Firestore.</span>
                  <button
                    type="button"
                    onClick={() => openLoginModal()}
                    className="ml-auto px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Passcode stored securely in Firestore <code className="text-amber-400">stats/admin_config</code> doc.
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!isAdminAuthenticated}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 transition-all flex items-center gap-2 disabled:opacity-40"
              >
                <Save className="w-4 h-4" /> Save Passcode to Firestore
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
