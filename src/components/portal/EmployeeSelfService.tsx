import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Calendar,
  Clock,
  FileText,
  Download,
  CheckCircle2,
  Play,
  Square,
} from 'lucide-react';
import { LeaveType, PayrollRecord } from '../../types';

export const EmployeeSelfService: React.FC = () => {
  const {
    currentUser,
    employees,
    payrollRecords,
    leaveRequests,
    submitLeaveRequest,
    attendanceRecords,
    logAttendance,
  } = useApp();

  const myEmployee = employees.find((e) => e.email === currentUser.email) || employees[0];
  const myPayroll = payrollRecords.filter((p) => p.employeeId === myEmployee.id);
  const myLeaveRequests = leaveRequests.filter((l) => l.employeeId === myEmployee.id);
  const myAttendance = attendanceRecords.filter((a) => a.employeeId === myEmployee.id);

  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('2026-10-20');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [daysCount, setDaysCount] = useState(3);
  const [reason, setReason] = useState('');
  const [handbookDownloaded, setHandbookDownloaded] = useState(false);

  // Virtual clock state
  const [clockedIn, setClockedIn] = useState(false);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      organizationId: myEmployee.organizationId,
      organizationName: myEmployee.organizationName,
      employeeId: myEmployee.id,
      employeeName: myEmployee.name,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
    });
    setLeaveModalOpen(false);
    setReason('');
  };

  const handleClockToggle = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockedIn(!clockedIn);
    logAttendance({
      organizationId: myEmployee.organizationId,
      employeeId: myEmployee.id,
      employeeName: myEmployee.name,
      date: new Date().toISOString().split('T')[0],
      checkIn: clockedIn ? '09:00 AM' : timeStr,
      checkOut: clockedIn ? timeStr : '--:--',
      status: 'Present',
      workHours: clockedIn ? 8.5 : 0,
      notes: clockedIn ? 'Shift completed' : 'Self-service mobile clock-in',
    });
  };

  const handleDownloadHandbook = () => {
    setHandbookDownloaded(true);
    const content = `Accounticca HRM Solutions - Official Employee Handbook (2026 Edition)
Organization: ${myEmployee.organizationName}
Employee: ${myEmployee.name} (${myEmployee.employeeCode})
Department: ${myEmployee.department}

1. Code of Conduct & Confidentiality
2. Working Hours, Attendance & Remote Work Policy
3. Annual, Sick & Casual Leave Entitlements
4. Performance Appraisal & Career Progression
5. Anti-Harassment & Grievance Redressal Procedure
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${myEmployee.organizationName.replace(/\s+/g, '_')}_Employee_Handbook_2026.txt`;
    a.click();
    setTimeout(() => setHandbookDownloaded(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-white to-slate-50 dark:from-blue-950 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={myEmployee.photo}
            alt={myEmployee.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">{myEmployee.name}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                {myEmployee.employeeCode}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {myEmployee.designation} &bull; {myEmployee.department}
            </p>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{myEmployee.organizationName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleClockToggle}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 ${
              clockedIn
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {clockedIn ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{clockedIn ? 'Clock Out' : 'Clock In Now'}</span>
          </button>

          <button
            onClick={() => setLeaveModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md"
          >
            Request Time Off
          </button>
        </div>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm dark:shadow-none">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Annual Leave Available</div>
          <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-serif mt-1">
            {myEmployee.leaveBalance.annual} Days
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Accrues 1.5 days / month</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm dark:shadow-none">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sick Leave Available</div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-serif mt-1">
            {myEmployee.leaveBalance.sick} Days
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Medical certificate required &gt; 2 days</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm dark:shadow-none">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Casual Leave Available</div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-serif mt-1">
            {myEmployee.leaveBalance.casual} Days
          </div>
          <div className="text-[10px] text-slate-500 mt-1">For personal emergencies</div>
        </div>
      </div>

      {/* Payslips & Documents Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Payslips */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>My Digital Payslips</span>
            </h3>

            <div className="space-y-2.5">
              {myPayroll.map((pay) => (
                <div
                  key={pay.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {pay.month} {pay.year} Payslip
                    </div>
                    <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                      Net Pay: BDT {pay.netSalary.toLocaleString()} (Gross: BDT {pay.grossSalary.toLocaleString()})
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePayslip(pay)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/15 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View & Print</span>
                  </button>
                </div>
              ))}
              {myPayroll.length === 0 && (
                <div className="text-xs text-slate-500 text-center py-4">No payslips issued yet.</div>
              )}
            </div>
          </div>

          {/* My Leave Requests History */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>My Leave Requests</span>
            </h3>

            <div className="space-y-2.5">
              {myLeaveRequests.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-xs">{l.leaveType}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {l.startDate} to {l.endDate} ({l.daysCount} Days)
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      l.status === 'Approved'
                        ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : l.status === 'Rejected'
                        ? 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                        : 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance & Policy Quick Links */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Recent Shift Clock History</span>
            </h3>

            <div className="space-y-2 text-xs">
              {myAttendance.slice(0, 4).map((att) => (
                <div key={att.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{att.date}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{att.notes || 'Normal Day Shift'}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{att.checkIn} - {att.checkOut}</span>
                    <span className="block text-[10px] text-slate-500">{att.workHours} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Company Handbook & Policies</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Access your signed employment handbook, code of conduct, and leave policy documents.
            </p>
            <button
              onClick={handleDownloadHandbook}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {handbookDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Handbook Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Employee Handbook (2026 Edition)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Apply for Leave / Time Off</h3>
            <form onSubmit={handleApplyLeave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Annual Leave">Annual Leave ({myEmployee.leaveBalance.annual} left)</option>
                  <option value="Sick Leave">Sick Leave ({myEmployee.leaveBalance.sick} left)</option>
                  <option value="Casual Leave">Casual Leave ({myEmployee.leaveBalance.casual} left)</option>
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
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Reason & Coverage Plan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Reason for time off and teammate covering urgent inquiries..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
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

      {/* Payslip Viewer Modal */}
      {activePayslip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-950">Official Payslip</h3>
                <p className="text-xs text-slate-500">Accounticca HRM Solutions &bull; {activePayslip.organizationName}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-blue-700">{activePayslip.month} {activePayslip.year}</div>
                <div className="text-[10px] text-slate-500 font-mono">Ref: #{activePayslip.id}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-slate-200">
              <div>
                <span className="text-slate-500">Employee:</span>
                <div className="font-bold text-slate-900">{activePayslip.employeeName}</div>
                <div className="text-slate-500">{activePayslip.department}</div>
              </div>
              <div>
                <span className="text-slate-500">Payment Status:</span>
                <div className="font-bold text-emerald-600">{activePayslip.paymentStatus}</div>
                <div className="text-slate-500">Payment Date: {activePayslip.paymentDate || 'End of Month'}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs py-2">
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span className="font-mono font-medium">BDT {activePayslip.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent & Living:</span>
                <span className="font-mono font-medium">BDT {activePayslip.allowances.houseRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Medical & Conveyance:</span>
                <span className="font-mono font-medium">BDT {(activePayslip.allowances.medical + activePayslip.allowances.conveyance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-600 border-t border-slate-100 pt-1">
                <span>Tax & Deductions:</span>
                <span className="font-mono font-medium">-BDT {activePayslip.totalDeductions.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Net Pay Transferred</div>
                <div className="text-2xl font-bold font-serif text-slate-950">BDT {activePayslip.netSalary.toLocaleString()}</div>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold"
              >
                Print PDF
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActivePayslip(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
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
