import crypto from 'node:crypto';

const PAYSTACK_BASE = 'https://api.paystack.co';

export const APPLICATION_FEE_KOBO = Number(
  process.env.APPLICATION_FEE_KOBO || 1_000_000
);
export const APPLICATION_FEE_NAIRA = Math.round(APPLICATION_FEE_KOBO / 100);

function secret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured');
  return key;
}

export interface InitializeParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeResult {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export async function initializeTransaction(
  params: InitializeParams
): Promise<InitializeResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
    cache: 'no-store',
  });

  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: InitializeResult;
  };

  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack initialize failed: ${json.message || res.statusText}`);
  }
  return json.data;
}

export interface VerifyResult {
  status: 'success' | 'failed' | 'abandoned' | string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
  customer?: { email: string; customer_code: string };
  [key: string]: unknown;
}

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret()}` },
      cache: 'no-store',
    }
  );
  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: VerifyResult;
  };
  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack verify failed: ${json.message || res.statusText}`);
  }
  return json.data;
}

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;
  const computed = crypto
    .createHmac('sha512', secret())
    .update(rawBody)
    .digest('hex');
  try {
    const a = Buffer.from(computed, 'utf8');
    const b = Buffer.from(signatureHeader, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function buildReference(applicationId: string): string {
  return `OAK-${applicationId.slice(0, 8)}-${Date.now()}`;
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
