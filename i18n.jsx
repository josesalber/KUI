/* global React */
const { useEffect, useState, useRef } = React;

/* ============================================================
   i18n — Spanish / English / Russian / Japanese / Chinese
   - Pre-translated dictionary for the high-traffic strings.
   - Anything missing falls back to Spanish + (optional) auto-translation
     via window.claude.complete, cached per-language in localStorage.
   ============================================================ */

const LANGS = [
  { code: "es", name: "Español", short: "ES", flag: "🇪🇸" },
  { code: "en", name: "English", short: "EN", flag: "🇺🇸" },
  { code: "ru", name: "Русский", short: "RU", flag: "🇷🇺" },
  { code: "ja", name: "日本語",   short: "JA", flag: "🇯🇵" },
  { code: "zh", name: "中文",     short: "ZH", flag: "🇨🇳" },
];

// Pre-translated dictionary for the strings we know live on the page.
// Spanish is the source / fallback.
const DICT = {
  // ───── Nav ─────
  "Servicios":      { en: "Services",   ru: "Услуги",       ja: "サービス",  zh: "服务" },
  "Productos":      { en: "Products",   ru: "Продукты",     ja: "プロダクト", zh: "产品" },
  "Estudio":        { en: "Studio",     ru: "Студия",       ja: "スタジオ",  zh: "工作室" },
  "Equipo":         { en: "Team",       ru: "Команда",      ja: "チーム",    zh: "团队" },
  "Inicio":         { en: "Home",       ru: "Главная",      ja: "ホーム",    zh: "首页" },
  "Administración": { en: "Administration", ru: "Администрация", ja: "管理",  zh: "行政管理" },
  "Profesores":     { en: "Teachers",   ru: "Преподаватели", ja: "教師",     zh: "教师" },
  "Padres":         { en: "Parents",    ru: "Родители",     ja: "保護者",    zh: "家长" },
  "Estudiantes":    { en: "Students",   ru: "Студенты",     ja: "学生",      zh: "学生" },
  "Enfermería":     { en: "Nursing",    ru: "Медпункт",     ja: "保健室",    zh: "校医室" },
  "Planes":         { en: "Plans",      ru: "Тарифы",       ja: "プラン",    zh: "方案" },
  "Prueba KUI":     { en: "Try KUI",    ru: "Попробовать",  ja: "KUIを試す", zh: "试用KUI" },
  "Conócenos":      { en: "Solutions",  ru: "Решения",      ja: "ソリューション", zh: "解决方案" },
  "Contacto":       { en: "Contact",    ru: "Контакты",     ja: "お問い合わせ", zh: "联系" },
  "Hablemos":       { en: "Let's talk", ru: "Поговорим",    ja: "話そう",    zh: "聊聊" },

  // ───── Hero ─────
  "Infraestructura":             { en: "Digital",          ru: "Цифровая",     ja: "デジタル", zh: "数字化" },
  "digital para":                { en: "infrastructure",   ru: "инфраструктура", ja: "インフラ", zh: "基础设施" },
  "negocios que":                { en: "for businesses",   ru: "для бизнеса",  ja: "ビジネスのための", zh: "为发展中的" },
  "se mueven":                   { en: "that move",        ru: "в движении",   ja: "動くもの",  zh: "企业服务" },
  "Ver productos":               { en: "See products",     ru: "Продукты",     ja: "プロダクトを見る", zh: "查看产品" },
  "Iniciar proyecto":            { en: "Start a project",  ru: "Начать проект",ja: "プロジェクト開始", zh: "开始项目" },
  "Disponible":                  { en: "Available",        ru: "Доступно",     ja: "受付中",    zh: "现已开放" },
  "3 proyectos abiertos en Q3 2026": { en: "3 open slots in Q3 2026", ru: "3 проекта в Q3 2026", ja: "Q3 2026に3枠", zh: "2026 Q3 开放 3 个名额" },
  "Construimos sistemas operativos para empresas en crecimiento — desde plataformas de aprendizaje hasta puntos de venta para restaurantes. Software medido en velocidad, no en features.": {
    en: "We build operating systems for growing companies — from learning platforms to restaurant POS. Software measured in speed, not features.",
    ru: "Мы создаём операционные системы для растущих компаний — от платформ обучения до POS-систем для ресторанов. Софт, который измеряется скоростью, а не функциями.",
    ja: "成長企業のための業務システムを構築します — 学習プラットフォームからレストランPOSまで。機能ではなく、スピードで測るソフトウェア。",
    zh: "我们为成长型企业构建运营系统 — 从学习平台到餐厅POS。以速度衡量,而非功能。",
  },

  // ───── Section labels / kickers ─────
  "— servicios":     { en: "— services",     ru: "— услуги",        ja: "— サービス",  zh: "— 服务" },
  "— productos":     { en: "— products",     ru: "— продукты",      ja: "— プロダクト", zh: "— 产品" },
  "02 — productos":  { en: "02 — products",  ru: "02 — продукты",   ja: "02 — プロダクト", zh: "02 — 产品" },
  "03 — números":    { en: "03 — numbers",   ru: "03 — цифры",      ja: "03 — 数字",   zh: "03 — 数据" },
  "— alcance":       { en: "— reach",        ru: "— охват",         ja: "— 展開",      zh: "— 覆盖" },
  "— por qué kui":   { en: "— why kui",      ru: "— почему kui",    ja: "— なぜkui",   zh: "— 为什么是 kui" },
  "— historia":      { en: "— history",      ru: "— история",       ja: "— 歴史",      zh: "— 历程" },
  "— stack":         { en: "— stack",        ru: "— стек",          ja: "— スタック",  zh: "— 技术栈" },
  "— testimonios":   { en: "— testimonials", ru: "— отзывы",        ja: "— お客様の声", zh: "— 客户评价" },
  "— equipo":        { en: "— team",         ru: "— команда",       ja: "— チーム",    zh: "— 团队" },
  "— contacto":      { en: "— contact",      ru: "— контакты",      ja: "— お問い合わせ", zh: "— 联系" },

  // ───── Marquee items ─────
  "Software a medida":     { en: "Custom software",   ru: "Софт под заказ",   ja: "カスタム開発", zh: "定制软件" },
  "LMS empresarial":       { en: "Enterprise LMS",    ru: "LMS для бизнеса",  ja: "企業向けLMS", zh: "企业 LMS" },
  "POS para restaurantes": { en: "Restaurant POS",    ru: "POS для ресторанов", ja: "レストランPOS", zh: "餐厅 POS" },
  "Integraciones API":     { en: "API integrations",  ru: "API-интеграции",   ja: "API連携",     zh: "API 集成" },
  "Diseño de producto":    { en: "Product design",    ru: "Дизайн продукта",  ja: "プロダクトデザイン", zh: "产品设计" },
  "Arquitectura cloud":    { en: "Cloud architecture",ru: "Облачная архитектура", ja: "クラウド設計", zh: "云架构" },

  // ───── Buttons / generic ─────
  "Enviar mensaje":         { en: "Send message",        ru: "Отправить",          ja: "送信",         zh: "发送" },
  "Enviar otro mensaje":    { en: "Send another",        ru: "Ещё одно",           ja: "もう一通送る", zh: "再发一条" },
  "Mensaje enviado.":       { en: "Message sent.",       ru: "Сообщение отправлено.", ja: "送信完了", zh: "已发送。" },
  "Abrir WhatsApp":         { en: "Open WhatsApp",       ru: "Открыть WhatsApp",   ja: "WhatsAppを開く", zh: "打开 WhatsApp" },
  "Copiar número + mensaje":{ en: "Copy number + message", ru: "Скопировать",       ja: "コピー",       zh: "复制号码+信息" },
  "Copiado":                { en: "Copied",              ru: "Скопировано",        ja: "コピー済",      zh: "已复制" },
  "Escribe un mensaje…":    { en: "Type a message…",     ru: "Напишите сообщение…", ja: "メッセージを入力…", zh: "输入消息…" },
  "En línea · responde en minutos": { en: "Online · replies in minutes", ru: "Онлайн · отвечаем за минуты", ja: "オンライン · 数分で返信", zh: "在线 · 数分钟内回复" },
  "Tu mensaje continúa en WhatsApp · respuestas en minutos": {
    en: "Continue in WhatsApp · replies in minutes",
    ru: "Продолжим в WhatsApp · ответ за минуты",
    ja: "WhatsAppで続けます · 数分で返信",
    zh: "在 WhatsApp 继续 · 数分钟内回复",
  },
  "Hoy":                    { en: "Today",  ru: "Сегодня", ja: "今日", zh: "今天" },
  "ahora":                  { en: "now",    ru: "сейчас",  ja: "今",   zh: "刚刚" },
  "enviado":                { en: "sent",   ru: "отпр.",   ja: "送信",  zh: "已发" },
  "¿Hablamos?":             { en: "Let's chat?", ru: "Чат",  ja: "話そう", zh: "聊一下?" },
  "Cerrar":                 { en: "Close",  ru: "Закрыть", ja: "閉じる", zh: "关闭" },

  // ───── Footer ─────
  "Studio":   { en: "Studio",  ru: "Студия",   ja: "スタジオ",    zh: "工作室" },
  "Sobre kui":{ en: "About",   ru: "О нас",    ja: "kuiについて", zh: "关于" },
  "Historia": { en: "History", ru: "История",  ja: "歴史",        zh: "历程" },
  "Stack":    { en: "Stack",   ru: "Стек",     ja: "スタック",    zh: "技术栈" },

  // ───── ROI ─────
  "Calculadora de inversión": { en: "ROI calculator", ru: "Калькулятор инвестиций", ja: "ROI計算機", zh: "投资计算器" },
  "Estima tu proyecto":        { en: "Estimate your project", ru: "Оцените свой проект", ja: "見積もり", zh: "项目估算" },

  // ───── FAQ ─────
  "Preguntas frecuentes":      { en: "Frequently asked", ru: "Частые вопросы", ja: "よくある質問", zh: "常见问题" },

  // ───── Newsletter ─────
  "Newsletter trimestral":     { en: "Quarterly newsletter", ru: "Ежекв. рассылка", ja: "四半期ニュースレター", zh: "季度通讯" },
  "Suscribirme":               { en: "Subscribe", ru: "Подписаться", ja: "登録", zh: "订阅" },

  // ───── Form labels ─────
  "Nombre completo *":   { en: "Full name *",     ru: "Имя *",        ja: "氏名 *",   zh: "姓名 *" },
  "Email corporativo *": { en: "Work email *",    ru: "Рабочий email *", ja: "業務メール *", zh: "工作邮箱 *" },
  "Empresa":             { en: "Company",         ru: "Компания",     ja: "会社",     zh: "公司" },
  "¿Qué te interesa?":   { en: "What interests you?", ru: "Что интересует?", ja: "ご興味", zh: "您感兴趣的" },
  "Presupuesto estimado":{ en: "Estimated budget", ru: "Бюджет",      ja: "予算",     zh: "预算" },
  "Cuéntanos sobre tu proyecto *": { en: "Tell us about your project *", ru: "О проекте *", ja: "プロジェクトについて *", zh: "项目说明 *" },
};

