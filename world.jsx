/* global React, anime */
const { useEffect, useRef, useState } = React;

/* ============================================================
   PeruMap — dot-grid Americas with Lima as glowing HQ marker
   and animated connection arcs to other LatAm cities.
   ============================================================ */

// Stylized continent polygons in 0–100 coord space (left→right, top→bottom).
// Not a real geographic projection — a designed approximation of the Americas.
const NORTH_AMERICA = [
  [22, 6], [38, 4], [52, 5], [66, 8], [76, 12], [80, 18],
  [76, 24], [70, 28], [60, 32], [50, 34], [40, 33], [32, 30],
  [26, 24], [22, 16]
];
const CENTRAL_AMERICA = [
  [38, 34], [44, 36], [48, 40], [50, 44], [49, 48], [46, 50], [42, 48], [40, 42]
];
const SOUTH_AMERICA = [
  [42, 50], [52, 49], [60, 52], [64, 58], [66, 66], [62, 74],
  [56, 82], [50, 88], [46, 92], [42, 90], [40, 84], [38, 76],
  [40, 68], [40, 60], [41, 54]
];
const PERU = [
  [40, 60], [44, 58], [48, 60], [50, 64], [49, 70], [46, 72],
  [42, 71], [40, 66]
];

const CITIES = [
  { code: "PE", name: "Lima",         x: 44, y: 65, hq: true },
  { code: "CL", name: "Santiago",     x: 49, y: 85 },
  { code: "CO", name: "Bogotá",       x: 51, y: 53 },
  { code: "MX", name: "CDMX",         x: 36, y: 32 },
  { code: "EC", name: "Quito",        x: 47, y: 55 },
  { code: "AR", name: "Buenos Aires", x: 55, y: 84 },
  { code: "US", name: "Miami",        x: 50, y: 28 },
];

