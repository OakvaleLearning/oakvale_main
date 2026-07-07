# Oakvale Learning — Landing Page Build Plan

## For: AI Agent / Developer
## Project: Healthcare Leadership and Innovation Summer Intensive 2026
## Output: Single-page landing page (React `.jsx` or standalone `.html`)

---

## 1. Project Brief

Build a single-page marketing landing page for the **Oakvale Healthcare Leadership and Innovation Summer Intensive 2026** — a four-week blended-learning programme for health sciences students in Lagos, Nigeria. The page must be conversion-focused: the primary goal is driving applications via the "Apply now" CTA.

**Target audience:** Penultimate and final-year health sciences students (Medicine, Pharmacy, Dentistry, Nursing, Lab Sciences, Physiotherapy) at three Lagos institutions: CMUL, LASUCOM, and EkoUnimed. Audience is mobile-first, likely on Android devices with mid-range data plans.

**Brand:** Oakvale Learning. Professional but approachable. Nigerian context. Education + healthcare + innovation. Contact: hello@oakvaleltd.com | www.oakvaleltd.com

---

## 2. Design Direction

### Aesthetic
- **Tone:** Confident, aspirational, grounded. Not corporate. Not startup-bro. Think "serious opportunity presented clearly."
- **Palette:** Use a restrained, professional colour scheme. Suggest a deep navy or dark teal as the primary, a warm accent colour (gold, amber, or coral) for CTAs and highlights, and clean neutrals for backgrounds. Avoid generic purple gradients and overused blue-on-white SaaS aesthetics.
- **Typography:** Use a distinctive, modern serif or humanist sans-serif for headlines (something with character — not Inter, Roboto, or Arial). Pair with a clean, highly legible body font. Google Fonts only.
- **Layout:** Clean, spacious sections with generous padding. No clutter. Mobile-first responsive. Each copy block maps to a distinct full-width section.
- **Imagery approach:** Since no images are provided, use abstract geometric patterns, subtle background textures, or coloured section dividers to create visual rhythm. Do not use placeholder stock photos. Icons are acceptable for track cards and steps.

### Key Design Constraints
- Single HTML file or single React component (self-contained)
- All CSS inline or embedded (no external stylesheets beyond Google Fonts)
- Fully responsive: must look excellent at 360px (mobile), 768px (tablet), and 1200px+ (desktop)
- Smooth scroll between sections
- All text content is provided below — use it verbatim (it has been copywritten)
- "Apply now" buttons should link to `#apply` (placeholder anchor) or use `mailto:hello@oakvaleltd.com` as fallback
- Sticky or fixed navigation header with section anchors is encouraged

---

## 3. Page Architecture

Build the page as **8 sequential sections**, each corresponding to a copy block. The sections flow top to bottom in this exact order:

| Section # | ID | Type | Copy Block |
|---|---|---|---|
| 1 | `hero` | Hero banner | Copy Block 1 |
| 2 | `overview` | Text section | Copy Block 2 |
| 3 | `tracks` | Three-card layout | Copy Block 3 |
| 4 | `innovathon` | Callout / highlight panel | Copy Block 4 |
| 5 | `how-it-works` | Stepped timeline | Copy Block 5 |
| 6 | `details` | Key details table | Copy Block 6 |
| 7 | `faq` | Accordion / collapsible Q&A | Copy Block 7 |
| 8 | `cta` | Final CTA banner | Copy Block 8 |

Additionally, include:
- A **top navigation bar** with the brand name "Oakvale Learning" on the left and anchor links to key sections (Programme, Tracks, How It Works, FAQ, Apply) on the right. Collapse to hamburger menu on mobile.
- A **footer** with: hello@oakvaleltd.com | www.oakvaleltd.com | © 2026 Oakvale Learning

---

## 4. Section-by-Section Build Instructions + Copy

### SECTION 1 — Hero (`#hero`)

**Layout:** Full-width banner. Vertically centred content. Dark or bold background colour. Large headline, subheadline below, supporting line below that, single CTA button.

**Headline (large, display font):**
> Learn to lead health systems. Not just to manage patients.

**Subheadline (medium, slightly lighter weight):**
> Four weeks. Three tracks. One programme that will change how you think about your career in healthcare.

**Supporting line (smaller body text, slightly muted):**
> The Oakvale Healthcare Leadership and Innovation Summer Intensive 2026 is a four-week blended-learning programme for penultimate and final-year health sciences students at CMUL, LASUCOM, and EkoUnimed. Applications open 9 June 2026.

**CTA button:**
> Apply now

**Design notes:**
- Headline should be the largest text on the entire page
- CTA button should use the accent colour, with hover state
- Consider a subtle animated entrance (fade-up on load)
- Minimum height: 90vh on desktop, auto on mobile

---

### SECTION 2 — Programme Overview (`#overview`)

**Layout:** Light background. Section heading + 2–3 paragraphs of body text. Generous max-width (700–800px) centred on the page for readability.

**Section heading:**
> What is this programme?