const LS_KEY = "kui-lang";

function getInitialLang() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored && LANGS.find((l) => l.code === stored)) return stored;
  } catch (e) {}
  const browser = (navigator.language || "es").slice(0, 2).toLowerCase();
  if (LANGS.find((l) => l.code === browser)) return browser;
  return "es";
}

// Cache for auto-translations (claude.complete results)
const AUTO_CACHE = {};
function loadCache() {
  try {
    LANGS.forEach((l) => {
      const v = localStorage.getItem(`kui-i18n-${l.code}`);
      if (v) AUTO_CACHE[l.code] = JSON.parse(v);
      else AUTO_CACHE[l.code] = {};
    });
  } catch (e) {}
}
function persistCache(lang) {
  try { localStorage.setItem(`kui-i18n-${lang}`, JSON.stringify(AUTO_CACHE[lang] || {})); } catch (e) {}
}
loadCache();

// Global lang + listeners
window.__kuiLang = getInitialLang();
window.__kuiLangListeners = new Set();
function setLang(code) {
  window.__kuiLang = code;
  try { localStorage.setItem(LS_KEY, code); } catch (e) {}
  document.documentElement.lang = code;
  window.__kuiLangListeners.forEach((fn) => fn(code));
}
document.documentElement.lang = window.__kuiLang;

