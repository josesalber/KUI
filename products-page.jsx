/* global React, Reveal, anime */
const { useEffect, useRef, useState } = React;

/* ============================================================
   ProductsPage — full product showcase with roles + modules
   ============================================================ */

const ROLES = [
  {
    id: "proveedor",
    title: "Proveedor",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 27c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "#ee5a1f",
    functions: [
      "Branding institucional",
      "Configuración de logo, colores y fondos de login",
      "Configuración de años académicos",
      "Configuración de horarios",
    ],
    detail: "El rol Proveedor gestiona la identidad visual de la institución dentro de la plataforma: logo, colores institucionales, fondos de pantalla de login, y la configuración base de años académicos y horarios que heredan todos los demás módulos.",
    imageSlot: "role-img-proveedor",
    imageSrc: "assets/proveedor.png",
    imageFit: "contain",
    imagePlaceholder: "Captura: panel de branding del proveedor",
  },
  {
    id: "admin",
    title: "Admin",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <path d="M16 4l12 6v8c0 6-5 10-12 14C9 28 4 24 4 18v-8l12-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 16l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#DD0031",
    functions: [
      "Acceso total a toda la plataforma",
      "Administración general",
      "Gestión de usuarios",
      "Gestión de estructura académica",
      "Matrícula",
      "Pagos",
      "Anuncios",
      "Asistencia",
      "Almacén",
      "Salud escolar",
      "Permisos de administración",
    ],
    detail: "El Admin tiene visibilidad y control total sobre todos los módulos. Desde la creación de usuarios y estructura académica hasta pagos, anuncios y salud escolar. Es el superusuario que configura permisos granulares para el resto de roles.",
    imageSlot: "role-img-admin",
    imageSrc: "assets/admin.png",
    imagePlaceholder: "Captura: dashboard del administrador",
  },
  {
    id: "administracion",
    title: "Administración",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 12h24" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8" y="16" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="18" y="16" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8" y="21" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1.5"/>
      </svg>
    ),
    color: "#3178C6",
    functions: [
      "Operación diaria por módulos",
      "Acceso segmentado por permisos",
      "Usuarios · Estructura académica",
      "Matrícula · Pagos · Anuncios",
      "Asistencia · Almacén · Salud escolar",
    ],
    detail: "El personal de Administración opera el día a día de la institución con acceso segmentado según los permisos que el Admin le asigne. Puede gestionar matrícula, pagos, asistencia, almacén y más sin ver módulos que no le corresponden.",
    imageSlot: "role-img-administracion",
    imageSrc: "assets/administracion.png",
    imagePlaceholder: "Captura: vista de administración operativa",
  },
  {
    id: "director",
    title: "Director",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 10v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#6DB33F",
    functions: [
      "Visión directiva y reportes",
      "Gestión de anuncios",
      "Gestión de años académicos",
      "Reportes ejecutivos",
    ],
    detail: "El Director accede a reportes ejecutivos, puede gestionar los anuncios institucionales y configurar años académicos. Una vista de alto nivel diseñada para la toma de decisiones estratégicas sin ruido operativo.",
    imageSlot: "role-img-director",
    imageSrc: "assets/director.png",
    imagePlaceholder: "Captura: reportes y dashboard del director",
  },
  {
    id: "docente",
    title: "Docente",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <path d="M4 24V10l12-6 12 6v14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 13v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    color: "#646CFF",
    functions: [
      "Ver cursos asignados",
      "Workspace por curso",
      "Gestión de notas",
      "Gestión de asistencia",
      "Chat con padres",
      "Anuncios",
    ],
    detail: "Cada docente tiene un workspace por curso: gestiona notas, pasa asistencia, publica anuncios para sus alumnos y se comunica directamente con los padres de familia a través del chat integrado en tiempo real.",
    imageSlot: "role-img-docente",
    imageSrc: "assets/docente.png",
    imagePlaceholder: "Captura: workspace del docente con notas y asistencia",
  },
  {
    id: "estudiante",
    title: "Estudiante",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <path d="M6 12l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M26 12v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14.5v6c0 2 2.7 4 6 4s6-2 6-4v-6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    color: "#3ECF8E",
    functions: [
      "Ver cursos",
      "Ver detalle del curso",
      "Ver notas",
      "Ver anuncios",
    ],
    detail: "Los estudiantes ven sus cursos, notas, anuncios y detalle de cada materia desde la web o la app móvil. Una interfaz limpia y enfocada en lo esencial: su progreso académico.",
    imageSlot: "role-img-estudiante",
    imageSrc: "assets/estudiante.png",
    imagePlaceholder: "Captura: vista del estudiante con cursos y notas",
  },
  {
    id: "padre",
    title: "Padre de familia",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="22" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 26c0-4.4 3.6-8 8-8 1.5 0 2.9.4 4 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "#ee5a1f",
    functions: [
      "Seleccionar hijo",
      "Seguimiento académico",
      "Matrícula (continuidad / nuevo / traslado)",
      "Ver solicitudes y notas del hijo",
      "Ver estado de cuenta",
      "Chat con docentes",
      "Ver anuncios",
    ],
    detail: "Los padres seleccionan a su hijo, ven su progreso académico, gestionan matrícula (continuidad, nuevo ingreso o traslado), consultan el estado de cuenta de pensiones y se comunican con los docentes por chat en tiempo real.",
    imageSlot: "role-img-padre",
    imageSrc: "assets/padre.png",
    imagePlaceholder: "Captura: panel del padre con seguimiento y matrícula",
  },
  {
    id: "almacen",
    title: "Almacén",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <rect x="4" y="14" width="24" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 14l4-8h16l4 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 14v4h8v-4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    color: "#00758F",
    functions: [
      "Gestión de espacios físicos",
      "Gestión de bienes y compras",
      "Operaciones y reportes",
      "Inventario físico y préstamos",
      "Mantenimiento y cotizaciones",
      "Incidencias de compra",
    ],
    detail: "El módulo de Almacén gestiona sectores, pabellones, activos, inventario, compras, cotizaciones, préstamos, mantenimiento y firma operativa. Todo vinculado con enfermería para el control de medicamentos.",
    imageSlot: "role-img-almacen",
    imageSrc: "assets/almacen.png",
    imagePlaceholder: "Captura: inventario y gestión de bienes",
  },
  {
    id: "enfermeria",
    title: "Enfermería",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <rect x="6" y="6" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 11v10M11 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "#DD0031",
    functions: [
      "Dashboard de salud escolar",
      "Gestión de tópico",
      "Incidencias y alertas médicas",
      "Comunicación con padres",
      "Medicación y reportes",
      "Chat con padres y anuncios",
    ],
    detail: "Enfermería opera desde su propio dashboard: registra atenciones, accidentes, incidencias y alertas médicas. Gestiona medicación, se comunica con padres por chat y genera reportes de salud escolar con auditoría completa.",
    imageSlot: "role-img-enfermeria",
    imageSrc: "assets/enfermeria.png",
    imagePlaceholder: "Captura: dashboard de salud escolar y tópico",
  },
];

