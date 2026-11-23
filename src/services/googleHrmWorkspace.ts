import {
  AttendanceRecord,
  DocumentItem,
  Employee,
  LeaveRequest,
  Organization,
  PayrollRecord,
  PerformanceReview,
} from '../types';
import { ACCOUNTICCA_CLIENT_DATA_FOLDER_ID } from '../utils/googleAuth';

const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

export const EMPLOYEE_HRM_TABS = [
  '1_Profile',
  '2_Salary_Payroll',
  '3_Attendance_Leave',
  '4_Performance_Training',
  '5_Banking_Documents',
] as const;

export const MASTER_EMPLOYEE_SHEET_HEADERS = [
  'HR ID',
  'Full Name (Official / NID)',
  'Department',
  'Bank Name',
  'Branch Code',
  'Bank Account No.',
  'Product Code',
  'Gross Salary (Tk.)',
  'Joining Date',
  'Personal Phone',
  'Official Phone',
  'Requested Phone Numbers',
  'Emergency Contact',
  'Personal Email',
  'Official Email',
  'Personal NID Number',
  'Date of Birth',
  'Blood Group',
  'Passport No.',
  'Contact Address',
  'Nominee Name',
  'Nominee Phone',
  'Nominee DOB',
  'Photo Link',
  'NID Copy Link',
  'Passport Copy Link',
  'Nominee Photo Link',
  'Nominee ID Link',
] as const;

export function buildMasterEmployeeRow(emp: Employee): string[] {
  const basic = emp.salaryBreakdowns?.basicSalary || emp.basicSalary || 0;
  const allow = emp.allowances || 0;
  const gross = emp.salaryBreakdowns?.grossSalary || basic + allow;
  return [
    emp.employeeCode || '—',
    emp.name || '—',
    emp.department || '—',
    emp.bankingProfile?.bankName || '—',
    emp.bankingProfile?.bankBranchCode || '—',
    emp.bankingProfile?.bankAccountNo || '—',
    emp.bankingProfile?.bankProductCode || '—',
    gross ? gross.toLocaleString() : '0',
    emp.joiningDate || '—',
    emp.personalMobileNumber || '—',
    emp.phone || '—',
    emp.requestedPhoneNumbers || '—',
    emp.emergencyContact || '—',
    emp.personalEmailAddress || '—',
    emp.email || '—',
    emp.nid || '—',
    emp.dob || '—',
    emp.bloodGroup || '—',
    emp.passportNumber || '—',
    emp.presentAddress || emp.permanentAddress || '—',
    emp.nominee || '—',
    emp.nomineePhone || '—',
    emp.nomineeDob || '—',
    emp.photo || '—',
    emp.nidCopyLink || '—',
    emp.passportCopyLink || '—',
    emp.nomineePhotoLink || '—',
    emp.nomineeIdLink || '—',
  ];
}

export interface EmployeeWorkspaceRecord {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  organizationId: string;
  companyFolderId: string;
  employeeFolderId: string;
  employeeFolderUrl: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  tabs: string[];
  lastSyncedAt: string;
}

