<div align="center">

# Consola Text→SQL

**Interfaz local para inspeccionar el flujo experimental del Proyecto 3**

Next.js 16 · React 19 · TypeScript · React Bits

</div>

## Propósito

Esta aplicación presenta el contrato real del proyecto sin formar parte de la ruta oficial de evaluación. Permite introducir un esquema MySQL, escribir una pregunta en español, escoger baseline o adapter y revisar una consulta de solo lectura junto con su traza.

Si la API local no está configurada, la aplicación usa un fixture determinista y lo identifica explícitamente. Nunca presenta métricas del modelo como reales antes de ejecutar los entrenamientos.

## Inicio rápido

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para usar la API FastAPI del repositorio, desde la raíz del proyecto:

```powershell
Copy-Item web\.env.example web\.env.local
.\.venv\Scripts\uvicorn.exe backend.main:app --reload
```

La variable `NEXT_PUBLIC_API_URL` controla el endpoint local. Si no existe o la API no responde, `lib/client.ts` conserva el fallback explícito al fixture.

## Rutas

| Ruta | Función |
|---|---|
| `/` | Laboratorio interactivo de esquema, pregunta y SQL |
| `/experimentos` | Protocolo baseline frente a QLoRA `r=16` y `r=32` |
| `/datos` | Estado verificable del dataset y control de fuga |
| `/metodologia` | Etapas reproducibles y contrato de entrega |

## Sistema visual

La interfaz usa una dirección de “instrumento de laboratorio de datos”: fondo técnico claro, tinta azul mineral, acentos cian/coral y panel de salida oscuro. El efecto interactivo del resultado se basa en el componente fuente [Spotlight Card de React Bits](https://reactbits.dev/components/spotlight-card), instalado dentro de `components/`; no llama un servicio externo ni participa en la generación de SQL.

Se incluyeron navegación activa, enlaces de salto, labels reales, feedback con `aria-live`, foco visible, diseño desde 360 px y soporte para `prefers-reduced-motion`.

## Archivos principales

```text
app/
├── page.tsx                 laboratorio y estados interactivos
├── experimentos/page.tsx   diseño experimental
├── datos/page.tsx           estado del dataset
├── metodologia/page.tsx    protocolo
└── globals.css              tokens, layout y responsive
components/
├── site-header.tsx          navegación accesible y estado activo
├── SpotlightCard.tsx        componente fuente de React Bits
└── SpotlightCard.css
lib/client.ts                cliente HTTP con fallback local
```

## Verificación

```powershell
pnpm typecheck
pnpm build
```

La última revisión también recorrió las cuatro rutas y el flujo generar/copiar en Chromium, tanto a `1440 × 1000` como a `390 × 844`, sin errores de consola.

## Frontera de seguridad

- La aplicación no modifica ni reemplaza `solucion.py`.
- No usa APIs externas de IA ni bases de datos administradas.
- La salida se describe como fixture o API local según corresponda.
- El adapter final sólo se habilita después de entrenarlo, evaluarlo y colocarlo en `adapter/`.
