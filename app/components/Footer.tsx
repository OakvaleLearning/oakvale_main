"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const router = useRouter();
  const onNavigate = (page: string) => router.push(page === "home" ? "/" : `/${page}`);
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <Link className="nav-logo" href="/">
              <Image
                src="/oakvale-white.svg"
                width={120}
                height={32}
                style={{ height: "2rem", width: "auto" }}
                alt="Oakvale Learning Logo"
              />
            </Link>
          </div>
          <p>
            Changing lives through learning and self-discovery. Evidence-based
            workforce, leadership and organisational development for Africa.
          </p>
          <div className="footer-social">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Oakvale Learning on Instagram"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Oakvale Learning on Facebook"
            >
              <FacebookIcon size={20} />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li>
              <a onClick={() => onNavigate("corporates")}>For Corporates</a>
            </li>
            <li>
              <a onClick={() => onNavigate("academic")}>
                For Academic Institutions
              </a>
            </li>
            <li>
              <a onClick={() => onNavigate("donors")}>For Donor Agencies</a>
            </li>
            <li>
              <a onClick={() => onNavigate("government")}>For Government</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Organisation</h4>
          <ul>
            <li>
              <a onClick={() => onNavigate("about")}>About Us</a>
            </li>
            <li>
              <a onClick={() => onNavigate("services")}>What We Do</a>
            </li>
            <li>
              <a onClick={() => onNavigate("contact")}>Work With Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:hello@oakvaleltd.com">hello@oakvaleltd.com</a>
            </li>
            <li>
              <a onClick={() => onNavigate("contact")}>Partnership Enquiries</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Oakvale Learning Ltd. All rights reserved.</span>
        <span>
          <a href="#">Privacy Policy</a> &middot; <a href="#">Terms</a> &middot;{" "}
          <Link href="/admin">Admin</Link>
        </span>
      </div>
    </footer>
  );
}
