/* global React */
const { useEffect, useRef } = React;

/* ============================================================
   CaseStudy — full case study page layout. Used by caso-pos and
   caso-lms pages. Driven by the body[data-case] attribute.
   ============================================================ */

const CASES = {
  pos: {
    code: "P/01",
    name: "kui · POS",
    tag: "Caso · Restaurantes",
    title: "El sistema operativo de los restaurantes que crecen.",
    lead: "Un POS construido desde la cocina, no desde un Excel. Reemplaza tres herramientas distintas (caja, comanda, inventario) con una sola, sincronizada y offline-first.",
    images: [
      { src: "assets/pos-2.png", url: "salberpos.app/admin", label: "Panel admin" },
      { src: "assets/pos-1.png", url: "salberpos.app/login", label: "Acceso por PIN" },
    ],
    stats: [
      { v: "180+", l: "locales en producción" },
      { v: "1.2M", l: "comandas al mes" },
      { v: "<60ms", l: "tiempo de respuesta promedio" },
      { v: "99.99%", l: "uptime en horario pico" },
    ],
    problem: [
      "El equipo de operaciones gestionaba 12 locales con tres sistemas distintos: una caja registradora, una app de comanda por bluetooth y un Excel para inventario.",
      "Cierres de caja se hacían a mano cada noche, con discrepancias que tomaban días resolver.",
      "Cuando se caía el internet, el servicio se paralizaba — pizzería sin pedido es pizzería sin venta.",
    ],
    solution: [
      "Un POS unificado web + tablet, con login por PIN para que el mesero arranque su turno en 3 segundos.",
      "Modo offline-first: si se cae el internet, las comandas se cachean localmente y se sincronizan al volver — el cliente nunca se entera.",
      "Kitchen Display System conectado en vivo, con tiempos de preparación rastreados por plato.",
      "Inventario por receta: descuento automático de insumos al cerrar cada cuenta.",
    ],
    results: [
      "Cierre de caja pasa de 45 min a 4 min por local.",
      "Reducción del 28% en mermas por descuento automático de inventario.",
      "Tres herramientas reemplazadas → un solo costo recurrente.",
    ],
    tech: ["React", "TypeScript", "PostgreSQL", "Redis", "Service Workers", "Tailwind", "Node + Fastify"],
    timeline: "10 semanas",
    team: "4 personas (PM, 2 ingenieros, 1 diseñadora)",
    quote: {
      text: "Nos entregaron un POS que reemplazó tres sistemas distintos. Lo más difícil fue convencer al equipo de no extrañar el papel.",
      author: "Daniela Vega",
      role: "Operations Lead · Cadena gastronómica · 12 locales",
    },
    next: { slug: "lms", title: "kui · LMS" },
  },

  lms: {
    code: "P/02",
    name: "kui · LMS",
    tag: "Caso · Educación",
    title: "Plataforma escolar para 12.000 estudiantes, migrada sin un día de servicio caído.",
    lead: "Un LMS construido para colegios y academias en LatAm. Web para docentes y administración, app móvil para alumnos y apoderados — todo conectado en tiempo real.",
    images: [
      { src: "assets/lms-2.png", url: "kui-lms.app/dashboard", label: "Dashboard docente" },
      { src: "assets/lms-1.png", url: "", label: "App apoderado" },
      { src: "assets/lms-3.png", url: "", label: "App alumno" },
    ],
    stats: [
      { v: "12k", l: "estudiantes activos" },
      { v: "4", l: "colegios migrados" },
      { v: "0", l: "días de servicio caído en migración" },
      { v: "92%", l: "adopción en la primera semana" },
    ],
    problem: [
      "Cuatro colegios del mismo grupo educativo operaban con sistemas dispersos: una intranet en PHP del 2014, hojas de Excel para asistencia, un chat de WhatsApp para anuncios.",
      "Padres recibían información tarde o incompleta. Docentes pasaban más tiempo en planillas que en aulas.",
      "Migrar tenía que hacerse sin interrumpir clases — el período académico nunca para.",
    ],
    solution: [
      "Web administrativa multi-tenant (un solo sistema, cuatro colegios separados por permisos).",
      "App móvil nativa para alumnos y apoderados con notificaciones en tiempo real para notas, tareas y anuncios.",
      "Sistema de asistencia con QR para entrada/salida, integrado al registro académico.",
      "Importación masiva de datos históricos con validación + reportes de migración por colegio.",
    ],
    results: [
      "Tiempo en planillas reducido 70% — docentes recuperan ~6 horas por semana.",
      "Comunicación con apoderados se mueve de WhatsApp informal a notificaciones in-app con audit trail.",
      "Implementación en cuatro colegios en un trimestre, sin pausar clases.",
    ],
    tech: ["React", "Next.js", "React Native", "Expo", "Postgres", "SpringBoot", "tRPC", "Tailwind"],
    timeline: "14 semanas",
    team: "6 personas (PM, 2 ingenieros web, 2 mobile, 1 diseñadora)",
    quote: {
      text: "Migramos 4 colegios al LMS en un trimestre sin un solo día de servicio caído. El equipo de kui se quedó hasta tarde con nosotros en la primera semana de clases.",
      author: "Carlos Mendoza",
      role: "Director de tecnología · Grupo educativo · Lima",
    },
    next: { slug: "pos", title: "kui · POS" },
  },
};

