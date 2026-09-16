'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Building2,
  ChartColumn,
  Clapperboard,
  ClipboardCheck,
  FileText,
  Globe,
  GraduationCap,
  Landmark,
  Link2,
  Package,
  Quote,
  Smartphone,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import styles from '../build-for-you/BuildForYou.module.css';

const processSteps = [
  { num: '01', label: 'Your Content In', sub: 'Manuals, slides, scripts, video, expertise', accent: false },
  { num: '02', label: 'Oakvale Builds', sub: 'Instructional design, production, QA', accent: true },
  { num: '03', label: 'Finished Modules Out', sub: 'SCORM-ready, platform-agnostic, yours', accent: false },
  { num: '04', label: 'Deployed & Tracked', sub: 'LMS setup, analytics, learner data', accent: false },
];

const audiences: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Landmark,
    title: 'Professional Associations & Membership Bodies',
    body: 'You have standards, competency frameworks and training programmes. We convert them into scalable digital learning your members can access on demand - without you needing an in-house production team.',
  },
  {
    Icon: Stethoscope,
    title: 'Health & Social Care Organisations',
    body: 'Training teams with existing content, induction programmes or mandatory learning that needs to be modernised, digitalised and deployed across dispersed workforces quickly and cost-effectively.',
  },
  {
    Icon: GraduationCap,
    title: 'Academic Institutions & CPD Providers',
    body: 'Course content, lecture materials or CPD programmes that need to move online. We handle the instructional redesign, interactive build and LMS deployment so your faculty can focus on the teaching.',
  },
  {
    Icon: Globe,
    title: 'Development Organisations & NGOs',
    body: 'Field-tested training curricula that need to reach geographically dispersed workforces at scale. We build for low-bandwidth environments, mobile-first delivery and multilingual learner populations.',
  },
  {
    Icon: Building2,
    title: 'Corporates & L&D Teams',
    body: 'Onboarding programmes, compliance training, product knowledge or leadership content that needs to be converted into professional digital learning without stretching an internal L&D team.',
  },
  {
    Icon: ClipboardCheck,
    title: 'Regulators & Standards Bodies',
    body: 'Regulatory guidance, licensing requirements or sector standards that need to become accessible, assessable digital learning - with completion tracking and outcome evidence built in.',
  },
];

const buildTypes = [
  {
    num: '01',
    title: 'Interactive E-Learning Modules',
    body: 'Scenario-based, branching modules with knowledge checks, reflection activities and summative assessment. Built in Articulate Rise or Storyline, or Genially for rapid development. Delivered as SCORM.',
    tags: ['Articulate', 'Genially', 'SCORM'],
  },
  {
    num: '02',
    title: 'Animated Video & Explainer Content',
    body: 'Scripted and produced animated videos for complex concepts, process walkthroughs or case-based learning. Voiceover in English and African languages where required.',
    tags: ['Animation', 'Voiceover', 'Multilingual'],
  },
  {
    num: '03',
    title: 'Microlearning & Mobile-First Content',
    body: 'Short-form modules optimised for smartphone access. Ideal for frontline workforces, just-in-time learning and reinforcement between formal training events.',
    tags: ['Mobile-First', 'Low Bandwidth', 'Bite-Size'],
  },
  {
    num: '04',
    title: 'Blended Programme Design',
    body: 'Where face-to-face or virtual facilitation remains essential, we design the digital components that sit alongside it - pre-work, application activities, and post-training reinforcement.',
    tags: ['Blended', 'Pre-Work', 'Facilitation Guides'],
  },
  {
    num: '05',
    title: 'Assessment & Certification Modules',
    body: 'Competency-based assessments, end-of-programme evaluations and certificate-generating modules aligned to your standards and qualification frameworks.',
    tags: ['Assessment', 'Certification', 'Competency'],
  },
  {
    num: '06',
    title: 'LMS Setup & Deployment',
    body: 'If you do not have a platform, we configure and deploy one. Moodle or TalentLMS on your infrastructure. Learner management, analytics dashboards and completion reporting included.',
    tags: ['Moodle', 'TalentLMS', 'Analytics'],
  },
];

const processStages = [
  {
    num: 'Step 01',
    title: 'Brief & Scoping Call',
    body: 'You send us your content, context and learning objectives. We review it and schedule a 45-minute scoping call to agree scope, format, timeline and deliverables. No lengthy discovery process - we move quickly.',
  },
  {
    num: 'Step 02',
    title: 'Instructional Design',
    body: 'Our instructional designers restructure your content into a learning design that works digitally - sequencing, scenario design, knowledge check placement and assessment strategy. You review and approve before production begins.',
  },
  {
    num: 'Step 03',
    title: 'Build & Subject Review',
    body: 'We build the modules and share a draft for your subject matter expert review. One round of structured feedback is built into every project. Additional rounds available on request. Your content accuracy is non-negotiable.',
  },
  {
    num: 'Step 04',
    title: 'Delivery & Handover',
    body: 'Finished modules delivered as SCORM packages for upload to your existing LMS, or deployed directly to a platform we configure for you. Full handover documentation included. You own everything we build.',
  },
];

