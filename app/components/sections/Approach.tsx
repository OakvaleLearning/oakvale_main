'use client';

export default function Approach() {
  return (
    <div className="approach">
      <h2>Our approach puts <em>your organisation&apos;s context</em> at the centre of every programme we design.</h2>
      <div className="approach-steps">
        {[
          { num: '01', title: 'Diagnose', body: 'We start by understanding your workforce, your challenges and your goals before we design anything.' },
          { num: '02', title: 'Co-Design', body: 'We build programmes with you, not for you, ensuring ownership and relevance from day one.' },
          { num: '03', title: 'Deliver', body: 'We deploy with rigour: quality-assured, monitored and continuously improved throughout.' },
          { num: '04', title: 'Transfer', body: 'We build your internal capability so the learning continues after we are gone.' },
        ].map((s, i) => (
          <div className="step" key={i}>
            <div className="step-num">{s.num}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-body">{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
