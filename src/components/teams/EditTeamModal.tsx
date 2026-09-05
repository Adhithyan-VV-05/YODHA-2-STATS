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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl p-6 shadow-xl relative my-8 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5 shrink-0">
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Edit Team Details</h2>
            <p className="text-xs text-slate-500">Team ID: {formData.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 flex-1 font-sans">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-slate-400 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">College / Institution</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-slate-400 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Track Category</label>
              <select
                value={formData.track}
                onChange={e => setFormData({ ...formData, track: e.target.value as TrackType })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-slate-400 focus:bg-white outline-none"
              >
                {TRACKS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Verification Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Team['status'] })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-slate-400 focus:bg-white outline-none"
              >
                <option value="Verified">Verified</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Google Drive / PPT Presentation Link</label>
            <input
              type="text"
              value={formData.driveLink || formData.pptLink || ''}
              onChange={e => setFormData({ ...formData, driveLink: e.target.value, pptLink: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-slate-400 focus:bg-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Project Description</label>
            <textarea
              rows={3}
              value={formData.projectDescription || ''}
              onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Brief summary of solution..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-slate-400 focus:bg-white outline-none"
            />
          </div>

          {/* Members List Section */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-700" /> Team Roster ({formData.members.length} Members)
              </h3>
              <button
                type="button"
                onClick={addMember}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Member
              </button>
            </div>

            <div className="space-y-3">
              {formData.members.map((member, idx) => (
                <div key={member.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      member.role === 'Leader' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {member.role}
                    </span>
                    {member.role !== 'Leader' && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="text-rose-600 hover:text-rose-700 p-1 cursor-pointer"
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
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={e => handleMemberChange(idx, 'email', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={member.phone}
                      onChange={e => handleMemberChange(idx, 'phone', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="College / Inst."
                      value={member.college}
                      onChange={e => handleMemberChange(idx, 'college', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Year of Study"
                      value={member.year}
                      onChange={e => handleMemberChange(idx, 'year', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL (optional)"
                      value={member.githubUrl || ''}
                      onChange={e => handleMemberChange(idx, 'githubUrl', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