// The translation function — pure dictionary lookup.
// If the string isn't in DICT, returns the Spanish original.
// Auto-translation (via claude.complete) is opt-in via `<AutoTranslate>` wrapper.
function t(es) {
  const lang = window.__kuiLang;
  if (lang === "es") return es;
  if (DICT[es] && DICT[es][lang]) return DICT[es][lang];
  if (AUTO_CACHE[lang] && AUTO_CACHE[lang][es]) return AUTO_CACHE[lang][es];
  return es; // fallback
}

// Hook: re-render component when language changes.
function useLang() {
  const [lang, setLangState] = useState(window.__kuiLang);
  useEffect(() => {
    const listener = (code) => setLangState(code);
    window.__kuiLangListeners.add(listener);
    return () => window.__kuiLangListeners.delete(listener);
  }, []);
  return [lang, setLang];
}

/* ============================================================
   LanguageSwitcher — compact dropdown for the nav.
   ============================================================ */
function LanguageSwitcher() {
  const [lang, setLangVal] = useLang();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div className={`lang ${open ? "is-open" : ""}`} ref={wrapRef}>
      <button
        type="button"
        className="lang-trigger"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-label="Cambiar idioma"
      >
        <span className="lang-flag" aria-hidden="true">{current.flag}</span>
        <span className="lang-code mono">{current.short}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="lang-menu" role="menu">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`lang-item ${l.code === lang ? "is-active" : ""}`}
            onClick={() => { setLangVal(l.code); setOpen(false); }}
            onMouseEnter={() => { if (l.code !== lang && window.__kuiPrefetchLang) window.__kuiPrefetchLang(l.code); }}
            onFocus={() => { if (l.code !== lang && window.__kuiPrefetchLang) window.__kuiPrefetchLang(l.code); }}
            role="menuitem"
          >
            <span className="lang-flag" aria-hidden="true">{l.flag}</span>
            <span className="lang-name">{l.name}</span>
            <span className="lang-code mono">{l.short}</span>
            {l.code === lang && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="lang-check">
                <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   T — text wrapper that re-renders on language change.
   Use <T>Hola mundo</T> instead of {t("Hola mundo")} when you
   want React to react to language switches.
   ============================================================ */
function extractText(children) {
  if (children == null || children === false) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  // React element — recurse into its children
  if (typeof children === "object" && children.props && children.props.children != null) {
    return extractText(children.props.children);
  }
  return "";
}

function T({ children }) {
  const [lang] = useLang();
  void lang; // force re-render on lang change
  const text = extractText(children);
  return text ? t(text) : (children ?? null);
}

/* ============================================================
   AutoTranslator — walks the live DOM, captures Spanish originals
   per text node + translatable attribute, looks up in DICT /
   AUTO_CACHE, and batch-translates the rest via window.claude.complete.

   - Caches every result in localStorage under kui-i18n-<lang>.
   - Survives React re-renders via MutationObserver.
   - No-op when language is "es".
   ============================================================ */

const TEXT_ORIG = new WeakMap();         // text node -> original Spanish string
const ATTR_ORIG = new WeakMap();         // element  -> { attr: originalSpanish }
const TRANSLATABLE_ATTRS = ["placeholder", "aria-label", "title", "alt"];
const SKIP_TAGS = new Set([
  "SCRIPT","STYLE","NOSCRIPT","IFRAME","CODE","PRE","TEXTAREA",
  "SVG","PATH","LINE","CIRCLE","RECT","POLYGON","POLYLINE","ELLIPSE","G","DEFS","USE","SYMBOL",
]);

function shouldSkipParent(el) {
  if (!el || !el.tagName) return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.closest && el.closest("[data-no-translate]")) return true;
  // Skip the language switcher's own UI so it stays self-labeled
  if (el.closest && el.closest(".lang")) return true;
  // Skip elements explicitly marked as keep-original (mono code blocks, etc.)
  if (el.closest && el.closest("[data-keep-original]")) return true;
  return false;
}

