import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveType } from '../../types';
import {
  Plus,
  X,
  Play,
  Square,
} from 'lucide-react';

export const LeaveAttendanceManager: React.FC = () => {
  const {
    attendanceRecords,
    logAttendance,
    leaveRequests,
    submitLeaveRequest,
    reviewLeaveRequest,
    currentUser,
    selectedOrgIdFilter,
  } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const isEmployee = currentUser.role === 'employee';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'leave'>('attendance');
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  // Clock in simulator state
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  // Leave request form
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-17');
  const [daysCount, setDaysCount] = useState(3);
  const [leaveReason, setLeaveReason] = useState('');

  const filteredAttendance = attendanceRecords.filter((a) => {
    if (isEmployee) {
      return a.employeeId === currentUser.id || a.employeeName === currentUser.name;
    }
    return targetOrgId === 'all' || a.organizationId === targetOrgId;
  });

  const filteredLeave = leaveRequests.filter((l) => {
    if (isEmployee) {
      return l.employeeId === currentUser.id || l.employeeName === currentUser.name;
    }
    return targetOrgId === 'all' || l.organizationId === targetOrgId;
  });

  const handleToggleClock = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!clockedIn) {
      setClockedIn(true);
      setClockInTime(timeStr);
      logAttendance({
        organizationId: currentUser.organizationId,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        checkIn: timeStr,
        checkOut: '--:--',
        status: 'Present',
        workHours: 0,
        notes: 'Clocked in via portal',
      });
    } else {
      setClockedIn(false);
      logAttendance({
        organizationId: currentUser.organizationId,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        checkIn: clockInTime || '09:00 AM',
        checkOut: timeStr,
        status: 'Present',
        workHours: 8.5,
        notes: 'Clocked out successfully',
      });
    }
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      organizationId: currentUser.organizationId,
      organizationName: currentUser.organizationName,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason: leaveReason,
    });
    setLeaveModalOpen(false);
    setLeaveReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Leave & Attendance Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Shift logging, clock in/out tracking, and employee leave approval workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Virtual Clock In/Out Button */}
          <button
            onClick={handleToggleClock}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all ${
              clockedIn
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {clockedIn ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Clock Out ({clockInTime})</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Quick Clock In</span>
              </>
            )}
          </button>

          <button
            onClick={() => setLeaveModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Request Time-Off</span>
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'attendance'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Daily Attendance Logs ({filteredAttendance.length})
        </button>
        <button
          onClick={() => setActiveSubTab('leave')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'leave'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Leave Requests & Approvals ({filteredLeave.length})
        </button>
      </div>

      {activeSubTab === 'attendance' ? (
        /* Attendance Table */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Check-In</th>
                  <th className="px-4 py-3 font-semibold">Check-Out</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Hours Logged</th>
                  <th className="px-4 py-3 font-semibold">Notes / Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{rec.employeeName}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{rec.date}</td>
                    <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">{rec.checkIn}</td>
                    <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400">{rec.checkOut}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : rec.status === 'Late'
                            ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : rec.status === 'Remote'
                            ? 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-900 dark:text-white">{rec.workHours} hrs</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{rec.notes || 'Normal Day Shift'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leave Requests Table */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Leave Type</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Days</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredLeave.map((lv) => (
                  <tr key={lv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{lv.employeeName}</td>
                    <td className="px-4 py-3 text-teal-600 dark:text-teal-400 font-medium">{lv.leaveType}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {lv.startDate} &rarr; {lv.endDate}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{lv.daysCount} Days</td>
                    <td className="px-4 py-3 max-w-[220px] truncate text-slate-700 dark:text-slate-300">
                      {lv.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          lv.status === 'Approved'
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : lv.status === 'Rejected'
                            ? 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {lv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {lv.status === 'Pending' && !isEmployee ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reviewLeaveRequest(lv.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-600/15 dark:bg-emerald-600/20 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-400 hover:text-white rounded-lg text-xs font-semibold transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reviewLeaveRequest(lv.id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-600/15 dark:bg-rose-600/20 hover:bg-rose-600 text-rose-700 dark:text-rose-400 hover:text-white rounded-lg text-xs font-semibold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">{lv.reviewerNotes || 'Completed'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Apply for Leave / Time Off</h3>
              <button onClick={() => setLeaveModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Annual Leave">Annual Paid Leave</option>
                  <option value="Sick Leave">Sick / Medical Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity/Paternity">Maternity / Paternity Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Total Days</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline the reason and handoff coverage plan..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
