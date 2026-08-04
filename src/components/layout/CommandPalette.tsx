import React, { useEffect, useState } from 'react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { useNavigate } from 'react-router-dom';
import { Search, Users, UserCheck, ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    teams,
    participants,
    setSelectedTeam
  } = useCommandCenter();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredTeams = query.trim()
    ? teams.filter(
        t =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.leaderName.toLowerCase().includes(query.toLowerCase()) ||
          t.college.toLowerCase().includes(query.toLowerCase()) ||
          t.track.toLowerCase().includes(query.toLowerCase()) ||
          t.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : teams.slice(0, 4);

  const filteredParticipants = query.trim()
    ? participants.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase()) ||
          p.college.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectTeam = (t: any) => {
    setSelectedTeam(t);
    setCommandPaletteOpen(false);
    navigate('/teams');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden font-mono"
        >
          {/* Header Input */}
          <div className="p-4 border-b border-cyan-500/20 flex items-center gap-3">
            <Search className="w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Teams, Leader, Scout, College, Track, ID..."
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-4 max-h-96 overflow-y-auto space-y-4">
            {/* Teams Section */}
            <div>
              <div className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Registered Teams ({filteredTeams.length})
              </div>
              {filteredTeams.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">No matching teams found</div>
              ) : (
                <div className="space-y-1">
                  {filteredTeams.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTeam(t)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/30 text-left transition-all group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                          {t.name} <span className="text-[10px] text-slate-500">({t.id})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {t.leaderName} • {t.college} • <span className="text-emerald-400">{t.track}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Participants Section */}
            {filteredParticipants.length > 0 && (
              <div>
                <div className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Scout Participants ({filteredParticipants.length})
                </div>
                <div className="space-y-1">
                  {filteredParticipants.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setCommandPaletteOpen(false);
                        navigate('/participants');
                      }}
                      className="cursor-pointer p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-emerald-500/30 transition-all"
                    >
                      <div className="text-xs font-bold text-slate-200">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.email} • {p.college} ({p.role})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-500">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-cyan-400">ESC</kbd> to exit command palette</span>
            <span>YODHA REAL-TIME INDEX</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
