/* ══ Carousel — Bencho (MIT, bencho.dev/licence) ═══════════════
   Portado a este proyecto: React 18 UMD + Babel en el navegador.
   Cambios respecto al original .tsx: sin `import`/`export`, sin
   tipos TypeScript, hooks tomados de `React`, y se expone en
   `window.Carousel`. Todo lo demas (comentarios, numeros, fisica)
   se conserva tal cual, porque los comentarios explican POR QUE
   los numeros son los que son. */
(function () {
  const { useCallback, useEffect, useLayoutEffect, useRef, useState } = React;

  /* ── inlined from lab/spring ──────────────────────── */
  /* ── one spring, for everything that settles ───────────────
     The maths was already on this bench twice, copied by hand:
     Humidity's wheel and Brightness's column both accumulate
     velocity toward a target, damp it, and snap when both the
     delta and the velocity fall under 0.02. Two copies is a
     coincidence; five would be a policy, so it comes out here
     before the elastic blocks are written against it.

     Frames, not milliseconds. `dt` is expressed in sixtieths of
     a second and the damping is RAISED to it rather than
     multiplied by it, so a dropped frame decays the same amount
     of energy as the two frames it replaced. */

  /* 0..100 into the two numbers a spring actually has. 50 is the
     tuned middle — turn the panel to the middle and nothing has
     changed. The pair is chosen by DAMPING RATIO:
       zeta = -ln(d) / (2 * sqrt(k))
       0   → zeta ~0.85, heavy, arrives without a ring
       50  → zeta ~0.41
       100 → zeta ~0.20, lively, two visible rebounds */
  const springOf = (tune) => ({
    /* stiffness: how hard it is pulled toward the target */
    k: 0.08 + (tune / 100) * 0.16,
    /* decay, per frame: how much of the velocity survives */
    d: 0.62 + (tune / 100) * 0.2,
  });

  /* Units matter. The snap threshold is absolute, so a caller
     works in pixels or in 0..100 — a spring driven over 0..1
     would be "settled" before it had visibly moved. */
  function useSpring(target, tune = 50, instant = false) {
    const [at, setAt] = useState(target);
    const cur = useRef(target);
    const vel = useRef(0);
    const raf = useRef(0);

    useEffect(() => {
      if (instant) {
        cur.current = target;
        vel.current = 0;
        setAt(target);
        return;
      }
      const { k, d } = springOf(tune);
      let prev = 0;
      const tick = (t) => {
        const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
        prev = t;
        vel.current += (target - cur.current) * k * dt;
        vel.current *= Math.pow(d, dt);
        cur.current += vel.current * dt;
        if (Math.abs(target - cur.current) < 0.02 && Math.abs(vel.current) < 0.02) {
          cur.current = target;
          vel.current = 0;
          setAt(target);
          raf.current = 0;
          return;
        }
        setAt(cur.current);
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      };
      /* `tune` sits here beside `target`: the loop closes over
         it, so without it a knob turned mid-flight would do
         nothing until something else restarted the effect. */
    }, [target, tune, instant]);

    return at;
  }

  /* Read once. A preference, not a live input. */
  const stillness = () =>
    typeof window !== "undefined" &&
    !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ── inlined from lab/motion ──────────────────────── */
  /* How long it takes, slower to faster, as a multiplier on the
     component's own tuned duration. 0 is slower, 100 faster, 50
     is exactly 1. */
  const rate = (speed) => 1.6 - (speed / 100) * 1.2;

  /* SHOTS — las imagenes. El usuario coloca los archivos en
     assets/ con estos nombres. 5 posiciones = 5 fotos. */
  const SHOTS = [
    { name: "a", src: "assets/kuiweb-1.png" },
    { name: "b", src: "assets/kuiweb-2.png" },
    { name: "c", src: "assets/kuiweb-3.png" },
    { name: "d", src: "assets/kuiweb-4.png" },
    { name: "e", src: "assets/kuiweb-5.png" },
  ];

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const mix = (a, b, t) => a + (b - a) * t;

  /* the card is the PICTURES' own ratio, near enough — 160x226
     is 0.708 against their 2:3, so `cover` trims about six per
     cent off the height. */
  const CARD_W = 272;
  const CARD_H = 386;

  /* ── the frame, and it is only a frame ─────────────────────
     Sized for the DEFAULT, not for the extremes. 476x340 is the
     shipping ring plus about eighteen pixels of margin. Fixed
     at these two numbers, because a frame that grew with a knob
     would rescale the whole block every time one moved. */
  const STAGE_W = 620;
  const STAGE_H = 448;

  const ORBIT = 182;
  /* how much smaller the back of the ring is. `1 - depth / 200`:
     100 puts the card at the back at 0.5. */
  const DEPTH = 100;
  const DEPTH_MAX = 150;
  const CORNER = 20;
  const FLOAT = 15;
  const SINK = 50;
  const SETTLE = 50;

  /* ── how far back the ring leans ───────────────────────────
     A card at the back sits this much higher than one at the
     front. 38 so the back card clears the front one by ten px
     and you can see the ring goes round. */
  const LEAN = 50;

  /* how many px of drag turn the ring one position */
  const PULL = 140;

  /* how far ahead of the release the throw looks, in ms. Makes a
     short fast flick move a card. */
  const TOSS = 150;
  /* and how many it may skip. Past two the ring blurs. */
  const MOST = 2;

  const BASE = 620;

  /* the number of cards IS the picture count. */
  const N = SHOTS.length;

  /* which one is at the front when it opens, BY NAME. Falls back
     to the middle of the ring if the name is not there. */
  const FRONT = "man";
  const OPENS_ON = (() => {
    const i = SHOTS.findIndex((s) => s.name === FRONT);
    return i < 0 ? Math.floor((N - 1) / 2) : i;
  })();

  /* ── every card sits at its own angle ──────────────────────
     Numbers that are not a pattern: no two the same, no symmetry
     to spot, and they do not alternate. */
  const ANGLE = [-4.2, 2.6, -1.4, 3.8, 1.7];

  /* the drift's periods, deliberately awkward so no two cards
     are ever doing the same thing. */
  const PERIOD = [4.7, 5.9, 6.7, 5.3, 7.1, 6.1];

  /* ── where a card sits, given where the ring is ────────────
     ONE function, read by the first paint and by the drag both.
     `f` is 1 at the front, 0 at the back, and drives the size,
     the lean and the paint order together. */
  const spotOf = (i, turn, orbit, depth) => {
    const th = (i - turn) * ((Math.PI * 2) / N);
    const f = (Math.cos(th) + 1) / 2;
    return {
      x: Math.sin(th) * orbit,
      y: -(1 - f) * LEAN,
      s: mix(1 - clamp(depth, 0, DEPTH_MAX) / 200, 1, f),
      /* paint order is a z-index, by hand: everything here is
         2D, so nothing sorts itself. `f` already knows which is
         nearer. */
      z: Math.round(f * 100),
    };
  };

  const write = (el, sp, angle) => {
    /* NO OPACITY IS WRITTEN HERE. Size, lean and paint order say
       which is in front; none of them touch the picture. */
    el.style.transform = `translate(-50%, -50%) translate(${sp.x.toFixed(2)}px, ${sp.y.toFixed(2)}px) rotate(${angle}deg) scale(${sp.s.toFixed(4)})`;
    el.style.zIndex = String(sp.z);
  };

  const out = (t) => 1 - (1 - t) ** 4;

  function Carousel({
    /* how far out to the sides the ring reaches, in px */
    orbit = ORBIT,
    /* how much smaller the back of the ring is, 0..100 */
    depth = DEPTH,
    corner = CORNER,
    /* how much they drift at rest, 0..100 */
    float = FLOAT,
    /* how deep the pointer presses, 0..100 */
    sink = SINK,
    /* how quickly a swipe settles, 0..100 */
    settle = SETTLE,
    /* seconds for one whole turn of the ring. 0 is off (default).
       For a carousel that is a PICTURE rather than a control. */
    spin = 0,
  } = {}) {
    const still = stillness();

    const slots = useRef([]);
    /* where the ring is, and it is a REF — a continuous position
       in card-steps. NOT clamped and NOT wrapped. */
    const turn = useRef(OPENS_ON);
    const raf = useRef(0);
    const drag = useRef(null);
    const [held, setHeld] = useState(false);

    const paint = useCallback(() => {
      slots.current.forEach((el, i) =>
        el && write(el, spotOf(i, turn.current, orbit, depth), ANGLE[i % ANGLE.length]));
    }, [orbit, depth]);

    /* placed on mount, and again whenever a knob changes the
       arithmetic under it */
    useLayoutEffect(paint, [paint]);

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    /* ── the ring turning itself ─────────────────────────────
       Its own frame loop and its own handle, deliberately not
       `raf`. Advances `turn` by time rather than stepping between
       whole positions. Held pauses it. */
    useEffect(() => {
      if (!spin || still || held) return;
      let id = 0;
      let prev = 0;
      const step = (t) => {
        /* N cards over `spin` seconds is one whole revolution */
        if (prev) turn.current += ((t - prev) / 1000) * (N / spin);
        prev = t;
        paint();
        id = requestAnimationFrame(step);
      };
      id = requestAnimationFrame(step);
      return () => cancelAnimationFrame(id);
    }, [spin, still, held, paint]);

    /* ── the settle ──────────────────────────────────────────
       Quart-out from wherever the ring currently is to a whole
       position. Reads its start from the live value. */
    const glide = (to) => {
      cancelAnimationFrame(raf.current);
      const from = turn.current;
      if (still || from === to) {
        turn.current = to;
        paint();
        return;
      }
      const ms = BASE * rate(clamp(settle, 0, 100));
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        turn.current = mix(from, to, out(p));
        paint();
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };

    const go = (d) => glide(Math.round(turn.current) + d);

    const down = (e) => {
      cancelAnimationFrame(raf.current);
      drag.current = {
        x0: e.clientX, t0: turn.current, last: e.clientX,
        t: e.timeStamp, vx: 0, moved: false,
      };
      setHeld(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* not a live pointer */ }
    };

    const move = (e) => {
      const g = drag.current;
      if (!g) return;
      const dx = e.clientX - g.x0;
      if (!g.moved && Math.abs(dx) > 3) g.moved = true;

      /* px per ms, smoothed against the previous reading so one
         jittery frame cannot fake a flick. */
      const dt = Math.max(1, e.timeStamp - g.t);
      g.vx = (g.vx + (e.clientX - g.last) / dt) / 2;
      g.last = e.clientX;
      g.t = e.timeStamp;

      /* no rubber band, because there is no end. */
      turn.current = g.t0 - dx / PULL;
      paint();
    };

    const up = () => {
      const g = drag.current;
      if (!g) return;
      drag.current = null;
      setHeld(false);
      /* where it would come to rest if it kept going, capped. */
      const carry = clamp((-g.vx * TOSS) / PULL, -MOST, MOST);
      const to = Math.round(turn.current + carry);
      glide(to);
    };

    const key = (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      go(d);
    };

    const r = clamp(corner, 0, 40);

    return (
      <div className="car" style={{ width: STAGE_W, height: STAGE_H }}>
        <div
          className="car-track"
          data-held={held}
          role="group"
          aria-label="Card carousel"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={key}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          {SHOTS.map((shot, i) => (
            <div
              key={shot.name}
              ref={(el) => { slots.current[i] = el; }}
              className="car-slot"
              style={{ width: CARD_W, height: CARD_H }}
            >
              {/* ── the drift ─────────────────────────────────
                  Its own element, so the keyframes own this
                  transform outright. Period per card, amplitudes
                  are the knob. */}
              <div
                className="car-float"
                style={{
                  /* at Float 0 the keyframes come off rather than
                     running at zero amplitude. */
                  animationName: float <= 0 ? "none" : undefined,
                  animationDuration: `${PERIOD[i % PERIOD.length]}s`,
                  "--lift": `${((clamp(float, 0, 100) / 100) * 16).toFixed(2)}px`,
                  "--sway": `${((clamp(float, 0, 100) / 100) * 1.4).toFixed(2)}deg`,
                }}
              >
                <Card
                  shot={shot.src}
                  corner={r}
                  sink={sink}
                  /* a card under a finger that is turning the ring
                     is carried, not pressed. */
                  off={held || still}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── one card, and the press is its own ───────────────────
     A component per card rather than a loop, because the tilt is
     a pair of springs and a hook cannot be called n times from
     the parent. */
  function Card({ shot, corner, sink, off }) {
    const skin = useRef(null);
    const [pt, setPt] = useState({ x: 0, y: 0 });
    const [on, setOn] = useState(false);
    const still = stillness();

    /* Where the pointer is, as -1..1 on each axis, sprung. The
       spring is on the POSITION rather than on the rotation. */
    const live = on && !off;
    const sx = useSpring(live ? pt.x : 0, 50, still);
    const sy = useSpring(live ? pt.y : 0, 50, still);
    const lit = useSpring(live ? 1 : 0, 50, still);

    const deep = clamp(sink, 0, 100) / 100;
    const max = deep * 13;
    /* IT SINKS, IT DOES NOT LIFT. The point you are over goes
       AWAY and the far side comes up. */
    const rx = -sy * max;
    const ry = sx * max;

    /* the pointer in the card's own terms, as a PERCENTAGE. */
    const px = ((sx + 1) / 2) * 100;
    const py = ((sy + 1) / 2) * 100;
    const dark = deep * 0.5 * lit;
    /* the rim is a hint, not a highlight. */
    const rim = deep * 0.16 * lit;

    const track = (e) => {
      const el = skin.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      setPt({
        x: clamp(((e.clientX - b.left) / b.width) * 2 - 1, -1, 1),
        y: clamp(((e.clientY - b.top) / b.height) * 2 - 1, -1, 1),
      });
      setOn(true);
    };

    return (
      <div
        ref={skin}
        className="car-card"
        onPointerMove={track}
        /* `out` with a containment test rather than `leave`. */
        onPointerOut={(e) => {
          const el = skin.current;
          const to = e.relatedTarget;
          if (!el || !to || !el.contains(to)) setOn(false);
        }}
        onPointerCancel={() => setOn(false)}
        style={{
          borderRadius: corner,
          backgroundImage: `url(${shot})`,
          /* translateZ FIRST, so the retreat is measured in the
             room's axes rather than in the card's own. */
          transform: `translateZ(${(-10 * deep * lit).toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`,
          /* ONE SHADOW, AND IT DOES NOT MOVE. */
          boxShadow: "0 12px 28px -10px rgba(var(--shadow-rgb), 0.28)",
        }}
      >
        {/* the dent, and the rim opposite it. */}
        <span
          className="car-sheen"
          aria-hidden="true"
          style={{
            borderRadius: corner,
            backgroundImage: `radial-gradient(44% 36% at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(9, 14, 28, ${dark.toFixed(3)}) 0%, rgba(9, 14, 28, 0) 100%), radial-gradient(54% 44% at ${(100 - px).toFixed(1)}% ${(100 - py).toFixed(1)}%, rgba(255, 255, 255, ${rim.toFixed(3)}) 0%, rgba(255, 255, 255, 0) 100%)`,
          }}
        />
      </div>
    );
  }

  window.Carousel = Carousel;
})();