const MODULES = [
  {
    n: "01",
    title: "Gestión de Usuarios",
    desc: "Creación y edición de usuarios con múltiples roles. Relación padre ↔ hijo y control granular por permisos.",
    color: "#ee5a1f",
    features: ["Múltiples roles", "Relación padre ↔ hijo", "Control por permisos"],
  },
  {
    n: "02",
    title: "Estructura Académica",
    desc: "Niveles, grados y secciones con visualización tipo árbol. Asignación de alumnos y docentes por sección. Soporte de salto entre niveles (5 años → 1° primaria, 6° primaria → 1° secundaria).",
    color: "#3178C6",
    features: ["Visualización tipo árbol", "Asignación masiva", "Salto entre niveles"],
  },
  {
    n: "03",
    title: "Cursos y Horarios",
    desc: "Creación de cursos con distribución masiva por niveles, grados y secciones. Asignación de docentes, horarios por sección y workspace docente por curso.",
    color: "#646CFF",
    features: ["Distribución masiva", "Horarios por sección", "Workspace docente"],
  },
  {
    n: "04",
    title: "Matrícula",
    desc: "Ventanas de matrícula, solicitudes, matrícula manual. Continuidad, nuevo ingreso, traslado y promoción académica en un solo flujo.",
    color: "#6DB33F",
    features: ["Continuidad", "Nuevo ingreso", "Traslado", "Promoción"],
  },
  {
    n: "05",
    title: "Pagos",
    desc: "Tipos de matrícula, escalas mensuales, validación de pagos y estado de cuenta para padres. Analítica y detalle de pagos en tiempo real.",
    color: "#ee5a1f",
    features: ["Escalas mensuales", "Validación de pagos", "Analítica"],
  },
  {
    n: "06",
    title: "Asistencia",
    desc: "Asistencia administrativa y docente con vistas por curso y contexto académico. Control preciso de la presencia de cada estudiante.",
    color: "#3ECF8E",
    features: ["Administrativa", "Docente", "Vistas por curso"],
  },
  {
    n: "07",
    title: "Anuncios",
    desc: "Anuncios segmentados por rol, banners institucionales, inbox por usuario e indicadores visuales de novedades en tiempo real.",
    color: "#DD0031",
    features: ["Por rol", "Banners", "Inbox", "Indicadores"],
  },
  {
    n: "08",
    title: "Chat en Tiempo Real",
    desc: "Comunicación directa padre ↔ docente y padre ↔ enfermería. Mensajes privados 1 a 1, unread count, typing indicator, presencia en línea y notificaciones en tiempo real.",
    color: "#646CFF",
    features: ["1 a 1 privado", "Typing indicator", "Presencia online", "Notificaciones"],
  },
  {
    n: "09",
    title: "Salud Escolar",
    desc: "Registro de atenciones, accidentes e incidencias. Alertas médicas, medicación, seguimiento a padres, historial completo, reportes y auditoría. Integración automática con chat.",
    color: "#DD0031",
    features: ["Alertas médicas", "Historial", "Auditoría", "Chat integrado"],
  },
  {
    n: "10",
    title: "Almacén / Bienes y Compras",
    desc: "Sectores, pabellones y espacios. Activos e inventario, compras y cotizaciones, movimientos, préstamos, mantenimiento y firma operativa. Vínculo con enfermería para medicamentos.",
    color: "#00758F",
    features: ["Inventario físico", "Préstamos", "Cotizaciones", "Vínculo enfermería"],
  },
];

