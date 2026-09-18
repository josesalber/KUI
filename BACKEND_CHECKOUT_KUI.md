# Backend — Checkout público KUI (Culqi + creación de cuenta)

Especificación para el equipo de backend. El frontend (`pago.html` en la landing KUI) ya está listo: recolecta los datos de la institución, valida la cantidad de alumnos y **tokeniza la tarjeta con Culqi usando la llave pública**. Lo único que falta es el lado servidor descrito aquí.

## 1. Resumen del flujo

1. El usuario entra a `pago.html` desde el botón **"Adquiere"** de la landing.
2. Completa: nombre de institución, correo, tipo (`COLEGIO` / `INSTITUTO` / `ACADEMIA`) y selecciona la cantidad de alumnos (obligatorio).
3. Registra su tarjeta en el modal de Culqi. Culqi devuelve un **token de un solo uso** (`tkn_...`). El frontend **nunca ve el número de tarjeta**.
4. El frontend hace `POST` a `CHECKOUT_API` con el token + los datos.
5. **El backend** (este documento): crea el cliente y la tarjeta en Culqi, crea una **suscripción con 6 meses de prueba gratis**, crea la institución en el backend central, y responde con la URL de acceso.
6. El frontend redirige al usuario a la plataforma MEMBRESIA.

El **Plan Rocket** = 6 meses gratis. Se registra la tarjeta hoy, pero **el primer cobro recién ocurre tras 6 meses**, y luego cada mes según la cantidad de alumnos.

## 2. Seguridad — importante

- La **llave privada** de Culqi (`sk_test_YGriEtW3WCPIKSJn` en pruebas) va **solo en el backend**, como variable de entorno. Nunca en el frontend, nunca en el repositorio.
- La **llave pública** (`pk_test_zs2Xf3e5X7QQCSnf`) sí vive en el frontend — es segura por diseño.
- El token de Culqi (`tkn_...`) es de un solo uso y expira; el backend debe consumirlo de inmediato.

## 3. Variables de entorno a agregar

```
CULQI_SECRET_KEY=sk_test_YGriEtW3WCPIKSJn
CULQI_PUBLIC_KEY=pk_test_zs2Xf3e5X7QQCSnf
CULQI_API=https://api.culqi.com/v2
MEMBRESIA_URL=https://membresia.kuiweb.com/login   # ajustar a la URL real
KUI_TRIAL_MESES=6
```

> Reemplazar las llaves `test` por las de producción (`sk_live_...`, `pk_live_...`) al salir a producción. La `pk_live` también debe actualizarse en `pago.html` (constante `CULQI_PUBLIC_KEY`).

## 4. Endpoint a implementar

### `POST /api/public/checkout`

Público (sin JWT). Es el que el frontend ya está llamando.

**Request body** (lo que envía `pago.html` — formulario de 3 pasos: Personal, Institucional, Validación):

```json
{
  "culqiToken": "tkn_test_xxx",
  "plan": "ROCKET",
  "trialMeses": 6,
  "alumnos": 850,
  "montoMensual": 640,
  "contacto": {
    "nombreCompleto": "Juan Pérez",
    "email": "director@colegio.edu.pe",
    "cargo": "Dueño(a)",
    "telefono": "999999999"
  },
  "institucion": {
    "nombre": "Colegio San Martín",
    "tipo": "COLEGIO",
    "dominioDeseado": "micolegio.edu.pe",
    "ruc": "20481234567",
    "emailContacto": "director@colegio.edu.pe"
  }
}
```

- `contacto` = persona que registra (paso Personal). Úsalo para crear el usuario admin de la institución y el correo de bienvenida.
- `institucion.dominioDeseado` = **texto libre** con el dominio que la institución desea (paso Institucional). No es un subdominio fijo: el equipo KUI provisiona/registra el dominio después, de forma manual. Guárdalo como preferencia; no lo valides como único ni asumas formato.
- `institucion.ruc` = RUC o código modular.
- `montoMensual` viene en **soles** (S/). Para Culqi conviértelo a **céntimos** → `montoMensual * 100`.
- Recalcula y valida `montoMensual` en el backend (no confíes en el valor del cliente). Fórmula: `max(200, 200 + (alumnos - 250))` soles → **mínimo S/200**. `alumnos` es obligatorio y > 0.

**Pasos del backend:**

1. **Validar** entrada (email, alumnos en rango, monto recalculado).
2. **Crear cliente en Culqi** — `POST {CULQI_API}/customers`:
   ```json
   {
     "first_name": "Colegio San Martín",
     "last_name": "KUI",
     "email": "director@colegio.edu.pe",
     "address": "Lima",
     "address_city": "Lima",
     "country_code": "PE",
     "phone_number": "999999999"
   }
   ```
   Header: `Authorization: Bearer {CULQI_SECRET_KEY}`. Devuelve `customer_id` (`cus_...`).
3. **Crear tarjeta** — `POST {CULQI_API}/cards`:
   ```json
   { "customer_id": "cus_xxx", "token_id": "tkn_test_xxx" }
   ```
   Devuelve `card_id` (`crd_...`).