function isTranslatable(str) {
  if (!str) return false;
  const trimmed = str.trim();
  if (trimmed.length < 2) return false;
  // Need at least one alphabetic glyph
  if (!/[A-Za-zÀ-ÿ\u00f1\u00d1]/.test(trimmed)) return false;
  // Skip pure URL / email / @handle / file paths
  if (/^(https?:\/\/|www\.|mailto:|@|\/)/.test(trimmed)) return false;
  if (/^\S+@\S+\.\S+$/.test(trimmed)) return false;
  // Skip "kui" alone or with punctuation
  if (/^kui[\s.,·\-—]*$/i.test(trimmed)) return false;
  return true;
}

function collectTextNodes(root) {
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (shouldSkipParent(n.parentNode)) return NodeFilter.FILTER_REJECT;
      if (!isTranslatable(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n;
  while ((n = walker.nextNode())) out.push(n);
  return out;
}

function collectAttrTargets(root) {
  const out = [];
  const sel = TRANSLATABLE_ATTRS.map((a) => `[${a}]`).join(",");
  const els = root.querySelectorAll(sel);
  els.forEach((el) => {
    if (shouldSkipParent(el)) return;
    TRANSLATABLE_ATTRS.forEach((attr) => {
      const val = el.getAttribute(attr);
      if (val && isTranslatable(val)) out.push({ el, attr });
    });
  });
  return out;
}

function lookupTranslation(rawSrc, lang) {
  // Preserve leading/trailing whitespace exactly
  const leading = (rawSrc.match(/^\s*/) || [""])[0];
  const trailing = (rawSrc.match(/\s*$/) || [""])[0];
  const key = rawSrc.trim();
  if (!key) return null;
  let v = null;
  if (DICT[key] && DICT[key][lang]) v = DICT[key][lang];
  else if (AUTO_CACHE[lang] && AUTO_CACHE[lang][key]) v = AUTO_CACHE[lang][key];
  return v == null ? null : leading + v + trailing;
}

let isApplying = false;
let translating = false;
const TRANSLATING_LISTENERS = new Set();
function setTranslating(v) {
  translating = v;
  TRANSLATING_LISTENERS.forEach((fn) => { try { fn(v); } catch (e) {} });
}

function applyAllNow(lang) {
  isApplying = true;
  try {
    // Text nodes
    const nodes = collectTextNodes(document.body);
    for (const n of nodes) {
      let orig = TEXT_ORIG.get(n);
      if (orig == null) {
        orig = n.nodeValue;
        TEXT_ORIG.set(n, orig);
      }
      if (lang === "es") {
        // If React changed the content while in Spanish, update the cached original
        if (n.nodeValue !== orig) TEXT_ORIG.set(n, n.nodeValue);
      } else {
        const translated = lookupTranslation(orig, lang);
        const target = translated != null ? translated : orig;
        if (n.nodeValue !== target) {
          // Check if React changed the underlying content (new orig from React)
          if (n.nodeValue !== orig && lookupTranslation(n.nodeValue.trim(), lang) === null && !AUTO_CACHE[lang]?.[n.nodeValue.trim()]) {
            // React updated the text — adopt the new value as original
            TEXT_ORIG.set(n, n.nodeValue);
          } else {
            n.nodeValue = target;
          }
        }
      }
    }
    // Attributes
    const attrs = collectAttrTargets(document.body);
    for (const { el, attr } of attrs) {
      let map = ATTR_ORIG.get(el);
      if (!map) { map = {}; ATTR_ORIG.set(el, map); }
      const current = el.getAttribute(attr);
      if (map[attr] == null) map[attr] = current;
      if (lang === "es") {
        if (current !== map[attr]) map[attr] = current;
      } else {
        const translated = lookupTranslation(map[attr], lang);
        const target = translated != null ? translated : map[attr];
        if (current !== target) el.setAttribute(attr, target);
      }
    }
  } finally {
    isApplying = false;
  }
}

async function translateBatch(strings, lang) {
  const langMap = {
    en: "English",
    ru: "Russian",
    ja: "Japanese",
    zh: "Simplified Chinese",
  };
  const langName = langMap[lang];
  if (!langName) return strings.slice();
  if (!window.claude || typeof window.claude.complete !== "function") return strings.slice();

  const SEP = "⫷⫸";
  const list = strings.map((s, i) => `[${i + 1}] ${s.replace(/\n/g, " ⏎ ")}`).join(`\n${SEP}\n`);
  const prompt =
    `You are translating UI copy for "kui" — a software studio in Lima, Peru that builds POS, LMS and custom software for growing companies in Latin America. ` +
    `Brand voice: concise, professional, modern, lowercase brand name. ` +
    `\n\nTask: translate the following Spanish strings to ${langName}. ` +
    `Keep the same punctuation, em dashes (—), bullets, line breaks (encoded as " ⏎ "), capitalization style, and tone. ` +
    `Do NOT translate the brand "kui". Do NOT translate proper nouns of people, cities, or product names like "kui · POS" / "kui · LMS". ` +
    `Return ONLY the translations, in the exact same order, each preceded by its bracketed index, separated by lines containing only "${SEP}". ` +
    `No commentary, no quoting, no explanations.\n\nStrings:\n\n${list}`;

  let out;
  try {
    out = await window.claude.complete(prompt);
  } catch (e) {
    console.warn("[kui i18n] batch failed:", e);
    return strings.slice();
  }
  if (!out || typeof out !== "string") return strings.slice();

  const result = strings.slice();
  // Parse [n] prefixed entries
  const re = /\[(\d+)\]\s*([\s\S]*?)(?=\n[^\S\n]*[⫷⫸]+[^\S\n]*\n|\n\[\d+\]|$)/g;
  let m;
  while ((m = re.exec(out)) !== null) {
    const idx = parseInt(m[1], 10) - 1;
    let val = m[2].trim();
    val = val.replace(/\s*⏎\s*/g, "\n");
    // strip surrounding quotes if claude added them
    val = val.replace(/^["'`]+|["'`]+$/g, "");
    if (idx >= 0 && idx < strings.length && val) result[idx] = val;
  }
  return result;
}

async function ensureTranslations(lang, scope) {
  if (lang === "es") return;
  if (!AUTO_CACHE[lang]) AUTO_CACHE[lang] = {};
  const root = scope || document.body;

  const textNodes = collectTextNodes(root);
  const attrs = collectAttrTargets(root);
  const needed = new Set();

  for (const n of textNodes) {
    let orig = TEXT_ORIG.get(n);
    if (orig == null) { orig = n.nodeValue; TEXT_ORIG.set(n, orig); }
    const key = orig.trim();
    if (!key) continue;
    if (DICT[key] && DICT[key][lang]) continue;
    if (AUTO_CACHE[lang][key]) continue;
    needed.add(key);
  }
  for (const { el, attr } of attrs) {
    let map = ATTR_ORIG.get(el);
    if (!map) { map = {}; ATTR_ORIG.set(el, map); }
    if (map[attr] == null) map[attr] = el.getAttribute(attr);
    const key = (map[attr] || "").trim();
    if (!key) continue;
    if (DICT[key] && DICT[key][lang]) continue;
    if (AUTO_CACHE[lang][key]) continue;
    needed.add(key);
  }

  if (needed.size === 0) return;

  setTranslating(true);
  try {
    // Run batches in parallel (up to 3 at a time) for faster first paint.
    const arr = [...needed];
    const BATCH = 18;
    const CONCURRENCY = 3;
    const chunks = [];
    for (let i = 0; i < arr.length; i += BATCH) chunks.push(arr.slice(i, i + BATCH));

    let cursor = 0;
    const workers = Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, async () => {
      while (true) {
        if (window.__kuiLang !== lang) return;
        const idx = cursor++;
        if (idx >= chunks.length) return;
        const batch = chunks[idx];
        const translated = await translateBatch(batch, lang);
        batch.forEach((src, j) => {
          const t = translated[j];
          AUTO_CACHE[lang][src] = (t && t !== src) ? t : (AUTO_CACHE[lang][src] || src);
        });
        persistCache(lang);
        if (window.__kuiLang === lang) applyAllNow(lang);
      }
    });
    await Promise.all(workers);
  } finally {
    setTranslating(false);
  }
}

/* Prefetch translations for a language WITHOUT switching to it.
   Triggered on hover/focus of language menu items so the switch is instant. */
async function prefetchLang(lang) {
  if (lang === "es") return;
  if (!AUTO_CACHE[lang]) AUTO_CACHE[lang] = {};
  // Collect from current DOM but don't apply.
  const textNodes = collectTextNodes(document.body);
  const attrs = collectAttrTargets(document.body);
  const needed = new Set();
  for (const n of textNodes) {
    const orig = TEXT_ORIG.get(n) ?? n.nodeValue;
    const key = orig.trim();
    if (!key) continue;
    if (DICT[key] && DICT[key][lang]) continue;
    if (AUTO_CACHE[lang][key]) continue;
    needed.add(key);
  }
  for (const { el, attr } of attrs) {
    const map = ATTR_ORIG.get(el);
    const src = map ? map[attr] : el.getAttribute(attr);
    if (!src) continue;
    const key = src.trim();
    if (DICT[key] && DICT[key][lang]) continue;
    if (AUTO_CACHE[lang][key]) continue;
    needed.add(key);
  }
  if (needed.size === 0) return;
  // Fire-and-forget background fetch.
  const arr = [...needed];
  const BATCH = 18;
  for (let i = 0; i < arr.length; i += BATCH) {
    const batch = arr.slice(i, i + BATCH);
    try {
      const translated = await translateBatch(batch, lang);
      batch.forEach((src, j) => {
        const t = translated[j];
        if (t && t !== src) AUTO_CACHE[lang][src] = t;
      });
      persistCache(lang);
    } catch (e) { /* ignore */ }
  }
}
window.__kuiPrefetchLang = prefetchLang;

let pendingTimer = null;
function scheduleApply() {
  if (isApplying) return;
  if (pendingTimer) return;
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    const lang = window.__kuiLang;
    applyAllNow(lang);
    if (lang !== "es") ensureTranslations(lang);
  }, 80);
}

let observer = null;
function startObserver() {
  if (observer) return;
  observer = new MutationObserver((muts) => {
    if (isApplying) return;
    for (const m of muts) {
      if (m.type === "characterData" || m.addedNodes.length || m.removedNodes.length || m.type === "attributes") {
        scheduleApply();
        return;
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATABLE_ATTRS,
  });
}

// Re-apply whenever language changes.
window.__kuiLangListeners.add(() => scheduleApply());

function bootAutoTranslator() {
  startObserver();
  // First pass slightly delayed so React has rendered the page.
  setTimeout(scheduleApply, 200);
  setTimeout(scheduleApply, 800);
  setTimeout(scheduleApply, 2000);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAutoTranslator);
} else {
  bootAutoTranslator();
}

/* ============================================================
   TranslatingIndicator — small pill that fades in while
   batches of translations are in flight.
   ============================================================ */
function TranslatingIndicator() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fn = (v) => setOn(v);
    TRANSLATING_LISTENERS.add(fn);
    return () => TRANSLATING_LISTENERS.delete(fn);
  }, []);
  const labelMap = {
    es: "Traduciendo…",
    en: "Translating…",
    ru: "Перевод…",
    ja: "翻訳中…",
    zh: "翻译中…",
  };
  const lang = window.__kuiLang || "es";
  return (
    <div className={`i18n-status ${on ? "is-on" : ""}`} data-no-translate="true" aria-live="polite">
      <span className="i18n-status-dot" />
      <span className="i18n-status-text mono">{labelMap[lang] || labelMap.en}</span>
    </div>
  );
}

Object.assign(window, {
  LANGS, DICT, AUTO_CACHE, t, setLang, useLang, LanguageSwitcher, T,
  TranslatingIndicator,
});