/* ── ProductsPageHero ── */
function ProductsPageHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof window.anime !== "function") return;
    window.anime({
      targets: el.querySelectorAll(".pp-hero-anim"),
      translateY: [40, 0],
      opacity: [0, 1],
      delay: window.anime.stagger(100),
      duration: 900,
      easing: "easeOutQuart",
    });
  }, []);

  return (
    <section className="section pp-hero" ref={heroRef}>
      <div className="container">
        <div className="pp-hero-badge pp-hero-anim mono">kui · LMS</div>
        <h1 className="pp-hero-title pp-hero-anim">
          La plataforma académica<br />
          <em>integral</em> para colegios<br />
          modernos.
        </h1>
        <p className="pp-hero-desc pp-hero-anim">
          Matrícula, estructura académica, cursos, horarios, pagos, salud escolar,
          almacén, comunicación en tiempo real y operación multirol — todo dentro
          de un solo ecosistema.
        </p>
        <div className="pp-hero-stats pp-hero-anim">
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">9</span>
            <span className="pp-hero-stat-l mono">roles del sistema</span>
          </div>
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">10</span>
            <span className="pp-hero-stat-l mono">módulos integrados</span>
          </div>
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">12k+</span>
            <span className="pp-hero-stat-l mono">estudiantes activos</span>
          </div>
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">99.97%</span>
            <span className="pp-hero-stat-l mono">uptime</span>
          </div>
        </div>
        <div className="pp-hero-actions pp-hero-anim">
          <a className="btn btn-primary" href="contacto.html#contacto">
            Solicitar demo
            <svg className="arr" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a className="btn btn-ghost" href="caso-lms.html">Ver caso de estudio</a>
        </div>
      </div>
    </section>
  );
}

