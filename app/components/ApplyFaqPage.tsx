'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

const FAQ_SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'About the programme',
    items: [
      { q: 'What is the Oakvale Summer Intensive?', a: 'It is a four-week blended-learning programme for penultimate and final-year health sciences students at CMUL, LASUCOM, and EkoUNIMED. You choose one of three specialist tracks: Clinical Enterprise, Health Systems Leadership, or Digital Health Innovation. Over four weeks, you work through interactive course content, attend live sessions with global health industry experts, discuss ideas with your cohort, and build toward the Health Innovation Challenge capstone.' },
      { q: 'Is this a university course?', a: 'No. It is an external programme run by Oakvale Learning. Completing the programme earns you a formally recognised UK CPD certificate, which you can share on LinkedIn and include in your CV. Your university does not need to be involved in your application.' },
      { q: 'What is the Health Innovation Challenge?', a: 'The Health Innovation Challenge is the capstone competition at the heart of the programme. In Week 3, your team of two receives a real, unsolved healthcare challenge relevant to your track. You develop a solution over one week and pitch it live to an independent panel of industry judges on 5 September 2026. There are 18 teams across the programme and a total prize pool of ₦4,000,000.' },
      { q: 'What certificate do I get?', a: 'You receive a formally recognised UK CPD certificate issued by Oakvale Learning. It is accredited, can be verified by employers and institutions, and is issued digitally so you can share it directly on LinkedIn.' },
      { q: 'Will this affect my university studies?', a: 'The programme runs in August and September 2026. Plan for around five to seven hours per week. Think about whether that fits around any rotations or assessments you have before applying.' },
    ],
  },
  {
    title: 'Who can apply?',
    items: [
      { q: 'Who is this programme for?', a: 'The programme is open to penultimate and final-year health sciences students at CMUL, LASUCOM, and EkoUnimed. Eligible disciplines are Medicine, Pharmacy, Dentistry, Nursing, Laboratory Sciences, and Physiotherapy. If you are in a health sciences programme at one of these institutions and you are in your 400 or 500 level year, you are eligible to apply.' },
      { q: 'I am in 300 level. Can I apply?', a: 'No. The programme is designed for students in their final two years of study. Applications for the next cohort will open in 2027.' },
      { q: 'Do I need high grades to apply?', a: 'No. We do not look at your CGPA. We assess your motivation statement: why you want to join, and what you want to do differently because of it. Students who show genuine curiosity and commitment are the ones we select.' },
    ],
  },
  {
    title: 'How to apply',
    items: [
      { q: 'How do I apply?', a: 'Complete the online application form on this page. The form has six sections: personal details, academic information, track selection, motivation statement, financial aid (optional), and review and submit.' },
      { q: 'What should I write in my motivation statement?', a: 'The form asks two questions: why you chose your track, and what you want to do differently as a health professional because of it. Be honest and specific. We are looking for real reasons, not perfect writing. Students who are vague or who seem to have copied a template are easy to spot. Students who are genuine are even easier.' },
      { q: 'When do applications open and close?', a: 'Applications open on 9 June 2026 and close on 15 July 2026. We review applications on a rolling basis and send offers as strong applications arrive, so applying earlier gives you a better chance of securing your first track preference.' },
      { q: 'How will I know if I have been accepted?', a: 'We will contact you by email and WhatsApp with confirmation of your place, your assigned track, and your payment or scholarship instructions. If you do not hear from us within five working days of submitting, check your spam folder and then contact us at hello@oakvaleltd.com.' },
    ],
  },
  {
    title: 'What the fee covers',
    items: [
      { q: 'How much does the programme cost?', a: 'The application fee is ₦10,000. This covers access to the Opening Ceremony on 8 August 2026, four weeks of fully online learning with interactive modules and live expert sessions, access to the Health Innovation Challenge with the chance to compete for a share of ₦4,000,000 in prizes, and a formally recognised UK CPD certificate on successful completion.' },
      { q: 'When do I pay?', a: 'Payment instructions are included in your acceptance message. You have 10 working days from the date of your offer to complete payment. If you do not pay within 10 working days, your place may be offered to another applicant on the waiting list. Contact us at hello@oakvaleltd.com before the deadline if you need more time.' },
      { q: 'What payment methods are accepted?', a: 'Payment details, including bank transfer information, will be included in your acceptance message. We do not accept cash payments. If you experience any difficulty with the payment process, contact us directly and we will help you resolve it.' },
    ],
  },
  {
    title: 'Financial aid and scholarships',
    items: [
      { q: 'Can I get help with the fee?', a: 'Yes. Fifteen scholarship and financial aid places are available across the programme, five per institution. The application form includes a dedicated financial aid section where you can apply for a full scholarship (fee completely waived). Applying for financial aid does not affect how the rest of your application is assessed.' },
      { q: 'How do I apply for financial aid?', a: 'In the financial aid section of the application form, tick the box to indicate you need support, choose the level of help you need, and write a short statement explaining your situation. You can also upload supporting documents, though these are optional.' },
      { q: 'What supporting documents can I upload?', a: 'You can upload up to three documents in PDF, JPG, or PNG format, each up to 5 MB. These might include a letter of recommendation from your institution confirming your enrolment, a letter from a parent or guardian describing your household situation, or any other relevant document. All documents are treated with strict confidentiality.' },
      { q: 'Are scholarships awarded on academic merit?', a: 'No. Scholarships and financial aid are awarded on the strength of your motivation statement and the honesty of your financial need declaration, not on your academic grades or CGPA. A student with average grades who explains their situation clearly and shows genuine commitment will be considered ahead of a high-achieving student who does not demonstrate financial need.' },
      { q: 'What if I am awarded a scholarship?', a: 'If your scholarship application is approved, you will be notified in your acceptance message. Full scholarship recipients do not need to make any payment.' },
      { q: 'What if I need financial aid but I am not sure I qualify?', a: 'Apply anyway. We would rather hear from a student who is unsure than miss a student who genuinely needs support. If you are on the boundary, be honest in your statement and let us make the assessment.' },
    ],
  },
  {
    title: 'The programme itself',
    items: [
      { q: 'Do I need to attend anything in person?', a: 'The Opening Ceremony on 8 August 2026 is at Julius Berger Hall, UNILAG Yaba Campus. Attendance is strongly encouraged and is part of the programme experience. A hybrid option is available for students who genuinely cannot attend in person. The Health Innovation Challenge Showcase on 5 September is fully online via Zoom. All other programme activity is online.' },
      { q: 'What happens each week?', a: 'Each week follows a consistent pattern: your track module unlocks at the start of the week (around 45 to 60 minutes of work); a global health industry expert delivers a live session mid-week; and at the end of the week you submit a short reflection post and respond to your peers.' },
      { q: 'Who delivers the live sessions?', a: 'Live sessions are delivered by practising health professionals with real experience in the relevant field. Speakers come from clinical practice, health systems leadership, digital health, and medical entrepreneurship. Sessions are grounded in Nigerian and West African healthcare realities, not generic global examples.' },
      { q: 'Do I have to attend the live sessions?', a: 'Yes. Attending live sessions is part of the completion requirement. Sessions are recorded and shared within 24 hours in case of genuine technical difficulties, but regular live attendance is expected.' },
      { q: 'What is the Health Innovation Challenge brief?', a: 'In Week 3, your team of two receives a real, unsolved problem relevant to your track. You have one week to develop your solution. By Thursday 3 September your team submits a structured pitch deck. On Saturday 5 September you deliver a live five-minute pitch to the independent judging panel via Zoom.' },
    ],
  },
  {
    title: 'Certificates and completion',
    items: [
      { q: 'What do I need to do to earn my certificate?', a: 'To receive your UK CPD certificate you must complete all four course modules, submit your weekly learning log entries, attend the required live sessions, and submit your Health Innovation Challenge capstone. Students who meet all four requirements receive their certificate.' },
      { q: 'What if I do not finish everything?', a: 'Students who do not meet the completion requirements receive a Participation Record showing what they completed. The door remains open to apply for the next cohort. Certificates are only issued to students who meet all requirements — there are no exceptions.' },
      { q: 'What does UK CPD accreditation mean?', a: 'CPD stands for Continuing Professional Development. A UK CPD-accredited certificate means the programme has been assessed and recognised by an accrediting body in the United Kingdom as meeting a defined standard of professional learning. It is verifiable by employers and institutions. This is not a university degree, but it is a recognised professional credential that holds real value in applications, interviews, and career conversations.' },
    ],
  },
  {
    title: 'Technical questions',
    items: [
      { q: 'What do I need to participate?', a: 'A smartphone or computer, a reliable internet connection, and a web browser. No special software needs to be downloaded. The application form and all programme content work in any standard browser.' },
      { q: 'What if my internet is unreliable?', a: 'Live sessions are recorded and shared within 24 hours. If you miss a session due to a genuine technical problem, contact your track facilitator immediately. We are aware that connectivity can be inconsistent in some areas and we will work with you where we can.' },
    ],
  },
];

