/* global React */
const { useEffect, useRef, useState, useCallback } = React;

/* ============================================================
   Animated lines canvas — orange-tinted moving grid lines
   ============================================================ */
function LinesCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, lines, raf;
    const mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    };

    const seed = () => {
      lines = [];
      const N = 28;
      for (let i = 0; i < N; i++) {
        lines.push({
          y: i / N * h + Math.random() * 18 - 9,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.5,
          amp: 6 + Math.random() * 14,
          hue: Math.random() < 0.18 ? "orange" : "ink"
        });
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.0006;
      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        ctx.beginPath();
        const steps = 80;
        for (let s = 0; s <= steps; s++) {
          const x = s / steps * w;
          const wave =
            Math.sin(time * ln.speed + ln.phase + s * 0.05) * ln.amp +
            Math.sin(time * 0.3 + s * 0.02) * 4;
          const dx = mouse.active ? x - mouse.x : 0;
          const dy = mouse.active ? ln.y - mouse.y : 0;
          const dist = mouse.active ? Math.hypot(dx, dy) : 9999;
          const push = mouse.active ? Math.max(0, 1 - dist / 240) * 30 : 0;
          const y = ln.y + wave - push;
          if (s === 0) ctx.moveTo(x, y); else
            ctx.lineTo(x, y);
        }
        if (ln.hue === "orange") {
          ctx.strokeStyle = "rgba(238, 90, 31, 0.55)";
          ctx.lineWidth = 1.1;
          ctx.shadowColor = "rgba(238, 90, 31, 0.5)";
          ctx.shadowBlur = 14;
        } else {
          ctx.strokeStyle = "rgba(12, 10, 8, 0.08)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // Watch the canvas's own box — the hero grows after fonts load and after
    // the intro overlay tears down. Without this the canvas stays at its
    // initial (small) size and the lines end up clustered top-left.
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    // Also re-seed once everything has settled (intro + fonts).
    const settleTimers = [setTimeout(resize, 300), setTimeout(resize, 1200), setTimeout(resize, 2500)];

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      settleTimers.forEach(clearTimeout);
    };
  }, []);

  return <canvas className="hero-canvas" ref={ref} style={{ borderStyle: "solid", margin: "0px", borderRadius: "0px", padding: "0px" }} />;
}

/* ============================================================
   Cinematic intro overlay — slides up after first paint
   ============================================================ */
function Intro({ onDone }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Skip intro if already seen this session
    try {
      const seen = sessionStorage.getItem("kui-intro-seen");
      if (seen === "1") {
        setHidden(true);
        onDone?.();
        return;
      }
      sessionStorage.setItem("kui-intro-seen", "1");
    } catch (e) { }

    // Timeline: show for 2.3 seconds, then exit
    const exitTimer = setTimeout(() => {
      // Try GSAP exit animation
      try {
        const root = document.querySelector(".intro");
        if (root && window.gsap && typeof window.gsap.timeline === "function") {
          const tl = window.gsap.timeline({
            onComplete: () => {
              setHidden(true);
              onDone?.();
            }
          });
          tl.to(root.querySelectorAll(".intro-bar"),
            { scaleY: 0, duration: 0.7, ease: "expo.inOut", stagger: 0.04, transformOrigin: "top" }, 0.1);
          tl.to(root.querySelector(".intro-logo"),
            { opacity: 0, duration: 0.5, ease: "power3.out" }, 0);
        } else {
          // No GSAP, just fade
          const root = document.querySelector(".intro");
          if (root) {
            root.style.transition = "opacity 0.5s ease-out";
            root.style.opacity = "0";
          }
          setTimeout(() => {
            setHidden(true);
            onDone?.();
          }, 500);
        }
      } catch (err) {
        console.error("Exit animation error:", err);
        setHidden(true);
        onDone?.();
      }
    }, 2300);

    // Update percentage display
    let pct = 0;
    const countInterval = setInterval(() => {
      pct += 5 + Math.random() * 15;
      if (pct >= 100) pct = 100;

      const pctEl = document.querySelector(".intro-pct");
      if (pctEl) {
        pctEl.textContent = `${String(Math.floor(pct)).padStart(3, "0")} / 100`;
      }

      if (pct >= 100) clearInterval(countInterval);
    }, 50);

    return () => {
      clearInterval(countInterval);
      clearTimeout(exitTimer);
    };
  }, []); // deps: empty — run only once

  if (hidden) return null;

  return (
    <div className="intro">
      <div className="intro-bar" style={{ left: 0, width: "25%" }} />
      <div className="intro-bar" style={{ left: "25%", width: "25%" }} />
      <div className="intro-bar" style={{ left: "50%", width: "25%" }} />
      <div className="intro-bar" style={{ left: "75%", width: "25%" }} />
      <div className="intro-logo">
        kui<span className="dot" />
      </div>
      <div className="intro-pct">000 / 100</div>
    </div>
  );
}