function CaseStudy() {
  const slug = document.body.getAttribute("data-case") || "pos";
  const c = CASES[slug] || CASES.pos;

  useEffect(() => {
    if (typeof window.anime !== "function") return;
    window.anime.timeline({ easing: "easeOutExpo" })
      .add({
        targets: ".cs-hero-meta",
        translateY: [20, 0], opacity: [0, 1], duration: 700,
      })
      .add({
        targets: ".cs-hero-title",
        translateY: [40, 0], opacity: [0, 1], duration: 900,
      }, "-=500")
      .add({
        targets: ".cs-hero-lead",
        translateY: [20, 0], opacity: [0, 1], duration: 700,
      }, "-=600")
      .add({
        targets: ".cs-stat",
        translateY: [30, 0], opacity: [0, 1],
        delay: window.anime.stagger(80), duration: 700,
      }, "-=400");
  }, []);

  return (
    <main className="cs">
      <section className="cs-hero">
        <div className="container">
          <div className="cs-hero-meta">
            <span className="mono">{c.code}</span>
            <span className="mono">·</span>
            <span className="mono">{c.tag}</span>
          </div>
          <h1 className="cs-hero-title">{c.title}</h1>
          <p className="cs-hero-lead">{c.lead}</p>

          <div className="cs-stats">
            {c.stats.map((s, i) => (
              <div className="cs-stat" key={i}>
                <div className="cs-stat-v">{s.v}</div>
                <div className="cs-stat-l mono">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-gallery container">
        {c.images.map((img, i) => (
          <Reveal key={i} className={`cs-shot ${i % 2 ? "cs-shot-right" : "cs-shot-left"}`}>
            <div className="cs-shot-frame">
              <div className="cs-shot-bar">
                <span className="cs-shot-dot r" /><span className="cs-shot-dot y" /><span className="cs-shot-dot g" />
                {img.url && <span className="cs-shot-url mono">{img.url}</span>}
              </div>
              <img src={img.src} alt={img.label} loading="lazy" decoding="async" />
            </div>
            <div className="cs-shot-cap mono">{img.label}</div>
          </Reveal>
        ))}
      </section>

      <section className="cs-narrative container">
        <Reveal className="cs-block">
          <h2 className="cs-block-h">El problema</h2>
          <ul className="cs-list">
            {c.problem.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Reveal>

        <Reveal className="cs-block">
          <h2 className="cs-block-h">Lo que construimos</h2>
          <ul className="cs-list">
            {c.solution.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Reveal>

        <Reveal className="cs-block">
          <h2 className="cs-block-h">Resultados</h2>
          <ul className="cs-list cs-list-results">
            {c.results.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Reveal>

        <Reveal className="cs-meta-grid">
          <div className="cs-meta-cell">
            <div className="cs-meta-l mono">Stack</div>
            <div className="cs-meta-v">
              {c.tech.map((t) => <span className="cs-chip" key={t}>{t}</span>)}
            </div>
          </div>
          <div className="cs-meta-cell">
            <div className="cs-meta-l mono">Duración</div>
            <div className="cs-meta-v">{c.timeline}</div>
          </div>
          <div className="cs-meta-cell">
            <div className="cs-meta-l mono">Equipo</div>
            <div className="cs-meta-v">{c.team}</div>
          </div>
        </Reveal>
      </section>

      <section className="cs-quote">
        <div className="container">
          <Reveal>
            <svg className="cs-quote-mark" viewBox="0 0 64 48" fill="currentColor">
              <path d="M0 48V28C0 14 8 4 22 0L26 6C18 9 14 14 14 22H24V48H0Z" opacity="0.4" />
              <path d="M38 48V28C38 14 46 4 60 0L64 6C56 9 52 14 52 22H62V48H38Z" opacity="0.4" />
            </svg>
            <p className="cs-quote-text">{c.quote.text}</p>
            <div className="cs-quote-author">
              <div className="cs-quote-avatar">{c.quote.author.split(" ").map((s) => s[0]).join("")}</div>
              <div>
                <div className="cs-quote-name">{c.quote.author}</div>
                <div className="cs-quote-role">{c.quote.role}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="cs-next container">
        <a className="cs-next-link" href={`caso-${c.next.slug}.html`}>
          <div className="cs-next-label mono">Siguiente caso →</div>
          <div className="cs-next-title">{c.next.title}</div>
        </a>
      </section>
    </main>
  );
}

Object.assign(window, { CaseStudy, CASES });
