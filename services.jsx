/* global React */
const { useEffect, useRef, useState } = React;

/* ============================================================
   Services — large numbered list with hover image follow
   Image slots are drag-and-drop ready for the user.
   ============================================================ */

const SERVICES = [
  {
    n: "01",
    slot: "svc-01",
    src: "assets/svc-01.webp",
    title: "Producto digital",
    desc: "Diseñamos y construimos software end-to-end. Investigación, sistema visual, prototipo navegable y código en producción — un único equipo del primer Figma al primer release.",
    tags: ["Discovery", "UI/UX", "Frontend", "Backend"],
  },
  {
    n: "02",
    slot: "svc-02",
    src: "assets/svc-02.webp",
    title: "Plataformas SaaS",
    desc: "Construimos sistemas multi-tenant escalables: control de planes, billing, roles, observabilidad y panel de administración. Listos para crecer sin reescribir.",
    tags: ["Multi-tenant", "Billing", "RBAC", "Cloud"],
  },
  {
    n: "03",
    slot: "svc-03",
    src: "assets/svc-03.webp",
    title: "Punto de venta & e-commerce",
    desc: "Sistemas POS para retail y restaurantes, tiendas online y conexiones con marketplaces. Pagos, inventario y cocina en un solo flujo.",
    tags: ["POS", "Shopify", "Pasarelas", "KDS"],
  },
  {
    n: "04",
    slot: "svc-04",
    src: "assets/svc-04.webp",
    title: "Sistemas educativos (LMS)",
    desc: "Plataformas de aprendizaje para academias, colegios y empresas. Cursos, evaluaciones, asistencia, notas, certificados y apps para alumnos / apoderados.",
    tags: ["LMS", "Cohortes", "Mobile", "Reportes"],
  },
  {
    n: "05",
    slot: "svc-05",
    src: "assets/svc-05.webp",
    title: "Integraciones & APIs",
    desc: "Conectamos facturación electrónica, contabilidad, mensajería, ERPs y CRMs. APIs propias, webhooks y middleware para que tus sistemas hablen el mismo idioma.",
    tags: ["REST", "Webhooks", "ERP", "Fact. electrónica"],
  },
  {
    n: "06",
    src: "assets/svc-06.webp",
    slot: "svc-06",
    title: "Marca & sistema visual",
    desc: "Identidad, sistema visual y guías de marca pensadas para producto digital. Tokens, biblioteca de componentes y artes para campañas.",
    tags: ["Identidad", "Design system", "Web", "Pitch deck"],
  },
];

function Services() {
  const wrapRef = useRef(null);
  const previewRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    // smooth-follow loop for the preview
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.18);
      current.current.y = lerp(current.current.y, target.current.y, 0.18);
      const el = previewRef.current;
      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    // offset so the preview floats slightly to the upper-right of the cursor
    target.current.x = e.clientX - r.left + 30;
    target.current.y = e.clientY - r.top - 220;
    // initialize position the first time so it doesn't snap from 0,0
    if (current.current.x === 0 && current.current.y === 0) {
      current.current.x = target.current.x;
      current.current.y = target.current.y;
    }
  };

  return (
    <section className="section services" id="servicios">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="tag">— servicios</div>
          </div>
          <div className="section-kicker">
            <h2 className="section-title">
              Lo que<br />
              <em>hacemos</em>.
            </h2>
            <p>
              Seis líneas de trabajo, una sola disciplina: software pensado como
              infraestructura de negocio.
            </p>
          </div>
        </Reveal>

        <div
          className="svc-list"
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHoveredIdx(-1)}
        >
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} className="svc-row-wrap">
              <div
                className={`svc-row ${hoveredIdx === i ? "is-hover" : ""}`}
                onMouseEnter={() => window.innerWidth > 800 && setHoveredIdx(i)}
                onClick={() => window.innerWidth <= 800 && setHoveredIdx(hoveredIdx === i ? -1 : i)}
              >
                <div className="svc-num mono">{s.n}</div>
                <div className="svc-body">
                  <h3 className="svc-title">{s.title}</h3>
                  <p className="svc-desc">{s.desc}</p>
                </div>
                <div className="svc-tags">
                  {s.tags.map((t) => (
                    <span className="svc-tag mono" key={t}>{t}</span>
                  ))}
                </div>
                <div className="svc-arrow">
                  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                    <path d="M5 19L19 5M19 5H9M19 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="svc-mobile-img">
                  <div className="svc-mobile-img-inner">
                    <image-slot
                      id={s.slot}
                      src={s.src || ""}
                      shape="rounded"
                      radius="14"
                      placeholder={`Arrastra una imagen para “${s.title}”`}
                    ></image-slot>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          {/* Floating preview that follows the cursor */}
          <div
            ref={previewRef}
            className={`svc-preview ${hoveredIdx >= 0 ? "is-visible" : ""}`}
            aria-hidden="true"
          >
            {SERVICES.map((s, i) => (
              <div
                key={s.n}
                className={`svc-preview-card ${hoveredIdx === i ? "is-current" : ""}`}
              >
                <image-slot
                  id={s.slot}
                  src={s.src || ""}
                  shape="rounded"
                  radius="14"
                  placeholder={`Arrastra una imagen para “${s.title}”`}
                ></image-slot>
                <div className="svc-preview-label mono">{s.n} · {s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Services });