export default function ApplyFaqPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: C.cream, paddingTop: 80 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>
            Oakvale Learning · Summer Intensive 2026
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, fontWeight: 400, color: C.forest, margin: '0 0 8px', lineHeight: 1.2 }}>
            Before you apply
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            Everything you need to know about the programme, eligibility, fees, and financial aid — before you fill in the form.
          </p>
        </div>

        {/* FAQ accordion */}
        <div style={{ marginBottom: '2.5rem' }}>
          {(() => {
            let globalIdx = 0;
            return FAQ_SECTIONS.map(section => (
              <div key={section.title} style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, padding: '10px 0 2px', fontFamily: 'DM Sans, sans-serif' }}>
                  {section.title}
                </div>
                {section.items.map(item => {
                  const idx = globalIdx++;
                  const open = faqOpen === idx;
                  return (
                    <div key={idx} style={{ borderBottom: `0.5px solid ${C.border}` }}>
                      <button
                        aria-expanded={open}
                        onClick={() => setFaqOpen(prev => prev === idx ? null : idx)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: C.charcoal, paddingRight: 16, lineHeight: 1.4 }}>
                          {item.q}
                        </span>
                        <ChevronDown
                          size={17}
                          color={C.gold}
                          style={{ flexShrink: 0, transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </button>
                      <div className="si-faq-body" style={{ maxHeight: open ? 400 : 0, opacity: open ? 1 : 0 }}>
                        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, paddingBottom: 16, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ));
          })()}

          <div style={{ marginTop: '1.5rem', padding: '12px 14px', background: C.creamWarm, borderRadius: 4, fontSize: 13, color: C.muted, fontFamily: 'DM Sans, sans-serif' }}>
            Have a question not answered here? Contact us at{' '}
            <a href="mailto:hello@oakvaleltd.com" style={{ color: C.forest, fontWeight: 500 }}>hello@oakvaleltd.com</a>
          </div>
        </div>

        {/* CTA */}
        <div style={{ borderTop: `0.5px solid ${C.border}`, paddingTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: '1.25rem', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
            Applications close <strong style={{ color: C.charcoal }}>15 July 2026</strong>. We review on a rolling basis — applying early improves your chance of securing your first track preference.
          </p>
          <a
            href="/apply"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.forest, color: '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 500,
              padding: '13px 32px', borderRadius: 4,
              textDecoration: 'none', letterSpacing: '0.02em',
              transition: 'background 0.2s',
            }}
          >
            Start your application <ChevronRight size={16} />
          </a>
          <p style={{ marginTop: 12, fontSize: 12, color: C.muted, fontFamily: 'DM Sans, sans-serif' }}>
            Takes around 10 minutes to complete.
          </p>
        </div>

      </div>
    </div>
  );
}
