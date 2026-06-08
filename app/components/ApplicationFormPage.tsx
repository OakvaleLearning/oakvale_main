'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Check,
  Upload, FileText, X, Info, CheckCircle2,
} from 'lucide-react';

const C = {
  forest: '#0A3D2B',
  forestMid: '#145C3F',
  gold: '#C8881A',
  cream: '#F7F3EC',
  creamWarm: '#EDE7DB',
  charcoal: '#1C1C1C',
  muted: '#5A5A5A',
  border: 'rgba(10,61,43,0.12)',
};

type TrackKey = 'A' | 'B' | 'C';
type AidKey = 'full' | 'flexible';

interface FormData {
  firstName: string; lastName: string; email: string; phone: string; state: string;
  institution: string; discipline: string; yearOfStudy: string; studentId: string;
  trackFirst: TrackKey | ''; trackSecond: string;
  mot1: string; mot2: string;
  needsAid: boolean; aidLevel: AidKey | ''; aidStatement: string;
}

const BLANK: FormData = {
  firstName: '', lastName: '', email: '', phone: '', state: '',
  institution: '', discipline: '', yearOfStudy: '', studentId: '',
  trackFirst: '', trackSecond: '',
  mot1: '', mot2: '',
  needsAid: false, aidLevel: '', aidStatement: '',
};

const STEP_LABELS = ['Personal', 'Academic', 'Track', 'Statement', 'Financial', 'Review'];

const TRACKS = [
  {
    key: 'A' as TrackKey,
    label: 'Track A',
    name: 'Clinical Enterprise',
    badgeBg: '#dcf5e7', badgeColor: '#145C3F',
    desc: 'Design, run, and lead a sustainable healthcare service. Covers business of healthcare, clinical operations, quality management, and MDCN regulations. Capstone: designing a fertility clinic in Lagos.',
  },
  {
    key: 'B' as TrackKey,
    label: 'Track B',
    name: 'Health Systems Leadership',
    badgeBg: '#dce8ff', badgeColor: '#1a4bcc',
    desc: 'Lead within and improve complex public health systems. Covers Nigerian public health architecture, WHO frameworks, health financing, and evidence-based policy. Capstone: strengthening maternal health services in a Nigerian state.',
  },
  {
    key: 'C' as TrackKey,
    label: 'Track C',
    name: 'Digital Health Innovation',
    badgeBg: '#fff4dc', badgeColor: '#a06010',
    desc: 'Lead digital transformation in healthcare. Covers the Nigerian digital health landscape, telemedicine design, data governance, and global standards. Capstone: building a telemedicine service for a Nigerian context.',
  },
];

const TRACK_LABELS: Record<TrackKey, string> = {
  A: 'Track A: Clinical Enterprise',
  B: 'Track B: Health Systems Leadership',
  C: 'Track C: Digital Health Innovation',
};

const AID_LEVELS: { key: AidKey; name: string; desc: string }[] = [
  { key: 'full',     name: 'Full scholarship',  desc: '₦10,000 fee fully waived' },
  { key: 'flexible', name: 'Flexible payment',  desc: 'Pay in two instalments' },
];

