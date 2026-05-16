/* global React, anime */
const { useEffect, useRef, useState } = React;

/* ============================================================
   History — animated vertical timeline
   ============================================================ */
function History() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".tl-item"),
              translateX: [-30, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(120),
              duration: 800,
              easing: "easeOutQuart",
            });
            window.anime({
              targets: el.querySelector(".tl-line-fill"),
              scaleY: [0, 1],
              easing: "easeInOutQuart",
              duration: 1800,
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const milestones = [
    {
      year: "2023",
      title: "El garaje",
      desc: "Alexander y José Enrique se conocen trabajando freelance. Comparten la frustración de ver pymes peruanas pagando licencias caras por software que no se adapta a su operación. Empiezan a prototipar un POS los fines de semana.",
      tag: "Inicio",
    },
    {
      year: "2024 · Q1",
      title: "Primer cliente",
      desc: "Un restaurante en Miraflores acepta probar el sistema durante un mes. Termina firmando un contrato anual. La validación que necesitaban para soltar los proyectos freelance y enfocarse 100% en kui.",
      tag: "Validación",
    },
    {
      year: "2024 · Q3",
      title: "kui nace",
      desc: "Constituyen la empresa formalmente en Lima. Se mudan a una oficina propia en La Molina. Suman a las primeras dos personas al equipo: una diseñadora y un ingeniero backend.",
      tag: "Fundación",
    },
    {
      year: "2025",
      title: "El año del LMS",
      desc: "Un grupo educativo con cuatro colegios los contrata para reemplazar su sistema escolar. Doce mil estudiantes migrados sin un día de servicio caído. kui · LMS se convierte en producto separado.",
      tag: "Producto",
    },
    {
      year: "2026",
      title: "Expansión LatAm",
      desc: "Primeros clientes en Chile, Colombia y Ecuador. El equipo crece a doce personas. Cierran el año atendiendo a más de 180 locales operando con kui · POS y miles de estudiantes con kui · LMS.",
      tag: "Hoy",
      current: true,
    },
  ];

  return (
    <section className="section history" id="historia">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— historia</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              De un fin de semana<br />
              a <em>toda LatAm</em>.
            </h2>
            <p>
              Tres años desde el primer commit. Una línea recta entre la frustración inicial
              y los productos que hoy operan en cientos de negocios.
            </p>
          </div>
        </Reveal>

        <div className="tl" ref={wrapRef}>
          <div className="tl-line">
            <div className="tl-line-fill" />
          </div>
          {milestones.map((m, i) => (
            <div className={`tl-item ${m.current ? "is-current" : ""}`} key={i}>
              <div className="tl-dot">
                <span className="tl-dot-inner" />
              </div>
              <div className="tl-content">
                <div className="tl-year-row">
                  <span className="tl-year mono">{m.year}</span>
                  <span className="tl-tag mono">{m.tag}</span>
                </div>
                <h3 className="tl-title">{m.title}</h3>
                <p className="tl-desc">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Team — founders grid
   ============================================================ */
function Team() {
  const members = [
    {
      slot: "team-alexander",
      src: "assets/alexander.png",
      name: "Alexander Ferrua",
      role: "Co-fundador · Producto & UX",
      bio: "Ingeniero de software con foco en producto. Antes de kui lideró equipos de diseño en startups de SaaS en Lima y Bogotá. Cree que el mejor software es el que se siente inevitable.",
      links: [
        { kind: "linkedin", href: "https://linkedin.com/in/alexander-ferrua" },
        { kind: "mail", href: "mailto:alexander@kui.studio" },
      ],
    },
    {
      slot: "team-jose-enrique",
      src: "assets/enrique.png",
      name: "José Enrique Salirrosas",
      role: "Co-fundador · Ingeniería & Plataforma",
      bio: "Arquitecto de sistemas. Construyó plataformas multi-tenant para fintechs antes de fundar kui. Obsesionado con la simplicidad operativa y los sistemas que no despiertan a nadie de madrugada.",
      links: [
        { kind: "linkedin", href: "https://linkedin.com/in/jose-enrique-salirrosas" },
        { kind: "mail", href: "mailto:jose@kui.studio" },
      ],
    },
  ];

  return (
    <section className="section team" id="equipo">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— equipo</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Las personas<br />
              detrás de <em>kui</em>.
            </h2>
            <p>
              Un equipo pequeño y dedicado. Los fundadores siguen en el código y en
              las reuniones de descubrimiento con cada cliente.
            </p>
          </div>
        </Reveal>

        <div className="team-grid">
          {members.map((m) => (
            <Reveal key={m.slot} className="team-card">
              <div className="team-photo-wrap" style={{ position: "relative", zIndex: 1 }}>
                <img src="assets/logo.png" className="team-photo-bg" alt="" aria-hidden="true" />
                <div className="team-photo">
                  <image-slot
                    id={m.slot}
                    src={m.src || ""}
                    shape="rounded"
                    radius="20"
                    placeholder={`Foto de ${m.name.split(" ")[0]}`}
                  ></image-slot>
                  <div className="team-photo-frame" aria-hidden="true" />
                </div>
              </div>
              <div className="team-body">
                <div className="team-role mono">{m.role}</div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-bio">{m.bio}</p>
                <div className="team-links">
                  {m.links.map((l) => (
                    <a className="team-link" key={l.kind} href={l.href} target="_blank" rel="noreferrer">
                      {l.kind === "linkedin" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                        </svg>
                      )}
                      {l.kind === "mail" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 7l9 6 9-6" />
                        </svg>
                      )}
                      <span>{l.kind === "linkedin" ? "LinkedIn" : "Email"}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="team-foot">

          <div className="team-foot-stat">
            <span className="team-foot-v">100%</span>
            <span className="team-foot-l">remoto, con base en Lima</span>
          </div>
          <div className="team-foot-stat">
            <span className="team-foot-v">3</span>
            <span className="team-foot-l">años de operación continua</span>
          </div>
          <a className="team-foot-cta" href="#contacto">
            ¿Te interesa unirte?
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   ContactForm — proper professional form
   ============================================================ */
function ContactForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    company: "",
    interest: "POS",
    budget: "USD 10k – 30k",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!state.name || !state.email || !state.message) return;
    setSending(true);
    // Fake submit — in production wire to your backend or Formspree/Resend.
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  if (sent) {
    return (
      <div className="form-success">
        <div className="form-success-icon">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M14 24l7 7 14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="form-success-title">Mensaje enviado.</h3>
        <p className="form-success-desc">
          Gracias, {state.name.split(" ")[0]}. Te respondemos a <strong>{state.email}</strong> en menos de 24 horas hábiles.
        </p>
        <button className="btn btn-ghost" onClick={() => { setSent(false); setState({ name: "", email: "", company: "", interest: "POS", budget: "USD 10k – 30k", message: "" }); }}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-row form-row-2">
        <label className="field">
          <span className="field-label">Nombre completo *</span>
          <input
            className="field-input"
            type="text"
            required
            value={state.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="María García"
          />
        </label>
        <label className="field">
          <span className="field-label">Email corporativo *</span>
          <input
            className="field-input"
            type="email"
            required
            value={state.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="maria@empresa.com"
          />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Empresa</span>
        <input
          className="field-input"
          type="text"
          value={state.company}
          onChange={(e) => set("company", e.target.value)}
          placeholder="Nombre de tu empresa"
        />
      </label>

      <div className="form-row form-row-2">
        <label className="field">
          <span className="field-label">¿Qué te interesa?</span>
          <select
            className="field-input field-select"
            value={state.interest}
            onChange={(e) => set("interest", e.target.value)}
          >
            <option>POS para restaurante</option>
            <option>LMS / educación</option>
            <option>Producto a medida</option>
            <option>Integraciones / API</option>
            <option>Inventario / Stock</option>
            <option>Otro</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Presupuesto estimado</span>
          <select
            className="field-input field-select"
            value={state.budget}
            onChange={(e) => set("budget", e.target.value)}
          >
            <option>USD &lt; 10k</option>
            <option>USD 10k – 30k</option>
            <option>USD 30k – 60k</option>
            <option>USD 60k+</option>
            <option>Aún no lo sé</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field-label">Cuéntanos sobre tu proyecto *</span>
        <textarea
          className="field-input field-textarea"
          rows="5"
          required
          value={state.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="¿Qué estás construyendo? ¿Qué fricción tienes hoy? Mientras más contexto, mejor."
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? (
            <>
              <span className="spinner" />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensaje
              <svg className="arr" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
        <p className="form-hint mono">
          Al enviar aceptas que te contactemos por email. No spam, lo prometemos.
        </p>
      </div>
    </form>
  );
}

/* ============================================================
   Contact section — replaces the old CTA
   ============================================================ */
function Contact() {
  return (
    <section className="section contact" id="contacto">
      <div className="container">
        <div className="contact-grid">
          <Reveal className="contact-side">
            <div className="tag">— contacto</div>
            <h2 className="contact-title">
              Construyamos<br />
              <em>juntos</em>.
            </h2>
            <p className="contact-lead">
              Cuéntanos qué necesitas. Te respondemos en menos de 24 horas hábiles
              con próximos pasos concretos — no con un brochure.
            </p>

            <div className="contact-channels">
              <a className="contact-channel" href="mailto:hola@kui.studio">
                <span className="contact-channel-label mono">Email</span>
                <span className="contact-channel-v">hola@kui.studio</span>
              </a>
              <a className="contact-channel" href="https://wa.me/51902487635" target="_blank" rel="noreferrer">
                <span className="contact-channel-label mono">WhatsApp</span>
                <span className="contact-channel-v">+51 902 487 635</span>
              </a>
              <div className="contact-channel">
                <span className="contact-channel-label mono">Oficina</span>
                <span className="contact-channel-v">Los Naturalistas<br />La Molina, Lima — Perú</span>
              </div>
              <div className="contact-channel">
                <span className="contact-channel-label mono">Horario</span>
                <span className="contact-channel-v">Lun – Vie · 9:00 a 18:00<br />GMT-5 (Lima · Bogotá · CDMX)</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FacebookFeed — displays the latest posts from Facebook
   ============================================================ */
function FacebookFeed() {
  const url = "https://www.facebook.com/profile.php?id=61589326215024";
  const encodedUrl = encodeURIComponent(url);

  return (
    <section className="section fb-feed" id="social">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— comunidad</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Novedades y<br />
              <em>actualizaciones</em>.
            </h2>
            <p className="contact-lead">
              Lo último de nuestra operación y lanzamientos, directo desde Facebook.
            </p>
          </div>
        </Reveal>

        <Reveal className="fb-feed-content">
          <div className="fb-iframe-wrap">
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=500&height=800&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId`}
              width="100%"
              height="800"
              style={{ border: "none", overflow: "hidden", mixBlendMode: "multiply", opacity: 0.95 }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { History, Team, Contact, ContactForm, FacebookFeed });
