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
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden font-sans"
        >
          {/* Header Input */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Teams, Leader, College, Track, ID..."
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-sm font-sans"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-4 max-h-96 overflow-y-auto space-y-4">
            {/* Teams Section */}
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Registered Teams ({filteredTeams.length})
              </div>
              {filteredTeams.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">No matching teams found</div>
              ) : (
                <div className="space-y-1">
                  {filteredTeams.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTeam(t)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-slate-950">
                          {t.name} <span className="text-[11px] text-slate-400 font-normal">({t.id})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {t.leaderName} • {t.college} • <span className="text-slate-700 font-medium">{t.track}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Participants Section */}
            {filteredParticipants.length > 0 && (
              <div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Participants ({filteredParticipants.length})
                </div>
                <div className="space-y-1">
                  {filteredParticipants.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setCommandPaletteOpen(false);
                        navigate('/participants');
                      }}
                      className="cursor-pointer p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                    >
                      <div className="text-xs font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.email} • {p.college} ({p.role})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">ESC</kbd> to close</span>
            <span>YODHA 2.0 Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
