import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Eye,
  LineChart,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { teams, sessions } = useCommandCenter();
  const { isAdminAuthenticated } = useAdminAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { path: '/teams', label: 'Teams', icon: Users, badge: teams.length },
    { path: '/participants', label: 'Participants', icon: UserCheck, badge: null },
    { path: '/visitors', label: 'Visitors', icon: Eye, badge: sessions.length ? `${sessions.filter(s => s.isOnline).length} Live` : null },
    { path: '/analytics', label: 'Analytics', icon: LineChart, badge: null },
    { path: '/exports', label: 'Exports', icon: Download, badge: null },
    { path: '/settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-slate-950/90 border-r border-cyan-500/15 backdrop-blur-xl flex flex-col transition-all duration-300 relative z-30 font-mono ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all group relative ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                  
                  {!isCollapsed && (
                    <span className="flex-1 truncate tracking-wide">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge !== null && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-slate-900 text-cyan-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active glowing indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-cyan-400 shadow-glow shadow-cyan-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse Toggle & Security Badge */}
      <div className="p-3 border-t border-cyan-500/15 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAdminAuthenticated ? 'ADMIN AUTHENTICATED' : 'READ-ONLY MODE'}</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
