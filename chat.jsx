/* global React */
const { useEffect, useRef, useState } = React;

/* ============================================================
   WhatsApp number — change this single constant to point to
   your real business number (international format, no plus).
   ============================================================ */
const WA_NUMBER = "51902487635";   // número oficial kui
const WA_NAME = "kui";
const WA_GREETING = "¡Hola! Soy del equipo de kui. ¿En qué te podemos ayudar?";

/* ============================================================
   Chat widget — floating WhatsApp launcher with mini chat preview.
   Anything the user types is forwarded to WhatsApp Web with prefilled text.
   ============================================================ */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [bumped, setBumped] = useState(false);
  const [draft, setDraft] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: WA_GREETING, time: "ahora" },
  ]);
  const scrollRef = useRef(null);

  // Tiny attention pulse after 8 seconds, once.
  useEffect(() => {
    const tid = setTimeout(() => {
      if (!open) setBumped(true);
    }, 8000);
    return () => clearTimeout(tid);
  }, [open]);

  useEffect(() => {
    if (open) setBumped(false);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Build the wa.me URL for the current pending message.
  const fullText = pendingMessage ? `Hola ${WA_NAME}, escribo desde la web.\n\n${pendingMessage}` : "";
  const waUrl = pendingMessage
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(fullText)}`
    : `https://wa.me/${WA_NUMBER}`;

  const formatNumber = (n) => "+" + n.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4");

  const copyMessage = async () => {
    const blob = `${formatNumber(WA_NUMBER)}\n\n${fullText}`;
    try {
      await navigator.clipboard.writeText(blob);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback for sandboxed contexts where clipboard API is restricted
      const ta = document.createElement("textarea");
      ta.value = blob;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (_) {}
      document.body.removeChild(ta);
    }
  };

  const send = (e) => {
    e?.preventDefault?.();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "me", text, time: "enviado" }]);
    setDraft("");
    setPendingMessage(text);
    // tiny "typing" delay then surface the WhatsApp CTA bubble
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "¡Gracias! Continuemos en WhatsApp para responderte en vivo. Toca el botón verde de abajo para abrir el chat.",
          time: "ahora",
          showCta: true,
        },
      ]);
    }, 600);
  };

  const quickReplies = [
    "Quiero conocer el POS",
    "Necesito un LMS para mi colegio",
    "Tengo un proyecto a medida",
    "Pedir una demo",
  ];

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        className={`wa-fab ${open ? "is-open" : ""} ${bumped ? "is-bumped" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat de WhatsApp"}
      >
        <span className="wa-fab-ring" />
        <span className="wa-fab-ring wa-fab-ring-2" />
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 2.7C8.65 2.7 2.7 8.65 2.7 16c0 2.34.62 4.62 1.79 6.63L2.7 29.3l6.86-1.8a13.27 13.27 0 0 0 6.44 1.64h.01c7.34 0 13.29-5.96 13.29-13.3 0-3.55-1.38-6.89-3.9-9.4a13.21 13.21 0 0 0-9.4-3.9zm0 24.5h-.01a11.1 11.1 0 0 1-5.66-1.55l-.4-.24-4.07 1.07 1.09-3.96-.26-.42a11.05 11.05 0 0 1-1.69-5.9c0-6.11 4.97-11.07 11.07-11.07 2.96 0 5.74 1.15 7.83 3.24a11 11 0 0 1 3.24 7.83c0 6.1-4.97 11.07-11.07 11.07zm6.07-8.29c-.33-.16-1.97-.97-2.27-1.08-.3-.11-.53-.16-.75.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.71.08-.33-.16-1.4-.51-2.66-1.64a10 10 0 0 1-1.85-2.3c-.19-.33-.02-.51.14-.67.15-.15.33-.38.5-.58.16-.19.22-.33.33-.55.11-.22.06-.41-.03-.57-.08-.16-.74-1.79-1.02-2.45-.27-.65-.55-.56-.75-.57l-.64-.01c-.22 0-.58.08-.88.41-.3.33-1.15 1.13-1.15 2.75 0 1.63 1.18 3.2 1.34 3.42.16.22 2.31 3.52 5.59 4.94.78.34 1.39.54 1.87.69.78.25 1.5.21 2.07.13.63-.09 1.97-.81 2.25-1.59.28-.78.28-1.45.2-1.59-.08-.14-.3-.22-.63-.39z"/>
          </svg>
        )}
        <span className="wa-fab-label">{open ? "Cerrar" : "¿Hablamos?"}</span>
      </button>

      {/* Chat panel */}
      <div className={`wa-panel ${open ? "is-open" : ""}`} role="dialog" aria-hidden={!open}>
        <div className="wa-head">
          <div className="wa-avatar">
            <img src="assets/logo.png" alt="kui logo" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", background: "#fff" }} />
            <span className="wa-online" />
          </div>
          <div className="wa-head-meta">
            <div className="wa-head-name">{WA_NAME} studio</div>
            <div className="wa-head-status">
              <span className="wa-online-dot" />
              En línea · responde en minutos
            </div>
          </div>
          <button className="wa-close" onClick={() => setOpen(false)} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="wa-body" ref={scrollRef}>
          <div className="wa-date mono">Hoy</div>
          {messages.map((m, i) => (
            <div key={i} className={`wa-msg ${m.from === "me" ? "is-me" : ""}`}>
              <div className="wa-bubble">
                {m.text}
                <span className="wa-meta">
                  {m.time}
                  {m.from === "me" && (
                    <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
                      <path d="M1 6l3 3 6-7M6 9l3-3M9 6l4-4" stroke="#53bdeb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {m.showCta && (
                  <div className="wa-cta-stack">
                    <a
                      className="wa-cta"
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 2.7C8.65 2.7 2.7 8.65 2.7 16c0 2.34.62 4.62 1.79 6.63L2.7 29.3l6.86-1.8a13.27 13.27 0 0 0 6.44 1.64h.01c7.34 0 13.29-5.96 13.29-13.3 0-3.55-1.38-6.89-3.9-9.4a13.21 13.21 0 0 0-9.4-3.9z"/>
                      </svg>
                      Abrir WhatsApp
                    </a>
                    <button type="button" className="wa-cta-secondary" onClick={copyMessage}>
                      {copied ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Copiado
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6"/>
                          </svg>
                          Copiar número + mensaje
                        </>
                      )}
                    </button>
                    <div className="wa-cta-num mono">
                      ¿Prefieres marcar? <strong>{formatNumber(WA_NUMBER)}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="wa-quick">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  className="wa-quick-btn"
                  onClick={() => { setDraft(q); setTimeout(() => send(), 60); }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form className="wa-input" onSubmit={send}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribe un mensaje…"
            aria-label="Mensaje"
          />
          <button type="submit" aria-label="Enviar" disabled={!draft.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
            </svg>
          </button>
        </form>

        <div className="wa-foot mono">
          Tu mensaje continúa en WhatsApp · respuestas en minutos
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ChatWidget, WA_NUMBER });
