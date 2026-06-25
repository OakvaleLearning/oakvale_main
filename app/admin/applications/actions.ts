'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildDelimitedText } from '@/lib/applicationExport';

/**
 * Build tab-separated (spreadsheet-pasteable) text for the given applicant IDs.
 * All export columns, data rows only — for the table's copy-to-clipboard button.
 */
export async function getApplicationsTsv(ids: string[]): Promise<string> {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  if (ids.length === 0) return '';

  const apps = await prisma.application.findMany({
    where: { id: { in: ids } },
    orderBy: { createdAt: 'desc' },
  });

  return buildDelimitedText(apps, { delimiter: '\t', includeHeader: false });
}