export interface EmployeeHrmContext {
  payrollRecords: PayrollRecord[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  performanceReviews: PerformanceReview[];
  documents: DocumentItem[];
}

export async function findOrCreateDriveFolder(
  accessToken: string,
  folderName: string,
  parentId?: string
): Promise<{ id: string; name: string; webViewLink: string }> {
  const escaped = folderName.replace(/'/g, "\\'");
  let q = `mimeType='application/vnd.google-apps.folder' and name='${escaped}' and trashed=false`;
  if (parentId) {
    q += ` and '${parentId}' in parents`;
  }

  const searchRes = await fetch(
    `${DRIVE_API}?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&pageSize=5`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!searchRes.ok) {
    throw new Error(`Drive search failed (${searchRes.status}): ${await searchRes.text()}`);
  }
  const searchData = await searchRes.json();
  if (searchData.files?.length > 0) {
    const f = searchData.files[0];
    return {
      id: f.id,
      name: f.name,
      webViewLink: f.webViewLink || `https://drive.google.com/drive/folders/${f.id}`,
    };
  }

  const body: Record<string, unknown> = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) body.parents = [parentId];

  const createRes = await fetch(`${DRIVE_API}?fields=id,name,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!createRes.ok) {
    throw new Error(`Drive folder create failed (${createRes.status}): ${await createRes.text()}`);
  }
  const created = await createRes.json();
  return {
    id: created.id,
    name: created.name,
    webViewLink: created.webViewLink || `https://drive.google.com/drive/folders/${created.id}`,
  };
}

async function findSpreadsheetInFolder(
  accessToken: string,
  title: string,
  folderId: string
): Promise<{ id: string; url: string } | null> {
  const escaped = title.replace(/'/g, "\\'");
  const q = `mimeType='application/vnd.google-apps.spreadsheet' and name='${escaped}' and '${folderId}' in parents and trashed=false`;
  const res = await fetch(
    `${DRIVE_API}?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&pageSize=3`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.files?.length > 0) {
    const f = data.files[0];
    return {
      id: f.id,
      url: f.webViewLink || `https://docs.google.com/spreadsheets/d/${f.id}`,
    };
  }
  return null;
}

async function moveFileToFolder(accessToken: string, fileId: string, folderId: string) {
  const metaRes = await fetch(`${DRIVE_API}/${fileId}?fields=parents`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!metaRes.ok) return;
  const meta = await metaRes.json();
  const prevParents = (meta.parents || []).join(',');
  await fetch(
    `${DRIVE_API}/${fileId}?addParents=${encodeURIComponent(folderId)}${
      prevParents ? `&removeParents=${encodeURIComponent(prevParents)}` : ''
    }`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

async function createEmployeeMasterSheet(
  accessToken: string,
  title: string,
  folderId: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const existing = await findSpreadsheetInFolder(accessToken, title, folderId);
  if (existing) {
    return { spreadsheetId: existing.id, spreadsheetUrl: existing.url };
  }

  const res = await fetch(SHEETS_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: EMPLOYEE_HRM_TABS.map((tabName) => ({
        properties: { title: tabName, gridProperties: { frozenRowCount: 1 } },
      })),
    }),
  });
  if (!res.ok) {
    throw new Error(`Spreadsheet create failed (${res.status}): ${await res.text()}`);
  }
  const created = await res.json();
  await moveFileToFolder(accessToken, created.spreadsheetId, folderId);
  return {
    spreadsheetId: created.spreadsheetId,
    spreadsheetUrl:
      created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}`,
  };
}

/**
 * Provisions or syncs:
 * Accounticca Client Data (1AumdWXQmtP6gsjNJaeuP1oG3NLp_AQVe)
 *   -> [Company Name]
 *      -> Employees
 *         -> [EMP-Code] - [Employee Name] (One Dedicated Folder)
 *            -> [EMP-Code] - [Employee Name] - Master HRM Sheet (5 Tabs)
 */
export async function provisionEmployeeHrmWorkspace(
  accessToken: string,
  org: Organization,
  employee: Employee,
  ctx: EmployeeHrmContext,
  existing?: EmployeeWorkspaceRecord
): Promise<EmployeeWorkspaceRecord> {
  const companyFolder = await findOrCreateDriveFolder(
    accessToken,
    org.name,
    ACCOUNTICCA_CLIENT_DATA_FOLDER_ID
  );
  const employeesRootFolder = await findOrCreateDriveFolder(
    accessToken,
    'Employees',
    companyFolder.id
  );
  const empFolderName = `${employee.employeeCode} - ${employee.name}`;
  const employeeFolder = await findOrCreateDriveFolder(
    accessToken,
    empFolderName,
    employeesRootFolder.id
  );

  const sheetTitle = `${employee.employeeCode} - ${employee.name} - Master HRM Sheet`;
  let spreadsheetId = existing?.spreadsheetId || '';
  let spreadsheetUrl = existing?.spreadsheetUrl || '';

  if (!spreadsheetId) {
    const createdSheet = await createEmployeeMasterSheet(
      accessToken,
      sheetTitle,
      employeeFolder.id
    );
    spreadsheetId = createdSheet.spreadsheetId;
    spreadsheetUrl = createdSheet.spreadsheetUrl;
  }

  // Build 5 HRM tabs
  const basic = employee.salaryBreakdowns?.basicSalary || employee.basicSalary || 0;
  const allow = employee.allowances || 0;
  const gross = employee.salaryBreakdowns?.grossSalary || basic + allow;
  const ded = employee.deductions || 0;
  const net = gross - ded;

  const profileRows = [
    [...MASTER_EMPLOYEE_SHEET_HEADERS],
    buildMasterEmployeeRow(employee),
  ];

  const empPayrolls = ctx.payrollRecords.filter((p) => p.employeeId === employee.id);
  const payrollRows = [
    ['Month / Period', 'Basic (BDT)', 'Allowances (BDT)', 'Gross (BDT)', 'Deductions (BDT)', 'Net Pay (BDT)', 'Status'],
    [
      'Current Structure',
      basic,
      allow,
      gross,
      ded,
      net,
      employee.status,
    ],
    ...empPayrolls.map((p) => {
      const totalAllow =
        (p.allowances?.houseRent || 0) +
        (p.allowances?.medical || 0) +
        (p.allowances?.conveyance || 0) +
        (p.allowances?.specialBonus || 0);
      const totalDed =
        typeof p.deductions === 'number'
          ? p.deductions
          : Object.values(p.deductions || {}).reduce((s: number, v) => s + (Number(v) || 0), 0);
      return [
        p.month,
        p.basicSalary,
        totalAllow,
        p.basicSalary + totalAllow,
        totalDed,
        p.netSalary,
        p.paymentStatus,
      ];
    }),
  ];

  const empAttendance = ctx.attendanceRecords.filter((a) => a.employeeId === employee.id);
  const empLeaves = ctx.leaveRequests.filter((l) => l.employeeId === employee.id);
  const attendanceLeaveRows = [
    ['Record Type', 'Date / Period', 'Detail', 'Check In / Days', 'Check Out / Reason', 'Status'],
    ...empAttendance.map((a) => [
      'Attendance',
      a.date,
      `${a.workHours} hrs`,
      a.checkIn || '—',
      a.checkOut || '—',
      a.status,
    ]),
    ...empLeaves.map((l) => [
      'Leave',
      `${l.startDate} to ${l.endDate}`,
      l.leaveType,
      `${l.daysCount} day(s)`,
      l.reason || '—',
      l.status,
    ]),
  ];

  const empReviews = ctx.performanceReviews.filter((r) => r.employeeId === employee.id);
  const perfTrainingRows = [
    ['Period', 'Reviewer', 'Rating', 'KPI / Goals', 'Status'],
    ...empReviews.map((r) => [
      r.reviewPeriod,
      r.department,
      r.finalScore,
      r.strengths || '—',
      r.status,
    ]),
  ];

  const empDocs = ctx.documents.filter((d) => d.organizationId === org.id);
  const bankingDocRows = [
    ['Category', 'Title / Field', 'Value / Reference', 'Status / Updated'],
    ['Banking', 'Bank Name', employee.bankingProfile?.bankName || '—', 'Active'],
    ['Banking', 'Bank Account No', employee.bankingProfile?.bankAccountNo || '—', 'Active'],
    ['Tax', 'e-TIN', employee.bankingProfile?.tin || '—', 'Active'],
    ...empDocs.map((d) => [
      'Document',
      d.title,
      d.category,
      d.uploadDate,
    ]),
  ];

  const batchRes = await fetch(`${SHEETS_API}/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: '1_Profile!A1', values: profileRows },
        { range: '2_Salary_Payroll!A1', values: payrollRows },
        { range: '3_Attendance_Leave!A1', values: attendanceLeaveRows },
        { range: '4_Performance_Training!A1', values: perfTrainingRows },
        { range: '5_Banking_Documents!A1', values: bankingDocRows },
      ],
    }),
  });
  if (!batchRes.ok) {
    throw new Error(`Sheet sync failed (${batchRes.status}): ${await batchRes.text()}`);
  }

  return {
    employeeId: employee.id,
    employeeCode: employee.employeeCode,
    employeeName: employee.name,
    organizationId: org.id,
    companyFolderId: companyFolder.id,
    employeeFolderId: employeeFolder.id,
    employeeFolderUrl: employeeFolder.webViewLink,
    spreadsheetId,
    spreadsheetUrl,
    tabs: [...EMPLOYEE_HRM_TABS],
    lastSyncedAt: new Date().toISOString(),
  };
}

