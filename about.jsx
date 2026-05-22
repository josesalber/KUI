/* global React, Reveal, anime */
const { useEffect, useRef, useState, useCallback } = React;

/* ============================================================
   AboutCarousel — "Quiénes somos" + "Qué hacemos" auto-playing
   carousel inside a premium card.
   ============================================================ */
function AboutCarousel() {
  const [slide, setSlide] = useState(0);
  const total = 2;
  const timerRef = useRef(null);

  const next = useCallback(() => setSlide((s) => (s + 1) % total), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + total) % total), []);

  // Auto-advance every 8s
  useEffect(() => {
    timerRef.current = setInterval(next, 8000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 8000);
  };

  const goTo = (i) => { setSlide(i); resetTimer(); };
  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— nosotros</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Quiénes<br /><em>somos</em>.
            </h2>
          </div>
        </Reveal>

        <Reveal className="about-card">
          {/* Decorative corner lines */}
          <div className="about-card-deco about-card-deco-tl" aria-hidden="true" />
          <div className="about-card-deco about-card-deco-br" aria-hidden="true" />

          {/* Slide track */}
          <div className="about-carousel">
            <div
              className="about-slides"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {/* Slide 0 — Quiénes somos */}
              <div className="about-slide about-slide--hero">
                <div className="about-slide-badge mono">01 · Quiénes somos</div>
                <h3 className="about-slide-title">
                  Transformamos la gestión educativa con tecnología de vanguardia.
                </h3>
                <p className="about-slide-body">
                  Somos una plataforma digital intuitiva, práctica y adaptable, que conecta
                  a toda la comunidad educativa: docentes, estudiantes, directivos y padres
                  de familia, facilitando la comunicación y el trabajo diario desde la web o
                  nuestra app móvil.
                </p>
                <div className="about-slide-tags">
                  <span className="about-pill">Plataforma web</span>
                  <span className="about-pill">App móvil</span>
                  <span className="about-pill">Toda la comunidad</span>
                  <span className="about-pill">Gestión educativa</span>
                </div>
                <div className="about-slide-hero" aria-hidden="true">
                  <img src="assets/slide0.png" alt="" loading="lazy" />
                </div>
              </div>

              {/* Slide 1 — Qué hacemos */}
              <div className="about-slide about-slide--hero">
                <div className="about-slide-badge mono">02 · Nuestra plataforma</div>
                <h3 className="about-slide-title">
                  Todo lo que una institución educativa necesita, en un solo lugar.
                </h3>
                <p className="about-slide-body">
                  Nuestro sistema integra funciones clave como Aula Virtual, calificaciones,
                  tareas, control de asistencia, certificados, admisión, pensiones y mucho más,
                  permitiendo a las instituciones educativas enfocarse en lo que realmente
                  importa: educar con calidad.
                </p>
                <p className="about-slide-body">
                  Nuestra finalidad es optimizar la experiencia de gestión educativa a través
                  de una plataforma robusta, eficiente y alineada con los más altos estándares
                  del sector. Nuestra cultura se basa en la cercanía con el cliente, la mejora
                  continua y el trabajo en equipo, impulsando el impacto educativo con
                  compromiso e innovación constante.
                </p>
                <div className="about-slide-tags">
                  <span className="about-pill">Aula Virtual</span>
                  <span className="about-pill">Calificaciones</span>
                  <span className="about-pill">Asistencia</span>
                  <span className="about-pill">Certificados</span>
                  <span className="about-pill">Admisión</span>
                  <span className="about-pill">Pensiones</span>
                </div>
                <div className="about-slide-hero" aria-hidden="true">
                  <img src="assets/slide1.png" alt="" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="about-controls">
            <div className="about-dots">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  className={`about-dot ${i === slide ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                >
                  {i === slide && <span className="about-dot-fill" />}
                </button>
              ))}
            </div>
            <div className="about-arrows">
              <button className="about-arrow" onClick={handlePrev} aria-label="Anterior">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="about-counter mono">{slide + 1}/{total}</span>
              <button className="about-arrow" onClick={handleNext} aria-label="Siguiente">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Values — animated card grid with staggered entry
   ============================================================ */
function Values() {
  const gridRef = useRef(null);

  const values = [
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Experiencia",
      desc: "Años resolviendo desafíos reales en gestión educativa nos dan perspectiva y criterio para cada decisión de producto.",
      accent: "#ee5a1f",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <rect x="4" y="10" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      title: "Seguridad y confiabilidad",
      desc: "99.97% uptime. Datos encriptados, respaldos automáticos y auditoría constante para proteger a cada institución.",
      accent: "#3178C6",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <path d="M16 4l3.5 7 7.5 1.1-5.4 5.3L22.9 25 16 21.3 9.1 25l1.3-7.6L5 12.1l7.5-1.1L16 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ),
      title: "Calidad",
      desc: "Cada feature pasa por diseño, ingeniería y QA antes de llegar a producción. No lanzamos lo que no usaríamos nosotros.",
      accent: "#6DB33F",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 16.5l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Compromiso",
      desc: "Respondemos en minutos, no en días. Cada cliente tiene acceso directo al equipo que construye su producto.",
      accent: "#ee5a1f",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <path d="M8 20l4-8 4 5 4-10 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      title: "Innovación",
      desc: "Evaluamos nuevas tecnologías cada trimestre y adoptamos lo que genera impacto real — no lo que está de moda.",
      accent: "#646CFF",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <path d="M6 16c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 16c0 5.523 4.477 10 10 10s10-4.477 10-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
          <circle cx="16" cy="16" r="3" fill="currentColor" />
        </svg>
      ),
      title: "Adaptabilidad",
      desc: "Cada institución es única. Nuestro sistema se configura sin código para adaptarse a cualquier modelo educativo.",
      accent: "#3ECF8E",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
          <path d="M16 4v6m0 12v6M4 16h6m12 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
        </svg>
      ),
      title: "Impacto educativo",
      desc: "12.000+ estudiantes y cientos de docentes usan kui diariamente. Medimos éxito en aprendizaje real, no en métricas vacías.",
      accent: "#DD0031",
    },
  ];

  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".val-card"),
              translateY: [50, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(80),
              duration: 900,
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
    <section className="section values-section" id="valores">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— valores</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Lo que nos<br /><em>define</em>.
            </h2>
            <p>
              Siete principios que guían cada línea de código, cada decisión de
              producto y cada conversación con nuestros clientes.
            </p>
          </div>
        </Reveal>

        <div className="val-grid" ref={gridRef}>
          {values.map((v, i) => (
            <div className="val-card" key={i} style={{ "--val-accent": v.accent }}>
              <div className="val-icon">{v.icon}</div>
              <div className="val-num mono">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="val-title">{v.title}</h3>
              <p className="val-desc">{v.desc}</p>
              <div className="val-line" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MissionVision — split card with animated reveal
   ============================================================ */
function MissionVision() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".mv-card"),
              translateY: [60, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(200),
              duration: 1100,
              easing: "easeOutQuart",
            });
            window.anime({
              targets: el.querySelectorAll(".mv-icon-ring"),
              scale: [0, 1],
              opacity: [0, 1],
              duration: 1000,
              delay: window.anime.stagger(200, { start: 300 }),
              easing: "easeOutBack",
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

  return (
    <section className="section mv-section" id="mision-vision">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— propósito</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Misión y<br /><em>Visión</em>.
            </h2>
          </div>
        </Reveal>

        <div className="mv-grid" ref={wrapRef}>
          {/* Mission */}
          <div className="mv-card mv-mission">
            <div className="mv-icon-wrap">
              <div className="mv-icon-ring" aria-hidden="true">
                <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
                  <circle cx="40" cy="40" r="36" stroke="var(--orange)" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
                  <circle cx="40" cy="40" r="24" stroke="var(--orange)" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="40" cy="40" r="10" fill="var(--orange)" opacity="0.9" />
                  <path d="M28 40l8 8 16-16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="mv-content">
              <div className="mv-label mono">Misión</div>
              <h3 className="mv-title">
                Brindar la mejor plataforma digital para la gestión educativa
              </h3>
              <p className="mv-body">
                Optimizando el trabajo, la experiencia de usuario y la comunicación
                institucional. Cada funcionalidad está pensada para reducir la carga
                administrativa y elevar la calidad del proceso educativo.
              </p>
              <div className="mv-metrics" aria-hidden="true">
                <div className="mv-metric">
                  <span className="mv-metric-n">180+</span>
                  <span className="mv-metric-l mono">instituciones</span>
                </div>
                <div className="mv-metric">
                  <span className="mv-metric-n">12k+</span>
                  <span className="mv-metric-l mono">estudiantes</span>
                </div>
                <div className="mv-metric">
                  <span className="mv-metric-n">99.97%</span>
                  <span className="mv-metric-l mono">uptime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="mv-card mv-vision">
            <div className="mv-icon-wrap">
              <div className="mv-icon-ring" aria-hidden="true">
                <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
                  <circle cx="40" cy="40" r="36" stroke="var(--ink)" strokeWidth="1" strokeDasharray="6 4" opacity="0.15" />
                  <circle cx="40" cy="40" r="24" stroke="var(--ink)" strokeWidth="1.5" opacity="0.25" />
                  <circle cx="40" cy="40" r="10" fill="var(--ink)" opacity="0.9" />
                  <path d="M32 40c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" stroke="#fff" strokeWidth="0" />
                  <path d="M22 40s6-12 18-12 18 12 18 12-6 12-18 12-18-12-18-12z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="none" />
                  <circle cx="40" cy="40" r="4" fill="#fff" />
                </svg>
              </div>
            </div>
            <div className="mv-content">
              <div className="mv-label mono">Visión</div>
              <h3 className="mv-title">
                Ser la plataforma de gestión educativa más utilizada y reconocida
              </h3>
              <p className="mv-body">
                A nivel nacional e internacional. Aspiramos a ser el estándar de
                referencia para cualquier institución educativa que busque
                digitalizarse con calidad, seguridad y un equipo comprometido
                detrás.
              </p>
              <div className="mv-ambition">
                <div className="mv-ambition-bar" aria-hidden="true">
                  <div className="mv-ambition-fill" />
                </div>
                <div className="mv-ambition-labels mono">
                  <span>Lima 2024</span>
                  <span>LatAm 2026</span>
                  <span>Global →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AboutCarousel, Values, MissionVision });
