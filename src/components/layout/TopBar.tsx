import React, { useState, useEffect } from 'react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Search, Clock, Users, ShieldAlert, Lock, Unlock, Moon, Sun } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIstTimeStr(formatISTTime(new Date()));
    }, 1000);
    setIstTimeStr(formatISTTime(new Date()));
    return () => clearInterval(timer);
  }, []);

  const onlineVisitorsCount = sessions.filter(s => s.isOnline).length;

  return (
    <header className="h-16 border-b border-cyan-500/15 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 font-mono">
      {/* Left: Branding & Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-white uppercase">
              YODHA COMMAND CENTER
            </h1>
            <p className="text-[10px] text-cyan-400/80 tracking-wider">
              REAL-TIME HACKATHON MONITORING
            </p>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs font-mono group"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <span>Global Search (Team, Leader, Member, College)...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-400 font-mono">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Realtime Status, Database Status, Current Time, Dark Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Realtime Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">Realtime Live</span>
        </div>

        {/* Database Status */}
        <div className="hidden sm:flex items-center gap-2">
          <StatusBadge
            status={isFirebaseConnected ? 'SYNCED' : 'ONLINE'}
            pulse={isFirebaseConnected}
          />
        </div>

        {/* Online Visitors Counter */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white">{onlineVisitorsCount}</span>
          <span className="text-[10px] text-cyan-400/80 uppercase">Online</span>
        </div>

        {/* Live Clock (IST) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-xs text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold">{istTimeStr || '00:00:00 IST'}</span>
        </div>

        {/* Dark Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Theme Status: Dark Premium Theme Active"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-cyan-400 transition-all"
        >
          {isDarkMode ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Admin Login / Logout Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          {isAdminAuthenticated ? (
            <button
              onClick={logoutAdmin}
              title="Click to logout from Admin Mode"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 transition-all text-xs font-bold"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>ADMIN</span>
            </button>
          ) : (
            <button
              onClick={() => openLoginModal()}
              title="Click to enter Admin Passcode"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-slate-800 transition-all text-xs font-bold"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>LOGIN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
