import {
  Employee,
  PayrollRecord,
  JobRequisition,
  Candidate,
  RegionalComplianceRisk,
  RegionId,
} from '../types';

export interface ExportSectionsConfig {
  kpiSummary: boolean;
  regionalMatrix: boolean;
  departmentAndPerformance: boolean;
  complianceLedger: boolean;
  employeePayrollRoster: boolean;
}

export interface AnalyticsExportPayload {
  organizationScopeLabel: string;
  selectedRegion: RegionId;
  dateRange: string;
  periodLabel: string;
  dateMultiplier: number;
  riskSeverityFilter: string;
  metrics: {
    activeHeadcount: number;
    openRequisitions: number;
    activeCandidates: number;
    periodGrossPayroll: number;
    periodTaxAndDeductions: number;
    periodNetPayroll: number;
    avgCostPerEmployee: number;
    avgComplianceScore: number;
    totalFinancialExposure: number;
    openActionRisksCount: number;
    avgPerformanceScore: string;
  };
  deptCounts: Record<string, number>;
  performanceBands: Record<string, number>;
  regionalBreakdownRows: {
    region: string;
    headcount: number;
    grossPayroll: number;
    deductions: number;
    avgCost: number;
    complianceScore: number;
    riskLevel: string;
  }[];
  filteredEmployees: Employee[];
  filteredPayroll: PayrollRecord[];
  filteredJobs: JobRequisition[];
  filteredCandidates: Candidate[];
  filteredRisks: RegionalComplianceRisk[];
  sections: ExportSectionsConfig;
}

/**
 * Escapes a value for RFC-4180 CSV compliance
 */
const escapeCsvCell = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

const buildCsvRow = (cells: (string | number | undefined | null)[]): string => {
  return cells.map(escapeCsvCell).join(',');
};

/**
 * Generates a comprehensive, multi-section CSV file Blob for the currently filtered HR metrics
 */
