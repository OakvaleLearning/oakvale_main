import type { NextRequest } from 'next/server';
import ExcelJS from 'exceljs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildApplicationWhere, normalizePayment, normalizeStatus, normalizeAid } from '@/lib/applicationFilters';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Column = { header: string; key: string };

const COLUMNS: Column[] = [
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

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const payment = normalizePayment(sp.get('payment') ?? undefined);
  const status = normalizeStatus(sp.get('status') ?? undefined);
  const aid = normalizeAid(sp.get('aid') ?? undefined);
  const q = (sp.get('q') ?? '').trim();
  const format = sp.get('format') === 'xlsx' ? 'xlsx' : 'csv';

  const where = buildApplicationWhere({ payment, status, aid, q });

  const apps = await prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const rows = apps.map((a) => ({
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
    fileCount: a.fileCount,
    consentTruth: yesNo(a.consentTruth),
    consentContact: yesNo(a.consentContact),
    consentTerms: yesNo(a.consentTerms),
    paymentStatus: a.paymentStatus,
    status: a.status,
    notes: a.notes ?? '',
    paystackCustomerCode: a.paystackCustomerCode ?? '',
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  const datestamp = new Date().toISOString().slice(0, 10);

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Applications');
    sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 20 }));
    sheet.getRow(1).font = { bold: true };
    sheet.addRows(rows);
    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="applications-${datestamp}.xlsx"`,
      },
    });
  }

  const lines: string[] = [];
  lines.push(COLUMNS.map((c) => csvCell(c.header)).join(','));
  for (const row of rows) {
    lines.push(COLUMNS.map((c) => csvCell(String((row as Record<string, unknown>)[c.key] ?? ''))).join(','));
  }
  // Prepend a UTF-8 BOM so Excel renders ₦ and accented characters correctly.
  const csv = '﻿' + lines.join('\r\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="applications-${datestamp}.csv"`,
    },
  });
}
