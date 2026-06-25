import type { NextRequest } from 'next/server';
import ExcelJS from 'exceljs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildApplicationWhere, normalizePayment, normalizeStatus, normalizeAid } from '@/lib/applicationFilters';
import { APPLICATION_COLUMNS, flattenApplication, buildDelimitedText } from '@/lib/applicationExport';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

  const datestamp = new Date().toISOString().slice(0, 10);

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Applications');
    sheet.columns = APPLICATION_COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 20 }));
    sheet.getRow(1).font = { bold: true };
    sheet.addRows(apps.map(flattenApplication));
    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="applications-${datestamp}.xlsx"`,
      },
    });
  }

  // Prepend a UTF-8 BOM so Excel renders ₦ and accented characters correctly.
  const csv = '﻿' + buildDelimitedText(apps, { delimiter: ',', includeHeader: true });

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="applications-${datestamp}.csv"`,
    },
  });
}
