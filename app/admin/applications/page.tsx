import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PAYMENT_OPTS,
  STATUS_OPTS,
  buildApplicationWhere,
  normalizePayment,
  normalizeStatus,
} from "@/lib/applicationFilters";

const C = {
  forest: "#0A3D2B",
  gold: "#C8881A",
  cream: "#F7F3EC",
  charcoal: "#1C1C1C",
  muted: "#5A5A5A",
  border: "rgba(10,61,43,0.12)",
};

const PAGE_SIZE = 25;

export const dynamic = "force-dynamic";

function badge(text: string, color: string) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: color + "22",
        color,
      }}
    >
      {text}
    </span>
  );
}

function paymentColor(s: string) {
  return s === "Paid"
    ? "#145C3F"
    : s === "Pending"
      ? "#a06010"
      : s === "Waived"
        ? "#1a4bcc"
        : "#9a1d1d";
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment?: string;
    status?: string;
    page?: string;
    q?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const params = await searchParams;
  const payment = normalizePayment(params.payment);
  const status = normalizeStatus(params.status);
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const where = buildApplicationWhere({ payment, status, q });

  const [total, rows] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        institution: true,
        trackFirst: true,
        paymentStatus: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildQS(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (payment !== "All") sp.set("payment", payment);
    if (status !== "All") sp.set("status", status);
    if (q) sp.set("q", q);
    if (page > 1) sp.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const s = sp.toString();
    return s ? `?${s}` : "";
  }

  function exportHref(format: "csv" | "xlsx") {
    const sp = new URLSearchParams();
    if (payment !== "All") sp.set("payment", payment);
    if (status !== "All") sp.set("status", status);
    if (q) sp.set("q", q);
    sp.set("format", format);
    return `/admin/applications/export?${sp.toString()}`;
  }

  const exportBtn: React.CSSProperties = {
    display: "inline-block",
    padding: "8px 14px",
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    color: C.forest,
    textDecoration: "none",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: 30,
              fontWeight: 500,
              color: C.forest,
              margin: "0 0 4px",
            }}
          >
            Applications
          </h1>
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px" }}>
            {total} total{q ? ` matching “${q}”` : ""}
          </p>
        </div>
        <div>
          <div style={{ display: "flex", gap: 8 }}>
            <a download href={exportHref("csv")} style={exportBtn}>
              Export as CSV
            </a>
            <a download href={exportHref("xlsx")} style={exportBtn}>
              Export as (.xlsx) Excel
            </a>
          </div>
          <p
            style={{
              fontSize: 11,
              color: C.muted,
              alignSelf: "center",
              margin: ".5rem 0"
            }}
          >
            The current table filter applies. Select ALL to export all
            applications.
          </p>
        </div>
      </div>

      <form
        method="get"
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginBottom: 18,
          background: "#fff",
          padding: 14,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 11,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Search
          </label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Name, email, student ID"
            style={{
              padding: "8px 10px",
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 13,
              fontFamily: "inherit",
              minWidth: 220,
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 11,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Payment
          </label>
          <select
            name="payment"
            defaultValue={payment}
            style={{
              padding: "8px 10px",
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {PAYMENT_OPTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 11,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Status
          </label>
          <select
            name="status"
            defaultValue={status}
            style={{
              padding: "8px 10px",
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {STATUS_OPTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          style={{
            background: C.forest,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "9px 16px",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Apply filters
        </button>
      </form>

      <div
        style={{
          background: "#fff",
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {rows.length === 0 ? (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              color: C.muted,
              fontSize: 14,
            }}
          >
            No applications found.
          </div>
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: C.cream,
                  textAlign: "left",
                  color: C.muted,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <th style={{ padding: "10px 14px" }}>Name</th>
                <th style={{ padding: "10px 14px" }}>Institution</th>
                <th style={{ padding: "10px 14px" }}>Track</th>
                <th style={{ padding: "10px 14px" }}>Payment</th>
                <th style={{ padding: "10px 14px" }}>Status</th>
                <th style={{ padding: "10px 14px" }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderTop: `1px solid ${C.border}`,
                    }}
                  >
                    <Link
                      href={`/admin/applications/${r.id}`}
                      style={{
                        color: C.forest,
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {r.firstName} {r.lastName}
                    </Link>
                    <div style={{ fontSize: 12, color: C.muted }}>
                      {r.email}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderTop: `1px solid ${C.border}`,
                    }}
                  >
                    {r.institution}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderTop: `1px solid ${C.border}`,
                    }}
                  >
                    Track {r.trackFirst}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderTop: `1px solid ${C.border}`,
                    }}
                  >
                    {badge(r.paymentStatus, paymentColor(r.paymentStatus))}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderTop: `1px solid ${C.border}`,
                      color: C.muted,
                    }}
                  >
                    {r.status}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderTop: `1px solid ${C.border}`,
                      color: C.muted,
                    }}
                  >
                    {r.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            fontSize: 13,
            color: C.muted,
          }}
        >
          <div>
            Page {page} of {totalPages}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {page > 1 && (
              <Link
                href={`/admin/applications${buildQS({ page: String(page - 1) })}`}
                style={{
                  padding: "6px 12px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  color: C.forest,
                  textDecoration: "none",
                  background: "#fff",
                }}
              >
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/applications${buildQS({ page: String(page + 1) })}`}
                style={{
                  padding: "6px 12px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  color: C.forest,
                  textDecoration: "none",
                  background: "#fff",
                }}
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
