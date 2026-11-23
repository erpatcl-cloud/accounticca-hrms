import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import {
  Plus,
  Printer,
  X,
} from 'lucide-react';

export const InvoicesManager: React.FC = () => {
  const { invoices, createInvoice, updateInvoiceStatus, currentUser, selectedOrgIdFilter, organizations } = useApp();

  const isClientAdmin = currentUser.role === 'client_admin';
  const targetOrgId = isClientAdmin ? currentUser.organizationId : selectedOrgIdFilter;

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Invoice form state
  const [clientName, setClientName] = useState('Apex Technologies');
  const [service, setService] = useState('Corporate HR Retainer (Monthly)');
  const [subtotal, setSubtotal] = useState(6500);
  const [taxRate, setTaxRate] = useState(8);
  const [dueDate, setDueDate] = useState('2026-10-31');

  const filteredInvoices = invoices.filter(
    (inv) => targetOrgId === 'all' || inv.organizationId === targetOrgId
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const total = subtotal + taxAmount;
    const invNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    createInvoice({
      invoiceNumber: invNumber,
      organizationId: isClientAdmin ? currentUser.organizationId : 'org_apex',
      clientName,
      service,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      subtotal,
      taxRate,
      taxAmount,
      discount: 0,
      total,
      status: 'Sent',
    });

    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Invoicing & Billing Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Retainer invoices, ATS placement commissions, and payment audit logs
          </p>
        </div>

        {currentUser.role !== 'client_admin' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Invoice</span>
          </button>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice Number</th>
                <th className="px-4 py-3 font-semibold">Client Organization</th>
                <th className="px-4 py-3 font-semibold">Service Description</th>
                <th className="px-4 py-3 font-semibold">Issue Date</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Total Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{inv.clientName}</td>
                  <td className="px-4 py-3 max-w-[220px] truncate text-slate-700 dark:text-slate-300">{inv.service}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{inv.issueDate}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{inv.dueDate}</td>
                  <td className="px-4 py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                    BDT {inv.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() =>
                        updateInvoiceStatus(inv.id, inv.status === 'Paid' ? 'Sent' : 'Paid')
                      }
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8">
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-950">Accounticca HRM Solutions</h3>
                <p className="text-xs text-slate-500">Corporate Consulting & Advisory LLC</p>
                <p className="text-xs text-slate-500">Tax ID: #US-8829-4109</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-blue-700 font-mono block">
                  {selectedInvoice.invoiceNumber}
                </span>
                <span className="text-xs text-slate-500">Status: {selectedInvoice.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-5 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-500 font-medium block">Billed To:</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{selectedInvoice.clientName}</strong>
                <span className="text-slate-600 block">Corporate Client Account</span>
              </div>
              <div className="text-right space-y-1">
                <div>Issue Date: <strong>{selectedInvoice.issueDate}</strong></div>
                <div>Payment Due: <strong>{selectedInvoice.dueDate}</strong></div>
              </div>
            </div>

            <div className="py-5">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-medium text-slate-900">{selectedInvoice.service}</td>
                    <td className="py-3 text-right font-mono">BDT {selectedInvoice.subtotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 border-t border-slate-200 space-y-1.5 text-xs text-right">
                <div>Subtotal: <span className="font-mono">BDT {selectedInvoice.subtotal.toLocaleString()}</span></div>
                <div>Tax ({selectedInvoice.taxRate}%): <span className="font-mono">BDT {selectedInvoice.taxAmount.toLocaleString()}</span></div>
                <div className="text-base font-bold text-slate-950 pt-2 border-t border-slate-200">
                  Total Due: <span className="font-mono">BDT {selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Create Client Invoice</h3>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Client Organization *</label>
                <select
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.name}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Service Rendered</label>
                <input
                  type="text"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Subtotal (BDT)</label>
                  <input
                    type="number"
                    required
                    value={subtotal}
                    onChange={(e) => setSubtotal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