/* ── RolesSection ── */
function RolesSection() {
  const [active, setActive] = useState(null);
  const gridRef = useRef(null);
  const detailRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".role-card"),
              translateY: [40, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(60),
              duration: 800,
              easing: "easeOutQuart",
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Animate detail panel on open
  useEffect(() => {
    if (active && detailRef.current && typeof window.anime === "function") {
      window.anime({
        targets: detailRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutQuart",
      });
    }
  }, [active]);

  const activeRole = ROLES.find((r) => r.id === active);

  return (
    <section className="section pp-roles" id="roles">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— roles</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Un sistema,<br /><em>nueve roles</em>.
            </h2>
            <p>
              Cada usuario ve exactamente lo que necesita. Permisos granulares,
              interfaces especializadas y flujos diseñados para cada actor
              de la comunidad educativa.
            </p>
          </div>
        </Reveal>

        <div className="role-grid" ref={gridRef}>
          {ROLES.map((r, i) => {
            const isOpen = active === r.id;
            return (
              <div
                className={`role-card ${isOpen ? "is-open" : ""}`}
                key={r.id}
                style={{ "--role-accent": r.color }}
                onClick={() => setActive(isOpen ? null : r.id)}
              >
                <div className="role-card-head">
                  <div className="role-icon">{r.icon}</div>
                  <div className="role-info">
                    <div className="role-num mono">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="role-title">{r.title}</h3>
                  </div>
                  <div className="role-toggle" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {isOpen && (
                  <ul className="role-functions">
                    {r.functions.map((f, j) => (
                      <li key={j} className="role-fn">
                        <span className="role-fn-dot" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail panel — appears below grid when a role is selected */}
        {activeRole && (
          <div className="role-detail" ref={detailRef} style={{ "--role-accent": activeRole.color }} data-no-translate="true">
            <div className="role-detail-content">
              <div className="role-detail-badge mono">
                <span className="role-detail-dot" style={{ background: activeRole.color }} aria-hidden="true" />
                {activeRole.title}
              </div>
              <h3 className="role-detail-title">
                Interfaz del <em style={{ color: activeRole.color }}>{activeRole.title}</em>
              </h3>
              <p className="role-detail-desc">{activeRole.detail}</p>
              <div className="role-detail-fns">
                {activeRole.functions.map((f, j) => (
                  <span className="role-detail-pill" key={j}>{f}</span>
                ))}
              </div>
            </div>
            <div className="role-detail-image" data-no-translate="true">
              <image-slot
                id={activeRole.imageSlot}
                placeholder={activeRole.imagePlaceholder}
                src={activeRole.imageSrc || ""}
                fit={activeRole.imageFit || "cover"}
                shape="rounded"
                radius="16"
              ></image-slot>
              <div className="role-detail-image-overlay" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── ModulesSection ── */
function ModulesSection() {
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof window.anime !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.anime({
              targets: el.querySelectorAll(".mod-card"),
              translateY: [50, 0],
              opacity: [0, 1],
              delay: window.anime.stagger(70),
              duration: 900,
              easing: "easeOutQuart",
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section pp-modules" id="modulos">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— módulos</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Diez módulos<br /><em>integrados</em>.
            </h2>
            <p>
              Cada módulo resuelve un problema real de la operación educativa.
              Todos conectados entre sí, sin integraciones externas, sin silos.
            </p>
          </div>
        </Reveal>

        <div className="mod-grid" ref={gridRef}>
          {MODULES.map((m) => (
            <div className="mod-card" key={m.n} style={{ "--mod-accent": m.color }}>
              <div className="mod-head">
                <span className="mod-num mono">{m.n}</span>
                <h3 className="mod-title">{m.title}</h3>
              </div>
              <p className="mod-desc">{m.desc}</p>
              <div className="mod-features">
                {m.features.map((f, i) => (
                  <span className="mod-feat" key={i}>{f}</span>
                ))}
              </div>
              <div className="mod-line" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ProductsCTA ── */
function ProductsCTA() {
  return (
    <section className="section pp-cta">
      <div className="container">
        <Reveal className="pp-cta-card">
          <div className="pp-cta-content">
            <h2 className="pp-cta-title">
              ¿Listo para modernizar<br />tu institución?
            </h2>
            <p className="pp-cta-desc">
              Agenda una demo personalizada. Te mostramos cómo kui · LMS se
              adapta a tu modelo educativo en menos de 30 minutos.
            </p>
            <div className="pp-cta-actions">
              <a className="btn btn-primary" href="contacto.html#contacto">
                Solicitar demo
                <svg className="arr" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a className="btn btn-ghost" href="https://wa.me/51902487635?text=Hola%20kui!%20Me%20interesa%20una%20demo%20del%20LMS." target="_blank" rel="noreferrer">
                WhatsApp directo
              </a>
            </div>
          </div>
          <div className="pp-cta-deco" aria-hidden="true">
            <div className="pp-cta-ring pp-cta-ring-1" />
            <div className="pp-cta-ring pp-cta-ring-2" />
            <div className="pp-cta-ring pp-cta-ring-3" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Assembled page component ── */
function ProductsPageFull() {
  return (
    <main>
      <ProductsPageHero />
      <RolesSection />
      <ModulesSection />
      <ProductsCTA />
    </main>
  );
}

Object.assign(window, { ProductsPageFull });