function wordCount(t: string) {
  return t.trim() === '' ? 0 : t.trim().split(/\s+/).length;
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${Math.round(b / 1048576 * 10) / 10} MB`;
}

// ─── shared style fragments ───────────────────────────────────────────────────

const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  border: `1px solid ${C.border}`, borderRadius: 4,
  fontFamily: 'DM Sans, sans-serif', fontSize: 14,
  color: C.charcoal, backgroundColor: '#fff',
  outline: 'none', boxSizing: 'border-box',
};

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: C.charcoal, marginBottom: 5, fontFamily: 'DM Sans, sans-serif',
};

const hint: React.CSSProperties = {
  fontSize: 12, color: C.muted, marginTop: 4,
  fontFamily: 'DM Sans, sans-serif',
};

const req = <span style={{ color: '#c0392b' }}> *</span>;

// ─── NavRow helper ────────────────────────────────────────────────────────────

function NavRow({
  onBack, onNext, nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: `0.5px solid ${C.border}` }}>
      {onBack ? (
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: `0.5px solid ${C.border}`, borderRadius: 4, padding: '8px 18px', fontSize: 14, cursor: 'pointer', color: C.charcoal, fontFamily: 'DM Sans, sans-serif' }}>
          <ChevronLeft size={15} /> Back
        </button>
      ) : <div />}
      <button onClick={onNext} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.forest, border: 'none', borderRadius: 4, padding: '9px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
        {nextLabel} <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionHead({ title, sub }: { title: React.ReactNode; sub: string }) {
  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 500, color: C.forest, fontFamily: 'var(--font-cormorant)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: '1.25rem', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>{sub}</div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ApplicationFormPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(BLANK);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [stepError, setStepError] = useState('');
  const [consents, setConsents] = useState([false, false, false]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [requiresPayment, setRequiresPayment] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function validate(s: number): string {
    if (s === 0) {
      if (!form.firstName.trim()) return 'First name is required.';
      if (!form.lastName.trim()) return 'Last name is required.';
      if (!form.email.trim()) return 'Email address is required.';
      if (!form.phone.trim()) return 'Phone number is required.';
      if (!form.state.trim()) return 'State of residence is required.';
    }
    if (s === 1) {
      if (!form.institution) return 'Please select your institution.';
      if (!form.discipline) return 'Please select your discipline.';
      if (!form.yearOfStudy) return 'Please select your year of study.';
      if (!form.studentId.trim()) return 'Student ID is required.';
    }
    if (s === 2) {
      if (!form.trackFirst) return 'Please select a track.';
    }
    if (s === 3) {
      if (!form.mot1.trim()) return 'Please answer the first motivation question.';
      if (!form.mot2.trim()) return 'Please answer the second motivation question.';
    }
    if (s === 4) {
      if (form.needsAid && !form.aidLevel) return 'Please select a level of support needed.';
      if (form.needsAid && !form.aidStatement.trim()) return 'Please explain why you are applying for financial aid.';
    }
    return '';
  }

  function goNext() {
    const err = validate(step);
    if (err) { setStepError(err); return; }
    setStepError('');
    setStep(s => s + 1);
  }

  function goBack() {
    setStepError('');
    setStep(s => s - 1);
  }

  function goTo(n: number) {
    if (n < step) { setStepError(''); setStep(n); }
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (let i = 0; i < list.length; i++) {
      if (next.length >= 3) break;
      if (list[i].size > 5 * 1024 * 1024) continue;
      next.push(list[i]);
    }
    setFiles(next);
  }

  async function handleSubmit() {
    if (!consents[0] || !consents[1] || !consents[2]) {
      setSubmitError('Please confirm all three statements before submitting.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      for (const [k, v] of Object.entries(form)) {
        fd.append(k, typeof v === 'boolean' ? String(v) : (v ?? '') as string);
      }
      fd.append('consentTruth', String(consents[0]));
      fd.append('consentContact', String(consents[1]));
      fd.append('consentTerms', String(consents[2]));
      for (const file of files) fd.append('aidFiles', file);
      const res = await fetch('/api/apply', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSubmitError(json.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setPaymentUrl(json.paymentUrl ?? null);
      setRequiresPayment(json.requiresPayment !== false);
      setSubmitted(true);
    } catch {
      setSubmitError('Could not reach the server. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  // ─── Success ───────────────────────────────────────────────────────────────

  if (submitted) {
    return <SuccessScreen paymentUrl={paymentUrl} requiresPayment={requiresPayment} />;
  }

  // ─── Wrapper ───────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>
            Oakvale Learning · Summer Intensive 2026
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, fontWeight: 400, color: C.forest, margin: '0 0 6px', lineHeight: 1.2 }}>
            Student Application Form
          </h1>
        
          <p className='py-2what'>All fields marked <span style={{ color: '#c0392b' }}>*</span> are required.</p>
          <span className="text-slate-500 font-medium font-sans border-b border-slate-300 pb-0.5" style={{ display: 'inline-block', marginTop: 6, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}> 
           Want to learn more? {" "}
          <a
            href="/apply/faq"
            style={{
              display: 'inline-block', 
              fontWeight: 500,
              color: C.gold,
              textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif', 
              paddingBottom: 1,
            }}
          >
           Read the FAQs before you apply →
          </a>
          </span>
        </div>

        {/* Step bar */}
        <div style={{ display: 'flex', marginBottom: '1.75rem', border: `0.5px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
          {STEP_LABELS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={label}
                onClick={() => goTo(i)}
                style={{
                  flex: 1, padding: '9px 4px', textAlign: 'center',
                  fontSize: 11, fontWeight: 500, lineHeight: 1.3,
                  cursor: done ? 'pointer' : 'default',
                  border: 'none',
                  borderRight: i < STEP_LABELS.length - 1 ? `0.5px solid ${C.border}` : 'none',
                  background: active ? C.creamWarm : '#fff',
                  color: active ? C.forest : done ? C.forestMid : C.muted,
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background 0.15s',
                }}
              >
                {done
                  ? <Check size={12} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                  : <span style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{i + 1}</span>
                }
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Validation error */}
        {stepError && (
          <div style={{ background: '#fff3f3', border: '0.5px solid #f5c6c6', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#b91c1c', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif' }}>
            {stepError}
          </div>
        )}

        {/* ── STEP 0: Personal ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <SectionHead title="Personal details" sub="Enter your details exactly as they appear on your student ID." />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>First name{req}</label>
                <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="e.g. Adaeze" style={input} />
              </div>
              <div>
                <label style={lbl}>Last name{req}</label>
                <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="e.g. Okafor" style={input} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Email address{req}</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your.name@email.com" style={input} />
              <p style={hint}>We will send your offer and all communications to this address.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Phone number (WhatsApp){req}</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" style={input} />
                <p style={hint}>We will send updates via WhatsApp.</p>
              </div>
              <div>
                <label style={lbl}>State of residence{req}</label>
                <input type="text" value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Lagos" style={input} />
              </div>
            </div>

            <NavRow onNext={goNext} nextLabel="Next: Academic details" />
          </div>
        )}

        {/* ── STEP 1: Academic ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <SectionHead title="Academic information" sub="Tell us about your current studies." />

            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Institution{req}</label>
              <select value={form.institution} onChange={e => set('institution', e.target.value)} style={input}>
                <option value="">Select your institution</option>
                <option>CMUL (College of Medicine, University of Lagos)</option>
                <option>LASUCOM (Lagos State University College of Medicine)</option>
                <option>EkoUnimed (Ekiti State University College of Medicine)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Discipline / Faculty{req}</label>
                <select value={form.discipline} onChange={e => set('discipline', e.target.value)} style={input}>
                  <option value="">Select your discipline</option>
                  <option>Medicine and Surgery</option>
                  <option>Pharmacy</option>
                  <option>Dentistry</option>
                  <option>Nursing</option>
                  <option>Medical Laboratory Sciences</option>
                  <option>Physiotherapy</option>
                  <option>Other health sciences</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Current year of study{req}</label>
                <select value={form.yearOfStudy} onChange={e => set('yearOfStudy', e.target.value)} style={input}>
                  <option value="">Select year</option>
                  <option>400 level (penultimate year)</option>
                  <option>500 level (final year)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Student ID number{req}</label>
              <input type="text" value={form.studentId} onChange={e => set('studentId', e.target.value)} placeholder="e.g. 190501001" style={input} />
              <p style={hint}>Used for verification only. Not shared with third parties.</p>
            </div>

            <NavRow onBack={goBack} onNext={goNext} nextLabel="Next: Choose your track" />
          </div>
        )}

        {/* ── STEP 2: Track ────────────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <SectionHead
              title={<>Choose your track{req}</>}
              sub="You will stay in this track for the full four weeks. Choose the one that best fits where you want to grow."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1rem' }}>
              {TRACKS.map(t => (
                <div
                  key={t.key}
                  onClick={() => {
                    set('trackFirst', t.key);
                    if (form.trackSecond === t.key) set('trackSecond', '');
                  }}
                  style={{
                    border: form.trackFirst === t.key ? `1.5px solid ${C.gold}` : `0.5px solid ${C.border}`,
                    borderRadius: 6, padding: '14px 16px', cursor: 'pointer',
                    background: form.trackFirst === t.key ? '#fffbf4' : '#fff',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20, background: t.badgeBg, color: t.badgeColor, fontFamily: 'DM Sans, sans-serif' }}>
                      {t.label}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: C.charcoal, fontFamily: 'DM Sans, sans-serif' }}>{t.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>{t.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Second track preference</label>
              <select value={form.trackSecond} onChange={e => set('trackSecond', e.target.value)} style={input}>
                <option value="">No second preference</option>
                {TRACKS.map(t => (
                  <option key={t.key} value={t.key} disabled={t.key === form.trackFirst}>
                    {t.label}: {t.name}
                  </option>
                ))}
              </select>
              <p style={hint}>If your first choice is full, we will try to place you in your second preference.</p>
            </div>

            <NavRow onBack={goBack} onNext={goNext} nextLabel="Next: Motivation statement" />
          </div>
        )}

        {/* ── STEP 3: Motivation ───────────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <SectionHead
              title="Motivation statement"
              sub="Answer both questions below in your own words. We are looking for genuine curiosity and commitment, not perfect writing. There is no minimum word count, but we recommend at least 80 words per question."
            />

            {[
              {
                id: 'mot1' as const,
                q: 'Why have you chosen your track, and what draws you to it?',
                ph: 'Tell us what interests you about this track and what specific aspects you are most curious about.',
              },
              {
                id: 'mot2' as const,
                q: 'What do you want to do differently as a health professional because of this programme?',
                ph: 'Be specific. What problem do you want to solve? What kind of work do you want to do? How does this programme connect to that?',
              },
            ].map(({ id, q, ph }) => (
              <div key={id} style={{ marginBottom: 14 }}>
                <label style={lbl}>{q}{req}</label>
                <textarea
                  value={form[id]}
                  onChange={e => set(id, e.target.value)}
                  rows={5}
                  placeholder={ph}
                  style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
                />
                <div style={{ fontSize: 12, color: C.muted, textAlign: 'right', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
                  {wordCount(form[id])} {wordCount(form[id]) === 1 ? 'word' : 'words'}
                </div>
              </div>
            ))}

            <div style={{ background: '#eef4ff', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#1a4bcc', lineHeight: 1.5, marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif' }}>
              <Info size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
              We read every statement. Students who show real, specific reasons for applying are the ones we select. You do not need to sound impressive. You need to be honest.
            </div>

            <NavRow onBack={goBack} onNext={goNext} nextLabel="Next: Financial aid" />
          </div>
        )}

        {/* ── STEP 4: Financial Aid ────────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <SectionHead
              title="Financial aid"
              sub="The application fee is ₦10,000. Fifteen scholarship places are available across all three institutions. If the fee presents a genuine difficulty, we encourage you to apply for support."
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', border: `0.5px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', marginBottom: '1rem', background: '#fff' }}>
              <input
                type="checkbox"
                checked={form.needsAid}
                onChange={e => set('needsAid', e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0, accentColor: C.forest }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.charcoal, marginBottom: 3, fontFamily: 'DM Sans, sans-serif' }}>
                  I would like to apply for financial aid
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.45, fontFamily: 'DM Sans, sans-serif' }}>
                  Scholarship places are awarded based on the strength of your statement and level of financial need. Applying for aid does not affect how your application is assessed.
                </div>
              </div>
            </label>

            {form.needsAid && (
              <div style={{ border: `0.5px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: '1rem', background: '#fff' }}>
                {/* Aid level selector */}
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Level of support needed{req}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {AID_LEVELS.map(a => (
                      <div
                        key={a.key}
                        onClick={() => set('aidLevel', a.key)}
                        style={{
                          border: form.aidLevel === a.key ? `1.5px solid ${C.gold}` : `0.5px solid ${C.border}`,
                          borderRadius: 6, padding: '10px 12px', cursor: 'pointer',
                          textAlign: 'center', background: form.aidLevel === a.key ? '#fffbf4' : '#fafaf9',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.charcoal, marginBottom: 2, fontFamily: 'DM Sans, sans-serif' }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: C.muted, fontFamily: 'DM Sans, sans-serif' }}>{a.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aid statement */}
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Why are you applying for financial aid?{req}</label>
                  <textarea
                    value={form.aidStatement}
                    onChange={e => set('aidStatement', e.target.value)}
                    rows={4}
                    placeholder="Tell us honestly about your situation. You do not need to share anything you are not comfortable with. We are looking for genuine need, not a perfect explanation."
                    style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
                  />
                  <div style={{ fontSize: 12, color: C.muted, textAlign: 'right', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
                    {wordCount(form.aidStatement)} {wordCount(form.aidStatement) === 1 ? 'word' : 'words'}
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label style={lbl}>Supporting documents</label>
                  <p style={{ ...hint, marginBottom: 8 }}>
                    Optional but helpful. Acceptable documents include a letter from your institution, a letter from a parent or guardian, or any other document that helps us understand your circumstances. All documents are treated with strict confidentiality.
                  </p>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                    style={{
                      border: `1.5px dashed ${dragOver ? C.gold : C.border}`,
                      borderRadius: 6, padding: 20, textAlign: 'center', cursor: 'pointer',
                      background: dragOver ? '#fffbf4' : '#fafaf9',
                      transition: 'border-color 0.15s, background 0.15s',
                      marginBottom: 8,
                    }}
                  >
                    <Upload size={24} color={C.muted} style={{ display: 'block', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.charcoal, marginBottom: 3, fontFamily: 'DM Sans, sans-serif' }}>
                      Click to upload or drag and drop
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, fontFamily: 'DM Sans, sans-serif' }}>
                      PDF, JPG, or PNG · Maximum 5 MB per file · Up to 3 files
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e => addFiles(e.target.files)} style={{ display: 'none' }} />
                  </div>

                  {files.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {files.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: C.creamWarm, borderRadius: 4, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                          <FileText size={16} color={C.muted} style={{ flexShrink: 0 }} />
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: C.charcoal }}>{f.name}</span>
                          <span style={{ color: C.muted, fontSize: 12, flexShrink: 0 }}>{fmtBytes(f.size)}</span>
                          <button onClick={() => setFiles(fl => fl.filter((_, j) => j !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: C.muted, display: 'flex', alignItems: 'center' }}>
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!form.needsAid && (
              <div style={{ background: '#eef4ff', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#1a4bcc', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
                <Info size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                If you do not need financial aid, you will be asked to pay the ₦10,000 application fee within 10 working days of receiving your offer. Payment instructions will be included in your offer message.
              </div>
            )}

            <NavRow onBack={goBack} onNext={goNext} nextLabel="Review my application" />
          </div>
        )}

        {/* ── STEP 5: Review & Submit ──────────────────────────────────────── */}
        {step === 5 && (
          <div>
            <SectionHead
              title="Review and submit"
              sub="Please check your details below before submitting. Once submitted, you will receive a confirmation by email and WhatsApp."
            />

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: '1.25rem' }}>
              <tbody>
                {[
                  {
                    head: 'Personal details',
                    rows: [
                      ['Full name', `${form.firstName} ${form.lastName}`.trim() || '—'],
                      ['Email', form.email || '—'],
                      ['Phone', form.phone || '—'],
                      ['State', form.state || '—'],
                    ],
                  },
                  {
                    head: 'Academic details',
                    rows: [
                      ['Institution', form.institution || '—'],
                      ['Discipline', form.discipline || '—'],
                      ['Year of study', form.yearOfStudy || '—'],
                    ],
                  },
                  {
                    head: 'Track selection',
                    rows: [
                      ['First preference', form.trackFirst ? TRACK_LABELS[form.trackFirst] : '—'],
                      ['Second preference', form.trackSecond ? TRACK_LABELS[form.trackSecond as TrackKey] : 'None'],
                    ],
                  },
                  {
                    head: 'Financial aid',
                    rows: [
                      ['Applying for aid', form.needsAid ? 'Yes' : 'No'],
                      ...(form.needsAid
                        ? [['Level of support', form.aidLevel === 'full' ? 'Full scholarship' : form.aidLevel === 'flexible' ? 'Flexible payment' : '—']]
                        : []),
                    ],
                  },
                ].map(section => (
                  <React.Fragment key={section.head}>
                    <tr>
                      <td colSpan={2} style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, padding: '12px 10px 4px', fontFamily: 'DM Sans, sans-serif' }}>
                        {section.head}
                      </td>
                    </tr>
                    {section.rows.map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ padding: '8px 10px', borderBottom: `0.5px solid ${C.border}`, color: C.muted, width: '38%', verticalAlign: 'top', fontFamily: 'DM Sans, sans-serif' }}>{k}</td>
                        <td style={{ padding: '8px 10px', borderBottom: `0.5px solid ${C.border}`, color: C.charcoal, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>{v}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Consent checkboxes */}
            {[
              'The information I have provided in this form is accurate and true to the best of my knowledge.',
              'I understand that my application will be assessed by the Oakvale team, and that being offered a place is subject to the programme terms.',
              'I agree to Oakvale Learning contacting me by email and WhatsApp with information about my application and the programme.',
            ].map((text, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.muted, marginBottom: 10, lineHeight: 1.5, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                <input
                  type="checkbox"
                  checked={consents[i]}
                  onChange={e => setConsents(c => { const n = [...c]; n[i] = e.target.checked; return n; })}
                  style={{ marginTop: 2, flexShrink: 0, accentColor: C.forest }}
                />
                {text}
              </label>
            ))}

            {submitError && (
              <div style={{ background: '#fff9e6', border: '0.5px solid #f5d67a', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#92620a', marginBottom: '0.75rem', fontFamily: 'DM Sans, sans-serif' }}>
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: '100%', background: submitting ? C.forestMid : C.forest, border: 'none', borderRadius: 4, padding: '13px 0', fontSize: 15, fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer', color: '#fff', marginTop: '0.5rem', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em', opacity: submitting ? 0.8 : 1 }}
            >
              {submitting ? 'Sending your application…' : 'Submit my application'}
            </button>

            <div style={{ marginTop: '0.75rem' }}>
              <button onClick={goBack} style={{ background: 'none', border: `0.5px solid ${C.border}`, borderRadius: 4, padding: '8px 18px', fontSize: 14, cursor: 'pointer', color: C.charcoal, fontFamily: 'DM Sans, sans-serif' }}>
                Back to edit
              </button>
            </div>
          </div>
        )}
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.5, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            Applications close 2 July 2026. 
          </p>

      </div>
    </div>
  );
}

function SuccessScreen({ paymentUrl, requiresPayment }: { paymentUrl: string | null; requiresPayment: boolean }) {
  const [redirecting, setRedirecting] = useState(!!paymentUrl);

  useEffect(() => {
    if (!paymentUrl) return;
    const t = window.setTimeout(() => {
      window.location.assign(paymentUrl);
    }, 800);
    return () => window.clearTimeout(t);
  }, [paymentUrl]);

  return (
    <div style={{ minHeight: '100vh', background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <CheckCircle2 size={52} color={C.forestMid} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 30, fontWeight: 500, color: C.forest, margin: '0 0 0.5rem' }}>
          Application received
        </h2>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>
          Thank you for applying to the Oakvale Summer Intensive 2026. A confirmation email is on its way to your inbox.
        </p>

        {paymentUrl ? (
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '22px 24px', marginTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.gold, marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>
              Final step · Application fee
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: C.forest, marginBottom: 10 }}>
              ₦10,000 — payable now
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 18, fontFamily: 'DM Sans, sans-serif' }}>
              {redirecting
                ? 'Redirecting you to our secure Paystack checkout…'
                : 'Click below to complete your application via Paystack.'}
            </p>
            <a
              href={paymentUrl}
              onClick={() => setRedirecting(false)}
              style={{
                display: 'inline-block',
                background: C.forest,
                color: '#fff',
                padding: '11px 28px',
                borderRadius: 4,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Pay ₦10,000 application fee
            </a>
            <div style={{ marginTop: 14, fontSize: 12, color: C.muted, fontFamily: 'DM Sans, sans-serif' }}>
              If you are not redirected automatically, click the button above. The same link is also in your email.
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>
            {requiresPayment
              ? 'We could not start a payment session right now. Our team will contact you with payment instructions shortly.'
              : 'You have requested a full scholarship. Our team will review your supporting documents and contact you about the scholarship decision separately — no payment is required at this stage.'}
          </p>
        )}

        <p style={{ marginTop: 24, fontWeight: 500, fontSize: 14, color: C.forest, fontFamily: 'DM Sans, sans-serif' }}>
          hello@oakvaleltd.com · www.oakvaleltd.com
        </p>
      </div>
    </div>
  );
}
