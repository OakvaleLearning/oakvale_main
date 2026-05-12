'use client';

export default function Why() {
  return (
    <section className="why">
      <div className="why-grid">
        <div>
          <div className="section-label">Why Oakvale Learning</div>
          <h2 className="section-title">Forged in health and<br />social care. <br/> <em>Applied everywhere.</em></h2>
          <div className="differentiators">
            {[
              { title: 'Evidence-based methodology', body: 'Every programme we design is grounded in learning science and tested against real-world outcomes, not just completion rates.' },
              { title: 'Built for African realities', body: 'Low bandwidth, dispersed workforces, resource constraints. Our programmes are designed for the context, not borrowed from elsewhere.' },
              { title: 'Systems thinking', body: 'We design for sustainable change: building the internal capability and infrastructure that allows our partners to continue improving after we are gone.' },
              { title: 'Co-design by default', body: 'We do not deliver off-the-shelf programmes. We build with you: your context, your workforce, your goals.' },
            ].map((d, i) => (
              <div className="diff-item" key={i}>
                <div className="diff-num">0{i + 1}</div>
                <div className="diff-content">
                  <h4>{d.title}</h4>
                  <p>{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="positioning-statement">
            <p>High-quality, globally relevant learning, built where the stakes are highest, applied wherever people and organisations need to grow.</p>
            <div className="attr">Oakvale Learning Positioning Statement</div>
          </div>
        </div>
      </div>
    </section>
  );
}
