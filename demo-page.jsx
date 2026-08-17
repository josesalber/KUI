/* global React, Reveal */
const { useState: useDemoState, useRef: useDemoRef } = React;

/* ============================================================
   PruebaKui — live demo page
   - Browser-window mockup with a platform screenshot (image-slot
     id="demo-platform", file assets/demo-platform.png)
   - "Abrir demo" opens the live app in a new tab
   - Mock credentials per role (edit CREDENTIALS with the real ones)
   ============================================================ */

const DEMO_URL = "https://colegioawa.vercel.app/login";

const CREDENTIALS = [
  { role: "Administrador", color: "#DD0031", user: "awa@gmail.com", pass: "Tmp@4ad50bb42d7e" },
  { role: "Director", color: "#6DB33F", user: "mariobros@gmail.com", pass: "Tmp@4ad50bb42d7e" },
  { role: "Docente", color: "#646CFF", user: "jirafales@gmail.com", pass: "Tmp@4ad50bb42d7e" },
  { role: "Estudiante", color: "#3ECF8E", user: "embape@gmail.com", pass: "Tmp@4ad50bb42d7e" },
  { role: "Padre de familia", color: "#ee5a1f", user: "lucas@gmail.com", pass: "Tmp@4ad50bb42d7e" },
  { role: "Enfermería", color: "#DD0031", user: "joy@gmail.com", pass: "Tmp@4ad50bb42d7e" },
  { role: "Almacen  ", color: "#1c75b1", user: "ralf@gmail.com", pass: "Tmp@4ad50bb42d7e" },

];

function CopyField({ label, value }) {
  const [copied, setCopied] = useDemoState(false);
  const timer = useDemoRef(null);

  const copy = () => {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <div className="cred-field">
      <span className="cred-field-label mono">{label}</span>
      <button className="cred-field-value" onClick={copy} title="Copiar" type="button">
        <span className="cred-field-text">{value}</span>
        <span className={`cred-copy ${copied ? "is-copied" : ""}`} aria-hidden="true">
          {copied ? (
            <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
              <path d="M4.5 10.5l3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
              <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 13V5a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}

function PruebaKui() {
  return (
    <main className="demo-page">
      <section className="section demo-hero is-page-top">
        <div className="container">
          <Reveal className="demo-head">
            <div className="demo-badge mono">
              <span className="demo-badge-dot" aria-hidden="true" />
              Demo en vivo
            </div>
            <h1 className="demo-title">
              Prueba <em>KUI</em><br />sin instalar nada.
            </h1>
            <p className="demo-desc">
              Explora la plataforma real con datos de ejemplo. Ingresa con cualquiera
              de los roles y navega como lo haría tu institución.
            </p>
          </Reveal>

          {/* Browser window mockup */}
          <Reveal className="demo-window">
            <div className="demo-window-bar">
              <div className="demo-window-dots" aria-hidden="true">
                <span style={{ background: "#ff5f57" }} />
                <span style={{ background: "#febc2e" }} />
                <span style={{ background: "#28c840" }} />
              </div>
              <div className="demo-window-url mono">
                <svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true">
                  <rect x="3.5" y="7" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                colegioawa.vercel.app
              </div>
              <a className="demo-window-open" href={DEMO_URL} target="_blank" rel="noreferrer">
                Abrir demo
                <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                  <path d="M6 3h7v7M13 3L5 11M4 6v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <a className="demo-window-screen" href={DEMO_URL} target="_blank" rel="noreferrer" data-no-translate="true" aria-label="Abrir demo en una pestaña nueva">
              <image-slot
                id="demo-platform"
                src="assets/demo-platform.png"
                placeholder="Captura de la plataforma KUI"
                fit="cover"
                position="50% 0%"
                shape="rect"
                radius="0"
              ></image-slot>
              <span className="demo-window-overlay" aria-hidden="true">
                <span className="demo-window-play">
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <path d="M6 3h7v7M13 3L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 8v9a2 2 0 002 2h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="demo-window-overlay-txt">Abrir demo en vivo</span>
              </span>
            </a>
          </Reveal>

          {/* Credentials */}
          <div className="demo-creds">
            <Reveal className="demo-creds-head">
              <h2 className="demo-creds-title">Credenciales de prueba</h2>
              <p className="demo-creds-sub">Usa cualquiera de estos accesos para entrar a la demo.</p>
            </Reveal>
            <div className="demo-creds-grid">
              {CREDENTIALS.map((c) => (
                <Reveal key={c.role} className="cred-card" style={{ "--cred-accent": c.color }}>
                  <div className="cred-card-top">
                    <span className="cred-avatar" aria-hidden="true">{c.role.charAt(0)}</span>
                    <h3 className="cred-role">{c.role}</h3>
                  </div>
                  <CopyField label="Usuario" value={c.user} />
                  <CopyField label="Contraseña" value={c.pass} />
                </Reveal>
              ))}
            </div>
            <p className="demo-creds-note mono">
              Datos de ejemplo · la información se reinicia periódicamente.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { PruebaKui });
