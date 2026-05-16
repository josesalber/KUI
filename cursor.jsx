/* global React */
const { useEffect, useRef } = React;

/* ============================================================
   CustomCursor — small dot follows mouse, expands on interactive
   elements. Hidden on touch devices.
   ============================================================ */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const tick = () => {
      // ring lags behind dot with lerp
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const setHover = (val) => {
      ring.classList.toggle("is-hover", val);
      dot.classList.toggle("is-hover", val);
    };

    const interactiveSel = "a, button, [role='button'], input, textarea, select, label, .product, .case, .svc-row, .step, .why-card, .upcoming-item, .tl-item, .team-card, .latam-item, .stack-chip, .quote-dot, .map-label";
    const onEnter = (e) => { if (e.target.closest && e.target.closest(interactiveSel)) setHover(true); };
    const onLeave = (e) => { if (e.target.closest && e.target.closest(interactiveSel)) setHover(false); };
    const onDown = () => { ring.classList.add("is-down"); };
    const onUp   = () => { ring.classList.remove("is-down"); };

    raf = requestAnimationFrame(tick);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}

/* ============================================================
   PageTransitions — orange overlay swipes across on link clicks.
   Intercepts <a> clicks to internal pages; plays an exit animation
   before navigation, plays entry animation on mount.
   ============================================================ */
function PageTransitions() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Entry: overlay starts covering the page, slides up on mount.
    requestAnimationFrame(() => {
      overlay.classList.add("is-entering");
      setTimeout(() => overlay.classList.remove("is-entering", "is-covered"), 900);
    });

    const onClick = (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (a.target === "_blank") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = a.getAttribute("href");
      if (!href) return;
      // Only handle in-project HTML links
      const internal = /^[^/].*\.html(\#.*)?$/.test(href) || href === "index.html";
      if (!internal) return;
      e.preventDefault();
      overlay.classList.add("is-exiting");
      setTimeout(() => { window.location.href = href; }, 550);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="pt-overlay is-covered" ref={overlayRef} aria-hidden="true">
      <span className="pt-mark">kui</span>
    </div>
  );
}

Object.assign(window, { CustomCursor, PageTransitions });
