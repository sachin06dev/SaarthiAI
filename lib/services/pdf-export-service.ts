import { ReportAnalysisSummary, CandidateExtractionRow } from '../types/report.types';

/**
 * Formats a clean, patient-friendly text summary suitable for WhatsApp messaging.
 */
export function formatReportTextForWhatsApp(summary: ReportAnalysisSummary): string {
  const lines: string[] = [
    `📋 *SaarthiAI Decoded Report Summary*`,
    `*Document:* ${summary.fileName}`,
    `*Generated:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    ``,
    `*Overview:*`,
    `• Total Parameters: ${summary.totalTests}`,
    `• In Reference Range: ${summary.inRangeCount}`,
    `• Above Reference Range: ${summary.aboveRangeCount}`,
    `• Below Reference Range: ${summary.belowRangeCount}`,
    `• Needing Verification: ${summary.reviewRequiredCount}`,
    `• No Verified Range Available: ${summary.noVerifiedRangeCount}`,
    ``,
    `*Key Parameter Highlights:*`,
  ];

  // Include notable parameters (above, below, or needs review)
  const notable = summary.items.filter(
    (item) => item.comparisonStatus === 'ABOVE_RANGE' || item.comparisonStatus === 'BELOW_RANGE' || item.isReviewRequired
  );

  const displayItems = notable.length > 0 ? notable.slice(0, 5) : summary.items.slice(0, 5);

  for (const item of displayItems) {
    const statusIcon =
      item.comparisonStatus === 'IN_RANGE'
        ? '✅ In Range'
        : item.comparisonStatus === 'ABOVE_RANGE'
        ? '🔺 Above Range'
        : item.comparisonStatus === 'BELOW_RANGE'
        ? '🔻 Below Range'
        : '⚠️ Review Required';

    const valStr = `${item.parsedNumericValue ?? item.rawValueText} ${item.parsedUnit || ''}`.trim();
    const rangeStr = item.rawRangeText ? `(Ref: ${item.rawRangeText})` : '';

    lines.push(`• *${item.rawTestName}:* ${valStr} ${rangeStr} — ${statusIcon}`);
  }

  if (summary.items.length > displayItems.length) {
    lines.push(`...and ${summary.items.length - displayItems.length} more parameters in full report.`);
  }

  lines.push(``);
  lines.push(`*Questions for Doctor:*`);
  const firstQuestions = summary.items
    .filter((i) => i.explanation?.neutralDoctorQuestions && i.explanation.neutralDoctorQuestions.length > 0)
    .slice(0, 2)
    .map((i) => `• ${i.explanation!.neutralDoctorQuestions[0]}`);

  if (firstQuestions.length > 0) {
    lines.push(...firstQuestions);
  } else {
    lines.push(`• "Could you review these laboratory findings in the context of my current health status?"`);
  }

  lines.push(``);
  lines.push(`⚠️ *Medical Disclaimer:*`);
  lines.push(`SaarthiAI is an educational report explanation assistant. AI explains, rules compare, doctors diagnose. This summary does not provide medical diagnosis or treatment advice.`);

  return lines.join('\n');
}

/**
 * Builds the WhatsApp web / mobile click-to-chat URL with the prepared summary.
 */
export function generateWhatsAppShareUrl(summary: ReportAnalysisSummary, phoneNumber?: string): string {
  const text = formatReportTextForWhatsApp(summary);
  const encoded = encodeURIComponent(text);
  if (phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

/**
 * Generates an HTML printable report document content.
 */
export function generatePrintableReportHtml(summary: ReportAnalysisSummary): string {
  const rowsHtml = summary.items
    .map((item) => {
      const statusBadge =
        item.comparisonStatus === 'IN_RANGE'
          ? '<span style="color: #059669; font-weight: bold;">Within Range</span>'
          : item.comparisonStatus === 'ABOVE_RANGE'
          ? '<span style="color: #d97706; font-weight: bold;">Above Range</span>'
          : item.comparisonStatus === 'BELOW_RANGE'
          ? '<span style="color: #2563eb; font-weight: bold;">Below Range</span>'
          : item.comparisonStatus === 'NO_VERIFIED_RANGE'
          ? '<span style="color: #6b7280; font-style: italic;">No Verified Range</span>'
          : '<span style="color: #dc2626; font-weight: bold;">Review Required</span>';

      const val = `${item.parsedNumericValue ?? item.rawValueText} ${item.parsedUnit || ''}`.trim();
      const range = item.rawRangeText || 'N/A';
      const rangeSource = item.referenceRangeOrigin?.sourceType === 'REPORT_PRINTED'
        ? 'Report Printed'
        : item.referenceRangeOrigin?.sourceType === 'CURATED_INDIAN_FALLBACK'
        ? 'Curated Indian Reference'
        : 'None';

      const explanation = item.explanation ? (item.explanation.whatItMeasures || item.explanation.reportedResultSummary) : '';
      const doctorQ = item.explanation?.neutralDoctorQuestions?.[0]
        ? `<div style="font-size: 11px; color: #4b5563; margin-top: 4px;"><strong>Q for Doctor:</strong> ${item.explanation.neutralDoctorQuestions[0]}</div>`
        : '';

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; font-size: 12px;">
          <td style="padding: 8px 10px; font-weight: 600; color: #111827;">
            ${item.rawTestName}
            ${item.canonicalId ? `<br/><span style="font-size: 10px; color: #6b7280; font-weight: normal;">Canonical: ${item.canonicalId}</span>` : ''}
          </td>
          <td style="padding: 8px 10px; font-weight: bold; color: #1f2937;">${val}</td>
          <td style="padding: 8px 10px; color: #374151;">
            ${range}
            <br/><span style="font-size: 10px; color: #9ca3af;">Src: ${rangeSource}</span>
          </td>
          <td style="padding: 8px 10px;">${statusBadge}</td>
          <td style="padding: 8px 10px; color: #4b5563;">
            ${explanation}
            ${doctorQ}
          </td>
        </tr>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SaarthiAI Report - ${summary.fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1f2937; margin: 24px; line-height: 1.5; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; }
    .header h1 { margin: 0 0 4px 0; color: #0369a1; font-size: 22px; }
    .header p { margin: 0; font-size: 12px; color: #6b7280; }
    .summary-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 20px; text-align: center; }
    .summary-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; }
    .summary-card .num { font-size: 18px; font-weight: bold; color: #111827; }
    .summary-card .label { font-size: 10px; color: #6b7280; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; color: #4b5563; border-bottom: 2px solid #e5e7eb; }
    .disclaimer { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; font-size: 11px; color: #92400e; margin-top: 20px; }
    @media print {
      body { margin: 10mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SaarthiAI &bull; Laboratory Report Explanation Summary</h1>
    <p>File: <strong>${summary.fileName}</strong> | Generated: <strong>${new Date().toLocaleString('en-IN')}</strong> | Status: <strong>Verified by Patient</strong></p>
  </div>

  <div class="summary-grid">
    <div class="summary-card"><div class="num">${summary.totalTests}</div><div class="label">Total Parameters</div></div>
    <div class="summary-card"><div class="num" style="color: #059669;">${summary.inRangeCount}</div><div class="label">In Range</div></div>
    <div class="summary-card"><div class="num" style="color: #d97706;">${summary.aboveRangeCount}</div><div class="label">Above Range</div></div>
    <div class="summary-card"><div class="num" style="color: #2563eb;">${summary.belowRangeCount}</div><div class="label">Below Range</div></div>
    <div class="summary-card"><div class="num" style="color: #dc2626;">${summary.reviewRequiredCount}</div><div class="label">Review Needed</div></div>
    <div class="summary-card"><div class="num" style="color: #6b7280;">${summary.noVerifiedRangeCount}</div><div class="label">No Ref Range</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Parameter</th>
        <th style="width: 14%;">Result</th>
        <th style="width: 18%;">Reference Interval</th>
        <th style="width: 14%;">Comparison</th>
        <th style="width: 32%;">Explanation &amp; Doctor Question</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="disclaimer">
    <strong>Educational Use Only &bull; Non-Negotiable Medical Safety Contract:</strong><br/>
    SaarthiAI is an educational software assistant. AI explains, rules compare, and licensed doctors diagnose.
    This summary is designed solely to facilitate informed dialogue between the patient and their healthcare practitioner.
    It does not constitute medical diagnosis, treatment advice, or dosage guidance. Always consult a qualified physician.
  </div>
</body>
</html>`;
}

/**
 * Triggers client-side browser print for PDF creation.
 */
export function triggerBrowserPrintReport(summary: ReportAnalysisSummary): void {
  const html = generatePrintableReportHtml(summary);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } else {
    // Fallback if pop-up blocked: print current window
    window.print();
  }
}

/**
 * Attempts Web Share API with file/text, with honest graceful fallback.
 */
export async function shareReportViaWebShare(
  summary: ReportAnalysisSummary
): Promise<{ success: boolean; fallbackNeeded: boolean }> {
  const text = formatReportTextForWhatsApp(summary);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `SaarthiAI Decoded Report - ${summary.fileName}`,
        text: text,
      });
      return { success: true, fallbackNeeded: false };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, fallbackNeeded: false };
      }
      return { success: false, fallbackNeeded: true };
    }
  }

  return { success: false, fallbackNeeded: true };
}
