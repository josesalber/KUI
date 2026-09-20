# Contexto KUI — handoff para continuar en Claude Code

Resumen del estado del proyecto KUI (landing + membresía) para retomar el trabajo en otra sesión. Última sesión: 2026-09-19.

## Qué es el proyecto

- **Landing KUI** — carpeta `D:\KUI LAND\KUI`. Sitio estático: HTML + React 18 UMD + Babel en el navegador (sin build step). Se sirve con `server.js` (node) y se despliega en Vercel. Scripts `.jsx` se cargan con `type="text/babel"` desde `index.html`.
- **MEMBRESIA** — carpeta `D:\KUI LAND\MEMBRESIA`. Panel admin React + Vite + TypeScript + shadcn. Gestiona "instituciones" (colegios), licencias, login. Consume un backend REST externo: `https://backend-central-lost.onrender.com`.

## Objetivo de la tarea

Botón de pago en la landing que crea la cuenta del colegio y lo lleva a MEMBRESIA. Pago con **Culqi**. Plan Rocket = 6 meses gratis; se registra tarjeta hoy, primer cobro tras 6 meses, luego cobro mensual según cantidad de estudiantes.

Credenciales Culqi (TEST): pública `pk_test_zs2Xf3e5X7QQCSnf`. La llave privada va SOLO en backend (variable de entorno), nunca en el front.

## Lo que ya se hizo (front listo)

1. **`pago.html`** (nuevo) — checkout/registro. Diseño 2 columnas estilo referencia smiledu:
   - Izquierda: formulario 3 pasos con stepper (Personal → Institucional → Validación), labels sobre el borde, título "Empieza gratis.".
     - Paso 1 Personal: nombre completo, correo, cargo (select), teléfono, checkbox términos.
     - Paso 2 Institucional: nombre institución, **dominio deseado** (texto libre, sin prefijo — KUI provisiona el dominio después), RUC/cód. modular, cantidad estudiantes (obligatorio), tipo. Muestra precio en vivo.
     - Paso 3 Validación: banner Plan Rocket 6 meses gratis, resumen, "A pagar hoy S/0", tarjeta Culqi (modal v4).
   - Derecha: carrusel de 3 secciones (captura + texto a la derecha). Arrastre/swipe (mouse + touch), flechas y puntos. Fondo de captura transparente. Imágenes las coloca el usuario: `assets/reg-1.png`, `reg-2.png`, `reg-3.png`.
   - Countdown 10 min + botón "Volver a KUI". Overlay al expirar.
   - Constantes de config al inicio del `<script>`: `CULQI_PUBLIC_KEY`, `CHECKOUT_API`, `MEMBRESIA_URL`.
2. **`components.jsx`** — botón Nav "Hablemos" → **"Empieza gratis"**, enlaza a `pago.html`.
3. **`i18n.jsx`** — traducciones "Empieza gratis" y "Volver a KUI" (es/en/ru/ja/zh).
4. **`terminos.html`** (nuevo) — página legal completa (marco Perú: Ley 29733 datos personales + Reglamento DS 003-2013-JUS, Ley 29571 consumidor/INDECOPI, Culqi PCI-DSS). 19 secciones con índice. Abre en pestaña nueva desde el checkbox. Tiene placeholders naranjas (razón social, RUC, dirección, correo) a completar. Es plantilla base — revisar con abogado.
5. **`BACKEND_CHECKOUT_KUI.md`** (nuevo) — especificación para el dev backend.

## Precio (importante — cambió a piso S/200)

- Base (piso): **S/200 por hasta 250 estudiantes**.
- Adicional: **+S/1 por estudiante sobre 250**.
- Fórmula: `max(200, 200 + (alumnos - 250))`.
- En `pago.html` es la constante `BASE_PRICE = 200`.
- Nota: la landing (`products-page.jsx`, slider de planes) sigue con base S/40 — pendiente decidir si se sube a 200 también.

## Contrato del checkout (lo que envía `pago.html`)

`POST` a `CHECKOUT_API` con:

```json
{
  "culqiToken": "tkn_...",
  "plan": "ROCKET",
  "trialMeses": 6,
  "alumnos": 850,
  "montoMensual": 800,
  "contacto": { "nombreCompleto": "...", "email": "...", "cargo": "...", "telefono": "..." },
  "institucion": { "nombre": "...", "tipo": "COLEGIO", "dominioDeseado": "...", "ruc": "...", "emailContacto": "..." }
}
```

Backend responde `{ "loginUrl": "..." }` y el front redirige ahí.

## Pendientes

### Front (chico)
- [ ] Colocar imágenes `assets/reg-1.png`, `reg-2.png`, `reg-3.png` (capturas del carrusel).
- [ ] Confirmar `MEMBRESIA_URL` real y ponerla en `pago.html`.
- [ ] Completar los placeholders legales en `terminos.html` (razón social, RUC, dirección, correo) y revisar con abogado.
- [ ] Decidir si el slider de planes de la landing sube a piso S/200.

### Backend (falta implementar — ver `BACKEND_CHECKOUT_KUI.md`)
- [ ] `POST /api/public/checkout` (público, sin JWT): Culqi cliente → tarjeta → plan con trial 6 meses → suscripción → crear institución en backend central → crear usuario admin / correo bienvenida → responder `{ loginUrl }`.
- [ ] Recalcular `montoMensual` en servidor (piso S/200), no confiar en el cliente.
- [ ] `POST /api/webhooks/culqi` para renovar/suspender licencia según cobros.
- [ ] Variables de entorno con la llave privada Culqi (fuera del repo). Pasar a llaves `live` en producción.
- [ ] CORS: permitir el origen de la landing.

## Cómo correr / probar

- Landing: `npm run dev` (o `node server.js`) desde `D:\KUI LAND\KUI`. Se probó en `localhost:5173/pago.html`.
- MEMBRESIA: `pnpm install` + `pnpm dev`, con `.env` `VITE_CENTRAL_BACKEND_URL`.

## Archivos tocados esta sesión

`pago.html` (nuevo), `terminos.html` (nuevo), `BACKEND_CHECKOUT_KUI.md` (nuevo), `components.jsx` (editado), `i18n.jsx` (editado). Todos en `D:\KUI LAND\KUI`.
