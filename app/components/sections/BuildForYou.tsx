'use client';

import Link from 'next/link';

const deliverables = [
  { num: '01', title: 'Interactive Modules', body: 'Scenario-based builds in Articulate or Genially, delivered as SCORM.' },
  { num: '02', title: 'Video & Microlearning', body: 'Animated explainers and mobile-first content for frontline workforces.' },
  { num: '03', title: 'Assessment & Certification', body: 'Competency-based assessment aligned to your standards.' },
  { num: '04', title: 'LMS Setup & Deployment', body: 'Moodle or TalentLMS configured, deployed and reporting on day one.' },
];

export default function BuildForYou() {
  return (
    <div className="build-strip">
      <div className="build-strip-inner">
        <div className="build-strip-copy">
          <div className="section-label">Build For You</div>
          <h2 className="section-title">
            You have the content.
            <br />
            We build the <em>learning.</em>
          </h2>
          <p className="section-body">
            Our e-learning development service turns training materials you already own &mdash; curricula, slides,
            scripts, subject matter expertise &mdash; into professional, interactive modules ready to deploy on any
            platform. A single module in five to seven working days; a full programme in four to six weeks.
          </p>
          <Link href="/build-for-you" className="btn-primary-dark build-strip-link">
            See how it works
          </Link>
        </div>
        <div className="build-strip-list">
          {deliverables.map((item) => (
            <div className="build-strip-item" key={item.num}>
              <div className="build-strip-num">{item.num}</div>
              <div>
                <div className="build-strip-title">{item.title}</div>
                <div className="build-strip-body">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