**Paragraph 1:**
> Your degree teaches you how to diagnose, treat, and care for patients. But healthcare today is more than clinical work. Someone has to run the clinic. Someone has to design the policy. Someone has to build the technology. Nigerian health professionals are stepping into those roles, and most of them had no training for it.

**Paragraph 2:**
> This programme gives you that training. In four weeks, you will study one specialist track:

**Track list (render as a styled inline list or three small pills/tags):**
- Clinical Enterprise
- Health Systems Leadership
- Digital Innovation

**Paragraph 3:**
> You will learn from Nigerian practitioners doing this work right now. You will work in a team to tackle a real healthcare challenge. And you will earn a formally recognised UK CPD certificate.

**Paragraph 4:**
> You will not just listen to lectures. You will think through real problems, discuss them with your peers, and leave with a clearer picture of who you want to be as a health professional.

---

### SECTION 3 — Tracks (`#tracks`)

**Layout:** Three equal-width cards in a row (stack vertically on mobile). Each card should have a distinct icon or visual marker, a track title, and a description paragraph. Use a subtle background colour or border to distinguish cards.

**Section heading:**
> Choose your track

**Section subtext:**
> You choose one track when you apply. You stay in that track for the full four weeks. Your track shapes the modules you study, the live sessions you attend, and the team you compete with in the Innovata-thon.

**Card A:**

- **Title:** Track A: Clinical Enterprise
- **Icon suggestion:** A briefcase, building, or stethoscope-with-chart icon
- **Body:** This track is for students who want to understand the business of healthcare. You will learn what it takes to design and run a sustainable clinical service, from MDCN regulations and financing models to quality management and operational design. You will finish with a service design capstone based on a real scenario: running a fertility clinic in Lagos.

**Card B:**

- **Title:** Track B: Health Systems Leadership
- **Icon suggestion:** A network/nodes, globe, or policy-document icon
- **Body:** This track is for students who want to influence the systems that determine health outcomes for entire communities. You will study the Nigerian public health architecture, WHO frameworks, health financing, and evidence-based policy design. You will finish with a systems change proposal based on a real maternal health challenge in Nigeria.

**Card C:**

- **Title:** Track C: Digital Innovation
- **Icon suggestion:** A laptop, circuit, or mobile-health icon
- **Body:** This track is for students who are curious about technology and want to lead digital transformation in healthcare. You will study Nigeria's digital health landscape, global standards, telemedicine design, and data governance. You will finish with a digital health solution concept based on building a telemedicine service for a Nigerian context.

---

### SECTION 4 — Innovata-thon (`#innovathon`)

**Layout:** Bold callout panel. Use a contrasting background colour (the accent colour, or a dark panel). Large heading. Short punchy paragraphs. This section should feel like an event announcement.

**Section heading:**
> The Oakvale Health Innovation Challenge

**Paragraph 1:**
> The Innovation Challenge is the capstone competition at the heart of the programme. In Week 3, your team will receive a real, unsolved challenge facing the Nigerian health system.

**Paragraph 2:**
> As a group, you will work on this challenge and shape a real-world solution. You have one week to develop your solution.

**Paragraph 3:**
> On Saturday 5 September 2026, every team will pitch their solution to an independent panel of industry judges.

**Paragraph 4:**
> Winners are announced the same day. The prize pool is ₦4,000,000, distributed across the overall winner, three track winners, and one individual student award.

**Tagline (bold, standalone):**
> This is not a simulation. The problems are real. The judges are real. The prizes are real.

**Design notes:**
- The ₦4,000,000 figure should be visually prominent (larger font, accent colour, or its own styled callout)
- The final tagline should stand apart — consider italic, a rule above, or a different text treatment

---

### SECTION 5 — How It Works (`#how-it-works`)

**Layout:** Vertical stepped timeline or numbered cards. Each step has a number/label, a title, and a description. Use a visual connector (line, dots, or arrows) between steps. Light background.

**Section heading:**
> How it works

**Step 1: Apply**
> Fill in the online application form. Share your institution, faculty, year of study, and preferred track. Write 150 words on why you want to join. Applications are reviewed on a rolling basis. We are looking for genuine curiosity and commitment, not the highest grades.

**Step 2: Get accepted**
> Accepted students receive an invitation to join the online programme platform. You will complete a short onboarding module and introduce yourself to your track community before the programme begins.

**Step 3: Attend the Opening Ceremony**
> On Saturday 8 August 2026, all students gather at Julius Berger Hall, UNILAG Yaba Campus. You will hear from senior health system leaders, meet your cohort in person, and attend a practitioner session for your track. You also have the chance to hear from industry experts on possible career pathways.

**Step 4: Complete the four weeks online**
> Starting on Monday 10 August. Each week, an interactive module unlocks on the platform. You study it in your own time. In Week 2, we will host a guest practitioner on a live session. At the end of the week, you post a reflection and respond to a peer. In Week 3, your team will receive the Innovation Challenge brief.

