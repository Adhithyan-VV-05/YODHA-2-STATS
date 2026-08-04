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
      className={`h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative z-30 font-sans ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse Toggle & Security Status */}
      <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAdminAuthenticated ? 'Admin Authenticated' : 'Read-Only Mode'}</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all ml-auto cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