4. **Crear/obtener el plan de suscripción** — `POST {CULQI_API}/recurrent/plans` (o reutilizar uno existente por cantidad de alumnos). El plan define el monto e intervalo mensual y el periodo de prueba:
   ```json
   {
     "name": "KUI Rocket 850 alumnos",
     "amount": 64000,
     "currency_code": "PEN",
     "interval_unit_time": 3,          
     "interval_count": 1,
     "trial_days": 180                 
   }
   ```
   - `interval_unit_time: 3` = mensual en la API de Culqi.
   - `trial_days: 180` ≈ 6 meses gratis. (Ajusta el cálculo exacto de días si se requiere corte por fecha calendario.)
   - Como el monto depende de los alumnos, puedes crear un plan por cada checkout, o mantener un catálogo de planes por rango.
5. **Crear la suscripción** — `POST {CULQI_API}/recurrent/subscriptions/create`:
   ```json
   { "card_id": "crd_xxx", "plan_id": "pln_xxx", "tyc": true }
   ```
   Devuelve `subscription_id` (`sxn_...`). Gracias al `trial_days`, **no se cobra hoy**; el primer cargo ocurre a los 6 meses.
6. **Crear la institución en el backend central** (reutiliza el modelo existente de `instituciones`):
   - `nombre`, `tipo`, `emailContacto` del request.
   - `estado = ACTIVO`.
   - `fechaVencimiento` = hoy + duración de licencia (define política; p.ej. se renueva mientras la suscripción Culqi esté activa).
   - Genera `apiKey` y `subdominio` como ya lo hace el flujo admin.
   - Guarda referencia a Culqi: `culqiCustomerId`, `culqiCardId`, `culqiSubscriptionId`, `alumnosContratados`, `montoMensual`.
7. **Crear credenciales de acceso** para MEMBRESIA (usuario admin de esa institución) o disparar un correo de bienvenida con enlace para definir contraseña.
8. **Responder** al frontend:

```json
{
  "ok": true,
  "institucionId": 42,
  "loginUrl": "https://membresia.kuiweb.com/login?welcome=1&inst=42"
}
```

El frontend redirige a `loginUrl` (o a `MEMBRESIA_URL` si no viene).

**Errores:** responde con status `4xx/5xx` y `{ "message": "texto para el usuario" }`. El frontend ya muestra ese `message`.

## 5. Webhook de Culqi (recomendado)

### `POST /api/webhooks/culqi`

Registra esta URL en el panel de Culqi. Culqi notifica eventos de cobro recurrente:

- **Cargo recurrente exitoso** (mes 7 en adelante) → mantener institución `ACTIVO`, extender `fechaVencimiento`.
- **Cargo fallido / suscripción cancelada** → marcar institución `SUSPENDIDO` o `VENCIDO` (usa los endpoints ya existentes `PATCH /api/instituciones/:id/suspender`).

Valida la autenticidad del webhook según la documentación de Culqi antes de actuar.

## 6. Cómo se calcula el precio

| Concepto | Valor |
|---|---|
| Base (piso) | S/ 200 por 250 alumnos |
| Adicional | + S/ 1 por alumno sobre 250 |
| Mínimo | S/ 200/mes |
| Prueba | 6 meses gratis (primer cobro al mes 7) |

Ejemplo: 850 alumnos → `200 + (850 − 250)` = **S/ 800/mes** → `80000` céntimos en Culqi.

## 7. Tarjetas de prueba (Culqi test)

- Visa: `4111 1111 1111 1111`, cualquier CVV, fecha futura.
- Mastercard: `5111 1111 1111 1118`.
- Más en la documentación de Culqi (sección "Tarjetas de prueba").

## 8. Checklist para el backend

- [ ] Variables de entorno con la llave privada (fuera del repo).
- [ ] `POST /api/public/checkout` (cliente → tarjeta → plan → suscripción con trial → institución → respuesta).
- [ ] Recalcular monto en servidor; no confiar en `montoMensual` del cliente.
- [ ] Creación de institución + credenciales/correo de bienvenida.
- [ ] `POST /api/webhooks/culqi` para renovación/suspensión automática.
- [ ] CORS: permitir el origen de la landing (`https://kuiweb.com`).
- [ ] Confirmar la URL real de MEMBRESIA y ponerla en `pago.html` (`MEMBRESIA_URL`) y en el backend.

## 9. Ajustes pendientes en el frontend (`pago.html`)

Tres constantes al inicio del `<script>` de `pago.html`, listas para apuntar a producción:

```js
const CULQI_PUBLIC_KEY = "pk_test_zs2Xf3e5X7QQCSnf";               // → pk_live_... en prod
const CHECKOUT_API = "https://backend-central-0j9o.onrender.com/api/public/checkout"; // → URL real del endpoint
const MEMBRESIA_URL = "https://membresia.kuiweb.com/login";        // → URL real de MEMBRESIA
```

El frontend queda funcional apenas el endpoint `POST /api/public/checkout` responda con `{ loginUrl }`.