export const generateAnalyticsCsvBlob = (payload: AnalyticsExportPayload): Blob => {
  const {
    organizationScopeLabel,
    selectedRegion,
    dateRange,
    periodLabel,
    dateMultiplier,
    riskSeverityFilter,
    metrics,
    deptCounts,
    performanceBands,
    regionalBreakdownRows,
    filteredEmployees,
    filteredPayroll,
    filteredRisks,
    sections,
  } = payload;

  const lines: string[] = [];

  // 1. Report Header Metadata
  lines.push(buildCsvRow(['ACCOUNTICCA HRM SOLUTIONS - EXECUTIVE HR & GEOSPATIAL ANALYTICS REPORT']));
  lines.push(buildCsvRow(['Generated Timestamp', new Date().toISOString()]));
  lines.push(buildCsvRow(['Active Geographic Region', selectedRegion === 'all' ? 'Global Operations (All Regions)' : selectedRegion]));
  lines.push(buildCsvRow(['Organization Scope', organizationScopeLabel]));
  lines.push(buildCsvRow(['Reporting Period', `${dateRange} (${periodLabel})`]));
  lines.push(buildCsvRow(['Compliance Severity Filter', riskSeverityFilter]));
  lines.push('');

  // 2. Executive KPI Summary
  if (sections.kpiSummary) {
    lines.push(buildCsvRow(['SECTION 1: EXECUTIVE KPI SUMMARY']));
    lines.push(buildCsvRow(['Metric Name', 'Filtered Value', 'Unit / Context']));
    lines.push(buildCsvRow(['Active Headcount', metrics.activeHeadcount, 'Employees']));
    lines.push(buildCsvRow(['Open Job Requisitions', metrics.openRequisitions, 'Active Openings']));
    lines.push(buildCsvRow(['Active ATS Candidates', metrics.activeCandidates, 'Pipeline Applicants']));
    lines.push(buildCsvRow([`${periodLabel} Gross Payroll`, `BDT ${metrics.periodGrossPayroll.toLocaleString()}`, 'BDT Equivalent']));
    lines.push(buildCsvRow([`${periodLabel} Statutory Tax & PF Withheld`, `BDT ${metrics.periodTaxAndDeductions.toLocaleString()}`, 'BDT Equivalent']));
    lines.push(buildCsvRow([`${periodLabel} Net Disbursed Payroll`, `BDT ${metrics.periodNetPayroll.toLocaleString()}`, 'BDT Equivalent']));
    lines.push(buildCsvRow(['Average Monthly Cost Per Staff', `BDT ${metrics.avgCostPerEmployee.toLocaleString()}`, 'Monthly Gross Avg']));
    lines.push(buildCsvRow(['Regional Compliance Index', `${metrics.avgComplianceScore}%`, `${metrics.openActionRisksCount} Open Audit Item(s)`]));
    lines.push(buildCsvRow(['Statutory Financial Exposure', `BDT ${metrics.totalFinancialExposure.toLocaleString()}`, 'Variance Reserve']));
    lines.push(buildCsvRow(['Average Workforce Review Score', metrics.avgPerformanceScore, 'Out of 5.00']));
    lines.push('');
  }

  // 3. Regional Breakdown Matrix
  if (sections.regionalMatrix) {
    lines.push(buildCsvRow(['SECTION 2: REGIONAL COMPARISON MATRIX']));
    lines.push(
      buildCsvRow([
        'Operating Region',
        'Active Headcount',
        `${periodLabel} Gross Payroll (BDT)`,
        `${periodLabel} Tax & Deductions (BDT)`,
        'Avg Monthly Cost / Staff (BDT)',
        'Compliance Score (%)',
        'Risk Level',
      ])
    );
    regionalBreakdownRows.forEach((row) => {
      lines.push(
        buildCsvRow([
          row.region,
          row.headcount,
          row.grossPayroll * dateMultiplier,
          row.deductions * dateMultiplier,
          row.avgCost,
          `${row.complianceScore}%`,
          row.riskLevel,
        ])
      );
    });
    lines.push('');
  }

  // 4. Department & Performance Distribution
  if (sections.departmentAndPerformance) {
    lines.push(buildCsvRow(['SECTION 3: DEPARTMENT HEADCOUNT DISTRIBUTION']));
    lines.push(buildCsvRow(['Department', 'Headcount', 'Share of Filtered Workforce (%)']));
    Object.entries(deptCounts).forEach(([dept, count]) => {
      const pct = metrics.activeHeadcount > 0 ? Math.round((count / metrics.activeHeadcount) * 100) : 0;
      lines.push(buildCsvRow([dept, count, `${pct}%`]));
    });
    lines.push('');

    lines.push(buildCsvRow(['SECTION 4: WORKFORCE PERFORMANCE BELL CURVE']));
    lines.push(buildCsvRow(['Performance Band', 'Employee Count', 'Distribution Share (%)']));
    Object.entries(performanceBands).forEach(([band, count]) => {
      const pct = metrics.activeHeadcount > 0 ? Math.round((count / metrics.activeHeadcount) * 100) : 0;
      lines.push(buildCsvRow([band, count, `${pct}%`]));
    });
    lines.push('');
  }

  // 5. Statutory Compliance & Risk Ledger
  if (sections.complianceLedger) {
    lines.push(buildCsvRow(['SECTION 5: REGIONAL STATUTORY COMPLIANCE & RISK AUDIT LEDGER']));
    lines.push(
      buildCsvRow([
        'Risk ID',
        'Region',
        'Country',
        'Hub City',
        'Organization',
        'Audit Title',
        'Regulatory Framework',
        'Severity',
        'Status',
        'Compliance Score (%)',
        'Affected Staff',
        'Financial Exposure (BDT)',
        'Due Date',
        'Advisory Note',
      ])
    );
    filteredRisks.forEach((r) => {
      lines.push(
        buildCsvRow([
          r.id,
          r.region,
          r.country,
          r.hubCity,
          r.organizationName,
          r.title,
          r.regulatoryFramework,
          r.severity,
          r.status,
          `${r.complianceScore}%`,
          r.affectedHeadcount,
          r.financialExposure,
          r.dueDate,
          r.advisoryNote,
        ])
      );
    });
    lines.push('');
  }

  // 6. Filtered Employee & Payroll Roster
  if (sections.employeePayrollRoster) {
    lines.push(buildCsvRow(['SECTION 6: FILTERED WORKFORCE & PAYROLL ROSTER']));
    lines.push(
      buildCsvRow([
        'Employee Code',
        'Full Name',
        'Organization',
        'Department',
        'Designation',
        'Lifecycle Stage',
        'Basic Salary (BDT)',
        'Monthly Gross (BDT)',
        'Monthly Deductions (BDT)',
        'Monthly Net Salary (BDT)',
        'Performance Score',
        'Status',
      ])
    );
    filteredEmployees.forEach((emp) => {
      const pay = filteredPayroll.find((p) => p.employeeId === emp.id);
      const gross = pay ? pay.grossSalary : emp.basicSalary + emp.allowances;
      const ded = pay ? pay.totalDeductions : emp.deductions;
      const net = pay ? pay.netSalary : gross - ded;
      lines.push(
        buildCsvRow([
          emp.employeeCode,
          emp.name,
          emp.organizationName,
          emp.department,
          emp.designation,
          emp.lifecycleStage,
          emp.basicSalary,
          gross,
          ded,
          net,
          emp.performanceScore,
          emp.status,
        ])
      );
    });
  }

  // Prepend UTF-8 BOM for Excel compatibility
  const csvContent = '\uFEFF' + lines.join('\r\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Escapes characters for PDF string literals
 */
const pdfEscape = (text: string): string => {
  return text
    .replace(/[^\x20-\x7E]/g, ' ') // Keep printable ASCII for standard Type1 Helvetica
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
};

/**
 * Generates a valid, multi-page capable PDF 1.4 executive report Blob with vector layout,
 * KPI cards, tables, and compliance audit ledger.
 */
export const generateAnalyticsPdfBlob = (payload: AnalyticsExportPayload): Blob => {
  const {
    organizationScopeLabel,
    selectedRegion,
    dateRange,
    periodLabel,
    dateMultiplier,
    riskSeverityFilter,
    metrics,
    deptCounts,
    performanceBands,
    regionalBreakdownRows,
    filteredEmployees,
    filteredRisks,
    sections,
  } = payload;

  const pageWidth = 612; // 8.5 in * 72 pt
  const pageHeight = 792; // 11 in * 72 pt
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const pagesCommands: string[][] = [[]];
  let currentPageIdx = 0;
  let cursorY = pageHeight - 40;

  const emit = (cmd: string) => {
    pagesCommands[currentPageIdx].push(cmd);
  };

  const drawPageFooter = (pageNum: number) => {
    emit('0.88 0.91 0.94 RG 0.8 w');
    emit(`${margin} 36 m ${pageWidth - margin} 36 l S`);
    emit('BT /F1 8 Tf 0.45 0.50 0.58 rg');
    emit(`${margin} 24 Td (${pdfEscape('Accounticca HRM Solutions - Confidential Executive People & Geospatial Intelligence Report')}) Tj ET`);
    emit('BT /F2 8 Tf 0.45 0.50 0.58 rg');
    emit(`${pageWidth - margin - 45} 24 Td (${pdfEscape(`Page ${pageNum}`)}) Tj ET`);
  };

  const ensureSpace = (neededHeight: number) => {
    if (cursorY - neededHeight < 52) {
      drawPageFooter(currentPageIdx + 1);
      pagesCommands.push([]);
      currentPageIdx += 1;
      cursorY = pageHeight - 45;
      // Subtle top continuation header on new page
      emit('0.06 0.09 0.16 rg');
      emit(`${margin} ${cursorY - 18} ${contentWidth} 22 re f`);
      emit('BT /F2 9 Tf 1 1 1 rg');
      emit(
        `${margin + 10} ${cursorY - 11} Td (${pdfEscape(
          `ACCOUNTICCA HRM SOLUTIONS  |  CONTINUED REPORT (${selectedRegion === 'all' ? 'GLOBAL' : selectedRegion.toUpperCase()})`
        )}) Tj ET`
      );
      cursorY -= 34;
    }
  };

  // --- PAGE 1 TOP EXECUTIVE BANNER ---
  emit('0.06 0.09 0.16 rg'); // Dark slate/navy header
  emit(`${margin} ${pageHeight - 102} ${contentWidth} 66 re f`);

  // Accent teal bar at top of banner
  emit('0.08 0.72 0.65 rg');
  emit(`${margin} ${pageHeight - 38} ${contentWidth} 3 re f`);

  emit('BT /F2 15 Tf 1 1 1 rg');
  emit(`${margin + 16} ${pageHeight - 60} Td (${pdfEscape('ACCOUNTICCA HRM SOLUTIONS')}) Tj ET`);

  emit('BT /F1 9.5 Tf 0.58 0.85 0.82 rg');
  emit(
    `${margin + 16} ${pageHeight - 75} Td (${pdfEscape(
      'Executive HR Analytics, Payroll Cost & Geospatial Compliance Report'
    )}) Tj ET`
  );

  const regionText = selectedRegion === 'all' ? 'Global Operations (All Regions)' : selectedRegion;
  const metaLine = `Region: ${regionText}   |   Org Scope: ${organizationScopeLabel}   |   Period: ${dateRange}   |   Generated: ${new Date()
    .toISOString()
    .slice(0, 10)}`;
  emit('BT /F1 8 Tf 0.80 0.84 0.90 rg');
  emit(`${margin + 16} ${pageHeight - 91} Td (${pdfEscape(metaLine)}) Tj ET`);

  cursorY = pageHeight - 118;

  const drawSectionHeader = (title: string, subtitle?: string) => {
    ensureSpace(36);
    emit('0.95 0.97 0.99 rg');
    emit('0.82 0.86 0.92 RG 0.7 w');
    emit(`${margin} ${cursorY - 20} ${contentWidth} 20 re B`);
    emit('0.15 0.39 0.92 rg');
    emit(`${margin} ${cursorY - 20} 4 20 re f`);
    emit('BT /F2 9.5 Tf 0.08 0.12 0.22 rg');
    emit(`${margin + 10} ${cursorY - 13} Td (${pdfEscape(title)}) Tj ET`);
    if (subtitle) {
      emit('BT /F1 8 Tf 0.40 0.46 0.55 rg');
      emit(`${pageWidth - margin - 175} ${cursorY - 13} Td (${pdfEscape(subtitle)}) Tj ET`);
    }
    cursorY -= 28;
  };

  // --- SECTION 1: KPI SUMMARY CARDS ---
  if (sections.kpiSummary) {
    drawSectionHeader(
      '1. EXECUTIVE KPI SUMMARY',
      `Active Scope: ${selectedRegion === 'all' ? 'Global' : selectedRegion}`
    );
    ensureSpace(55);

    const kpiBoxes = [
      {
        label: 'ACTIVE HEADCOUNT',
        val: `${metrics.activeHeadcount} Staff`,
        sub: `${metrics.openRequisitions} Open Req / ${metrics.activeCandidates} ATS`,
      },
      {
        label: `${periodLabel.toUpperCase()} GROSS PAYROLL`,
        val: `BDT ${metrics.periodGrossPayroll.toLocaleString()}`,
        sub: `Avg BDT ${metrics.avgCostPerEmployee.toLocaleString()}/mo per staff`,
      },
      {
        label: 'TAX & PF WITHHELD',
        val: `BDT ${metrics.periodTaxAndDeductions.toLocaleString()}`,
        sub: `Net: BDT ${metrics.periodNetPayroll.toLocaleString()}`,
      },
      {
        label: 'COMPLIANCE INDEX',
        val: `${metrics.avgComplianceScore}%`,
        sub: `Exposure: BDT ${metrics.totalFinancialExposure.toLocaleString()}`,
      },
    ];

    const boxGap = 8;
    const boxWidth = (contentWidth - boxGap * 3) / 4;
    const boxHeight = 46;

    kpiBoxes.forEach((box, idx) => {
      const bx = margin + idx * (boxWidth + boxGap);
      const by = cursorY - boxHeight;
      emit('0.98 0.99 1.00 rg');
      emit('0.84 0.88 0.93 RG 0.7 w');
      emit(`${bx} ${by} ${boxWidth} ${boxHeight} re B`);

      emit('BT /F2 7 Tf 0.40 0.46 0.56 rg');
      emit(`${bx + 8} ${by + 34} Td (${pdfEscape(box.label)}) Tj ET`);

      emit('BT /F2 12 Tf 0.07 0.10 0.18 rg');
      emit(`${bx + 8} ${by + 19} Td (${pdfEscape(box.val)}) Tj ET`);

      emit('BT /F1 7.2 Tf 0.10 0.52 0.48 rg');
      emit(`${bx + 8} ${by + 7} Td (${pdfEscape(box.sub)}) Tj ET`);
    });

    cursorY -= boxHeight + 14;
  }

  // --- SECTION 2: REGIONAL COMPARISON MATRIX ---
  if (sections.regionalMatrix) {
    drawSectionHeader('2. GEOSPATIAL REGIONAL COMPARISON MATRIX', `${periodLabel} Financial Figures`);
    ensureSpace(22 + regionalBreakdownRows.length * 16);

    // Table Header
    emit('0.12 0.16 0.24 rg');
    emit(`${margin} ${cursorY - 16} ${contentWidth} 16 re f`);
    emit('BT /F2 7.5 Tf 1 1 1 rg');
    emit(`${margin + 8} ${cursorY - 11} Td (${pdfEscape('OPERATING REGION')}) Tj ET`);
    emit('BT /F2 7.5 Tf 1 1 1 rg');
    emit(`${margin + 150} ${cursorY - 11} Td (${pdfEscape('HEADCOUNT')}) Tj ET`);
    emit('BT /F2 7.5 Tf 1 1 1 rg');
    emit(`${margin + 225} ${cursorY - 11} Td (${pdfEscape('GROSS PAYROLL')}) Tj ET`);
    emit('BT /F2 7.5 Tf 1 1 1 rg');
    emit(`${margin + 320} ${cursorY - 11} Td (${pdfEscape('TAX / DEDUCTIONS')}) Tj ET`);
    emit('BT /F2 7.5 Tf 1 1 1 rg');
    emit(`${margin + 415} ${cursorY - 11} Td (${pdfEscape('COMPLIANCE RISK')}) Tj ET`);
    cursorY -= 16;

    regionalBreakdownRows.forEach((row, idx) => {
      const isSelectedRow = selectedRegion === row.region;
      if (isSelectedRow) {
        emit('0.91 0.96 1.00 rg');
      } else if (idx % 2 === 1) {
        emit('0.97 0.98 0.99 rg');
      } else {
        emit('1 1 1 rg');
      }
      emit('0.88 0.91 0.95 RG 0.5 w');
      emit(`${margin} ${cursorY - 16} ${contentWidth} 16 re B`);

      const regionLabel = isSelectedRow ? `* ${row.region} (Active)` : row.region;
      emit('BT /F2 8 Tf 0.10 0.14 0.22 rg');
      emit(`${margin + 8} ${cursorY - 11} Td (${pdfEscape(regionLabel)}) Tj ET`);

      emit('BT /F1 8 Tf 0.15 0.20 0.28 rg');
      emit(`${margin + 150} ${cursorY - 11} Td (${pdfEscape(`${row.headcount} Staff`)}) Tj ET`);

      emit('BT /F2 8 Tf 0.08 0.48 0.36 rg');
      emit(
        `${margin + 225} ${cursorY - 11} Td (${pdfEscape(
          `BDT ${(row.grossPayroll * dateMultiplier).toLocaleString()}`
        )}) Tj ET`
      );

      emit('BT /F1 8 Tf 0.20 0.25 0.35 rg');
      emit(
        `${margin + 320} ${cursorY - 11} Td (${pdfEscape(
          `BDT ${(row.deductions * dateMultiplier).toLocaleString()}`
        )}) Tj ET`
      );

      emit('BT /F2 8 Tf 0.15 0.20 0.28 rg');
      emit(
        `${margin + 415} ${cursorY - 11} Td (${pdfEscape(
          `${row.complianceScore}% (${row.riskLevel} Risk)`
        )}) Tj ET`
      );

      cursorY -= 16;
    });

    cursorY -= 12;
  }

  // --- SECTION 3: DEPARTMENT HEADCOUNT & PERFORMANCE DISTRIBUTION ---
  if (sections.departmentAndPerformance) {
    drawSectionHeader(
      '3. DEPARTMENT HEADCOUNT & PERFORMANCE DISTRIBUTION',
      `Avg Review Score: ${metrics.avgPerformanceScore} / 5.0`
    );
    ensureSpace(95);

    const colWidth = (contentWidth - 16) / 2;
    const startY = cursorY;

    // Left column: Departments
    emit('BT /F2 8.5 Tf 0.12 0.16 0.24 rg');
    emit(`${margin + 4} ${startY - 10} Td (${pdfEscape('Department Breakdown')}) Tj ET`);

    let leftY = startY - 24;
    Object.entries(deptCounts).forEach(([dept, count]) => {
      const pct = metrics.activeHeadcount > 0 ? Math.round((count / metrics.activeHeadcount) * 100) : 0;
      emit('BT /F1 8 Tf 0.20 0.25 0.34 rg');
      emit(`${margin + 4} ${leftY} Td (${pdfEscape(`${dept}: ${count} Staff (${pct}%)`)}) Tj ET`);

      // Bar background
      emit('0.90 0.93 0.96 rg');
      emit(`${margin + 150} ${leftY - 1} ${colWidth - 156} 6 re f`);
      // Bar fill
      const fillW = Math.max(2, Math.round(((colWidth - 156) * pct) / 100));
      emit('0.14 0.39 0.92 rg');
      emit(`${margin + 150} ${leftY - 1} ${fillW} 6 re f`);

      leftY -= 14;
    });

    // Right column: Performance Bands
    const rightX = margin + colWidth + 16;
    emit('BT /F2 8.5 Tf 0.12 0.16 0.24 rg');
    emit(`${rightX} ${startY - 10} Td (${pdfEscape('Performance Bell Curve')}) Tj ET`);

    let rightY = startY - 24;
    Object.entries(performanceBands).forEach(([band, count]) => {
      const pct = metrics.activeHeadcount > 0 ? Math.round((count / metrics.activeHeadcount) * 100) : 0;
      emit('BT /F1 8 Tf 0.20 0.25 0.34 rg');
      emit(`${rightX} ${rightY} Td (${pdfEscape(`${band}: ${count} (${pct}%)`)}) Tj ET`);
      rightY -= 14;
    });

    cursorY = Math.min(leftY, rightY) - 8;
  }

  // --- SECTION 4: STATUTORY COMPLIANCE & LABOR RISK LEDGER ---
  if (sections.complianceLedger) {
    drawSectionHeader(
      '4. REGIONAL STATUTORY COMPLIANCE & LABOR RISK LEDGER',
      `Filter: ${riskSeverityFilter} (${filteredRisks.length} Items)`
    );

    if (filteredRisks.length === 0) {
      ensureSpace(24);
      emit('BT /F1 8.5 Tf 0.40 0.45 0.52 rg');
      emit(`${margin + 8} ${cursorY - 12} Td (${pdfEscape('No compliance risks match the active filter criteria.')}) Tj ET`);
      cursorY -= 24;
    } else {
      filteredRisks.forEach((risk) => {
        ensureSpace(34);
        emit('0.98 0.99 1.00 rg');
        emit('0.86 0.89 0.94 RG 0.6 w');
        emit(`${margin} ${cursorY - 30} ${contentWidth} 28 re B`);

        const titleLine = `[${risk.severity.toUpperCase()} - ${risk.status.toUpperCase()}] ${risk.country} (${risk.organizationName}): ${risk.title}`;
        emit('BT /F2 8 Tf 0.08 0.12 0.20 rg');
        emit(`${margin + 8} ${cursorY - 12} Td (${pdfEscape(titleLine.slice(0, 96))}) Tj ET`);

        const detailLine = `Framework: ${risk.regulatoryFramework}  |  Score: ${risk.complianceScore}%  |  Exposure: BDT ${risk.financialExposure.toLocaleString()}  |  Due: ${risk.dueDate}`;
        emit('BT /F1 7.5 Tf 0.32 0.38 0.48 rg');
        emit(`${margin + 8} ${cursorY - 24} Td (${pdfEscape(detailLine.slice(0, 108))}) Tj ET`);

        cursorY -= 32;
      });
    }
    cursorY -= 6;
  }

  // --- SECTION 5: FILTERED EMPLOYEE & PAYROLL ROSTER ---
  if (sections.employeePayrollRoster) {
    drawSectionHeader(
      '5. FILTERED WORKFORCE & COMPENSATION ROSTER',
      `${filteredEmployees.length} Active Staff`
    );
    ensureSpace(22);

    emit('0.12 0.16 0.24 rg');
    emit(`${margin} ${cursorY - 15} ${contentWidth} 15 re f`);
    emit('BT /F2 7.2 Tf 1 1 1 rg');
    emit(`${margin + 6} ${cursorY - 10} Td (${pdfEscape('CODE & NAME')}) Tj ET`);
    emit('BT /F2 7.2 Tf 1 1 1 rg');
    emit(`${margin + 150} ${cursorY - 10} Td (${pdfEscape('ORGANIZATION')}) Tj ET`);
    emit('BT /F2 7.2 Tf 1 1 1 rg');
    emit(`${margin + 285} ${cursorY - 10} Td (${pdfEscape('DEPARTMENT & ROLE')}) Tj ET`);
    emit('BT /F2 7.2 Tf 1 1 1 rg');
    emit(`${margin + 445} ${cursorY - 10} Td (${pdfEscape('BASIC / SCORE')}) Tj ET`);
    cursorY -= 15;

    filteredEmployees.forEach((emp, idx) => {
      ensureSpace(16);
      if (idx % 2 === 1) {
        emit('0.97 0.98 0.99 rg');
      } else {
        emit('1 1 1 rg');
      }
      emit('0.89 0.92 0.95 RG 0.4 w');
      emit(`${margin} ${cursorY - 15} ${contentWidth} 15 re B`);

      emit('BT /F2 7.5 Tf 0.10 0.14 0.22 rg');
      emit(`${margin + 6} ${cursorY - 10} Td (${pdfEscape(`${emp.employeeCode} - ${emp.name}`.slice(0, 26))}) Tj ET`);

      emit('BT /F1 7.5 Tf 0.25 0.30 0.38 rg');
      emit(`${margin + 150} ${cursorY - 10} Td (${pdfEscape(emp.organizationName.slice(0, 24))}) Tj ET`);

      emit('BT /F1 7.5 Tf 0.25 0.30 0.38 rg');
      emit(
        `${margin + 285} ${cursorY - 10} Td (${pdfEscape(`${emp.department} (${emp.designation})`.slice(0, 30))}) Tj ET`
      );

      emit('BT /F2 7.5 Tf 0.08 0.48 0.36 rg');
      emit(
        `${margin + 445} ${cursorY - 10} Td (${pdfEscape(
          `BDT ${emp.basicSalary.toLocaleString()}/mo  |  ${emp.performanceScore.toFixed(1)}`
        )}) Tj ET`
      );

      cursorY -= 15;
    });
  }

  // Finalize footer on last page
  drawPageFooter(currentPageIdx + 1);

  // Assemble PDF 1.4 Objects with exact byte offsets
  const objects: string[] = [];
  // Obj 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Obj 2: Pages placeholder (will fill kids)
  const numPages = pagesCommands.length;
  const firstPageObjNum = 5;
  const pageObjNums: number[] = [];
  for (let i = 0; i < numPages; i++) {
    pageObjNums.push(firstPageObjNum + i * 2);
  }
  objects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${numPages} >>\nendobj\n`
  );

  // Obj 3: Font F1 (Helvetica)
  objects.push('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // Obj 4: Font F2 (Helvetica-Bold)
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  // Page & Content Stream pairs
  pagesCommands.forEach((cmds, idx) => {
    const pageObjId = firstPageObjNum + idx * 2;
    const contentObjId = pageObjId + 1;
    const streamData = cmds.join('\n');

    objects.push(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );
    objects.push(
      `${contentObjId} 0 obj\n<< /Length ${streamData.length} >>\nstream\n${streamData}\nendstream\nendobj\n`
    );
  });

  // Compute exact byte offsets
  let pdfBody = '%PDF-1.4\n';
  const offsets: number[] = [0]; // index 0 is free object
  objects.forEach((objStr) => {
    offsets.push(pdfBody.length);
    pdfBody += objStr;
  });

  const xrefStart = pdfBody.length;
  pdfBody += `xref\n0 ${objects.length + 1}\n`;
  pdfBody += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    const paddedOffset = String(offsets[i]).padStart(10, '0');
    pdfBody += `${paddedOffset} 00000 n \n`;
  }

  pdfBody += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdfBody], { type: 'application/pdf' });
};

/**
 * Triggers a clean browser download for a generated Blob
 */
export const triggerBlobDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};
