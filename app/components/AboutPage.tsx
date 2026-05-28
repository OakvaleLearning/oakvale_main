"use client";
 
import Image from "next/image";

type Page =
  | "home"
  | "about"
  | "services"
  | "corporates"
  | "academic"
  | "donors"
  | "government"
  | "contact";

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
        <div className="mt-[2.5rem]">
      <div className="about-hero relative w-full" style={{
      backgroundImage: 'url(/about-hero.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />
      
        <div className="about-hero-inner relative z-10">
          <div className="section-label" style={{ color: "var(--mint)" }}>
            About Oakvale Learning
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            We exist to change lives through{" "}<br/>
            <em style={{ fontStyle: "italic", color: "var(--mint)" }}>
              learning and self-discovery.
            </em>
          </h1>
          <p>
            Oakvale Learning is a specialist workforce, leadership and
            organisational development consultancy. We work with organisations
            across Africa to design and deliver learning that creates lasting,
            systemic change.
          </p>
        </div>
      </div>

      <section style={{ background: "var(--cream)", padding: "6rem 8%" }}>
        <div
          className="about-story"
          style={{
            display: "flex", 
            gap: "4rem",
            alignItems: "start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div className="section-label">Our Story</div>
            <h2 className="section-title">
              Born in health and social care. <br/> <em>Built for everywhere.</em>
            </h2>
            <div
              style={{
                marginTop: "2rem",
                color: "var(--mid-grey)",
                fontSize: "0.95rem",
                lineHeight: "1.85",
                fontWeight: 300,
              }}
            >
              <p style={{ marginBottom: "1.5rem" }}>
                Oakvale Learning grew out of more than a decade of workforce
                development work in health and social care — one of the most
                demanding, highest-stakes sectors in the world. The rigour,
                contextual sensitivity and commitment to real-world outcomes
                that this sector demands became the foundation of everything we
                do.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                We recognised that the quality of learning available to African
                workforces was not keeping pace with the ambition of the
                organisations and people we were working with. Too much of what
                passed for &ldquo;training&rdquo; was generic, extractive and
                disconnected from real-world application.
              </p>
              <p>
                We set out to do something different: high-quality, globally
                relevant learning, designed from the ground up for African
                realities, delivered with the rigour of the sectors where the
                stakes are highest.
              </p>
            </div>
          </div>
          <div 
          className="about-story-image" 
          style={{
            flex: "0 1 355px", 
            width: "100%", 
            height: "100%",  
            minHeight: "400px", 
            background: "url(/WATERMARK.png) no-repeat right/cover",
            opacity: 0.1,
            }}>
          </div>
        </div>
      </section>

      <div className="people">
        <div>
          <div className="section-label">Our Team</div>
          <h2 className="section-title">
            The people behind <em>Oakvale Learning</em>
          </h2>
        </div>
        <div className="people-grid">
          {[
            {
              initials: "FO",
              name: "Funke Onamusi",
              title: "Founder & Chief Executive",
              image: '/team/Dr Funke.png',
              bio: "Over 15 years leading workforce development programmes across Africa, with deep expertise in health systems strengthening and large-scale skills programmes.",
            },
            {
              initials: "SD",
              name: "Sitasri De",
              title: "Operations Lead",
               image: '/team/Sitasri.png',
              bio: "",
            },
            {
              initials: "CA",
              name: "Caleb Adejoh",
              title: "Project Coordinator",
               image: '/team/Caleb.png',
              bio: "",
            },
             {
              initials: "TA",
              name: "Timothy Ameloko",
              title: "Instructional Design",
               image: '/team/Timothy.png',
              bio: "",
            },
             {
              initials: "YB",
              name: "Dr Yinka Badmus ",
              title: "Subject Matter Expert (SME)",
               image: '/team/Dr Yinka.png',
              bio: "",
            },
             {
              initials: "SA",
              name: "Dr Sarah Adekoya ",
              title: "Quality Assurance Lead",
               image: '/team/Dr Sarah.png',
              bio: "",
            },
            {
              initials: "SA",
              name: "Prince Davis",
              title: "Graphics Designer",
               image: '/team/Prince.png',
              bio: "",
            },
            //  {
            //   initials: "SA",
            //   name: "Victor ",
            //   title: "Graphics Designer",
            //    image: '/team/Victor.png',
            //   bio: "",
            // }
          ].map((p, i) => (
            <div className="person-card" key={i}>
              <div className="person-photo">
                <Image
                  // src="https://plus.unsplash.com/premium_photo-1745624797647-37ddb5c77b65?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  src={p.image || ""}
                  alt="photo"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {/* <div className="person-photo-label">Photo Coming Soon</div> */}
              </div>
              <div className="person-info">
                <div className="person-name">{p.name}</div>
                <div className="person-title">{p.title}</div>
                {/* <div className="person-bio">{p.bio}</div> */}
                {/* <a className="person-link placeholder">LinkedIn →</a> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="advisory">
        <div className="">
          <div className="section-label">Advisory Board</div>
          <h2 className="section-title">
            Guided by <em>experience and expertise</em>
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-12 justify-center">
          {[
            {
              name: "Prof Marisa Miraldo",
              title: "Professor of Health Economics & Health Policy",
              image: "/board/Prof Marisa.png", 
              bio: `A Professor of Health Economics and Health Policy at Imperial College Business School, where she serves as Co-Director of the Centre for Health Policy and Co-Director of the School of Convergence Science in Health and Technology. She is the Academic Director of the MSc in International Health Management and a Fellow of Imperial's Data Science Institute. Her research spans the economics of healthcare innovation, the impact of policy on organisational performance, and the behavioural determinants of health decision-making. 
                  A member of the World Economic Forum's Expert Network on the Future of Health and Healthcare, Professor Miraldo brings world-class health economics expertise and a direct understanding of the Nigerian health system context to the Oakvale Advisory Board.`,
            },
            {
              name: "Mary Akangbe",
              title: "Specialist Practitioner in Invasive Surgery & Robotics",
              image: "/board/Mary FAPH.png", 
              bio: "A Specialist Practitioner in Minimally Invasive Surgery and Robotics at King's College Hospital NHS Foundation Trust, with over three decades of clinical practice. She is Founder and President of Zenith Global Health, through which she leads one of Africa's most prominent health leadership platforms - the Africa Healthcare Awards and Summit - and the Not Just a Nurse initiative, a training and mentoring hub supporting nurses and allied health professionals in career development, entrepreneurship, and professional progression. A Fellow of the Association of Public Health, Mary brings extensive networks across health institutions in the UK and Africa and a practitioner's authority on the workforce development and leadership challenges that sit at the heart of Oakvale's mission.",
            }
          ].map((a, i) => (
            <div className="advisor-card max-w-sm" key={i}>
              <div className="advisor-photo">
                <Image
                  // src="https://images.unsplash.com/photo-1613876215075-276fd62c89a4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  src={a.image || ""}
                  alt={`${a.name} photo`}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '6px' }}
                />
                {/* <div className="advisor-photo-label">Photo Coming Soon</div> */}
              </div>
              <div className="advisor-info">
                <div className="advisor-name">{a.name}</div>
                <div className="advisor-title">{a.title}</div>
                <div className="advisor-bio">{a.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta">
        <div className="cta-inner">
          <h2>Interested in working with us?</h2>
          <p>
            We work with a small number of institutional partners at any one
            time. If you are working on something that aligns with our
            expertise, we would like to hear from you.
          </p>
          <div className="cta-actions">
            <button
              className="btn-primary-dark"
              onClick={() => onNavigate("contact")}
            >
              Get in touch
            </button>
            <button
              className="btn-outline-dark"
              onClick={() => onNavigate("services")}
            >
              Our services
            </button>
          </div>
        </div>
      </div>
 
    </div>
  );
}
