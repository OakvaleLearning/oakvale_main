"use client";

export default function Values() {
  return (
    <section className="values">
      <div className="max-w-[60%] max-[768px]:max-w-full mx-auto text-center mb-12">
        <div className="section-label">What guides us</div>
        <h2 className="section-title">Our Values</h2>
      </div>
      <div className="values-grid">
        {[
          {
            title: "Rigour",
            body: "We hold ourselves to the highest standards of evidence, design and delivery.",
          },
          {
            title: "Contextual Sensitivity",
            body: "We listen before we design. African realities drive every decision.",
          },
          {
            title: "Genuine Partnership",
            body: "We build with our partners, not for them. Ownership always transfers.",
          },
          {
            title: "Long-term Thinking",
            body: "We measure success by what endures, not what we deliver.",
          },
        ].map((v, i) => (
          <div className="value-item" key={i}>
            <div className="value-title">{v.title}</div>
            <div className="value-body">{v.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