const youBring = [
  'Existing training materials in any format - slides, Word documents, PDFs, videos, manuals',
  'Subject matter experts available for a structured review session',
  'Clear learning objectives, or willingness to develop them with us in the scoping call',
  'Your branding, style guide or visual identity for us to apply',
  'Access to your LMS for SCORM upload, or an indication that you need one set up',
  'A designated point of contact for feedback and approval at each stage',
];

const weBring = [
  'Instructional designers who restructure content for how adults actually learn in digital environments',
  'Rapid production in Articulate Rise, Articulate Storyline or Genially',
  'Script writing and animation production for video content',
  'Voiceover recording in English and African languages on request',
  'Graphic design and illustration aligned to your brand',
  'Quality assurance review by an independent reviewer before every delivery',
  'SCORM packaging and LMS deployment support',
];

const formats: { Icon: LucideIcon; name: string; desc: string }[] = [
  {
    Icon: Package,
    name: 'SCORM 1.2 / 2004',
    desc: 'Compatible with Moodle, TalentLMS, Cornerstone, SAP SuccessFactors, Docebo and most enterprise LMS platforms.',
  },
  {
    Icon: ChartColumn,
    name: 'xAPI / Tin Can',
    desc: 'For organisations requiring granular learner activity data beyond SCORM completion and score. Full activity stream reporting.',
  },
  {
    Icon: Smartphone,
    name: 'Mobile-Responsive HTML5',
    desc: 'Every module is built responsive by default. No app download required. Runs in any mobile browser, including offline-capable builds.',
  },
  {
    Icon: Clapperboard,
    name: 'MP4 Video',
    desc: 'Animated or recorded video assets delivered as standalone MP4 files or embedded within interactive modules.',
  },
  {
    Icon: FileText,
    name: 'PDF Job Aids',
    desc: 'Supporting reference materials, quick-reference guides and performance support tools delivered alongside modules.',
  },
  {
    Icon: Link2,
    name: 'Direct LMS Deployment',
    desc: 'We upload, configure and test modules directly in your LMS or a platform we set up - so you receive a working course, not just files.',
  },
];

const organisationTypes = [
  'Health or social care organisation',
  'Professional association or membership body',
  'University or CPD provider',
  'NGO or development organisation',
  'Corporate / L&D team',
  'Regulator or standards body',
  'Other',
];

const moduleCounts = ['1–3 modules', '4–8 modules', '9–15 modules', 'Full programme (15+)', 'Not sure yet'];

const emptyForm = {
  name: '',
  organisation: '',
  email: '',
  phone: '',
  organisationType: '',
  moduleCount: '',
  description: '',
};

