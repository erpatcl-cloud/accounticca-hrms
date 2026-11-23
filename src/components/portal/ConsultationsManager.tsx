import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConsultationRequest, ConsultationStatus } from '../../types';
import { Search, X } from 'lucide-react';

export const ConsultationsManager: React.FC = () => {
  const { consultations, updateConsultationStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<ConsultationRequest | null>(null);
  const [consultantAssignee, setConsultantAssignee] = useState('Farzana Chowdhury');
  const [notesInput, setNotesInput] = useState('');

  const STATUSES: ConsultationStatus[] = [
    'New',
    'Contacted',
    'Consultation Scheduled',
    'Completed',
    'Proposal Sent',
    'Converted',
    'Closed',
  ];

  const filtered = consultations.filter((c) => {
    const matchesQuery =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  const handleUpdate = (status: ConsultationStatus) => {
    if (!selectedBooking) return;
    updateConsultationStatus(selectedBooking.id, status, notesInput || selectedBooking.notes, consultantAssignee);
    setSelectedBooking({
      ...selectedBooking,
      status,
      notes: notesInput || selectedBooking.notes,
      assignedConsultant: consultantAssignee,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Consultation Booking Requests
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage discovery meetings, assign senior consultants, and track conversion workflows
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by client name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Client / Company</th>
                <th className="px-4 py-3 font-semibold">Contact Info</th>
                <th className="px-4 py-3 font-semibold">Required Service</th>
                <th className="px-4 py-3 font-semibold">Scheduled Date & Time</th>
                <th className="px-4 py-3 font-semibold">Assigned Consultant</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    setSelectedBooking(item);
                    setConsultantAssignee(item.assignedConsultant);
                    setNotesInput(item.notes);
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white">{item.companyName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.fullName} ({item.designation})
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800 dark:text-slate-200">{item.email}</div>
                    <div className="text-[10px] text-slate-500">{item.phone}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate font-medium text-slate-800 dark:text-slate-200">
                    {item.requiredService}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900 dark:text-white font-medium">{item.preferredDate}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.preferredTime}</div>
                  </td>
                  <td className="px-4 py-3 text-teal-600 dark:text-teal-400 font-medium">
                    {item.assignedConsultant}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'New'
                          ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : item.status === 'Converted'
                          ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Consultation Booking #{selectedBooking.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedBooking.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Client Contact:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {selectedBooking.fullName} ({selectedBooking.designation})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Email:</span>
                  <span className="text-blue-600 dark:text-blue-400">{selectedBooking.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                  <span className="text-slate-900 dark:text-white">{selectedBooking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Industry & Size:</span>
                  <span className="text-slate-900 dark:text-white">
                    {selectedBooking.industry} &bull; {selectedBooking.companySize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Service:</span>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">{selectedBooking.requiredService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Requested Slot:</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {selectedBooking.preferredDate} ({selectedBooking.preferredTime})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client Stated Requirements:
                </label>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
                  "{selectedBooking.message}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assign HR Consultant:
                  </label>
                  <select
                    value={consultantAssignee}
                    onChange={(e) => setConsultantAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Farzana Chowdhury">Farzana Chowdhury (Lead Advisory)</option>
                    <option value="Ekramul Haque">Ekramul Haque (Managing Director)</option>
                    <option value="Tariq Al-Mansoor">Tariq Al-Mansoor (Talent Acquisition)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Update Booking Status:
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdate(e.target.value as ConsultationStatus)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consultant Notes & Calendar Link:
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Meeting agenda, Google Meet link, or proposal notes..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate(selectedBooking.status);
                    setSelectedBooking(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save & Notify Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
