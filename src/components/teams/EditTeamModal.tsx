import React, { useState, useEffect } from 'react';
import type { Team, TeamMember, TrackType } from '../../types/team';
import { X, Save, Trash2, Edit3, UserPlus, GraduationCap } from 'lucide-react';

interface EditTeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTeam: Team) => Promise<void>;
}

const TRACKS: TrackType[] = ['Healthcare', 'Environment', 'AI & Robotics', 'Cybersecurity', 'Open Hardware'];

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  team,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Team | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData(JSON.parse(JSON.stringify(team)));
    }
  }, [team]);

  if (!isOpen || !formData) return null;

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedMembers = [...prev.members];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value
      };

      const leaderMbr = updatedMembers.find(m => m.role === 'Leader') || updatedMembers[0];

      return {
        ...prev,
        leaderName: leaderMbr?.name || prev.leaderName,
        leaderEmail: leaderMbr?.email || prev.leaderEmail,
        leaderPhone: leaderMbr?.phone || prev.leaderPhone,
        college: leaderMbr?.college || prev.college,
        members: updatedMembers
      };
    });
  };

  const addMember = () => {
    setFormData(prev => {
      if (!prev) return null;
      const newMember: TeamMember = {
        id: `mbr-${prev.id}-${Date.now()}`,
        name: `Member ${prev.members.length + 1}`,
        email: '',
        phone: '',
        college: prev.college,
        year: '3rd Year',
        gender: 'Male',
        role: 'Member'
      };
      return {
        ...prev,
        members: [...prev.members, newMember],
        size: prev.members.length + 1
      };
    });
  };

  const removeMember = (index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const memberToRemove = prev.members[index];
      if (memberToRemove.role === 'Leader') {
        alert('Cannot remove the Team Leader. Please assign a new leader first.');
        return prev;
      }
      const updatedMembers = prev.members.filter((_, i) => i !== index);
      return {
        ...prev,
        members: updatedMembers,
        size: updatedMembers.length
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to update team:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-mono overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4 mb-5 shrink-0">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">EDIT RESPONSE / TEAM DETAILS</h2>
            <p className="text-xs text-slate-400">Team ID: {formData.id} • Updates persist directly to Firestore</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 flex-1">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">College / Institution</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Track Category</label>
              <select
                value={formData.track}
                onChange={e => setFormData({ ...formData, track: e.target.value as TrackType })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none"
              >
                {TRACKS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Verification Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Team['status'] })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none"
              >
                <option value="Verified">Verified</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Project Description</label>
            <textarea
              rows={3}
              value={formData.projectDescription || ''}
              onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Brief summary of solution..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Members List Section */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" /> Team Roster ({formData.members.length} Members)
              </h3>
              <button
                type="button"
                onClick={addMember}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-xs flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Member
              </button>
            </div>

            <div className="space-y-3">
              {formData.members.map((member, idx) => (
                <div key={member.id || idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      member.role === 'Leader' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {member.role}
                    </span>
                    {member.role !== 'Leader' && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="text-pink-400 hover:text-pink-300 p-1"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={member.name}
                      onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={e => handleMemberChange(idx, 'email', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={member.phone}
                      onChange={e => handleMemberChange(idx, 'phone', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="College / Inst."
                      value={member.college}
                      onChange={e => handleMemberChange(idx, 'college', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Year of Study"
                      value={member.year}
                      onChange={e => handleMemberChange(idx, 'year', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL (optional)"
                      value={member.githubUrl || ''}
                      onChange={e => handleMemberChange(idx, 'githubUrl', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving to Firestore...' : 'Save Firestore Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
