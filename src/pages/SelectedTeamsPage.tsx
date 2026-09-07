import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  User,
  Mail,
  Phone,
  DollarSign,
  AlertCircle,
  X
} from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { useToast } from '../context/ToastContext';
import type { SelectedTeam, PaymentStatus } from '../types/team';
import {
  addFirestoreSelectedTeam,
  updateFirestoreSelectedTeam,
  updateSelectedTeamPaymentStatus,
  deleteFirestoreSelectedTeam
} from '../services/firestoreService';

export const SelectedTeamsPage: React.FC = () => {
  const { selectedTeams, teams, firestoreDb, bulkDeleteSelectedTeams } = useCommandCenter();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<SelectedTeam | null>(null);

  // Form State
  const [selectedRegTeamId, setSelectedRegTeamId] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [leaderName, setLeaderName] = useState<string>('');
  const [leaderEmail, setLeaderEmail] = useState<string>('');
  const [leaderPhone, setLeaderPhone] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [track, setTrack] = useState<string>('Healthcare');
  const [amountToPay, setAmountToPay] = useState<string>('700');
  const [paymentTime, setPaymentTime] = useState<string>('Within 48 Hours');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  const handleSelectRegisteredTeam = (regId: string) => {
    setSelectedRegTeamId(regId);
    if (!regId) return;

    const found = teams.find((t) => t.id === regId);
    if (found) {
      setTeamName(found.name);
      setLeaderName(found.leaderName);
      setLeaderEmail(found.leaderEmail);
      setLeaderPhone(found.leaderPhone);
      setCollege(found.college);
      setTrack(found.track);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTeam(null);
    setSelectedRegTeamId('');
    setTeamName('');
    setLeaderName('');
    setLeaderEmail('');
    setLeaderPhone('');
    setCollege('Jyothi Engineering College (Autonomous)');
    setTrack('Healthcare');
    setAmountToPay('700');
    setPaymentTime('Within 48 Hours');
    setPaymentStatus('Pending');
    setPaymentNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (st: SelectedTeam) => {
    setEditingTeam(st);
    setSelectedRegTeamId(st.teamId || '');
    setTeamName(st.teamName);
    setLeaderName(st.leaderName);
    setLeaderEmail(st.leaderEmail);
    setLeaderPhone(st.leaderPhone);
    setCollege(st.college || '');
    setTrack(st.track || 'Healthcare');
    setAmountToPay(String(st.amountToPay));
    setPaymentTime(st.paymentTime || 'Within 48 Hours');
    setPaymentStatus(st.paymentStatus || 'Pending');
    setPaymentNotes(st.paymentNotes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !leaderName.trim()) {
      showToast('Validation Error', 'Team Name and Leader Name are required.', 'alert');
      return;
    }

    const uniqueTeamId =
      editingTeam?.uniqueTeamId ||
      `Y26-SEL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const payload: SelectedTeam = {
      id: editingTeam?.id || uniqueTeamId,
      uniqueTeamId,
      teamId: selectedRegTeamId || editingTeam?.teamId,
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim(),
      leaderPhone: leaderPhone.trim(),
      college: college.trim(),
      track,
      amountToPay: amountToPay.trim() || '700',
      paymentTime: paymentTime.trim() || 'Within 48 Hours',
      paymentStatus,
      paymentNotes: paymentNotes.trim(),
      createdAt: editingTeam?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (firestoreDb) {
        if (editingTeam) {
          await updateFirestoreSelectedTeam(firestoreDb, payload);
          showToast('Updated Selected Team', `${payload.teamName} updated in Firestore`, 'success');
        } else {
          await addFirestoreSelectedTeam(firestoreDb, payload);
          showToast('Selected Team Added', `${payload.teamName} added with ID ${uniqueTeamId}`, 'success');
        }
      } else {
        showToast('Local Only', 'Firestore not initialized', 'info');
      }
      setIsAddModalOpen(false);
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to save selected team', 'alert');
    }
  };

  const handleToggleStatus = async (st: SelectedTeam) => {
    const nextStatus: PaymentStatus = st.paymentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      if (firestoreDb) {
        await updateSelectedTeamPaymentStatus(firestoreDb, st.id || st.uniqueTeamId, nextStatus);
        showToast('Payment Status Updated', `${st.teamName} set to ${nextStatus}`, 'success');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update status', 'alert');
    }
  };

  const handleDelete = async (st: SelectedTeam) => {
    if (!window.confirm(`Are you sure you want to delete selected team "${st.teamName}"?`)) return;
    try {
      if (firestoreDb) {
        await deleteFirestoreSelectedTeam(firestoreDb, st.id || st.uniqueTeamId);
        showToast('Deleted', `Team ${st.teamName} deleted`, 'warning');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to delete team', 'alert');
    }
  };

  const handleCopyLink = (st: SelectedTeam) => {
    const link = `https://yodha.aidajecc.in/pay?teamId=${encodeURIComponent(st.uniqueTeamId)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(st.uniqueTeamId);
    showToast('Payment Link Copied', `Copied payment link for ${st.teamName}`, 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter List
  const filteredTeams = selectedTeams.filter((st) => {
    const matchesSearch =
      st.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.uniqueTeamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.leaderEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || st.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTeams.map(st => st.id || st.uniqueTeamId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected team(s)?`)) {
      await bulkDeleteSelectedTeams(selectedIds);
      setSelectedIds([]);
    }
  };

  // Calculate Metrics
  const totalCount = selectedTeams.length;
  const pendingCount = selectedTeams.filter((s) => s.paymentStatus === 'Pending').length;
  const completedCount = selectedTeams.filter((s) => s.paymentStatus === 'Completed').length;

  const totalPendingAmount = selectedTeams
    .filter((s) => s.paymentStatus === 'Pending')
    .reduce((acc, s) => acc + (Number(s.amountToPay) || 0), 0);

  const totalCollectedAmount = selectedTeams
    .filter((s) => s.paymentStatus === 'Completed')
    .reduce((acc, s) => acc + (Number(s.amountToPay) || 0), 0);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Selected Teams & Payment Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage shortlisted teams, set payment amounts & deadlines, and track real-time portal payments.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Select Team</span>
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Selected Teams
          </span>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
          <p className="text-[11px] text-slate-500">Total shortlisted roster</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider block">
            Pending Payments
          </span>
          <div className="text-2xl font-bold text-amber-600">
            {pendingCount} <span className="text-sm text-slate-500 font-normal">(₹{totalPendingAmount.toLocaleString()})</span>
          </div>
          <p className="text-[11px] text-slate-500">Awaiting candidate payment</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider block">
            Collected Amount
          </span>
          <div className="text-2xl font-bold text-emerald-600">
            ₹{totalCollectedAmount.toLocaleString()} <span className="text-sm text-slate-500 font-normal">({completedCount} Paid)</span>
          </div>
          <p className="text-[11px] text-slate-500">Confirmed team fees</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider block">
            Payment Conversion
          </span>
          <div className="text-2xl font-bold text-blue-600">
            {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-500">Completion rate</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team name, leader, email, or Unique ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDeleteSelected}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
            </button>
          )}

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['All', 'Pending', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE SECTION - FULL LIST, S.NO TIME ORDERED, MULTI-SELECT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTeams.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-600">No shortlisted / selected teams found.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Shortlist a team from the Teams tab or click "Add / Select Team" above to create a entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredTeams.length > 0 && selectedIds.length === filteredTeams.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 w-12 text-slate-400">#</th>
                  <th className="py-3.5 px-4">Unique Team ID</th>
                  <th className="py-3.5 px-4">Team Name</th>
                  <th className="py-3.5 px-4">Leader Details</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Time</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-medium">
                {filteredTeams.map((st, index) => {
                  const isSelected = selectedIds.includes(st.id) || selectedIds.includes(st.uniqueTeamId);
                  return (
                    <tr
                      key={st.id || st.uniqueTeamId}
                      className={`transition-colors ${isSelected ? 'bg-slate-100/70' : 'hover:bg-slate-50/70'}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(st.id || st.uniqueTeamId)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* S.No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* UNIQUE TEAM ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded border border-slate-800 shadow-2xs">
                            {st.uniqueTeamId}
                          </span>
                          <button
                            onClick={() => handleCopyLink(st)}
                            title="Copy Payment Portal URL"
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            {copiedId === st.uniqueTeamId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* TEAM NAME */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{st.teamName}</div>
                        {st.track && (
                          <span className="text-[10px] text-slate-400 font-normal block">{st.track}</span>
                        )}
                      </td>

                      {/* LEADER DETAILS */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900">{st.leaderName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{st.leaderEmail}</div>
                          {st.leaderPhone && (
                            <div className="text-[10px] text-slate-400 font-mono">{st.leaderPhone}</div>
                          )}
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        ₹{st.amountToPay}
                      </td>

                      {/* PAYMENT TIME */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono whitespace-nowrap">
                        {st.paymentTime}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(st)}
                          title="Click to toggle payment status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                            st.paymentStatus === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {st.paymentStatus === 'Completed' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyLink(st)}
                            title="Copy Portal Link"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(st)}
                            title="Edit Details"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(st)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTeam ? 'Edit Selected Team Payment Details' : 'Add / Select Team for Payment'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              {/* SELECT FROM REGISTERED TEAMS DROPDOWN */}
              {!editingTeam && teams.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Select from Registered Teams (Auto-fill)
                  </label>
                  <select
                    value={selectedRegTeamId}
                    onChange={(e) => handleSelectRegisteredTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="">-- Choose a team from registration list --</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.leaderName} - {t.college})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* TEAM NAME */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. CyberWarriors"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* LEADER NAME & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Leader Email</label>
                  <input
                    type="email"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="leader@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* LEADER PHONE & TRACK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Leader Phone</label>
                  <input
                    type="text"
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Track</label>
                  <input
                    type="text"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder="Healthcare AI"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* AMOUNT TO PAY & PAYMENT TIME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Amount Needed to be Paid (₹) *</label>
                  <input
                    type="text"
                    required
                    value={amountToPay}
                    onChange={(e) => setAmountToPay(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Payment Time / Deadline *</label>
                  <input
                    type="text"
                    required
                    value={paymentTime}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    placeholder="Within 48 Hours"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
              </div>

              {/* PAYMENT STATUS */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Initial Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-medium text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 shadow-xs cursor-pointer"
                >
                  {editingTeam ? 'Save Changes' : 'Create & Generate Portal Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedTeamsPage;
