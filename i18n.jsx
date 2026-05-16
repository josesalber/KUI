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
function T({ children }) {
  const [lang] = useLang();
  void lang; // force re-render on lang change
  return t(typeof children === "string" ? children : String(children));
}

Object.assign(window, { LANGS, DICT, AUTO_CACHE, t, setLang, useLang, LanguageSwitcher, T });