/* ============================================================
   Reveal helper — adds .in class when in viewport
   ============================================================ */
function Reveal({ as: Tag = "div", className = "", children, stagger, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => { el.classList.add("in"); };
    // Safety net: never let content stay invisible — show after 2.4s no matter what.
    const failsafe = setTimeout(reveal, 2400);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal();
            clearTimeout(failsafe);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);
  const cls = `${stagger ? "reveal-stagger" : "reveal"} ${className}`;
  return (
    <Tag ref={ref} className={cls} {...rest}>{children}</Tag>);

}

/* ============================================================
   Nav
   ============================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const page = document.body.getAttribute("data-page") || "home";
  const link = (target, label) => {
    const [pg, hash] = target.split("#");
    const onHome = page === "home";
    let href = "";
    if (pg === "" || pg === "home") {
      href = onHome ? `#${hash || ""}` : `index.html${hash ? "#" + hash : ""}`;
    } else {
      href = pg === page ? `#${hash || ""}` : `${pg}.html${hash ? "#" + hash : ""}`;
    }
    return <a className="nav-link" href={href} onClick={() => setMenuOpen(false)}><T>{label}</T></a>;
  };

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <div className="container nav-inner">
        <a href="index.html" className="brand" aria-label="kui" onClick={() => setMenuOpen(false)}>
          <img src="assets/logo.png" alt="" width="32" height="32" decoding="async" />
          kui
        </a>
        <button className={`nav-toggle ${menuOpen ? "is-active" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {link("#servicios", "Inicio")}
          {link("productos", "Productos")}
          {link("productos#planes", "Planes")}
          {link("estudio", "Estudio")}
          {link("contacto#equipo", "Equipo")}
          {link("contacto#contacto", "Contacto")}
          <LanguageSwitcher />
          <a className="nav-cta" href={page === "contacto" ? "#contacto" : "contacto.html#contacto"} onClick={() => setMenuOpen(false)}>
            <span className="pulse" />
            <T>Hablemos</T>
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   Hero
   ============================================================ */
function Hero() {
  const wordRefs = useRef([]);

  useEffect(() => {
    // hero text mask reveal — staggered
    const targets = wordRefs.current.filter(Boolean);
    targets.forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 200 + i * 140);
    });
  }, []);

  const addRef = (el, i) => { wordRefs.current[i] = el; };

  return (
    <section className="hero">
      <LinesCanvas />
      <div className="hero-glow" />
      <div className="hero-logo-wrap" aria-hidden="true">
        <div className="orbit o3"><div className="pin" /></div>
        <div className="orbit o2"><div className="pin" /></div>
        <img src="assets/personaje.png" alt="" className="hero-logo-img" decoding="async" />
      </div>

      <div className="container hero-inner">
        

        <h1 className="hero-headline">
          <span className="row mask-reveal" ref={(el) => addRef(el, 0)}><span>  La educación</span></span>
          <span className="row mask-reveal" ref={(el) => addRef(el, 1)}><span>y tecnología</span></span>
          <span className="row mask-reveal" ref={(el) => addRef(el, 2)}><span><em className="accent">avanzan</em> juntas.</span></span>
        </h1>

        <div className="hero-bottom">
          <p className="hero-sub">
            KUI integra la gestión académica, administrativa y la comunicación
            institucional en una experiencia moderna, intuitiva y eficiente.
          </p>
          <div className="hero-mobile-character" aria-hidden="true">
            <img src="assets/personaje.png" alt="" className="hero-mobile-character-img" decoding="async" />
          </div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span className="line" />
        <span>Desliza</span>
      </div>
    </section>);

}

