import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "./actions";
import Image from "next/image";

const C = {
  forest: "#0A3D2B",
  gold: "#C8881A",
  cream: "#F7F3EC",
  charcoal: "#1C1C1C",
  muted: "#5A5A5A",
  border: "rgba(10,61,43,0.12)",
};

const navLink: React.CSSProperties = {
  color: "#0A3D2B",
  textDecoration: "none",
  fontSize: 13,
};

const divider: React.CSSProperties = {
  width: 1,
  height: 20,
  background: "rgba(10,61,43,0.18)",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.cream,
        fontFamily: "DM Sans, sans-serif",
        color: C.charcoal,
      }}
    >
      {session?.user ? (
        <header
          style={{
            background: "#fff",
            color: C.charcoal,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "14px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Left — brand + admin nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Link
                href="/"
                className="nav-logo"
                style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
              >
                <Image
                  src="/logo_dark.png"
                  width={1920}
                  height={1080}
                  style={{ height: "1.9rem", width: "auto" }}
                  alt="Oakvale Learning Logo"
                  priority
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.gold,
                    background: "rgba(200,136,26,0.14)",
                    border: "1px solid rgba(200,136,26,0.4)",
                    borderRadius: 4,
                    padding: "3px 7px",
                  }}
                >
                  Admin
                </span>
              </Link>
              <span aria-hidden style={divider} />
              <nav style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Link href="/admin" style={navLink}>
                  Overview
                </Link>
                <Link href="/admin/applications" style={navLink}>
                  Applications
                </Link>
                <Link href="/admin/reminders" style={navLink}>
                  Reminders
                </Link>
              </nav>
            </div>

            {/* Right — public links + account */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                style={navLink}
              >
                Home
              </Link>
              <Link
                href="/summer-intensive"
                target="_blank"
                rel="noopener noreferrer"
                style={navLink}
              >
                Summer Intensive
              </Link>
              <span aria-hidden style={divider} />
              <span style={{ fontSize: 12, color: C.muted }}>
                {session.user.email}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  style={{
                    background: "transparent",
                    color: C.forest,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    padding: "5px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      ) : null}
      <main>{children}</main>
    </div>
  );
}
