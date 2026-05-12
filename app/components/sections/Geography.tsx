"use client";

export default function Geography() {
  return (
    <section
      className="geography relative w-full"
      style={{
        backgroundImage: "url(/map.png)",

        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-80 z-10" />
      {/* Grid overlay pattern */}
      <div className="absolute inset-0 hero-grid-overlay z-20" />

      <div className="geography-inner relative z-10">
        <div>
          <div className="section-label">Where we work</div>
          <h2 className="section-title">
            Rooted in Africa.
            <br />
            <em>Connected globally.</em>
          </h2>
          <p className="section-body" style={{ marginTop: "1.5rem" }}>
            We work across Sub-Saharan Africa, with particular depth in West
            Africa and East Africa. Our programmes are designed to travel: the
            methodology scales, the contextualisation is always local.
          </p>
          <div className="region-list">
            {[
              {
                region: "West Africa",
                detail: "Nigeria, Ghana, Sierra Leone, Liberia, Côte d'Ivoire",
              },
              {
                region: "East Africa",
                detail: "Kenya, Uganda, Tanzania, Rwanda, Ethiopia",
              },
              {
                region: "Southern Africa",
                detail: "South Africa, Zimbabwe, Zambia, Malawi",
              },
              {
                region: "North Africa",
                detail: "Egypt, Morocco (emerging presence)",
              },
            ].map((r, i) => (
              <div className="region-item" key={i}>
                <div className="region-dot" />
                <div className="region-text">
                  {r.region}
                  <span>{r.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
        
        </div>
      </div>
    </section>
  );
}
