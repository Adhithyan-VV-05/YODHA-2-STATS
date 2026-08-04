import React, { useState, useEffect } from 'react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Search, Clock, Users, Shield, Lock, Unlock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatISTTime } from '../../utils/formatters';

export const TopBar: React.FC = () => {
  const {
    isFirebaseConnected,
    sessions,
    setCommandPaletteOpen
  } = useCommandCenter();

  const { isAdminAuthenticated, openLoginModal, logoutAdmin } = useAdminAuth();

  const [istTimeStr, setIstTimeStr] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setIstTimeStr(formatISTTime(new Date()));
    }, 1000);
    setIstTimeStr(formatISTTime(new Date()));
    return () => clearInterval(timer);
  }, []);

  const onlineVisitorsCount = sessions.filter(s => s.isOnline).length;

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40 font-sans shadow-xs">
      {/* Left: Branding & Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              YODHA 2.0 Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Real-time Hackathon Analytics
            </p>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 transition-all text-xs font-sans group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span>Search teams, leaders, colleges...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] text-slate-600 font-mono shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Realtime Status, Database Status, Current Time, Admin Status */}
      <div className="flex items-center gap-3">
        {/* Realtime Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Realtime Sync</span>
        </div>

        {/* Database Status */}
        <div className="hidden sm:flex items-center gap-2">
          <StatusBadge
            status={isFirebaseConnected ? 'SYNCED' : 'ONLINE'}
            pulse={isFirebaseConnected}
          />
        </div>

        {/* Online Visitors Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-900">{onlineVisitorsCount}</span>
          <span className="text-slate-500 text-[11px]">Online</span>
        </div>

        {/* Live Clock (IST) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium text-slate-800">{istTimeStr || '00:00:00 IST'}</span>
        </div>

        {/* Admin Login / Logout Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          {isAdminAuthenticated ? (
            <button
              onClick={logoutAdmin}
              title="Click to logout from Admin Mode"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all text-xs font-semibold"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Mode</span>
            </button>
          ) : (
            <button
              onClick={() => openLoginModal()}
              title="Click to enter Admin Passcode"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-xs font-semibold shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-slate-300" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
