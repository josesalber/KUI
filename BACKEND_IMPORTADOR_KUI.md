# Backend — Importador masivo de estudiantes + Documentos del apoderado

Especificación para el equipo backend. El frontend ya está listo:

- **Importador masivo**: `importador.html` (landing, página autónoma). Genera y envía
  el payload de importación.
- **Panel del padre — pestaña Documentos**: debe implementarse en la app **MEMBRESIA**
  (React + Vite + TS + shadcn), no en esta landing. Aquí va solo la especificación.

---

## 1. Importador masivo

### 1.1. Estructura académica (para poblar los selects)

El importador usa, por ahora, constantes en `importador.html`:

```js
const PERIODOS   = ["2026", "2025", "2024"];           // [0] = actual (predeterminado)
const ESTRUCTURA = {
  "Inicial":    ["3 años", "4 años", "5 años"],
  "Primaria":   ["1°", "2°", "3°", "4°", "5°", "6°"],
  "Secundaria": ["1°", "2°", "3°", "4°", "5°"],
};
const SECCIONES  = ["A", "B", "C", "D", "E", "F"];
```

Para usar los valores reales de cada institución, exponer:

```
GET /api/academico/estructura?institucionId={id}
200 OK
{
  "periodos": [{ "id": "p-2026", "nombre": "2026", "actual": true }, ...],
  "niveles": [
    { "id": "n-ini", "nombre": "Inicial",
      "grados": [{ "id": "g-ini-3", "nombre": "3 años" }, ...] },
    ...
  ],
  "secciones": [{ "id": "s-a", "nombre": "A" }, ...]
}
```

El front reemplazará las constantes por la respuesta (mismas claves: `nivel -> grados`,
`secciones`, `periodos`). El periodo con `actual: true` queda preseleccionado y se hereda
en cada fila nueva. Si luego se envían **IDs** en vez de nombres, ajustar `buildPayload()`.

### 1.2. Endpoint de importación

Configurar en `importador.html` la constante `IMPORT_API` con esta URL. Si queda vacía,
el front solo muestra el JSON (no llama a la API).

```
POST /api/importacion/estudiantes        (requiere JWT del admin de la institución)
Content-Type: application/json
```

**Request** (lo que envía el front, `buildPayload()`):

```json
{
  "periodoAcademico": "2026",
  "totalFilas": 2,
  "estudiantes": [
    {
      "estudiante": {
        "docIdentidad": "12345678",
        "nombres": "Ana",
        "apellidos": "Quispe Flores",
        "nivel": "Primaria",
        "grado": "3°",
        "seccion": "A"
      },
      "apoderado": {
        "docIdentidad": "87654321",
        "nombres": "Rosa",
        "apellidos": "Flores Díaz"
      }
    }
  ]
}
```

**Reglas de validación en el servidor** (no confiar en el cliente):

- `docIdentidad`: DNI de 8 dígitos, o carné de extranjería / pasaporte alfanumérico de
  9 a 12 caracteres. Obligatorio en estudiante y apoderado.
- `nombres`, `apellidos`: obligatorios, no vacíos.
- `nivel`, `grado`, `seccion`: deben existir en la estructura académica de la institución,
  y `grado` debe pertenecer a `nivel`.
- `periodoAcademico`: debe existir y estar abierto para matrícula.
- **Deduplicación**: si el `docIdentidad` del estudiante ya existe en el periodo, decidir
  política (rechazar fila, o actualizar). Igual para el apoderado: si ya existe, enlazar;
  si no, crear.
- **Relación padre ↔ hijo**: crear/enlazar al apoderado y asociarlo como apoderado del
  estudiante (reutiliza el modelo "Relación padre ↔ hijo" del módulo de usuarios).

**Response** (éxito, idealmente parcial por fila para reportar errores):

```json
{
  "ok": true,
  "periodoAcademico": "2026",
  "resumen": { "recibidos": 2, "creados": 2, "actualizados": 0, "errores": 0 },
  "filas": [
    { "indice": 0, "estado": "creado", "estudianteId": "...", "apoderadoId": "..." }
  ]
}
```

En error de fila: `{ "indice": 1, "estado": "error", "mensaje": "DNI duplicado" }`.
El front muestra la respuesta tal cual en un modal; conviene devolver `filas[]` con el
detalle por índice para que el usuario corrija.

### 1.3. Formato CSV (plantilla / importación de archivo)

Cabecera exacta que genera y espera el front:

```
doc_identidad,nombres,apellidos,nivel,grado,seccion,doc_identidad_apoderado,nombres_apoderado,apellidos_apoderado
```

El parser del front tolera comillas y comas dentro de campos. Si el backend genera la
plantilla, mantener estas columnas y orden.

---

## 2. Panel del padre — pestaña "Documentos" (app MEMBRESIA)

Cuando el padre selecciona a un hijo, hoy ve las acciones: **Notas · Estado de cuenta ·
Regresar**. Agregar una cuarta: **Documentos**.

### 2.1. Comportamiento (frontend MEMBRESIA)

- Nueva pestaña/acción "Documentos" junto a Notas y Estado de cuenta.
- Lista los documentos requeridos del estudiante con su estado: `pendiente`, `enviado`,
  `aprobado`, `rechazado`.
- Por cada documento **faltante** (`pendiente` o `rechazado`), permitir **subir** el
  archivo (PDF / JPG / PNG, límite p. ej. 5 MB). Mostrar barra de progreso y resultado.
- Documentos ya `aprobado` o `enviado`: solo lectura (ver / descargar), sin reemplazo
  salvo que estén `rechazado`.

### 2.2. Endpoints sugeridos

```
GET  /api/estudiantes/{id}/documentos           → lista requeridos + estado
POST /api/estudiantes/{id}/documentos/{docTipoId}   (multipart/form-data, campo "archivo")
GET  /api/documentos/{documentoId}/archivo      → descarga (con control de acceso)
```

`GET .../documentos` (ejemplo):

```json
{
  "estudianteId": "...",
  "requeridos": [
    { "docTipoId": "dni",            "nombre": "DNI del estudiante",       "estado": "aprobado",  "archivoId": "..." },
    { "docTipoId": "partida",        "nombre": "Partida de nacimiento",    "estado": "pendiente", "archivoId": null },
    { "docTipoId": "libreta",        "nombre": "Libreta del año anterior", "estado": "rechazado", "archivoId": "...", "motivo": "ilegible" },
    { "docTipoId": "ficha_matricula","nombre": "Ficha de matrícula",       "estado": "pendiente", "archivoId": null }
  ]
}
```

Reglas:
- El catálogo de documentos requeridos lo define la institución (configurable por nivel).
- Validar tipo MIME y tamaño en el servidor. Guardar en almacenamiento privado; servir
  solo con autorización del apoderado dueño o del staff.
- Al subir, estado pasa a `enviado`; el colegio luego `aprueba` o `rechaza` (con motivo).
- Notificar (anuncio / chat) cuando falten documentos o cambie el estado.

### 2.3. Seguridad

- El apoderado solo ve y sube documentos de **sus** hijos (verificar relación en backend).
- Datos de menores: aplican las mismas obligaciones de protección de datos (Ley 29733)
  descritas en `terminos.html`.