export default function BuildForYouPage() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your brief...');

    try {
      const response = await fetch('/api/build-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        setForm(emptyForm);
        toast.success('Your brief has been sent. We will respond within one working day.', { duration: 6000 });
      } else {
        toast.error(data.error || 'Failed to send your brief. Please try again.', { duration: 6000 });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error('There was an error sending your brief. Please try again later.', { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* HERO */}
      <div className={styles.hero}> 
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>E-Learning Development</div>
          <h1 className={styles.heroTitle}>
            You have the content.
            <br />
            We build the <em>learning.</em>
          </h1>
          <p className={styles.heroSub}>
            Oakvale turns existing training content, curricula, scripts and subject matter expertise into
            professional, interactive e-learning - ready to deploy on any platform, to any workforce.
          </p>
          <div className={styles.heroActions}>
            <a href="#contact" className={styles.btnPrimary}>Send us your brief</a>
            <a href="#how-it-works" className={styles.btnGhost}>See how it works</a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.processStack}>
            {processSteps.map((step) => (
              <div
                key={step.num}
                className={`${styles.processCard}  `}
              >
                <div className={styles.processStepNum}>{step.num}</div>
                <div>
                  <div className={styles.processStepLabel}>{step.label}</div>
                  <div className={styles.processStepSub}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO THIS IS FOR */}
      <section className={`${styles.section} ${styles.who}`}>
        <div className={styles.label}>Who this is for</div>
        <h2 className={`${styles.title} ${styles.whoTitle}`}>
          Built for organisations
          <br />
          <em>with content to convert.</em>
        </h2>
        <p className={`${styles.body} ${styles.whoIntro}`}>
          You do not need to start from scratch. If your organisation already has training materials, a defined
          curriculum, or subject matter expertise - we take what you have and build it into something your learners
          can actually use.
        </p>
        <div className={styles.whoGrid}>
          {audiences.map((item) => (
            <div key={item.title} className={styles.whoCard}>
              <item.Icon className={styles.whoIcon} strokeWidth={1.5} aria-hidden="true" />
              <div className={styles.whoCardTitle}>{item.title}</div>
              <div className={styles.whoBody}>{item.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className={`${styles.section} ${styles.whatWeBuild}`}>
        <div className={styles.buildHeader}>
          <div>
            <div className={styles.label}>What we build</div>
            <h2 className={styles.title}>
              Six types of
              <br />
              <em>digital learning</em>
              <br />
              we produce for you.
            </h2>
          </div>
          <div>
            <p className={styles.body}>
              Every module we build is designed around how people actually learn - not how content is normally
              organised. We restructure, reframe and rewrite where needed. The subject matter expertise stays yours.
              The instructional design is ours.
            </p>
          </div>
        </div>
        <div className={styles.buildGrid}>
          {buildTypes.map((item) => (
            <div key={item.num} className={styles.buildCard}>
              <div className={styles.buildNumber}>{item.num}</div>
              <div className={styles.buildTitle}>{item.title}</div>
              <div className={styles.buildBody}>{item.body}</div>
              <div className={styles.buildTags}>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.buildTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${styles.section} ${styles.how}`} id="how-it-works">
        <div className={styles.howHeader}>
          <div className={`${styles.label} ${styles.labelLight}`}>How it works</div>
          <h2 className={`${styles.title} ${styles.howTitle}`}>
            From brief to <em>live modules</em>
            <br />
            in as little as two weeks.
          </h2>
          <p className={styles.howIntro}>
            Our production process is designed for speed without sacrificing quality. We can turn around a single
            module in five to seven working days. A full programme of eight to ten modules typically takes four to six
            weeks from brief to delivery.
          </p>
        </div>
        <div className={styles.howSteps}>
          {processStages.map((step) => (
            <div key={step.num} className={styles.howStep}>
              <div className={styles.stepDot}>
                <div className={styles.stepDotInner} />
              </div>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepBody}>{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU BRING / WHAT WE BRING */}
      <section className={`${styles.section} ${styles.youBring}`}>
        <div className={styles.bringSplit}>
          <div className={styles.bringCol}>
            <div className={styles.label}>What you bring</div>
            <h3>
              Your expertise.
              <br />
              <em>Your content.</em>
              <br />
              Your standards.
            </h3>
            <ul className={styles.bringList}>
              {youBring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.bringDivider} />
          <div className={styles.bringCol}>
            <div className={styles.label}>What we bring</div>
            <h3>
              Instructional design.
              <br />
              <em>Production.</em>
              <br />
              Speed.
            </h3>
            <ul className={styles.bringList}>
              {weBring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OUTPUT FORMATS */}
      <section className={`${styles.section} ${styles.formats}`}>
        <div className={styles.formatsHeader}>
          <div>
            <div className={styles.label}>Output formats</div>
            <h2 className={styles.title}>
              Platform-agnostic.
              <br />
              <em>Yours to own.</em>
            </h2>
          </div>
          <p className={styles.body}>
            Every module we build is delivered as a SCORM 1.2 or xAPI package compatible with any modern LMS. If you
            have a platform, we upload to it. If you don&apos;t, we set one up.
          </p>
        </div>
        <div className={styles.formatGrid}>
          {formats.map((item) => (
            <div key={item.name} className={styles.formatCard}>
              <item.Icon className={styles.formatIcon} strokeWidth={1.5} aria-hidden="true" />
              <div className={styles.formatName}>{item.name}</div>
              <div className={styles.formatDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* CTA / CONTACT */}
      <section className={styles.ctaSection} id="contact">
        <div className={styles.ctaInner}>
          <div className={`${styles.label} ${styles.labelLight}`}>Get started</div>
          <h2 className={styles.ctaTitle}>
            Tell us what you
            <br />
            <em>need built.</em>
          </h2>
          <p className={styles.ctaBody}>
            Send us a brief outline of your project - what content you have, who it is for, and when you need it. We
            will come back to you within one working day with an initial response and a proposed next step.
          </p>
          <form className={styles.ctaForm} onSubmit={handleSubmit}>
            <div className={styles.ctaRow}>
              <input
                type="text"
                placeholder="Your name *"
                aria-label="Your name"
                value={form.name}
                onChange={update('name')}
                required
              />
              <input
                type="text"
                placeholder="Organisation *"
                aria-label="Organisation"
                value={form.organisation}
                onChange={update('organisation')}
                required
              />
            </div>
            <div className={styles.ctaRow}>
              <input
                type="email"
                placeholder="Email address *"
                aria-label="Email address"
                value={form.email}
                onChange={update('email')}
                required
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp"
                aria-label="Phone or WhatsApp number"
                value={form.phone}
                onChange={update('phone')}
              />
            </div>
            <select aria-label="Organisation type" value={form.organisationType} onChange={update('organisationType')}>
              <option value="" disabled>Organisation type</option>
              {organisationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select aria-label="Approximate number of modules needed" value={form.moduleCount} onChange={update('moduleCount')}>
              <option value="" disabled>Approximate number of modules needed</option>
              {moduleCounts.map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
            <textarea
              placeholder="Brief description of your project - what content you have, who it is for, and when you need it *"
              aria-label="Brief description of your project"
              value={form.description}
              onChange={update('description')}
              required
            />
            <button type="submit" className={styles.formSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : <>Send brief <ArrowRight className={styles.submitIcon} aria-hidden="true" /></>}
            </button>
            <p className={styles.formNote}>
              Or contact us directly at{' '}
              <a href="mailto:hello@oakvalelearning.com">hello@oakvalelearning.com</a>. We respond within one working
              day. No commitment required at this stage.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
