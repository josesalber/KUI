/* global React, anime */
const { useEffect, useRef, useState } = React;

/* ============================================================
   AnimatedNumber — counts up to target when scrolled into view
   ============================================================ */
function AnimatedNumber({ value, decimals = 0, duration = 1600 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const obj = { v: 0 };
            window.anime({
              targets: obj,
              v: value,
              round: decimals === 0 ? 1 : Math.pow(10, decimals),
              easing: "easeOutExpo",
              duration,
              update: () => {
                el.textContent = decimals === 0
                  ? String(Math.round(obj.v))
                  : obj.v.toFixed(decimals);
              },
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, decimals, duration]);
  return <span ref={ref}>0</span>;
}

/* ============================================================
   WhyKui — 6 differentiators grid with anime.js staggered entry
   ============================================================ */
function WhyKui() {
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".why-card"),
              translateY: [40, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(70),
              duration: 900,
              easing: "easeOutQuart",
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

  const items = [
    {
      n: "01",
      title: "Operamos como producto, no como agencia",
      desc: "Nuestros productos kui están en producción. Cuando trabajamos contigo, traemos las cicatrices reales — no slides.",
    },
    {
      n: "02",
      title: "Mismo huso, mismo idioma",
      desc: "Standups en vivo en tu horario, no calls a las 4 a.m. Decisiones que se toman hoy, no la próxima semana.",
    },
    {
      n: "03",
      title: "Velocidad de startup, disciplina de banco",
      desc: "CI/CD, observabilidad, pruebas y SLA desde el día uno. No te entregamos un MVP frágil.",
    },
    {
      n: "04",
      title: "Diseño y código en un solo equipo",
      desc: "Sin handoffs entre agencias de diseño y fábricas de software. El mismo equipo piensa el UX y lo implementa.",
    },
    {
      n: "05",
      title: "Propiedad total del código",
      desc: "Repo tuyo desde el commit #1. Documentación, deploys y secretos en tu organización — sin candados.",
    },
    {
      n: "06",
      title: "Acompañamiento post-launch",
      desc: "Soporte y mejoras continuas con un equipo dedicado. Crecemos contigo, no facturamos por ticket.",
    },
  ];

  return (
    <section className="section why" id="por-que">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— por qué kui</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Seis razones<br />
              por las que <em>nos eligen</em>.
            </h2>
            <p>Lo que nos diferencia de la consultora promedio o de una fábrica de software clásica.</p>
          </div>
        </Reveal>

        <div className="why-grid" ref={gridRef}>
          {items.map((it) => (
            <div className="why-card" key={it.n}>
              <div className="why-num mono">{it.n}</div>
              <h3 className="why-title">{it.title}</h3>
              <p className="why-desc">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Stack — horizontal tech stack with anime.js floating badges
   ============================================================ */
function Stack() {
  const rowRef = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".stack-chip"),
              translateY: [20, 0],
              opacity: [0, 1],
              scale: [0.9, 1],
              delay: window.anime.stagger(40),
              duration: 700,
              easing: "easeOutBack",
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const groups = [
    { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Vite", "Motion"] },
    { label: "Backend", items: ["Node", "NestJS", "Postgres", "Redis", "Prisma", "tRPC"] },
    { label: "Mobile", items: ["React Native", "Expo", "Swift", "Kotlin"] },
    { label: "Cloud & DX", items: ["AWS", "Vercel", "Docker", "GitHub Actions", "Render", "Grafana"] },
  ];

  return (
    <section className="section stack" id="stack">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— stack</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Herramientas<br />
              que <em>se quedan</em>.
            </h2>
            <p>Tecnologías maduras, bien documentadas y sin lock-in. Lo que escribimos hoy lo podés mantener mañana.</p>
          </div>
        </Reveal>

        <div className="stack-groups" ref={rowRef}>
          {groups.map((g) => (
            <div className="stack-group" key={g.label}>
              <div className="stack-label mono">{g.label}</div>
              <div className="stack-row">
                {g.items.map((it) => (
                  <span className="stack-chip" key={it}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Testimonials — auto-rotating quote carousel
   ============================================================ */
function Testimonials() {
  const quotes = [
    {
      text: "Nos entregaron un POS que reemplazó tres sistemas distintos. Lo más difícil fue convencer al equipo de no extrañar el papel.",
      author: "Daniela Vega",
      role: "Operations Lead · Cadena gastronómica · 12 locales",
    },
    {
      text: "Migramos 4 colegios al LMS en un trimestre sin un solo día de servicio caído. El equipo de kui se quedó hasta tarde con nosotros en la primera semana de clases.",
      author: "Carlos Mendoza",
      role: "Director de tecnología · Grupo educativo · Lima",
    },
    {
      text: "Pedimos un MVP y nos volvieron a vender un producto. La diferencia se nota cuando llegan los primeros 5,000 usuarios.",
      author: "Sofía Aranibar",
      role: "Co-fundadora · Plataforma de e-learning",
    },
  ];
  const [i, setI] = useState(0);
  const stageRef = useRef(null);

  // auto-rotate every 7s
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % quotes.length), 7000);
    return () => clearInterval(id);
  }, [quotes.length]);

  // re-animate on change
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof window.anime !== "function") return;
    window.anime.remove(el);
    window.anime({
      targets: el,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
      easing: "easeOutQuart",
    });
  }, [i]);

  const q = quotes[i];

  return (
    <section className="section testimonials" id="testimonios">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— testimonios</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              La voz de<br />
              <em>quienes nos contratan</em>.
            </h2>
            <p>Tres conversaciones de los últimos doce meses. El resto vive bajo NDA.</p>
          </div>
        </Reveal>

        <div className="quote-card">
          <svg className="quote-mark" viewBox="0 0 64 48" fill="none">
            <path d="M0 48V28C0 14 8 4 22 0L26 6C18 9 14 14 14 22H24V48H0Z" fill="currentColor" opacity="0.18" />
            <path d="M38 48V28C38 14 46 4 60 0L64 6C56 9 52 14 52 22H62V48H38Z" fill="currentColor" opacity="0.18" />
          </svg>

          <div className="quote-stage" ref={stageRef}>
            <p className="quote-text">{q.text}</p>
            <div className="quote-author">
              <div className="quote-author-avatar">{q.author.split(" ").map((s) => s[0]).join("")}</div>
              <div>
                <div className="quote-author-name">{q.author}</div>
                <div className="quote-author-role">{q.role}</div>
              </div>
            </div>
          </div>

          <div className="quote-controls">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                className={`quote-dot ${idx === i ? "is-active" : ""}`}
                onClick={() => setI(idx)}
                aria-label={`Testimonio ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AnimatedNumber, WhyKui, Stack, Testimonials, StudioHero });

/* ============================================================
   StudioHero — page header for /estudio with heavy anime.js
   ============================================================ */
function StudioHero() {
  const rootRef = useRef(null);
  const blobsRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const metaRef = useRef(null);
  const trailRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window.anime !== "function") return;

    // Split title into character spans for stagger
    const title = titleRef.current;
    const text = title.dataset.text || title.textContent;
    title.innerHTML = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "sh-ch";
      span.textContent = ch === " " ? "\u00A0" : ch;
      title.appendChild(span);
    });

    const tl = window.anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: rootRef.current.querySelectorAll(".sh-blob"),
      scale: [0, 1],
      opacity: [0, 0.85],
      duration: 1400,
      delay: window.anime.stagger(120),
    });

    tl.add({
      targets: title.querySelectorAll(".sh-ch"),
      translateY: [80, 0],
      opacity: [0, 1],
      duration: 900,
      delay: window.anime.stagger(20),
    }, "-=900");

    tl.add({
      targets: [subRef.current, metaRef.current],
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: window.anime.stagger(120),
    }, "-=500");

    // Floating blobs ambient motion
    const blobs = rootRef.current.querySelectorAll(".sh-blob");
    blobs.forEach((b, i) => {
      window.anime({
        targets: b,
        translateX: [
          { value: 30 + i * 8, duration: 6000 + i * 800 },
          { value: -20 - i * 6, duration: 7000 + i * 600 },
          { value: 0, duration: 5500 },
        ],
        translateY: [
          { value: -20 - i * 4, duration: 5500 },
          { value: 25 + i * 6, duration: 6500 },
          { value: 0, duration: 6000 },
        ],
        scale: [
          { value: 1.08, duration: 5000 },
          { value: 0.94, duration: 5500 },
          { value: 1, duration: 5000 },
        ],
        loop: true,
        easing: "easeInOutSine",
        direction: "alternate",
      });
    });

    // Cursor-following soft trail (subtle parallax on blobs)
    const onMove = (e) => {
      const r = rootRef.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      trailRef.current = { x, y };
      blobs.forEach((b, i) => {
        const depth = 20 + i * 14;
        b.style.setProperty("--px", `${x * depth}px`);
        b.style.setProperty("--py", `${y * depth}px`);
      });
    };
    rootRef.current.addEventListener("mousemove", onMove);
    return () => rootRef.current?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="sh" ref={rootRef}>
      <div className="sh-blobs" ref={blobsRef} aria-hidden="true">
        <div className="sh-blob sh-blob-1" />
        <div className="sh-blob sh-blob-2" />
        <div className="sh-blob sh-blob-3" />
      </div>

      <div className="container sh-inner">
        <div className="sh-meta mono" ref={metaRef}>
          <span>kui</span>
          <span className="sh-dot">·</span>
          <span>estudio · Lima, Perú</span>
          <span className="sh-dot">·</span>
          <span>03 años</span>
        </div>

        <h1 className="sh-title" ref={titleRef} data-text="el estudio">el estudio</h1>

        <p className="sh-sub" ref={subRef}>
          Construimos sistemas en producción para empresas reales — POS,
          LMS y producto a medida — desde Lima para toda LatAm.
        </p>

        <div className="sh-scroll mono" aria-hidden="true">
          <span className="sh-scroll-arrow">↓</span>
          <span>desplázate · números · stack · historia · testimonios</span>
        </div>
      </div>
    </section>
  );
}