export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match?.[1]) return match[1];
  return trimmed;
}

export async function fetchGoogleSheetRows(
  accessToken: string,
  spreadsheetUrlOrId: string,
  sheetTabName?: string
): Promise<{
  spreadsheetId: string;
  title: string;
  sheetName: string;
  headers: string[];
  rows: string[][];
}> {
  const spreadsheetId = extractSpreadsheetId(spreadsheetUrlOrId);
  if (!spreadsheetId) {
    throw new Error('Please enter a valid Google Sheet URL or Spreadsheet ID.');
  }

  const metaRes = await fetch(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties.title`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!metaRes.ok) {
    throw new Error(`Unable to read Google Sheet (${metaRes.status}): ${await metaRes.text()}`);
  }
  const meta = await metaRes.json();
  const title: string = meta.properties?.title || 'Google Sheet';
  const firstTab: string = meta.sheets?.[0]?.properties?.title || 'Sheet1';
  const targetTab = (sheetTabName || '').trim() || firstTab;

  const valRes = await fetch(
    `${SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(`${targetTab}!A1:AZ500`)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!valRes.ok) {
    throw new Error(`Unable to read tab "${targetTab}" (${valRes.status}): ${await valRes.text()}`);
  }
  const valData = await valRes.json();
  const allRows: string[][] = Array.isArray(valData.values) ? valData.values : [];
  if (allRows.length === 0) {
    throw new Error(`No rows found in tab "${targetTab}".`);
  }

  const headers = allRows[0].map((h) => String(h || '').trim());
  const rows = allRows
    .slice(1)
    .filter((r) => Array.isArray(r) && r.some((cell) => String(cell ?? '').trim() !== ''));

  return { spreadsheetId, title, sheetName: targetTab, headers, rows };
}

export interface ParsedSheetEmployee {
  employee: Omit<Employee, 'id'>;
  isDuplicate: boolean;
}

export function mapSheetRowsToEmployees(
  headers: string[],
  rows: string[][],
  org: { id: string; name: string },
  existingEmployees: Employee[]
): ParsedSheetEmployee[] {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const headerIndex = new Map<string, number>();
  headers.forEach((h, i) => headerIndex.set(norm(h), i));

  const getCell = (row: string[], ...aliases: string[]): string => {
    for (const alias of aliases) {
      const idx = headerIndex.get(norm(alias));
      if (idx !== undefined && row[idx] !== undefined) {
        const val = String(row[idx]).trim();
        if (val && val !== '—' && val !== '-') return val;
      }
    }
    return '';
  };

  const existingCodes = new Set(
    existingEmployees
      .filter((e) => e.organizationId === org.id)
      .map((e) => e.employeeCode.trim().toLowerCase())
  );

  const results: ParsedSheetEmployee[] = [];

  rows.forEach((row, idx) => {
    const fullName = getCell(row, 'Full Name (Official / NID)', 'Full Name', 'Name', 'Employee Name');
    const hrIdRaw = getCell(row, 'HR ID', 'Employee Code', 'Emp Code', 'ID');
    if (!fullName && !hrIdRaw) return;

    const employeeCode = hrIdRaw || `EMP-${String(idx + 1).padStart(3, '0')}`;
    const name = fullName || employeeCode;
    const department = getCell(row, 'Department', 'Dept') || 'Operations';
    const designation = getCell(row, 'Designation', 'Role', 'Job Title') || 'Executive';

    const grossRaw = getCell(row, 'Gross Salary (Tk.)', 'Gross Salary (BDT)', 'Gross Salary', 'Gross');
    const grossSalary = Number(grossRaw.replace(/[^0-9.]/g, '')) || 50000;
    const basicSalary = Math.round(grossSalary * 0.6);
    const houseRent = Math.round(grossSalary * 0.25);
    const medicalAllowance = Math.round(grossSalary * 0.1);
    const conveyanceAllowance = Math.max(0, grossSalary - basicSalary - houseRent - medicalAllowance);
    const allowances = houseRent + medicalAllowance + conveyanceAllowance;
    const deductions = Math.round(basicSalary * 0.1);

    const officialEmail =
      getCell(row, 'Official Email', 'Email', 'Work Email') ||
      `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@company.com`;
    const officialPhone = getCell(row, 'Official Phone', 'Official Mobile', 'Phone', 'Mobile') || '—';
    const joiningDate = getCell(row, 'Joining Date', 'Join Date') || new Date().toISOString().slice(0, 10);
    const photo =
      getCell(row, 'Photo Link', 'Photo') ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

    const employee: Omit<Employee, 'id'> = {
      organizationId: org.id,
      organizationName: org.name,
      employeeCode,
      name,
      email: officialEmail,
      phone: officialPhone,
      emergencyContact: getCell(row, 'Emergency Contact') || '—',
      photo,
      department,
      designation,
      joiningDate,
      employmentType: 'Full-time',
      lifecycleStage: 'Active',
      manager: 'HR Admin',
      basicSalary,
      allowances,
      deductions,
      leaveBalance: { annual: 15, sick: 10, casual: 5 },
      performanceScore: 4.5,
      status: 'Active',
      dob: getCell(row, 'Date of Birth', 'DOB') || undefined,
      bloodGroup: getCell(row, 'Blood Group') || undefined,
      nid: getCell(row, 'Personal NID Number', 'NID') || undefined,
      passportNumber: getCell(row, 'Passport No.', 'Passport Number') || undefined,
      presentAddress: getCell(row, 'Contact Address', 'Present Address', 'Address') || undefined,
      personalMobileNumber: getCell(row, 'Personal Phone', 'Personal Mobile') || undefined,
      requestedPhoneNumbers: getCell(row, 'Requested Phone Numbers') || undefined,
      personalEmailAddress: getCell(row, 'Personal Email') || undefined,
      nominee: getCell(row, 'Nominee Name', 'Nominee') || undefined,
      nomineePhone: getCell(row, 'Nominee Phone') || undefined,
      nomineeDob: getCell(row, 'Nominee DOB') || undefined,
      nidCopyLink: getCell(row, 'NID Copy Link') || undefined,
      passportCopyLink: getCell(row, 'Passport Copy Link') || undefined,
      nomineePhotoLink: getCell(row, 'Nominee Photo Link') || undefined,
      nomineeIdLink: getCell(row, 'Nominee ID Link') || undefined,
      salaryBreakdowns: {
        basicSalary,
        houseRent,
        medicalAllowance,
        conveyanceAllowance,
        mobileAllowance: 0,
        grossSalary,
      },
      bankingProfile: {
        bankName: getCell(row, 'Bank Name') || '—',
        bankBranchCode: getCell(row, 'Branch Code') || undefined,
        bankAccountNo: getCell(row, 'Bank Account No.', 'Bank Account') || '—',
        bankProductCode: getCell(row, 'Product Code') || undefined,
      },
    };

    results.push({
      employee,
      isDuplicate: existingCodes.has(employeeCode.toLowerCase()),
    });
  });

  return results;
}
