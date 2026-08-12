import { prisma } from '@/lib/prisma';

const APPLICATIONS_OPEN_KEY = 'applicationsOpen';

/**
 * Whether NEW applications are being accepted. Defaults to open when the
 * setting has never been written. Applicants who have already started
 * (existing "Pending" records) can still complete payment regardless.
 */
export async function getApplicationsOpen(): Promise<boolean> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: APPLICATIONS_OPEN_KEY } });
    if (!row) return true;
    return row.value !== 'false';
  } catch (err) {
    // If the setting can't be read, fail open so the form stays available.
    console.error('getApplicationsOpen failed:', err);
    return true;
  }
}

export async function setApplicationsOpen(open: boolean): Promise<void> {
  const value = open ? 'true' : 'false';
  await prisma.setting.upsert({
    where: { key: APPLICATIONS_OPEN_KEY },
    update: { value },
    create: { key: APPLICATIONS_OPEN_KEY, value },
  });
}
