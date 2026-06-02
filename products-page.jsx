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
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 27c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
        <path d="M16 4l12 6v8c0 6-5 10-12 14C9 28 4 24 4 18v-8l12-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 16l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#DD0031",
    functions: [
      "Acceso total a toda la plataforma",
      "Administración general",
      "Gestión de usuarios",
      "Gestión de estructura académica",
      "Matrí­cula",
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
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12h24" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="16" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="18" y="16" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="8" y="21" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1.5" />
      </svg>
    ),
    color: "#3178C6",
    functions: [
      "Operación diaria por módulos",
      "Acceso segmentado por permisos",
      "Usuarios ·Estructura académica",
      "Matrí­cula ·Pagos ·Anuncios",
      "Asistencia ·Almacén ·Salud escolar",
    ],
    detail: "El personal de Administración opera el dí­a a dí­a de la institución con acceso segmentado según los permisos que el Admin le asigne. Puede gestionar matrí­cula, pagos, asistencia, almacén y más sin ver módulos que no le corresponden.",
    imageSlot: "role-img-administracion",
    imageSrc: "assets/administracion.png",
    imagePlaceholder: "Captura: vista de administración operativa",
  },
  {
    id: "director",
    title: "Director",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 10v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M4 24V10l12-6 12 6v14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 13v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="1.5" />
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
        <path d="M6 12l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M26 12v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 14.5v6c0 2 2.7 4 6 4s6-2 6-4v-6" stroke="currentColor" strokeWidth="1.5" />
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
        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="22" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 26c0-4.4 3.6-8 8-8 1.5 0 2.9.4 4 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "#ee5a1f",
    functions: [
      "Seleccionar hijo",
      "Seguimiento académico",
      "Matrí­cula (continuidad / nuevo / traslado)",
      "Ver solicitudes y notas del hijo",
      "Ver estado de cuenta",
      "Chat con docentes",
      "Ver anuncios",
    ],
    detail: "Los padres seleccionan a su hijo, ven su progreso académico, gestionan matrí­cula (continuidad, nuevo ingreso o traslado), consultan el estado de cuenta de pensiones y se comunican con los docentes por chat en tiempo real.",
    imageSlot: "role-img-padre",
    imageSrc: "assets/padre.png",
    imagePlaceholder: "Captura: panel del padre con seguimiento y matrí­cula",
  },
  {
    id: "almacen",
    title: "Almacén",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <rect x="4" y="14" width="24" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 14l4-8h16l4 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 14v4h8v-4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    color: "orange",
    functions: [
      "Gestión de espacios fí­sicos",
      "Gestión de bienes y compras",
      "Operaciones y reportes",
      "Inventario fí­sico y préstamos",
      "Mantenimiento y cotizaciones",
      "Incidencias de compra",
    ],
    detail: "El módulo de Almacén gestiona sectores, pabellones, activos, inventario, compras, cotizaciones, préstamos, mantenimiento y firma operativa. Todo vinculado con enfermerí­a para el control de medicamentos.",
    imageSlot: "role-img-almacen",
    imageSrc: "assets/almacen.png",
    imagePlaceholder: "Captura: inventario y gestión de bienes",
  },
  {
    id: "enfermeria",
    title: "Enfermerí­a",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
        <rect x="6" y="6" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 11v10M11 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    detail: "Enfermerí­a opera desde su propio dashboard: registra atenciones, accidentes, incidencias y alertas médicas. Gestiona medicación, se comunica con padres por chat y genera reportes de salud escolar con auditorí­a completa.",
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
    desc: "Niveles, grados y secciones con visualización tipo árbol. Asignación de alumnos y docentes por sección. Soporte para el avance entre niveles (5 años → 1.º de primaria, 6.º de primaria → 1.º de secundaria).", color: "#3178C6",
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
    title: "Matrí­cula",
    desc: "Ventanas de matrí­cula, solicitudes, matrí­cula manual. Continuidad, nuevo ingreso, traslado y promoción académica en un solo flujo.",
    color: "#6DB33F",
    features: ["Continuidad", "Nuevo ingreso", "Traslado", "Promoción"],
  },
  {
    n: "05",
    title: "Pagos",
    desc: "Tipos de matrí­cula, escalas mensuales, validación de pagos y estado de cuenta para padres. Analí­tica y detalle de pagos en tiempo real.",
    color: "#ee5a1f",
    features: ["Escalas mensuales", "Validación de pagos", "Analí­tica"],
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
    desc: "Comunicación directa padre ↔ docente y padre ↔ enfermerí­a. Mensajes privados 1 a 1, unread count, typing indicator, presencia en lí­nea y notificaciones en tiempo real.",
    color: "#646CFF",
    features: ["1 a 1 privado", "Typing indicator", "Presencia online", "Notificaciones"],
  },
  {
    n: "09",
    title: "Salud Escolar",
    desc: "Registro de atenciones, accidentes e incidencias. Alertas médicas, medicación, seguimiento a padres, historial completo, reportes y auditorí­a. Integración automática con chat.",
    color: "#DD0031",
    features: ["Alertas médicas", "Historial", "Auditorí­a", "Chat integrado"],
  },
  {
    n: "10",
    title: "Almacén / Bienes y Compras",
    desc: "Sectores, pabellones y espacios. Activos e inventario, compras y cotizaciones, movimientos, préstamos, mantenimiento y firma operativa. Ví­nculo con enfermerí­a para medicamentos.",
    color: "orange",
    features: ["Inventario fí­sico", "Préstamos", "Cotizaciones", "Ví­nculo enfermerí­a"],
  },
];

