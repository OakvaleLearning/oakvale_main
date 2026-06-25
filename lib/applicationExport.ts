import type { Application } from '@prisma/client';

export type Column = { header: string; key: string };

/** Column order shared by the CSV/Excel export and the clipboard copy. */
export const APPLICATION_COLUMNS: Column[] = [
  { header: 'ID', key: 'id' },
  { header: 'First name', key: 'firstName' },
  { header: 'Last name', key: 'lastName' },
  { header: 'Email', key: 'email' },
  { header: 'Phone', key: 'phone' },
  { header: 'State', key: 'state' },
  { header: 'Institution', key: 'institution' },
  { header: 'Discipline', key: 'discipline' },
  { header: 'Year of study', key: 'yearOfStudy' },
  { header: 'Student ID', key: 'studentId' },
  { header: 'Track (1st)', key: 'trackFirst' },
  { header: 'Track (2nd)', key: 'trackSecond' },
  { header: 'Motivation 1', key: 'mot1' },
  { header: 'Motivation 2', key: 'mot2' },
  { header: 'Needs aid', key: 'needsAid' },
  { header: 'Aid level', key: 'aidLevel' },
  { header: 'Aid statement', key: 'aidStatement' },
  { header: 'Aid files', key: 'aidFiles' },
  { header: 'File count', key: 'fileCount' },
  { header: 'Consent: truth', key: 'consentTruth' },
  { header: 'Consent: contact', key: 'consentContact' },
  { header: 'Consent: terms', key: 'consentTerms' },
  { header: 'Payment status', key: 'paymentStatus' },
  { header: 'Application status', key: 'status' },
  { header: 'Notes', key: 'notes' },
  { header: 'Paystack customer code', key: 'paystackCustomerCode' },
  { header: 'Created at', key: 'createdAt' },
  { header: 'Updated at', key: 'updatedAt' },
];

function yesNo(v: boolean): string {
  return v ? 'Yes' : 'No';
}

/** Flatten an Application row into a string map keyed by APPLICATION_COLUMNS keys. */
export function flattenApplication(a: Application): Record<string, string> {
  return {
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    email: a.email,
    phone: a.phone,
    state: a.state,
    institution: a.institution,
    discipline: a.discipline,
    yearOfStudy: a.yearOfStudy,
    studentId: a.studentId,
    trackFirst: a.trackFirst,
    trackSecond: a.trackSecond ?? '',
    mot1: a.mot1,
    mot2: a.mot2,
    needsAid: yesNo(a.needsAid),
    aidLevel: a.aidLevel ?? '',
    aidStatement: a.aidStatement ?? '',
    aidFiles: a.aidFiles == null ? '' : JSON.stringify(a.aidFiles),
    fileCount: String(a.fileCount),
    consentTruth: yesNo(a.consentTruth),
    consentContact: yesNo(a.consentContact),
    consentTerms: yesNo(a.consentTerms),
    paymentStatus: a.paymentStatus,
    status: a.status,
    notes: a.notes ?? '',
    paystackCustomerCode: a.paystackCustomerCode ?? '',
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

/**
 * Escape a single cell for delimited text. Wraps the value in double quotes
 * (doubling any interior quotes) when it contains the delimiter, a quote, or a
 * line break — so spreadsheets keep multiline values inside one cell. This
 * applies to both CSV (comma) and clipboard TSV (tab).
 */
function escapeCell(value: string, delimiter: string): string {
  if (value.includes(delimiter) || /["\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Build delimited (CSV/TSV) text from applications, in APPLICATION_COLUMNS order. */
export function buildDelimitedText(
  apps: Application[],
  { delimiter, includeHeader }: { delimiter: string; includeHeader: boolean }
): string {
  const lines: string[] = [];
  if (includeHeader) {
    lines.push(APPLICATION_COLUMNS.map((c) => escapeCell(c.header, delimiter)).join(delimiter));
  }
  for (const a of apps) {
    const flat = flattenApplication(a);
    lines.push(APPLICATION_COLUMNS.map((c) => escapeCell(flat[c.key] ?? '', delimiter)).join(delimiter));
  }
  return lines.join('\r\n');
}
