/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
   ROICalculator — interactive estimator for project investment
   ============================================================ */
function ROICalculator() {
  const [kind, setKind] = useState("POS");
  const [locales, setLocales] = useState(3);
  const [users, setUsers] = useState(500);
  const [integrations, setIntegrations] = useState(2);
  const [mobile, setMobile] = useState(false);
  const [custom, setCustom] = useState(false);

  // Estimate logic — illustrative, not a real quote.
  const base = {
    POS: 200,
    LMS: 350,
    "A medida": 500,
  }[kind];

  const localesFactor = kind === "POS" ? locales * 15 : 0;
  const usersFactor = kind === "LMS" ? Math.round(users * 0.05) : 0;
  const integFactor = integrations * 35;
  const mobileFactor = mobile ? 120 : 0;
  const customFactor = custom ? 90 : 0;

  const min = base + localesFactor + usersFactor + integFactor + mobileFactor + customFactor;
  const max = Math.round(min * 1.5);

  const numRef = useRef(null);
  useEffect(() => {
    const el = numRef.current;
    if (!el || typeof window.anime !== "function") return;
    const prev = parseInt(el.dataset.shown || "0", 10);
    const target = min;
    window.anime({
      targets: { v: prev },
      v: target,
      round: 1,
      duration: 700,
      easing: "easeOutQuart",
      update: (a) => {
        const v = a.animations[0].currentValue;
        el.textContent = Number(v).toLocaleString("en-US");
      },
    });
    el.dataset.shown = String(target);
  }, [min]);

  const weeks = Math.max(2, Math.round(min / 100));

  return (
    <section className="section roi" id="calculadora">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— calculadora</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Estima tu<br />
              <em>inversión</em>.
            </h2>
            <p>
              Rango orientativo en USD basado en proyectos similares. No es una
              cotización formal — para eso conversamos.
            </p>
          </div>
        </Reveal>

        <div className="roi-grid">
          <Reveal className="roi-controls" stagger>
            <div className="roi-block">
              <label className="roi-label mono">Tipo de proyecto</label>
              <div className="roi-radio">
                {["POS", "LMS", "A medida"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`roi-pill ${kind === k ? "is-active" : ""}`}
                    onClick={() => setKind(k)}
                  >
                    {k === "POS" && "🍴 POS"}
                    {k === "LMS" && "🎓 LMS"}
                    {k === "A medida" && "⚙ A medida"}
                  </button>
                ))}
              </div>
            </div>

            {kind === "POS" && (
              <div className="roi-block">
                <div className="roi-row">
                  <label className="roi-label mono">Locales</label>
                  <span className="roi-val mono">{locales}</span>
                </div>
                <input
                  type="range"
                  min="1" max="50" step="1"
                  value={locales}
                  onChange={(e) => setLocales(parseInt(e.target.value))}
                  className="roi-slider"
                />
              </div>
            )}

            {kind === "LMS" && (
              <div className="roi-block">
                <div className="roi-row">
                  <label className="roi-label mono">Usuarios activos</label>
                  <span className="roi-val mono">{users.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50" max="20000" step="50"
                  value={users}
                  onChange={(e) => setUsers(parseInt(e.target.value))}
                  className="roi-slider"
                />
              </div>
            )}

            <div className="roi-block">
              <div className="roi-row">
                <label className="roi-label mono">Integraciones externas</label>
                <span className="roi-val mono">{integrations}</span>
              </div>
              <input
                type="range"
                min="0" max="10" step="1"
                value={integrations}
                onChange={(e) => setIntegrations(parseInt(e.target.value))}
                className="roi-slider"
              />
            </div>

            <div className="roi-block roi-toggles">
              <button
                type="button"
                className={`roi-toggle ${mobile ? "is-on" : ""}`}
                onClick={() => setMobile((v) => !v)}
              >
                <span className="roi-toggle-dot" />
                App móvil nativa
              </button>
              <button
                type="button"
                className={`roi-toggle ${custom ? "is-on" : ""}`}
                onClick={() => setCustom((v) => !v)}
              >
                <span className="roi-toggle-dot" />
                Marca + design system
              </button>
            </div>
          </Reveal>

          <Reveal className="roi-result">
            <div className="roi-result-label mono">Rango estimado</div>
            <div className="roi-result-num">
              USD <span ref={numRef}>{min.toLocaleString("en-US")}</span>
              <span className="roi-result-sep">—</span>
              <span className="roi-result-max">{max.toLocaleString("en-US")}</span>
            </div>
            <div className="roi-result-meta">
              <div className="roi-result-meta-item">
                <span className="roi-result-meta-v">{weeks}</span>
                <span className="roi-result-meta-l mono">semanas</span>
              </div>
              <div className="roi-result-meta-item">
                <span className="roi-result-meta-v">2–4</span>
                <span className="roi-result-meta-l mono">personas asignadas</span>
              </div>
              <div className="roi-result-meta-item">
                <span className="roi-result-meta-v">12m</span>
                <span className="roi-result-meta-l mono">soporte incluido</span>
              </div>
            </div>
            <a className="btn btn-primary roi-cta" href="contacto.html#contacto">
              Conversemos en detalle
              <svg className="arr" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="roi-disclaimer mono">
              ▸ Estimación basada en 60+ proyectos. El número real depende del alcance final.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ — accordion with smooth open/close
   ============================================================ */
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    {
      q: "¿Cuánto tarda un proyecto?",
      a: "Depende del alcance. Un POS para una cadena pequeña: 6–8 semanas. Un LMS con app móvil: 10–14 semanas. Un producto completamente a medida: 14–20 semanas. Siempre con demos quincenales para que veas avance real, no slides.",
    },
    {
      q: "¿De quién es el código?",
      a: "Tuyo desde el commit #1. Te creamos el repositorio en tu organización de GitHub / GitLab y trabajamos ahí. Las credenciales, deploys y secretos viven en tu cuenta cloud, no en la nuestra.",
    },
    {
      q: "¿Pueden firmar NDA?",
      a: "Sí, antes de cualquier reunión sustantiva. Tenemos un NDA mutuo estándar listo o firmamos el tuyo. Mucho de lo que construimos vive bajo confidencialidad.",
    },
    {
      q: "¿Hacen mantenimiento después del launch?",
      a: "Sí. Todos nuestros productos incluyen 12 meses de soporte y mejoras menores. A partir del año, ofrecemos un retainer mensual con equipo dedicado, no tickets perdidos en un helpdesk.",
    },
    {
      q: "¿Trabajan con startups en etapa temprana?",
      a: "Sí, si la idea está validada con clientes reales o tienen un piloto andando. Si todavía estás explorando, podemos hacer un sprint de descubrimiento de 2 semanas antes de comprometer un proyecto completo.",
    },
    {
      q: "¿Qué stack usan?",
      a: "React / Next.js para web, React Native para móvil, SpringBoot + Postgres para backend. Cloud generalmente Vercel. Pero adaptamos al stack de tu equipo si ya tienes uno — no somos religiosos con las herramientas.",
    },
    {
      q: "¿Atienden fuera de Perú?",
      a: "Sí, ya tenemos clientes en Chile, Colombia, Ecuador y México. Lima nos da huso horario compatible con toda LatAm (GMT-5). Hablamos español, inglés, portugués básico.",
    },
    {
      q: "¿Cómo se cobra el proyecto?",
      a: "30% al inicio, 40% al hito intermedio, 30% al entregable final. Sin sorpresas de scope: si algo cambia mid-project, lo conversamos como un cambio de orden formal, no como un \"extra\".",
    },
  ];

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— FAQ</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Preguntas que<br />
              <em>siempre nos hacen</em>.
            </h2>
            <p>
              Si la tuya no está acá, escríbenos por WhatsApp.
              Respondemos en minutos durante horario hábil.
            </p>
          </div>
        </Reveal>

        <Reveal className="faq-list" stagger>
          {faqs.map((f, i) => (
            <div className={`faq-item ${openIdx === i ? "is-open" : ""}`} key={i}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                aria-expanded={openIdx === i}
              >
                <span className="faq-num mono">0{i + 1}</span>
                <span className="faq-q-text">{f.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="faq-a-wrap">
                <p className="faq-a">{f.a}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Newsletter — quarterly report opt-in
   ============================================================ */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return;
    setSent(true);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-side">
            <div className="tag">— newsletter trimestral</div>
            <h3 className="newsletter-title">
              Recibe nuestros<br />
              <em>reportes trimestrales</em>.
            </h3>
            <p className="newsletter-desc">
              Cada 90 días publicamos métricas reales: uptime, latencia,
              transacciones, casos cerrados. Cero spam, una vez por trimestre.
            </p>
          </div>

          <div className="newsletter-form-wrap">
            {sent ? (
              <div className="newsletter-success">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                  <path d="M14 24l7 7 14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h4>¡Suscrito!</h4>
                  <p>Te llega el primer reporte en el próximo cierre trimestral.</p>
                </div>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={submit}>
                <input
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Suscribirme
                  <svg className="arr" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <p className="newsletter-fine mono">▸ 4 emails al año · sin marketing · cancelas con un click</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ROICalculator, FAQ, Newsletter });