const IMPLEMENTATION_STEPS = [
  {
    step: "Paso 1",
    duration: "Dos dias",
    title: "Configuración",
    desc: "Configuramos el sistema según las necesidades de tu institución, personalizando módulos, accesos y estructura académica clave.",
    side: "left",
    icon: "gear",
  },
  {
    step: "Paso 2",
    duration: "Un dia",
    title: "Capacitación",
    desc: "Capacitamos a administradores y personal clave para garantizar un uso claro, rápido y ordenado de toda la plataforma.",
    side: "right",
    icon: "doc",
  },
  {
    step: "Paso 3",
    duration: "Una semana",
    title: "Acompañamiento",
    desc: "Acompañamos la salida en vivo durante la primera semana para resolver dudas y asegurar una transición sin fricción.",
    side: "left",
    icon: "briefcase",
  },
];

/* â”€â”€ ProductsPageHero â”€â”€ */
function ProductsPageHero() {
  const heroRef = useRef(null);
  const monthlyPrice = 300;
  const includedStudents = 300;
  const extraStudentPrice = 1.3;

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
        <h1 className="pp-hero-title pp-hero-anim">
          La plataforma académica<br />
          <em>integral</em> para colegios<br />
          modernos.
        </h1>
        <p className="pp-hero-desc pp-hero-anim">
          Con uno de los precios más cómodos del mercado peruano. Desde
          {" "}<strong>S/ {monthlyPrice.toLocaleString("es-PE")}</strong> al mes para integrar
          gestión académica, administración y comunicación institucional en un solo ecosistema.
        </p>
        <div className="pp-hero-stats pp-hero-anim pp-hero-pricing">
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">S/ {monthlyPrice}</span>
            <span className="pp-hero-stat-l mono">mensual</span>
          </div>
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">{includedStudents}</span>
            <span className="pp-hero-stat-l mono">máx alumnos</span>
          </div>
          <div className="pp-hero-stat">
            <span className="pp-hero-stat-n">S/ {extraStudentPrice}</span>
            <span className="pp-hero-stat-l mono">por alumno extra</span>
          </div>
        </div>
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
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* â”€â”€ RolesSection â”€â”€ */
function ImpactSection() {
  const points = [
    "Control de matrí­cula, pagos y operación escolar en un solo lugar.",
    "Registro de notas, asistencia y comunicación con padres en tiempo real.",
    "Menos fricción administrativa y más tiempo para enfocarse en educación.",
  ];

  return (
    <section className="section pp-impact">
      <div className="container">
        <Reveal className="pp-impact-shell">
          <div className="pp-impact-copy">
            <div className="pp-impact-badge mono">Efectividad</div>
            <h2 className="pp-impact-title">
              Mejore el<br />
              rendimiento de su<br />
              <em>Centro Educativo</em>.
            </h2>
            <p className="pp-impact-desc">
              KUI permite a los centros educativos ordenar su gestión,
              reducir tiempos operativos y fortalecer la comunicación institucional
              desde una sola plataforma.
            </p>
            <div className="pp-impact-list">
              {points.map((point) => (
                <div className="pp-impact-item" key={point}>
                  <span className="pp-impact-check" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                      <path d="M4.5 10.5l3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className="pp-impact-actions">
              <a className="btn btn-primary" href="#implementacion">
                Cómo funciona
              </a>
              <a className="btn btn-ghost" href="#modulos">
                Conocer soluciones
              </a>
            </div>
          </div>

          <div className="pp-impact-visual" aria-hidden="true">
            <img src="assets/impacto.png" alt="" className="pp-impact-mascot" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const items = [
    {
      title: "Informacion en Tiempo Real",
      desc: "Padres y directivos pueden acceder rapidamente a calificaciones, asistencia, tareas y eventos importantes.",
      tone: "blue",
      icon: "chart",
    },
    {
      title: "Comunicacion con Docentes",
      desc: "KUI facilita una comunicacion directa y ordenada entre familias, docentes y administracion.",
      tone: "mint",
      icon: "idea",
    },
    {
      title: "Alerta de Tareas y Notificaciones",
      desc: "Envio de avisos oportunos sobre tareas, eventos y novedades para mantener informada a toda la comunidad.",
      tone: "rose",
      icon: "alert",
      badge: "",
    },
    {
      title: "Control de matricula, Pagos y mas",
      desc: "Matriculas, pagos, notas, asistencias y procesos clave concentrados en una sola plataforma.",
      tone: "violet",
      icon: "briefcase",
    },
  ];

  return (
    <section className="section pp-benefits">
      <div className="container">
        <Reveal className="pp-benefits-head">
          <div className="pp-impact-badge mono">Beneficios</div>
          <h2 className="pp-benefits-title">
            KUI en Centros<br />
            <em>Educativos</em>.
          </h2>
        </Reveal>

        <div className="pp-benefits-grid">
          {items.map((item) => (
            <Reveal className={`pp-benefit-card is-${item.tone}`} key={item.title}>
              <div className="pp-benefit-icon-wrap">
                <div className="pp-benefit-icon">
                  <BenefitIcon kind={item.icon} />
                </div>
                {item.badge && <span className="pp-benefit-badge mono">{item.badge}</span>}
              </div>
              <div className="pp-benefit-copy">
                <h3 className="pp-benefit-title">{item.title}</h3>
                <p className="pp-benefit-desc">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitIcon({ kind }) {
  if (kind === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="34" height="34">
        <rect x="4" y="5" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 19l2-3 2 2 4-5 2 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "idea") {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="34" height="34">
        <path d="M12 4a5.5 5.5 0 00-3.7 9.57c.5.45.83.92.95 1.43h5.5c.12-.5.45-.98.95-1.43A5.5 5.5 0 0012 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9.5 18h5M10.5 21h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "alert") {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="34" height="34">
        <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" width="34" height="34">
      <path d="M4 8h16v10H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8V6h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImplementationSection() {
  return (
    <section className="section pp-impl" id="implementacion">
      <div className="container">
        <Reveal className="section-head">
          <div><div className="tag">— implementación</div></div>
          <div className="section-kicker">
            <h2 className="section-title">
              Salimos en vivo<br /><em>sin complicarte</em>.
            </h2>
            <p>
              Un proceso corto, claro y acompañado para que tu institución empiece
              a operar con KUI desde primeros dí­as.
            </p>
          </div>
        </Reveal>

        <div className="pp-impl-layout">
          <div className="pp-impl-timeline">
            <div className="pp-impl-line" aria-hidden="true" />
            {IMPLEMENTATION_STEPS.map((item) => (
              <Reveal
                key={item.step}
                className={`pp-impl-row ${item.side === "right" ? "is-right" : "is-left"}`}
              >
                <div className="pp-impl-card">
                  <h3 className="pp-impl-card-title">{item.title}</h3>
                  <p className="pp-impl-card-desc">{item.desc}</p>
                </div>

                <div className="pp-impl-marker">
                  <div className="pp-impl-dot">
                    <ImplementationIcon kind={item.icon} />
                  </div>
                  <div className="pp-impl-meta">
                    <div className="pp-impl-step">{item.step}</div>
                    <div className="pp-impl-duration mono">{item.duration}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="pp-impl-mascot">
            <img src="assets/impacto.png" alt="Mascota KUI guiando la implementación" loading="lazy" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ImplementationIcon({ kind }) {
  if (kind === "gear") {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19 12a7.9 7.9 0 00-.08-1l2.02-1.57-2-3.46-2.44.8a7.7 7.7 0 00-1.73-1L14.5 3h-5l-.27 2.77c-.62.25-1.2.58-1.73 1l-2.44-.8-2 3.46L5.08 11A8.9 8.9 0 005 12c0 .34.03.67.08 1l-2.02 1.57 2 3.46 2.44-.8c.53.42 1.11.75 1.73 1L9.5 21h5l.27-2.77c.62-.25 1.2-.58 1.73-1l2.44.8 2-3.46L18.92 13c.05-.33.08-.66.08-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "doc") {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M8 3h6l4 4v14H8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 3v4h4M10 11h6M10 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M4 8h16v10H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8V6h6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

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
                      <path d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

/* â”€â”€ ModulesSection â”€â”€ */
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
              Todos conectados entre sí­, sin integraciones externas, sin silos.
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

/* â”€â”€ ProductsCTA â”€â”€ */
function PlansSection() {
  const [openIdx, setOpenIdx] = useState(0);
  const whatsappBase = "https://wa.me/51902487635?text=";
  const plans = [
    {
      name: "Plan Inicial",
      desc: "Ideal para instituciones que quieren comenzar con gestión ordenada y rápida implementación.",
      price: "S/ 300",
      period: "mensuales",
      note: "Hasta 300 alumnos",
      featured: true,
    },
    {
      name: "Plan Crecimiento",
      desc: "Para colegios que necesitan más capacidad operativa, más usuarios y más personalización.",
      price: "S/ 1.30",
      period: "por alumno extra",
      note: "Escala según matrí­cula",
      featured: false,
    },
    {
      name: "Plan Institucional",
      desc: "Para grupos educativos o instituciones con necesidades avanzadas de operación y acompañamiento.",
      price: "A medida",
      period: "cotización directa",
      note: "Incluye propuesta personalizada",
      featured: false,
    },
  ];

  return (
    <section className="section pp-plans" id="planes">
      <div className="container">
        <Reveal className="pp-plans-shell">
          <div className="pp-plans-visual">
            <img src="assets/kuiplanes.png" alt="" className="pp-plans-image" loading="lazy" />
          </div>

          <div className="pp-plans-copy">
            <div className="pp-impact-badge mono">Precios</div>
            <h2 className="pp-plans-title">
              Adquiere <em>KUI</em><br />
              desde.
            </h2>
            <div className="pp-plans-list">
              {plans.map((plan, idx) => (
                <div className={`pp-plan-card ${plan.featured ? "is-featured" : ""} ${openIdx === idx ? "is-open" : ""}`} key={plan.name}>
                  <button className="pp-plan-toggle" onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}>
                    <div>
                      <h3 className="pp-plan-name">{plan.name}</h3>
                    </div>
                    <span className="pp-plan-toggle-icon">{openIdx === idx ? "−" : "+"}</span>
                  </button>
                  <div className="pp-plan-panel">
                    <div className="pp-plan-panel-inner">
                      <p className="pp-plan-desc">{plan.desc}</p>
                      <div className="pp-plan-price-row">
                        <div className="pp-plan-price-wrap">
                          <span className="pp-plan-price">{plan.price}</span>
                          <span className="pp-plan-period">/ {plan.period}</span>
                        </div>
                        <a
                          className={`pp-plan-btn ${plan.featured ? "is-featured" : ""}`}
                          href={`${whatsappBase}${encodeURIComponent(`Hola KUI, me interesa ${plan.name}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Obtenerlo
                        </a>
                      </div>
                      <div className="pp-plan-note mono">{plan.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProductsCTA() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    {
      q: "Como ayuda KUI a los colegios a mejorar su gestion administrativa?",
      a: "KUI ofrece una solucion integral para la administracion escolar. Simplifica matriculas, pagos, asistencia, calificaciones y comunicacion con padres en tiempo real desde una sola plataforma.",
    },
    {
      q: "KUI es compatible con dispositivos moviles?",
      a: "Si. KUI funciona en web y se adapta correctamente a dispositivos moviles para que directivos, docentes y familias accedan sin friccion.",
    },
    {
      q: "Como protege KUI la seguridad de la informacion?",
      a: "KUI trabaja con control de accesos por rol, trazabilidad operativa y buenas practicas de resguardo para mantener protegida la informacion institucional.",
    },
  ];

  return (
    <section className="section pp-cta">
      <div className="container">
        <Reveal className="pp-support">
          <div className="pp-support-top">
            <div className="pp-support-left">
              <div className="pp-impact-badge mono">Atencion al cliente</div>
              <h2 className="pp-support-title">
                Tienes<br />
                <em>Consultas</em>?
              </h2>
              <div className="pp-support-meta">
                <div className="pp-support-avatars" aria-hidden="true">
                  <span className="pp-support-avatar">K</span>
                  <span className="pp-support-avatar">U</span>
                </div>
                <div className="pp-support-meta-copy">
                  <span>Soporte KUI</span>
                  <strong>100% capacitado.</strong>
                </div>
              </div>
            </div>

            <div className="pp-support-visual" aria-hidden="true">
              <div className="pp-support-shape" />
              <img src="assets/enseña.png" alt="" className="pp-support-mascot" loading="lazy" />
            </div>

            <div className="pp-support-faq">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div className={`pp-support-faq-item ${isOpen ? "is-open" : ""}`} key={faq.q}>
                    <button className="pp-support-faq-q" onClick={() => setOpenIdx(isOpen ? -1 : idx)}>
                      <span>{faq.q}</span>
                      <span className="pp-support-faq-icon">{isOpen ? "-" : "+"}</span>
                    </button>
                    <div className="pp-support-faq-a-wrap">
                      <div className="pp-support-faq-a">{faq.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pp-support-bottom">
            <div className="pp-support-bottom-copy">
              Migrar su informacion a nuestro sistema <strong>KUI</strong> es simple y acompanado.
            </div>
            <a className="pp-support-bottom-btn" href="contacto.html#contacto">GRATIS</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Assembled page component */
function ProductsPageFull({ showPlans = false } = {}) {
  return (
    <main>
      {showPlans ? (
        <>
          <PlansSection />
          <ProductsCTA />
        </>
      ) : (
        <>
          <BenefitsSection />
          <ImplementationSection />
          <RolesSection />
          <ModulesSection />
          <ProductsCTA />
        </>
      )}
    </main>
  );
}

Object.assign(window, { ProductsPageFull });
