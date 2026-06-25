import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PAYMENT_OPTS,
  STATUS_OPTS,
  AID_OPTS,
  buildApplicationWhere,
  normalizePayment,
  normalizeStatus,
  normalizeAid,
} from "@/lib/applicationFilters";
import ApplicationsTable from "./ApplicationsTable";

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

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment?: string;
    status?: string;
    aid?: string;
    page?: string;
    q?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const params = await searchParams;
  const payment = normalizePayment(params.payment);
  const status = normalizeStatus(params.status);
  const aid = normalizeAid(params.aid);
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const where = buildApplicationWhere({ payment, status, aid, q });

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

  const activeFilters = [
    payment !== "All" ? `Payment: ${payment}` : null,
    status !== "All" ? `Status: ${status}` : null,
    aid !== "All" ? `Aid: ${aid}` : null,
    q ? `Search: “${q}”` : null,
  ].filter(Boolean) as string[];
  const isFiltered = activeFilters.length > 0;

  function buildQS(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (payment !== "All") sp.set("payment", payment);
    if (status !== "All") sp.set("status", status);
    if (aid !== "All") sp.set("aid", aid);
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
    if (aid !== "All") sp.set("aid", aid);
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
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 8px" }}>
            <strong style={{ color: C.forest, fontWeight: 600 }}>{total}</strong>{" "}
            {isFiltered ? "matching" : "total"} application{total === 1 ? "" : "s"}
            {isFiltered ? " (filtered)" : ""}
          </p>
          {isFiltered && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                margin: "0 0 20px",
                alignItems: "center",
              }}
            >
              {activeFilters.map((f) => (
                <span
                  key={f}
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background: C.gold + "22",
                    color: C.gold,
                  }}
                >
                  {f}
                </span>
              ))}
              <Link
                href="/admin/applications"
                style={{ fontSize: 12, color: C.muted, textDecoration: "underline" }}
              >
                Clear
              </Link>
            </div>
          )}
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
            Financial aid
          </label>
          <select
            name="aid"
            defaultValue={aid}
            style={{
              padding: "8px 10px",
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            {AID_OPTS.map((p) => (
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

      <ApplicationsTable
        rows={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      />

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
