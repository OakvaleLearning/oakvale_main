import { prisma } from '@/lib/prisma';

/**
 * Record an email send (or failed send) against an applicant's record.
 * Never throws — a logging failure must not break the email flow it tracks.
 */
export async function logEmail(entry: {
  applicationId: string;
  recipient: 'applicant' | 'admin';
  toAddress: string;
  type: string;
  subject: string;
  html: string;
  status?: 'sent' | 'failed';
  error?: string;
}): Promise<void> {
  try {
    await prisma.emailLog.create({
      data: {
        applicationId: entry.applicationId,
        recipient: entry.recipient,
        toAddress: entry.toAddress,
        type: entry.type,
        subject: entry.subject,
        html: entry.html,
        status: entry.status ?? 'sent',
        error: entry.error ?? null,
      },
    });
  } catch (err) {
    console.error('[emailLog] failed to record email:', err);
  }
}