/* ============================================================
   Marquee — tech stack used by the kui team (icons only)
   KUI logo inserted as a scrolling item at the centre position
   ============================================================ */
function Marquee() {
  const schools = [
    { name: "Colegio San Marcos", short: "SM", color: "#2f6fed" },
    { name: "Colegio Santa Elena", short: "SE", color: "#21b59b" },
    { name: "Colegio Los Alamos", short: "LA", color: "#ee5a1f" },
    { name: "Colegio Innova Norte", short: "IN", color: "#6b57ff" },
    { name: "Colegio San Jose", short: "SJ", color: "#d14e7a" },
    { name: "Colegio Virgen del Sol", short: "VS", color: "#0f8b8d" },
    { name: "Colegio Trilce Sur", short: "TS", color: "#d97706" },
    { name: "Colegio Humboldt", short: "HB", color: "#3b82f6" },
    { name: "Colegio Talentus", short: "TA", color: "#16a34a" },
    { name: "Colegio Alpha", short: "AL", color: "#7c3aed" },
    { name: "Colegio Jean Piaget", short: "JP", color: "#0891b2" },
    { name: "Colegio Prescott", short: "PR", color: "#e11d48" },
  ];

  const doubled = [...schools, ...schools, ...schools];

  return (
    <section className="marquee marquee-stack" aria-label="Instituciones educativas que pueden operar con KUI">
      <div className="marquee-track" data-no-translate="true">
        {doubled.map((school, i) => (
          <span
            className="marquee-item marquee-school"
            key={`${school.short}-${i}`}
            title={school.name}
            aria-label={school.name}
          >
            <span
              className="marquee-school-mark mono"
              style={{ background: school.color }}
              aria-hidden="true"
            >
              {school.short}
            </span>
            <span className="marquee-school-name">{school.name}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Products / Cases — featured rows + upcoming rail
   ============================================================ */
function Products() {
  const cases = [
    {
      n: "01",
      slug: "pos",
      title: "kui · POS",
      kicker: "Caso · Restaurantes",
      desc: "Punto de venta para restaurantes y cafeterías. Acceso rápido con PIN para meseros, panel administrativo en vivo con ventas, mesas, inventario y kitchen display. Diseñado offline-first para que el servicio no se detenga.",
      tags: ["live", "restaurantes", "offline-first", "multi-rol"],
      stat: { v: "180+", l: "locales en producción" },
      images: [
        { src: "assets/pos-2.png", kind: "browser", url: "salberpos.app/admin", label: "Panel admin" },
        { src: "assets/pos-1.png", kind: "browser", url: "salberpos.app/login", label: "Acceso PIN" },
      ],
      layout: "desktop-stack",
    },
    {
      n: "02",
      slug: "lms",
      title: "kui · LMS",
      kicker: "Caso · Educación",
      desc: "Plataforma de aprendizaje para colegios y academias. Vista web para docentes y administradores; app móvil para alumnos y apoderados. Horarios, tareas, notas y asistencias en un solo lugar — con anuncios y notificaciones en tiempo real.",
      tags: ["live", "colegios", "web + móvil", "multi-rol"],
      stat: { v: "12k", l: "estudiantes activos" },
      images: [
        { src: "assets/lms-2.png", kind: "browser", url: "kui-lms.app/dashboard", label: "Dashboard" },
        { src: "assets/lms-1.png", kind: "phone", label: "App apoderado" },
        { src: "assets/lms-3.png", kind: "phone", label: "App alumno" },
      ],
      layout: "lms-mix",
    },
  ];

  const upcoming = [
    { n: "03", title: "kui · Pay", desc: "Pasarela y links de pago conectados al POS y al LMS. Conciliación y reportería fiscal automáticas.", tag: "Beta · Q2 2026" },
    { n: "04", title: "kui · Stock", desc: "ERP ligero de inventario multi-bodega con trazabilidad por lote y reposición predictiva.", tag: "Próximamente · Q3 2026" },
    { n: "05", title: "kui · CRM", desc: "Relación con clientes, leads y campañas — integrado al POS y al LMS.", tag: "En diseño" },
  ];

  return (
    <section className="section products" id="productos">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="tag">02 — productos</div>
          </div>
          <div className="section-kicker">
            <h2 className="section-title">
              Sistemas vivos<br />
              en <em>producción</em>.
            </h2>
            <p>
              No demos. Productos kui que ya operan en empresas reales — y un roadmap
              corto y honesto de lo que viene.
            </p>
          </div>
        </Reveal>

        <div className="cases">
          {cases.map((c, idx) => (
            <Reveal key={c.n} className={`case ${idx % 2 ? "case-flip" : ""}`} stagger>
              <div className="case-copy">
                <div className="case-num mono">{c.n} / {c.kicker}</div>
                <h3 className="case-title">{c.title}</h3>
                <p className="case-desc">{c.desc}</p>
                <div className="case-tags">
                  {c.tags.map((t) => (
                    <span key={t} className={`product-tag ${t === "live" ? "live" : ""}`}>{t}</span>
                  ))}
                </div>
                <div className="case-stat">
                  <span className="case-stat-v">{c.stat.v}</span>
                  <span className="case-stat-l">{c.stat.l}</span>
                </div>
                <a className="case-cta" href={`caso-${c.slug}.html`}>
                  Ver caso completo
                  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
              <div className={`case-media case-media-${c.layout}`}>
                <CaseGallery images={c.images} layout={c.layout} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="upcoming">
          <div className="upcoming-head">
            <div className="tag">Roadmap</div>
            <h3 className="upcoming-title">Próximos sistemas</h3>
          </div>
          <div className="upcoming-grid">
            {upcoming.map((u) => (
              <div className="upcoming-item" key={u.n}>
                <div className="upcoming-num mono">{u.n}</div>
                <h4 className="upcoming-name">{u.title}</h4>
                <p className="upcoming-desc">{u.desc}</p>
                <div className="upcoming-tag mono">{u.tag}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>);

}

/* Renders the image collage for each case */
function CaseGallery({ images, layout }) {
  if (layout === "desktop-stack") {
    // Two browser windows, second one offset behind first
    return (
      <div className="gal gal-stack">
        <BrowserFrame img={images[1]} className="gal-back" />
        <BrowserFrame img={images[0]} className="gal-front" />
      </div>
    );
  }
  // lms-mix: 1 browser + 2 phones
  return (
    <div className="gal gal-mix">
      <BrowserFrame img={images[0]} className="gal-browser" />
      <PhoneFrame img={images[1]} className="gal-phone gal-phone-1" />
      <PhoneFrame img={images[2]} className="gal-phone gal-phone-2" />
    </div>
  );
}

function BrowserFrame({ img, className = "" }) {
  return (
    <div className={`frame frame-browser ${className}`}>
      <div className="frame-bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <div className="frame-url mono">{img.url || ""}</div>
        <div className="frame-label mono">{img.label}</div>
      </div>
      <div className="frame-body">
        <img src={img.src} alt={img.label} loading="lazy" />
      </div>
    </div>
  );
}

function PhoneFrame({ img, className = "" }) {
  return (
    <div className={`frame frame-phone ${className}`}>
      <div className="phone-notch" />
      <img src={img.src} alt={img.label} loading="lazy" />
      <div className="frame-label mono">{img.label}</div>
    </div>
  );
}

/* ============================================================
   Stats
   ============================================================ */
function Stats() {
  const stats = [
    { n: 180, s: "+", label: "Locales operando con kui" },
    { n: 6, s: "", label: "Países en LatAm" },
    { n: 99.97, s: "%", decimals: 2, label: "Uptime promedio" },
    { n: 3.2, s: "M", decimals: 1, label: "Transacciones / mes" }];

  return (
    <section className="section stats" id="nosotros">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">03 — números</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Datos que nos<br />sostienen.
            </h2>
            <p>Métricas vivas al cierre del trimestre. Las actualizamos públicamente cada 90 días.</p>
          </div>
        </Reveal>

        <Reveal className="stat-grid" stagger>
          {stats.map((st, i) =>
            <div className="stat" key={i}>
              <h3 className="stat-num">
                <AnimatedNumber value={st.n} decimals={st.decimals || 0} />
                <sup>{st.s}</sup>
              </h3>
              <div className="stat-label">{st.label}</div>
            </div>
          )}
        </Reveal>
      </div>
    </section>);

}

/* ============================================================
   Approach / Process
   ============================================================ */
function Approach() {
  const steps = [
    { n: "Etapa 01", t: "Descubrir", d: "Semanas en taller con tu operación. Mapeamos flujos, fricción y oportunidades antes de escribir una línea de código." },
    { n: "Etapa 02", t: "Diseñar", d: "Prototipos navegables y un sistema visual propio. Iteramos rápido con tu equipo hasta que el producto se siente inevitable." },
    { n: "Etapa 03", t: "Construir", d: "Sprints quincenales, demos en vivo, integraciones reales. Sin sorpresas en el último mes — lo ves todo en tiempo real." },
    { n: "Etapa 04", t: "Operar", d: "Observabilidad 24/7, SLA y un equipo dedicado. Crecemos contigo: cada release suma capacidades, no deuda técnica." }];

  return (
    <section className="section approach" id="proceso">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">04 — proceso</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Cuatro pasos.<br />
              <em>Cero</em> sorpresas.
            </h2>
            <p>El mismo método nos lleva de un Figma vacío a un sistema en producción atendiendo cientos de negocios.</p>
          </div>
        </Reveal>

        <Reveal className="steps" stagger>
          {steps.map((s) =>
            <div className="step" key={s.n}>
              <StepIcon name={s.t} />
              <div>
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.t}</h3>
                <p className="step-desc">{s.d}</p>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>);

}

function StepIcon({ name }) {
  const stroke = "currentColor";
  const common = { width: 32, height: 32, viewBox: "0 0 32 32", fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "Descubrir") return (
    <svg {...common} className="step-icon"><circle cx="14" cy="14" r="8" /><path d="M20 20l6 6" /></svg>);

  if (name === "Diseñar") return (
    <svg {...common} className="step-icon"><rect x="4" y="4" width="14" height="14" rx="1" /><rect x="14" y="14" width="14" height="14" rx="1" /></svg>);

  if (name === "Construir") return (
    <svg {...common} className="step-icon"><path d="M4 24l8-8 5 5 11-11" /><path d="M20 10h8v8" /></svg>);

  return (
    <svg {...common} className="step-icon"><circle cx="16" cy="16" r="12" /><path d="M16 4v12l8 4" /></svg>);

}

/* ============================================================
   Showcase — long sentence with word-by-word reveal
   ============================================================ */
function Showcase() {
  const sentence = "Diseñamos software con la disciplina de una agencia y el rigor de un equipo de producto — para que tu operación corra más rápido cada trimestre.";
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll(".showcase-word");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          words.forEach((w, i) => setTimeout(() => w.classList.add("lit"), i * 80));
        } else {
          words.forEach((w) => w.classList.remove("lit"));
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="showcase" ref={ref}>
      <div className="showcase-glow" />
      <p className="showcase-text">
        {sentence.split(" ").map((w, i) =>
          <span className="showcase-word" key={i}>
            {w === "agencia" || w === "rápido" ? <em>{w}</em> : w}
            {" "}
          </span>
        )}
      </p>
    </section>);

}

/* ============================================================
   CTA
   ============================================================ */
function CTA() {
  return (
    <section className="cta" id="contacto">
      <div className="container cta-inner">
        <Reveal>
          <div className="cta-eyebrow">¿Listos para construir?</div>
          <h2 className="cta-title">
            Empecemos<br />
            <em>algo serio</em>.
          </h2>
          <div className="cta-actions">
            <a className="btn btn-primary" href="mailto:kui.sitooo@gmail.com">
              kui.sitooo@gmail.com
              <svg className="arr" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="btn btn-ghost" href="#">Agendar llamada</a>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ============================================================
   Footer — redesigned with logo, animations, real socials
   ============================================================ */
function Footer() {
  const page = document.body.getAttribute("data-page") || "home";
  const footRef = useRef(null);
  const link = (target, label) => {
    const [pg, hash] = target.split("#");
    const onHome = page === "home";
    let href = "";
    if (pg === "" || pg === "home") {
      href = onHome ? `#${hash || ""}` : `index.html${hash ? "#" + hash : ""}`;
    } else {
      href = pg === page ? `#${hash || ""}` : `${pg}.html${hash ? "#" + hash : ""}`;
    }
    return <a href={href}>{label}</a>;
  };

  useEffect(() => {
    const el = footRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".footer-anim"),
              translateY: [30, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(60),
              duration: 800,
              easing: "easeOutQuart",
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="footer footer-v2" ref={footRef}>
      <div className="container">
        {/* Top bar: logo + tagline */}
        <div className="footer-top footer-anim">
          <div className="footer-logo-wrap">
            <img src="assets/logo.png" alt="kui" className="footer-logo-img" decoding="async" />
            <span className="footer-logo-text">kui<em>.</em></span>
          </div>
          <p className="footer-tagline mono">
            Infraestructura digital para negocios que se mueven.
          </p>
        </div>

        {/* Main grid */}
        <div className="footer-grid">
          <div className="footer-col footer-anim">
            <h4>Productos</h4>
            <ul>
              <li>{link("#productos", "kui · POS")}</li>
              <li>{link("#productos", "kui · LMS")}</li>
              <li>{link("#productos", "kui · Pay")}</li>
              <li>{link("#productos", "kui · Stock")}</li>
            </ul>
          </div>
          <div className="footer-col footer-anim">
            <h4>Studio</h4>
            <ul>
              <li>{link("estudio", "Sobre kui")}</li>
              <li>{link("estudio#historia", "Historia")}</li>
              <li>{link("estudio#stack", "Stack")}</li>
              <li>{link("contacto#equipo", "Equipo")}</li>
            </ul>
          </div>
          <div className="footer-col footer-anim">
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:kui.sitooo@gmail.com">kui.sitooo@gmail.com</a></li>
              <li><a href="https://wa.me/51902487635" target="_blank" rel="noreferrer">+51 902 487 635</a></li>
            </ul>
          </div>
          <div className="footer-col footer-anim">
            <h4>Redes</h4>
            <ul>
              <li>
                <a href="https://www.facebook.com/people/KUI/61589326215024/" target="_blank" rel="noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{verticalAlign: "middle", marginRight: 8}}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/kui.web?igsh=MTFxdmJpa2hvejhnZw==" target="_blank" rel="noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{verticalAlign: "middle", marginRight: 8}}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bot footer-anim">
          <span>© 2026 kui studio — Lima, Perú</span>
          <span className="footer-bot-right mono">
            <a href="mailto:kui.sitooo@gmail.com">kui.sitooo@gmail.com</a>
          </span>
        </div>
      </div>
    </footer>);

}

Object.assign(window, {
  Intro, Nav, Hero, Marquee, Products, Stats, Approach, Showcase, CTA, Footer, Reveal
});

