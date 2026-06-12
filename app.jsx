/* global React, ReactDOM, Intro, Nav, Hero, Marquee, Services, Products, Stats, Latam, WhyKui, History, Approach, Stack, Testimonials, Team, Showcase, Contact, Footer, ChatWidget, StudioHero, ROICalculator, FAQ, Newsletter, CaseStudy, CustomCursor, PageTransitions, TweaksPanel, useTweaks, TweakSection, TweakColor, TweakRadio, TweakToggle, FacebookFeed, TranslatingIndicator, AboutCarousel, Values, MissionVision, ProductsPageFull, AudiencePanels */
const { useEffect, useState, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ee5a1f",
  "background": "warm",
  "showGlow": true,
  "showLines": true
}/*EDITMODE-END*/;

function applyTheme(t) {
  const root = document.documentElement;
  root.style.setProperty("--orange", t.accent);
  const hexToRgba = (hex, a) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  root.style.setProperty("--orange-glow", hexToRgba(t.accent, 0.55));
  root.style.setProperty("--orange-soft", hexToRgba(t.accent, 0.12));
  root.style.setProperty("--orange-bright", t.accent);
  root.style.setProperty("--orange-deep", t.accent);

  if (t.background === "warm") {
    root.style.setProperty("--bg", "#f7f5f1");
    root.style.setProperty("--bg-2", "#efece6");
  } else if (t.background === "cool") {
    root.style.setProperty("--bg", "#f3f5f7");
    root.style.setProperty("--bg-2", "#e9ecef");
  } else {
    root.style.setProperty("--bg", "#ffffff");
    root.style.setProperty("--bg-2", "#f4f4f4");
  }
}

function App() {
  const [introDone, setIntroDone] = useState(false);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const page = document.body.getAttribute("data-page") || "home";

  // Stable callback to prevent Intro from remounting
  const handleIntroDone = useCallback(() => {
    setIntroDone(true);
  }, []);

  useEffect(() => { applyTheme(tweaks); }, [tweaks]);

  // Smooth scroll (Lenis)
  useEffect(() => {
    if (!introDone) return;
    const Lenis = window.Lenis;
    if (!Lenis) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenis.on("scroll", window.ScrollTrigger.update);
    }
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [introDone]);

  useEffect(() => {
    const canvas = document.querySelector(".hero-canvas");
    const glow = document.querySelectorAll(".hero-glow, .showcase-glow");
    if (canvas) canvas.style.display = tweaks.showLines ? "" : "none";
    glow.forEach((el) => { el.style.display = tweaks.showGlow ? "" : "none"; });
  }, [tweaks.showLines, tweaks.showGlow, introDone]);

  // Renders different sections per page — keeps the same shell (Nav/Footer/Chat).
  let body;
  if (page === "estudio") {
    body = (
      <main>
        <StudioHero />
        <AboutCarousel />
        <Values />
        <MissionVision />
        <Stats />
        <Latam />
        <WhyKui />
        <History />
        <Approach />
        <Stack />
        <FAQ />
        <Testimonials />
      </main>
    );
  } else if (page === "contacto") {
    body = (
      <main>
        <Team />
        <FacebookFeed />
        <Contact />
      </main>
    );
  } else if (page === "productos") {
    body = <ProductsPageFull showPlans />;
  } else if (["administracion", "profesores", "padres", "estudiantes", "enfermeria"].includes(page)) {
    body = (
      <main>
        <AudiencePanels only={page} />
      </main>
    );
  } else if (page === "case") {
    body = <CaseStudy />;
  } else if (page === "404") {
    body = <NotFound />;
  } else {
    body = (
      <main>
        <Hero />
        <ProductsPageFull />
      </main>
    );
  }

  return (
    <>
      <CustomCursor />
      <PageTransitions />
      <TranslatingIndicator />
      <Intro onDone={handleIntroDone} />
      <Nav />
      {body}
      {page !== "404" && <Footer />}
      <ChatWidget />

      <TweaksPanel title="Tweaks · kui">
        <TweakSection label="Color de acento">
          <TweakColor
            label="Acento"
            value={tweaks.accent}
            options={["#ee5a1f", "#ff7a1f", "#e63946", "#0a0908"]}
            onChange={(v) => setTweak("accent", v)}
          />
        </TweakSection>
        <TweakSection label="Fondo">
          <TweakRadio
            label="Tono"
            value={tweaks.background}
            options={["warm", "cool", "puro"]}
            onChange={(v) => setTweak("background", v)}
          />
        </TweakSection>
        <TweakSection label="Efectos">
          <TweakToggle label="Líneas animadas" value={tweaks.showLines} onChange={(v) => setTweak("showLines", v)} />
          <TweakToggle label="Glow naranja" value={tweaks.showGlow} onChange={(v) => setTweak("showGlow", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

/* ============================================================
   NotFound — 404 page with anime.js
   ============================================================ */
function NotFound() {
  useEffect(() => {
    if (typeof window.anime !== "function") return;
    window.anime({
      targets: ".nf-digit",
      translateY: [80, 0],
      opacity: [0, 1],
      rotate: [-15, 0],
      duration: 1000,
      delay: window.anime.stagger(120),
      easing: "easeOutExpo",
    });
    window.anime({
      targets: ".nf-orbit",
      rotate: "1turn",
      duration: 8000,
      loop: true,
      easing: "linear",
    });
  }, []);
  return (
    <main className="nf">
      <div className="container nf-inner">
        <div className="nf-digits">
          <span className="nf-digit">4</span>
          <span className="nf-digit nf-zero">
            <span className="nf-orbit" />
            0
          </span>
          <span className="nf-digit">4</span>
        </div>
        <h1 className="nf-title">Esta página se mudó.</h1>
        <p className="nf-desc">
          O nunca existió. En cualquier caso, no la encontramos. Mientras tanto,
          probá una de estas:
        </p>
        <div className="nf-links">
          <a className="btn btn-primary" href="index.html">
            Volver al inicio
            <svg className="arr" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a className="btn btn-ghost" href="contacto.html#contacto">Escribirnos</a>
        </div>
      </div>
    </main>
  );
}