function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if (((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function PeruMap() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, t = 0;
    let dots = [], peruDots = [], cities = [];

    function project(p) {
      return { x: (p.x / 100) * W, y: (p.y / 100) * H };
    }

    function resize() {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Re-generate dot grid
      dots = [];
      peruDots = [];
      const step = Math.max(1.2, Math.min(1.8, 600 / Math.max(W, H) * 1.6));
      for (let y = 2; y < 100; y += step) {
        for (let x = 2; x < 100; x += step) {
          // jitter a bit so it doesn't look like a strict grid
          const jx = x + (Math.random() - 0.5) * 0.4;
          const jy = y + (Math.random() - 0.5) * 0.4;
          if (pointInPoly(jx, jy, PERU)) {
            peruDots.push({ x: (jx / 100) * W, y: (jy / 100) * H, phase: Math.random() * Math.PI * 2 });
          } else if (
            pointInPoly(jx, jy, NORTH_AMERICA) ||
            pointInPoly(jx, jy, CENTRAL_AMERICA) ||
            pointInPoly(jx, jy, SOUTH_AMERICA)
          ) {
            dots.push({ x: (jx / 100) * W, y: (jy / 100) * H, phase: Math.random() * Math.PI * 2 });
          }
        }
      }
      cities = CITIES.map((c) => ({ ...c, px: (c.x / 100) * W, py: (c.y / 100) * H }));
    }

    function drawArc(a, b, t01) {
      // Quadratic bezier curving "outward" (away from the centre)
      const mx = (a.px + b.px) / 2;
      const my = Math.min(a.py, b.py) - Math.abs(b.px - a.px) * 0.35 - 20;
      ctx.beginPath();
      ctx.moveTo(a.px, a.py);
      ctx.quadraticCurveTo(mx, my, b.px, b.py);
      ctx.strokeStyle = "rgba(238, 90, 31, 0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Animated dash that travels along the curve
      const tt = t01;
      const px = (1 - tt) * (1 - tt) * a.px + 2 * (1 - tt) * tt * mx + tt * tt * b.px;
      const py = (1 - tt) * (1 - tt) * a.py + 2 * (1 - tt) * tt * my + tt * tt * b.py;

      const grad = ctx.createRadialGradient(px, py, 0, px, py, 14);
      grad.addColorStop(0, "rgba(238, 90, 31, 0.95)");
      grad.addColorStop(1, "rgba(238, 90, 31, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ee5a1f";
      ctx.fill();
    }

    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      // Backdrop circles (orbital rings)
      ctx.save();
      ctx.translate(W / 2, H / 2);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(W, H) * 0.45 - i * 26, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247, 245, 241, ${0.04 + i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Continent dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + d.phase));
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 245, 241, ${0.15 * tw})`;
        ctx.fill();
      }

      // Peru dots — pulsating orange with bloom
      for (let i = 0; i < peruDots.length; i++) {
        const d = peruDots[i];
        const tw = 0.6 + 0.4 * Math.sin(t * 2 + d.phase);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.8 + tw * 0.6, 0, Math.PI * 2);
        ctx.shadowColor = "rgba(238, 90, 31, 0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(238, 90, 31, ${0.65 + tw * 0.35})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Arcs Lima → other cities
      const lima = cities.find((c) => c.hq);
      if (lima) {
        for (let i = 1; i < cities.length; i++) {
          const c = cities[i];
          const phase = ((t * 0.5 + i * 0.22) % 1);
          drawArc(lima, c, phase);
        }

        // Other-city markers
        for (let i = 1; i < cities.length; i++) {
          const c = cities[i];
          ctx.beginPath();
          ctx.arc(c.px, c.py, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(247, 245, 241, 0.95)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(c.px, c.py, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#ee5a1f";
          ctx.fill();
        }

        // Lima — big pulsing marker with expanding rings
        for (let k = 0; k < 3; k++) {
          const rt = ((t * 0.8 + k * 0.33) % 1);
          ctx.beginPath();
          ctx.arc(lima.px, lima.py, 8 + rt * 60, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(238, 90, 31, ${(1 - rt) * 0.55})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(lima.px, lima.py, 8, 0, Math.PI * 2);
        ctx.shadowColor = "#ee5a1f";
        ctx.shadowBlur = 25;
        ctx.fillStyle = "#ee5a1f";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(lima.px, lima.py, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="map-wrap" ref={wrapRef}>
      <canvas ref={canvasRef} className="map-canvas" />
      {/* Floating city labels rendered as DOM so they pick up fonts cleanly */}
      <div className="map-labels">
        {CITIES.map((c) => (
          <div
            key={c.code}
            className={`map-label ${c.hq ? "is-hq" : ""}`}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <span className="map-label-code mono">{c.code}</span>
            <span className="map-label-name">{c.name}</span>
            {c.hq && <span className="map-label-tag mono">HQ</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   LATAM section — Peru map + countries panel
   ============================================================ */
function Latam() {
  const countries = [
    { code: "PE", name: "Perú",     city: "Lima",     hq: true,  since: "2026" },
    { code: "CL", name: "Chile",    city: "Santiago", since: "2026" },
    { code: "CO", name: "Colombia", city: "Bogotá",   since: "2026" },
    { code: "EC", name: "Ecuador",  city: "Quito",    since: "2026" },
    { code: "MX", name: "México",   city: "CDMX",     since: "—" },
    { code: "AR", name: "Argentina",city: "Buenos Aires", since: "—" },
  ];

  return (
    <section className="section latam" id="latam">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <div className="tag">— alcance</div>
          </div>
          <div className="section-kicker">
            <h2 className="section-title">
              Desde <em>Lima</em>,<br />
              para toda LatAm.
            </h2>
            <p>
              Operamos desde Perú con un equipo distribuido. Mismo huso horario,
              mismo idioma, contexto compartido — sin las fricciones del nearshore.
            </p>
          </div>
        </Reveal>

        <div className="latam-grid">
          <Reveal className="latam-map">
            <PeruMap />
            <div className="latam-map-corner mono">
              <span>11°S</span>
              <span>77°W</span>
            </div>
          </Reveal>

          <Reveal className="latam-side" stagger>
            <div className="latam-stat">
              <div className="latam-stat-v">6</div>
              <div className="latam-stat-l">países atendidos</div>
            </div>
            <div className="latam-list">
              {countries.map((c) => (
                <div key={c.code} className={`latam-item ${c.hq ? "is-hq" : ""}`}>
                  <span className="latam-code mono">{c.code}</span>
                  <span className="latam-name">{c.name}</span>
                  <span className="latam-city">{c.city}</span>
                  {c.hq
                    ? <span className="latam-pill is-hq mono">HQ</span>
                    : <span className="latam-pill mono">{c.since}</span>}
                </div>
              ))}
            </div>
            <div className="latam-foot mono">
              ▸ Construido en Lima · Latencia &lt; 80 ms a todo el continente
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PeruMap, Latam });
