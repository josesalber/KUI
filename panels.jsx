/* global React, Reveal, T */
const { useEffect: usePanelEffect, useRef: usePanelRef, useState: usePanelState } = React;

/* ============================================================
   AudiencePanels — one panel per audience (Administración,
   Profesores, Padres, Estudiantes, Enfermería).

   Each panel:
   1. Hero card — title + short description + illustration aside.
      Illustration file: assets/panel-<id>.png
   2. One row per point — text + capture aside, alternating sides.
      Capture files: assets/panel-<id>-1.png … assets/panel-<id>-N.png

   To fill the visuals just drop the files in /assets with those
   names (or drag an image onto each slot directly in edit mode).
   ============================================================ */

const PANELS = [
  {
    id: "administracion",
    title: "Administración",
    accent: "#3178C6",
    desc: "Centraliza la operación de tu colegio: control académico, pagos, comunicación y reportes desde un solo panel.",
    illustrationPlaceholder: "Ilustración: panel de administración",
    points: [
      "Gestión centralizada de alumnos, docentes, padres y áreas internas.",
      "Control académico, asistencia, pagos y comunicación desde un solo panel.",
      "Reportes claros para tomar decisiones rápidas.",
      "Gestiona inscripciones, reinscripciones e información importante",
    ],
  },
  {
    id: "profesores",
    title: "Profesores",
    accent: "#646CFF",
    desc: "Herramientas que reducen la carga administrativa y devuelven tiempo para enseñar.",
    illustrationPlaceholder: "Ilustración: panel del profesor",
    points: [
      "Registro rápido de notas, asistencia, tareas y observaciones.",
      "Comunicación directa con padres y estudiantes.",
      "Seguimiento del avance académico por curso y alumno.",
      "Menos carga administrativa, más tiempo para enseñar.",
      "Acceso fácil a información clave desde cualquier lugar.",
    ],
  },
  {
    id: "padres",
    title: "Padres",
    accent: "#ee5a1f",
    desc: "Visibilidad total del avance de sus hijos y comunicación directa con el colegio.",
    illustrationPlaceholder: "Ilustración: panel del padre de familia",
    points: [
      "Vista clara del rendimiento, asistencia y conducta de sus hijos.",
      "Notificaciones importantes en tiempo real.",
      "Comunicación directa con profesores y colegio.",
      "Acceso a tareas, comunicados, pagos y eventos.",
      "Pagos en línea sin necesidad de acercarse al colegio por Yape o Tarjeta.",
    ],
  },
  {
    id: "estudiantes",
    title: "Estudiantes",
    accent: "#3ECF8E",
    desc: "Una experiencia digital simple para organizar y seguir su vida académica.",
    illustrationPlaceholder: "Ilustración: panel del estudiante",
    points: [
      "Acceso a cursos, tareas, notas y comunicados en un solo lugar.",
      "Mejor organización de actividades académicas.",
      "Seguimiento de su propio progreso.",
      "Experiencia digital simple, moderna y accesible.",
    ],
  },
  {
    id: "enfermeria",
    title: "Enfermería",
    accent: "#DD0031",
    desc: "Salud escolar con registro, historial y alertas para actuar a tiempo.",
    illustrationPlaceholder: "Ilustración: panel de enfermería",
    points: [
      "Registro médico básico y seguimiento de incidencias.",
      "Historial de atenciones por estudiante.",
      "Comunicación rápida con padres y administración.",
    ],
  },
];

function PanelHero({ panel }) {
  return (
    <Reveal className="panel-hero">
      <div className="panel-hero-copy">
        <div className="pp-impact-badge mono" style={{ background: panel.accent }}>
          Panel
        </div>
        <h2 className="panel-hero-title">
          <em style={{ boxShadow: `inset 0 -0.18em 0 ${panel.accent}40` }}>{panel.title}</em>
        </h2>
        <p className="panel-hero-desc">{panel.desc}</p>
        <div className="panel-hero-actions">
          <a className="btn btn-primary" href="contacto.html#contacto">
            Solicitar demo
            <svg className="arr" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
      <div className="panel-hero-visual" data-no-translate="true">
        <image-slot
          id={`panel-${panel.id}-hero`}
          src={`assets/panel-${panel.id}.png`}
          placeholder={panel.illustrationPlaceholder}
          fit="contain"
          shape="rounded"
          radius="20"
        ></image-slot>
      </div>
    </Reveal>
  );
}

function PanelPoint({ panel, point, index }) {
  const side = index % 2 === 0 ? "is-right" : "is-left";
  return (
    <Reveal className={`panel-point ${side}`} style={{ "--panel-accent": panel.accent }}>
      <div className="panel-point-copy">
        <div className="panel-point-num mono">{String(index + 1).padStart(2, "0")}</div>
        <p className="panel-point-text">
          <span className="pp-impact-check" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
              <path d="M4.5 10.5l3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{point}</span>
        </p>
      </div>
      <div className="panel-point-capture" data-no-translate="true">
        <image-slot
          id={`panel-${panel.id}-${index + 1}`}
          src={`assets/panel-${panel.id}-${index + 1}.png`}
          placeholder={`Captura: ${panel.title} — punto ${index + 1}`}
          fit="cover"
          shape="rounded"
          radius="16"
        ></image-slot>
      </div>
    </Reveal>
  );
}

function PadresCarousel({ panel }) {
  const [active, usePanelStateSet] = usePanelState(0);
  const total = panel.points.length;
  const prev = () => usePanelStateSet((a) => (a - 1 + total) % total);
  const next = () => usePanelStateSet((a) => (a + 1) % total);

  return (
    <div className="padres-carousel">
      {/* All slides stay in DOM so image-slot persistence works */}
      <div className="padres-slides">
        {panel.points.map((point, i) => (
          <div className={`padres-slide ${i === active ? "is-active" : ""}`} key={i}>
            <div className="padres-slide-copy">
              <div className="panel-point-num mono">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
              <p className="padres-slide-text">
                <span className="pp-impact-check" aria-hidden="true" style={{ color: panel.accent, background: `${panel.accent}18` }}>
                  <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                    <path d="M4.5 10.5l3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{point}</span>
              </p>
            </div>
            <div className="padres-slide-phone" data-no-translate="true">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <image-slot
                    id={`panel-padres-${i + 1}`}
                    src={`assets/panel-padres-${i + 1}.png`}
                    placeholder={`Captura móvil ${i + 1}: Padres`}
                    fit="cover"
                    shape="rect"
                    radius="0"
                  ></image-slot>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="padres-controls">
        <button className="padres-btn" onClick={prev} aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="padres-dots">
          {panel.points.map((_, i) => (
            <button key={i} className={`padres-dot ${i === active ? "is-active" : ""}`} onClick={() => usePanelStateSet(i)} aria-label={`Punto ${i + 1}`} style={{ "--dot-color": panel.accent }} />
          ))}
        </div>
        <button className="padres-btn" onClick={next} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AudiencePanels({ only } = {}) {
  const list = only ? PANELS.filter((p) => p.id === only) : PANELS;
  return (
    <>
      {list.map((panel) => (
        <section className={`section panel-section ${only ? "is-page-top" : ""}`} id={panel.id} key={panel.id} style={{ "--panel-accent": panel.accent }}>
          <div className="container">
            <PanelHero panel={panel} />
            {panel.id === "padres" ? (
              <PadresCarousel panel={panel} />
            ) : (
              <div className="panel-points">
                {panel.points.map((point, i) => (
                  <PanelPoint panel={panel} point={point} index={i} key={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}

Object.assign(window, { AudiencePanels });