**Step 5: Compete in the Innovata-thon Showcase**
> On 5 September, your team pitches your solution live to the judges via Zoom. All students attend. Winners are announced at the closing ceremony. You receive your UK CPD certificate the same day.

---

### SECTION 6 — Key Details (`#details`)

**Layout:** A clean, well-styled two-column table (label | value). Alternating row shading or subtle borders. Centred on the page with a max-width.

**Section heading:**
> The details

| Label | Value |
|---|---|
| Open to | Penultimate and final-year students in Medicine, Pharmacy, Dentistry, Nursing, Lab Sciences, and Physiotherapy at CMUL, LASUCOM, and EkoUnimed. |
| Applications open | 9 June 2026 |
| Applications close | 15 July 2026 |
| Opening Ceremony | Saturday 8 August 2026. Julius Berger Hall, UNILAG Yaba. Hybrid. |
| Online modules | 10 August to 4 September 2026 |
| Innovata-thon Showcase | Saturday 5 September 2026. Online via Zoom. |
| Application fee | ₦10,000. Fifteen scholarship places available: five per institution. |
| Certificate | UK CPD-accredited certificate, formally recognised. |

---

### SECTION 7 — FAQ (`#faq`)

**Layout:** Accordion-style collapsible Q&A. Each question is a clickable header that reveals the answer. Only one answer open at a time (or allow multiple — either is fine). Light background.

**Section heading:**
> Common questions

**Q1:** Do I have to attend the Opening Ceremony in person?
**A1:** Attendance isn't mandatory, but attending the Opening Ceremony on 8 August is strongly encouraged. The rest of the programme is fully online.

**Q2:** I study Pharmacy, not Medicine. Can I apply?
**A2:** Yes. The programme is open to all health sciences disciplines: Medicine, Pharmacy, Dentistry, Nursing, Laboratory Sciences, and Physiotherapy.

**Q3:** What if I cannot pay the application fee?
**A3:** Fifteen scholarship places are available — five per track. Mention in your motivation statement that you are applying for a scholarship and why. Scholarships are awarded on merit and financial need.

**Q4:** How much time does it take each week?
**A4:** Plan for around five to seven hours per week, i.e. one hour daily. This includes the self-study module, the live session, and the weekly reflection activity.

**Q5:** What is the Innovata-thon?
**A5:** It is a team competition built into the programme. In Week 3, your team receives a real healthcare challenge. You develop a solution and pitch it live to judges on 5 September. There is a total prize pool of ₦4,000,000.

---

### SECTION 8 — Final CTA (`#cta`)

**Layout:** Full-width banner, dark or accent background (matching the hero in tone). Strong headline, supporting text, single CTA button. Should feel like a confident close.

**Headline:**
> Applications close 15 July 2026. Sixty places per institution across three tracks.

**Supporting text:**
> Three tracks. One cohort. A chance to compete for ₦4,000,000 in prizes and walk away with a UK CPD certificate. Apply now and be part of the first cohort.

**CTA button:**
> Apply now

**Below CTA (small, muted text):**
> Questions? Contact the Oakvale team: hello@oakvaleltd.com | www.oakvaleltd.com

---

## 5. Functional Requirements

### Interactions
- **Smooth scroll:** All navigation links scroll smoothly to the target section
- **FAQ accordion:** Click a question to toggle its answer. Animate open/close (slide or fade)
- **CTA buttons:** All "Apply now" buttons link to the same destination (`#apply` placeholder or `mailto:hello@oakvaleltd.com`)
- **Mobile nav:** Hamburger menu that slides in or drops down on small screens
- **Hover states:** Buttons, cards, and nav links should have clear hover/focus states

### Animations (optional but encouraged)
- Fade-up entrance on hero text elements (staggered)
- Cards in the tracks section animate in when scrolled into view
- Step numbers in the timeline pulse or highlight on scroll
- Subtle parallax on the hero background (if using a textured/patterned background)

### Accessibility
- Semantic HTML: use `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- All interactive elements keyboard-accessible
- Sufficient colour contrast (WCAG AA minimum)
- FAQ buttons should use `<button>` with `aria-expanded`
- Skip-to-content link (optional but good practice)

### Performance
- No external images to load (patterns/textures via CSS)
- Single file, minimal dependencies
- Google Fonts loaded via `<link>` in `<head>` (max 2 font families)

---

## 6. Delivery Checklist

Before marking the build as complete, verify:

- [ ] All 8 sections are present and in the correct order
- [ ] All copy is included verbatim as provided above
- [ ] The Naira symbol (₦) renders correctly for prize amounts and fees
- [ ] "Apply now" CTA appears in the hero (Section 1) and final CTA (Section 8)
- [ ] Three track cards are equal in layout and fully responsive
- [ ] FAQ accordion opens/closes correctly
- [ ] Navigation links scroll to the correct sections
- [ ] Mobile hamburger menu works
- [ ] Page is fully responsive at 360px, 768px, and 1200px+
- [ ] No placeholder text, lorem ipsum, or TODO comments remain
- [ ] Footer includes contact email and website
- [ ] No console errors
