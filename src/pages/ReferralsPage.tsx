import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { subscribeToReferralRooms, subscribeToRoomReferrals } from '../services/firestoreService';
import type { ReferralRoom, ReferredTeamEntry } from '../services/firestoreService';
import { GlassCard } from '../components/common/GlassCard';
import { formatISTDateTime } from '../utils/formatters';
import {
  Gift,
  Search,
  Users,
  Award,
  ArrowUpRight,
  X,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const [rooms, setRooms] = useState<ReferralRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<ReferralRoom | null>(null);
  const [roomEntries, setRoomEntries] = useState<ReferredTeamEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Subscribe to Referral Rooms
  useEffect(() => {
    const unsubscribe = subscribeToReferralRooms(
      db,
      (fetchedRooms) => {
        setRooms(fetchedRooms);
        setLoading(false);
      },
      (err) => {
        console.warn('Error subscribing to referral rooms:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to Room Referrals Subcollection when a room is opened
  useEffect(() => {
    if (!selectedRoom) {
      setRoomEntries([]);
      return;
    }

    setLoadingEntries(true);
    const unsubscribe = subscribeToRoomReferrals(
      db,
      selectedRoom.referralCode,
      (entries) => {
        setRoomEntries(entries);
        setLoadingEntries(false);
      },
      (err) => {
        console.warn('Error fetching room referrals:', err);
        setLoadingEntries(false);
      }
    );

    return () => unsubscribe();
  }, [selectedRoom]);

  const totalReferralCodes = rooms.length;
  const totalSuccessfulReferrals = rooms.reduce((acc, r) => acc + (r.totalReferrals || 0), 0);
  const topReferringTeam = rooms.length > 0 && rooms[0].totalReferrals > 0
    ? `${rooms[0].teamName} (${rooms[0].totalReferrals} Referrals)`
    : 'None yet';

  const filteredRooms = rooms.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.referralCode.toLowerCase().includes(q) ||
      r.teamName.toLowerCase().includes(q) ||
      r.leaderName.toLowerCase().includes(q) ||
      r.leaderEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" /> Warrior Referral System Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor all referral rooms, warrior codes, top referring teams, and referred registrations in real time
          </p>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard variant="default" className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Referral Codes</span>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalReferralCodes}</div>
          <p className="text-[11px] text-slate-400 mt-1">Generated Warrior Codes in Firestore</p>
        </GlassCard>

        <GlassCard variant="default" className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Successful Referrals</span>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalSuccessfulReferrals}</div>
          <p className="text-[11px] text-slate-400 mt-1">Teams registered using a Referral Code</p>
        </GlassCard>

        <GlassCard variant="default" className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Referring Team</span>
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-base font-bold text-slate-900 truncate">{topReferringTeam}</div>
          <p className="text-[11px] text-slate-400 mt-1">Leaderboard Champion</p>
        </GlassCard>
      </div>

      {/* Search Bar */}
      <GlassCard variant="default" className="p-4 bg-white border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Referral Code, Team Name, Leader Name, or Email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:border-slate-400 focus:bg-white outline-none font-sans"
          />
        </div>
      </GlassCard>

      {/* Referral Rooms Table */}
      <GlassCard variant="default" className="p-0 overflow-hidden bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" /> Active Referral Rooms ({filteredRooms.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-600" /> Loading referral rooms from Firestore...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No referral rooms found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Owner Team & Leader</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Total Referrals</th>
                  <th className="p-4">Created (IST)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {room.referralCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{room.teamName}</div>
                      <div className="text-[11px] text-slate-500">Leader: {room.leaderName}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400" /> {room.leaderEmail || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {room.leaderPhone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          room.totalReferrals > 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {room.totalReferrals} {room.totalReferrals === 1 ? 'Team' : 'Teams'}
                      </span>
                    </td>
                    <td className="p-4 text-[11px] text-slate-500">
                      {formatISTDateTime(room.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 ml-auto cursor-pointer shadow-2xs"
                      >
                        <span>View Room</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Referral Room Modal Details */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest block">
                  REFERRAL ROOM DETAILS
                </span>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>Room:</span>
                  <span className="font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {selectedRoom.referralCode}
                  </span>
                </h3>
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room Owner Info */}
            <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">ROOM OWNER TEAM</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">{selectedRoom.teamName}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">TOTAL SUCCESSFUL REFERRALS</span>
                <span className="font-black text-emerald-700 text-sm block mt-0.5">{selectedRoom.totalReferrals} Teams</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">TEAM LEADER</span>
                <span className="font-medium text-slate-800">{selectedRoom.leaderName}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">CONTACT</span>
                <span className="font-medium text-slate-800">{selectedRoom.leaderEmail} • {selectedRoom.leaderPhone}</span>
              </div>
            </div>

            {/* Referred Teams Subcollection */}
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-600" /> Referred Teams in this Room ({roomEntries.length})
              </h4>

              {loadingEntries ? (
                <div className="p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" /> Loading referred teams from Firestore subcollection...
                </div>
              ) : roomEntries.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200">
                  No teams have registered using this referral code yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {roomEntries.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{entry.teamName}</div>
                        <div className="text-slate-600 mt-0.5">Leader: {entry.leaderName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {entry.leaderEmail} • {entry.leaderPhone}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[10px] border border-emerald-200 block">
                          Referred
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {formatISTDateTime(entry.registeredAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
