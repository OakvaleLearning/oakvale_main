'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Federal Capital Territory (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'I am outside Nigeria',
];

type InterestKey = 'individual' | 'institution' | 'region' | 'other';

const INTEREST_CARDS: { value: InterestKey; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'individual',
    title: 'Join as an individual',
    desc: 'I am a student and I want to take part in a future edition.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
  },
  {
    value: 'institution',
    title: 'Bring in my school',
    desc: 'I want my school or institution to be part of the programme.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></svg>
    ),
  },
  {
    value: 'region',
    title: 'Come to my area',
    desc: 'I want the programme to run in my city or region.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
  {
    value: 'other',
    title: 'Something else',
    desc: 'I have a different question or idea to share.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.4-4 8-9 8a10 10 0 0 1-4-.8L3 21l1.8-4.2A7.7 7.7 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z" /></svg>
    ),
  },
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  state: '',
  discipline: '',
  individualInstitution: '',
  yearOfStudy: '',
  institutionName: '',
  institutionRole: '',
  cityOrArea: '',
  connectedSchool: '',
  message: '',
  heardVia: '',
};

type FieldKey = 'name' | 'email' | 'state' | 'interest' | 'consent' | 'discipline' | 'institutionName' | 'cityOrArea';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function RegisterInterestPage() {
  const [form, setForm] = useState(initialForm);
  const [interest, setInterest] = useState<InterestKey | ''>('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof initialForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const clearError = (key: FieldKey) => setErrors((prev) => ({ ...prev, [key]: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const next: Partial<Record<FieldKey, boolean>> = {};
    if (!form.name.trim()) next.name = true;
    if (!isEmail(form.email.trim())) next.email = true;
    if (!form.state) next.state = true;
    if (!interest) next.interest = true;
    if (interest === 'individual' && !form.discipline) next.discipline = true;
    if (interest === 'institution' && !form.institutionName.trim()) next.institutionName = true;
    if (interest === 'region' && !form.cityOrArea.trim()) next.cityOrArea = true;
    if (!consent) next.consent = true;

    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      requestAnimationFrame(() => {
        document.querySelector('.ri-error.show')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, interest, consent }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitting(false);
        toast.error(data.error || 'Something went wrong while sending. Please try again, or email hello@oakvaleltd.com.');
      }
    } catch {
      setSubmitting(false);
      toast.error('Something went wrong while sending. Please check your connection and try again.');
    }
  };

  const req = <span className="ri-req">*</span>;

  return (
    <main className="ri-shell">
      <style>{riStyles}</style>

      <div className="ri-wrap">
        <header className="ri-masthead">
          <div className="ri-eyebrow">Healthcare Leadership and Innovation Summer Intensive 2026</div>
          <h1>Register your <em>interest</em></h1>
          <p>
            We have heard from students, schools, and people across the country who want to be part of this. Tell us
            who you are and what you are hoping for. It helps us plan the next editions of the programme.
          </p>
        </header>

        <div className="ri-card">
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate>
              {/* About you */}
              <div className="ri-section">
                <div className="ri-section-eyebrow">About you</div>

                <div className="ri-field">
                  <label htmlFor="name">Full name{req}</label>
                  <input
                    type="text" id="name" autoComplete="name" placeholder="First and last name"
                    className={errors.name ? 'ri-invalid' : ''}
                    value={form.name} onChange={update('name')} onInput={() => clearError('name')}
                  />
                  <div className={`ri-error ${errors.name ? 'show' : ''}`}>Please tell us your name.</div>
                </div>

                <div className="ri-row-2">
                  <div className="ri-field">
                    <label htmlFor="email">Email address{req}</label>
                    <input
                      type="email" id="email" autoComplete="email" placeholder="you@example.com"
                      className={errors.email ? 'ri-invalid' : ''}
                      value={form.email} onChange={update('email')} onInput={() => clearError('email')}
                    />
                    <div className={`ri-error ${errors.email ? 'show' : ''}`}>Please enter a valid email address.</div>
                  </div>
                  <div className="ri-field">
                    <label htmlFor="phone">Phone or WhatsApp</label>
                    <input type="tel" id="phone" autoComplete="tel" placeholder="Optional" value={form.phone} onChange={update('phone')} />
                  </div>
                </div>

                <div className="ri-field">
                  <label htmlFor="state">Which state are you in?{req}</label>
                  <select
                    id="state" className={errors.state ? 'ri-invalid' : ''}
                    value={form.state} onChange={(e) => { update('state')(e); clearError('state'); }}
                  >
                    <option value="" disabled>Choose your state</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className={`ri-error ${errors.state ? 'show' : ''}`}>Please choose your state.</div>
                </div>
              </div>

              {/* Your interest */}
              <div className="ri-section">
                <div className="ri-section-eyebrow">Your interest</div>
                <label style={{ marginBottom: 14 }}>What are you reaching out about?{req}</label>

                <div className="ri-interest-grid">
                  {INTEREST_CARDS.map((c) => (
                    <label key={c.value} className={`ri-interest ${interest === c.value ? 'selected' : ''}`}>
                      <input
                        type="radio" name="interest" value={c.value}
                        checked={interest === c.value}
                        onChange={() => { setInterest(c.value); clearError('interest'); }}
                      />
                      <span className="ri-tick" aria-hidden="true">&#10003;</span>
                      <span className="ri-ic" aria-hidden="true">{c.icon}</span>
                      <span className="ri-t">{c.title}</span>
                      <span className="ri-d">{c.desc}</span>
                    </label>
                  ))}
                </div>
                <div className={`ri-error ${errors.interest ? 'show' : ''}`} style={{ marginTop: 10 }}>
                  Please pick one option so we know how to help.
                </div>

                {/* Branch: individual */}
                <div className={`ri-branch ${interest === 'individual' ? 'open' : ''}`}>
                  <div className="ri-branch-inner">
                    <div className="ri-field">
                      <label htmlFor="discipline">Which field are you studying?{req}</label>
                      <select
                        id="discipline" className={errors.discipline ? 'ri-invalid' : ''}
                        value={form.discipline} onChange={(e) => { update('discipline')(e); clearError('discipline'); }}
                      >
                        <option value="" disabled>Choose your field</option>
                        <option>Medicine</option>
                        <option>Pharmacy</option>
                        <option>Dentistry</option>
                        <option>Nursing</option>
                        <option>Laboratory Sciences</option>
                        <option>Physiotherapy</option>
                        <option>Other health sciences</option>
                      </select>
                      <div className={`ri-error ${errors.discipline ? 'show' : ''}`}>Please choose your field of study.</div>
                    </div>
                    <div className="ri-row-2">
                      <div className="ri-field">
                        <label htmlFor="individualInstitution">Your institution</label>
                        <input type="text" id="individualInstitution" placeholder="Name of your school" value={form.individualInstitution} onChange={update('individualInstitution')} />
                      </div>
                      <div className="ri-field">
                        <label htmlFor="yearOfStudy">Year of study</label>
                        <select id="yearOfStudy" value={form.yearOfStudy} onChange={update('yearOfStudy')}>
                          <option value="" disabled>Choose one</option>
                          <option>Penultimate year</option>
                          <option>Final year</option>
                          <option>Recent graduate</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch: institution */}
                <div className={`ri-branch ${interest === 'institution' ? 'open' : ''}`}>
                  <div className="ri-branch-inner">
                    <div className="ri-field">
                      <label htmlFor="institutionName">Name of the school or institution{req}</label>
                      <input
                        type="text" id="institutionName" placeholder="Full name, no short forms"
                        className={errors.institutionName ? 'ri-invalid' : ''}
                        value={form.institutionName} onChange={update('institutionName')} onInput={() => clearError('institutionName')}
                      />
                      <div className={`ri-error ${errors.institutionName ? 'show' : ''}`}>Please give the name of the school or institution.</div>
                    </div>
                    <div className="ri-field">
                      <label htmlFor="institutionRole">Your role there</label>
                      <div className="ri-hint">For example: lecturer, faculty member, administrator, or student leader.</div>
                      <input type="text" id="institutionRole" placeholder="Your role" value={form.institutionRole} onChange={update('institutionRole')} />
                    </div>
                  </div>
                </div>

                {/* Branch: region */}
                <div className={`ri-branch ${interest === 'region' ? 'open' : ''}`}>
                  <div className="ri-branch-inner">
                    <div className="ri-field">
                      <label htmlFor="cityOrArea">Which city or area?{req}</label>
                      <input
                        type="text" id="cityOrArea" placeholder="For example: Ibadan, Kano, Port Harcourt"
                        className={errors.cityOrArea ? 'ri-invalid' : ''}
                        value={form.cityOrArea} onChange={update('cityOrArea')} onInput={() => clearError('cityOrArea')}
                      />
                      <div className={`ri-error ${errors.cityOrArea ? 'show' : ''}`}>Please tell us which city or area.</div>
                    </div>
                    <div className="ri-field">
                      <label htmlFor="connectedSchool">Is there a school there you would connect us with?</label>
                      <input type="text" id="connectedSchool" placeholder="Optional" value={form.connectedSchool} onChange={update('connectedSchool')} />
                    </div>
                  </div>
                </div>
              </div>

              {/* A little more */}
              <div className="ri-section">
                <div className="ri-section-eyebrow">A little more</div>

                <div className="ri-field">
                  <label htmlFor="message">Tell us what you are hoping for</label>
                  <div className="ri-hint">A sentence or two is fine. This helps us plan future editions.</div>
                  <textarea id="message" placeholder="Share your idea, question, or reason for reaching out" value={form.message} onChange={update('message')} />
                </div>

                <div className="ri-field">
                  <label htmlFor="heardVia">How did you hear about the programme?</label>
                  <select id="heardVia" value={form.heardVia} onChange={update('heardVia')}>
                    <option value="" disabled>Choose one</option>
                    <option>LinkedIn</option>
                    <option>A friend or classmate</option>
                    <option>My school or a lecturer</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="ri-consent">
                  <input type="checkbox" id="consent" checked={consent} onChange={(e) => { setConsent(e.target.checked); clearError('consent'); }} />
                  <label htmlFor="consent">
                    I am happy for Oakvale Learning to contact me about future editions of the programme. We will keep
                    your details safe, use them only for this purpose, and remove them if you ask us to.
                  </label>
                </div>
                <div className={`ri-error ${errors.consent ? 'show' : ''}`} style={{ marginTop: 8 }}>
                  Please tick the box so we can get back to you.
                </div>
              </div>

              <div className="ri-actions">
                <button type="submit" className="ri-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send my interest'}
                </button>
                <div className="ri-form-note">We read every message. You will hear from us as we plan what comes next.</div>
              </div>
            </form>
          ) : (
            <div className="ri-success" role="status" aria-live="polite">
              <div className="ri-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h2>Thank you</h2>
              <p>
                Your interest has been received. We will be in touch as we plan the next editions of the programme.
                Please keep an eye on your email.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const riStyles = `
.ri-shell{
  --ri-green:#0a3d2b; --ri-green-mid:#145c3f; --ri-amber:#c8881a; --ri-amber-light:#e8a832;
  --ri-sage:#a8d5b5; --ri-sage-light:#d6ede0; --ri-slate:#4a5568;
  --ri-parchment:#f7f3ec; --ri-parchment-warm:#ede7db; --ri-stone:#d4cfca; --ri-white:#ffffff;
  --ri-serif:var(--font-cormorant), 'Cormorant Garamond', serif;
  --ri-body:'DM Sans', sans-serif;
  --ri-shadow-card:0 24px 70px rgba(10,61,43,0.12); --ri-radius:14px;
  display:flex;justify-content:center;
  background:var(--ri-parchment);color:var(--ri-green);
  font-family:var(--ri-body);line-height:1.6;
  padding:120px 16px 64px;
}
.ri-shell *{box-sizing:border-box;}
.ri-wrap{width:100%;max-width:660px;}

.ri-masthead{background:var(--ri-green);border-radius:var(--ri-radius) var(--ri-radius) 0 0;padding:40px 36px 34px;position:relative;overflow:hidden;}
.ri-masthead::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 78% 90% at 85% 0%, rgba(20,92,63,0.6) 0%, transparent 68%);pointer-events:none;}
.ri-eyebrow{position:relative;z-index:1;font-size:10.5px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ri-amber-light);margin-bottom:16px;line-height:1.5;}
.ri-masthead h1{position:relative;z-index:1;font-family:var(--ri-serif);font-weight:300;font-size:clamp(38px,8vw,54px);letter-spacing:-0.005em;line-height:1.05;color:var(--ri-parchment);margin:0 0 16px;}
.ri-masthead h1 em{font-style:italic;color:var(--ri-amber-light);}
.ri-masthead p{position:relative;z-index:1;font-size:14.5px;color:rgba(247,243,236,0.82);max-width:520px;line-height:1.72;margin:0;}

.ri-card{background:var(--ri-white);border-radius:0 0 var(--ri-radius) var(--ri-radius);box-shadow:var(--ri-shadow-card);padding:36px 36px 40px;}

.ri-section{padding:6px 0 4px;}
.ri-section + .ri-section{margin-top:30px;padding-top:30px;border-top:1px solid var(--ri-parchment-warm);}
.ri-section-eyebrow{font-weight:600;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ri-amber);display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.ri-section-eyebrow::before{content:'';width:22px;height:2px;background:var(--ri-amber);border-radius:2px;}

.ri-field{margin-bottom:18px;}
.ri-field:last-child{margin-bottom:0;}
.ri-shell label{display:block;font-size:13.5px;font-weight:500;color:var(--ri-green);margin-bottom:7px;}
.ri-req{color:var(--ri-amber);font-weight:700;margin-left:2px;}
.ri-hint{font-size:12px;color:var(--ri-slate);font-weight:400;margin-top:-3px;margin-bottom:7px;}

.ri-shell input[type=text],.ri-shell input[type=email],.ri-shell input[type=tel],.ri-shell select,.ri-shell textarea{
  width:100%;font-family:var(--ri-body);font-size:14.5px;color:var(--ri-green);background:var(--ri-parchment);
  border:1.5px solid var(--ri-parchment-warm);border-radius:9px;padding:12px 14px;transition:border-color .15s, box-shadow .15s, background .15s;
}
.ri-shell textarea{min-height:110px;resize:vertical;line-height:1.6;}
.ri-shell select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%230a3d2b' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:38px;}
.ri-shell input:focus,.ri-shell select:focus,.ri-shell textarea:focus{outline:none;border-color:var(--ri-amber);box-shadow:0 0 0 3px rgba(200,136,26,0.20);background:var(--ri-white);}
.ri-shell input.ri-invalid,.ri-shell select.ri-invalid,.ri-shell textarea.ri-invalid{border-color:var(--ri-amber);box-shadow:0 0 0 3px rgba(200,136,26,0.14);}
.ri-error{color:var(--ri-amber);font-size:12px;margin-top:6px;display:none;font-weight:500;}
.ri-error.show{display:block;}

.ri-interest-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.ri-interest{position:relative;cursor:pointer;background:var(--ri-parchment);border:1.5px solid var(--ri-parchment-warm);border-radius:12px;padding:18px 16px 16px;transition:border-color .15s, background .15s, transform .1s;margin:0;}
.ri-interest:hover{border-color:var(--ri-sage);}
.ri-interest:active{transform:scale(0.99);}
.ri-interest input{position:absolute;opacity:0;pointer-events:none;}
.ri-ic{width:34px;height:34px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:var(--ri-sage-light);color:var(--ri-green);transition:background .15s,color .15s;}
.ri-ic svg{width:19px;height:19px;}
.ri-t{display:block;font-size:14px;font-weight:600;color:var(--ri-green);margin-bottom:4px;line-height:1.25;}
.ri-d{display:block;font-size:12.5px;color:var(--ri-slate);line-height:1.45;font-weight:400;}
.ri-tick{position:absolute;top:12px;right:12px;width:20px;height:20px;border-radius:50%;background:var(--ri-amber);color:var(--ri-white);display:none;align-items:center;justify-content:center;font-size:12px;}
.ri-interest.selected{border-color:var(--ri-green);background:var(--ri-sage-light);}
.ri-interest.selected .ri-ic{background:var(--ri-green);color:var(--ri-white);}
.ri-interest.selected .ri-tick{display:flex;}

.ri-branch{overflow:hidden;max-height:0;opacity:0;transition:max-height .35s ease, opacity .3s ease, margin .3s ease;margin-top:0;}
.ri-branch.open{max-height:640px;opacity:1;margin-top:22px;}
.ri-branch-inner{background:var(--ri-parchment);border-radius:11px;padding:20px 18px 6px;border-left:3px solid var(--ri-amber);}

.ri-consent{display:flex;gap:12px;align-items:flex-start;background:var(--ri-sage-light);border-radius:11px;padding:16px;margin-top:4px;}
.ri-consent input{margin-top:3px;width:18px;height:18px;flex-shrink:0;accent-color:var(--ri-green);cursor:pointer;}
.ri-consent label{font-size:12.5px;color:var(--ri-slate);font-weight:400;line-height:1.55;margin:0;cursor:pointer;}

.ri-actions{margin-top:28px;}
.ri-submit{width:100%;font-family:var(--ri-body);font-weight:600;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ri-white);background:var(--ri-amber);border:none;border-radius:3px;padding:16px 24px;cursor:pointer;transition:background .15s, transform .1s, box-shadow .15s;box-shadow:0 8px 22px rgba(200,136,26,0.30);}
.ri-submit:hover{background:var(--ri-green);box-shadow:0 8px 26px rgba(10,61,43,0.30);}
.ri-submit:active{transform:translateY(1px);}
.ri-submit:disabled{opacity:0.6;cursor:default;box-shadow:none;}
.ri-form-note{font-size:12px;color:var(--ri-slate);text-align:center;margin-top:14px;line-height:1.5;}

.ri-success{text-align:center;padding:20px 8px 8px;}
.ri-badge{width:64px;height:64px;margin:0 auto 22px;border-radius:50%;background:var(--ri-sage-light);color:var(--ri-green);display:flex;align-items:center;justify-content:center;}
.ri-badge svg{width:30px;height:30px;}
.ri-success h2{font-family:var(--ri-serif);font-weight:400;font-size:32px;letter-spacing:0;color:var(--ri-green);margin:0 0 12px;}
.ri-success p{font-size:14.5px;color:var(--ri-slate);max-width:420px;margin:0 auto;line-height:1.7;}

.ri-row-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}

@media (max-width:560px){
  .ri-shell{padding:96px 12px 48px;}
  .ri-masthead{padding:32px 22px 28px;}
  .ri-card{padding:26px 20px 30px;}
  .ri-interest-grid{grid-template-columns:1fr;}
  .ri-row-2{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){
  .ri-shell *{transition:none !important;}
}
`;
