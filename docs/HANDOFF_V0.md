# Handoff completo para v0

> **Estado:** brief histórico de la primera versión. La implementación final está en `web/`; se omitieron gráficas y CodeMirror hasta disponer de métricas reales, evitando dependencias sin una función verificable.

## Cómo usar este documento

1. En v0, importar el repositorio privado `DanielBarillasM/Proyecto-3_Grupo-1_DLYSI_Sec-30`.
2. Confirmar que el proyecto trabaje en una rama propia de v0 y que el directorio raíz de la app sea `web/`.
3. Adjuntar también [`Proyecto_3_Texto_a_SQL.pdf`](enunciado/Proyecto_3_Texto_a_SQL.pdf) al chat. Su SHA-256 es `7855743984E5E78A21AE4FFD2165F60596D7FB571C5B6CB2B312CBBA2F840875`.
4. Pegar el prompt de la sección siguiente sin omitir el bloque de restricciones.
5. Pedir primero la UI con fixtures. Integrar el backend local en una iteración posterior.

v0 permite importar repositorios existentes y usa Next.js, React, TypeScript, Tailwind CSS y shadcn/ui como stack principal. Una vez conectado GitHub, el repositorio es la fuente de verdad y v0 trabaja mediante ramas/commits. Referencias oficiales: [FAQ de v0](https://v0.app/docs/faqs), [integración con GitHub](https://v0.app/docs/github), [sistemas de diseño](https://v0.app/docs/design-systems-2), [archivos adjuntos](https://v0.app/docs/screenshots) y [apps full-stack](https://v0.app/docs/full-stack-apps).

## Prompt listo para pegar en v0

```text
Trabaja lo siguiente, además te paso el .ZIP donde esta todo el contexto. Lee primero README.md, docs/PLAN_PROYECTO.md y el PDF adjunto docs/enunciado/Proyecto_3_Texto_a_SQL.pdf. El PDF es la fuente autoritativa del curso; este prompt define únicamente cómo construir la capa web sin violarlo.

OBJETIVO
Construye dentro de /web una aplicación académica React de alta calidad para demostrar y analizar un sistema Text-to-SQL en español. Usa Next.js App Router, React, TypeScript estricto, Tailwind CSS y shadcn/ui. La aplicación debe ser estética, responsive, accesible y funcional con fixtures realistas desde la primera versión.

CONTEXTO DEL PROYECTO
- Universidad del Valle de Guatemala.
- Curso: Deep Learning y Sistemas Inteligentes, Sección 30, 2026.
- Integrantes: Wilson Alejandro Calderón Argueta, 22018; Pablo Daniel Barillas Moreno, 22193.
- Modelo: Qwen/Qwen2.5-Coder-1.5B-Instruct con dos configuraciones QLoRA.
- Motor: MySQL 8.4.10 con ONLY_FULL_GROUP_BY.
- La función evaluada vive en /solucion.py y tiene el contrato generar_sql(esquema: str, pregunta: str, ejecutar=None) -> str.
- El resultado válido es una sola consulta SELECT o WITH ... SELECT.
- La evaluación compara resultados de ejecución, no texto SQL.

RESTRICCIONES ABSOLUTAS
- No modifiques solucion.py, config.json, adapter/, datos/, notebooks/, informe/ ni presentacion/.
- No añadas OpenAI, Anthropic, AI SDK, Hugging Face Inference API ni ninguna API externa para generar SQL.
- No conectes Supabase, Neon, Upstash ni bases administradas.
- No incluyas claves, autenticación ni persistencia remota.
- No afirmes métricas reales que todavía no existan. Los datos de muestra deben estar marcados como "Datos de demostración".
- La app no es parte de la ruta de evaluación del docente. No debe convertirse en dependencia de solucion.py.
- Todo lo que necesite el navegador debe vivir en /web. Si preparas un cliente HTTP, apúntalo a una API local configurable y usa fixtures como fallback.
- No uses gradientes decorativos, glassmorphism, fondos negro/verde neón ni una cuadrícula de cards SaaS genéricas.

ARQUITECTURA DE INFORMACIÓN
1. Ruta / — Laboratorio SQL.
   - Layout de trabajo, no landing page.
   - Columna izquierda: editor de esquema MySQL con un ejemplo de 3 tablas y botón para cargar otro fixture.
   - Zona central: pregunta en español, selector visual "Base" / "QLoRA" (solo estado de demo), botón "Generar consulta" y estados vacío/cargando/error/listo.
   - Panel de resultado: SQL con syntax highlighting, botón copiar, validaciones de solo lectura, latencia y botón "Ejecutar prueba".
   - Panel inferior o lateral: traza compacta de hasta dos intentos y respuesta simulada de MySQL con columnas/filas.
   - Un aviso discreto y persistente debe decir "Interfaz de demostración — la evaluación oficial usa solucion.py".

2. Ruta /experimentos — Comparación experimental.
   - Tabla clara: Baseline, QLoRA r=16, QLoRA r=32.
   - Gráfico de curvas train/eval loss.
   - Barras de EX por dificultad y resumen de parámetros entrenables/tiempo.
   - Toggle visible entre fixtures y datos cargados desde /public/results/*.json.
   - Todos los números fixture llevan una etiqueta "Demo" y no parecen resultados finales.

3. Ruta /datos — Calidad del dataset.
   - Flujo visual: candidatos → convertidos → ejecutados → aceptados/descartados.
   - Distribución por dificultad, fuente y esquema.
   - Tabla de descartes con motivos: sintaxis, dialecto, esquema, ejecución, duplicado, traducción ambigua.
   - Indicador de fuga de esquemas; en fixtures debe mostrar 0 intersecciones.

4. Ruta /metodologia — Método y contrato.
   - Explica dataset, baseline, dos QLoRA, experimento de reparación, validación y evaluación oculta.
   - Muestra límites 5 min / 30 s / 3 llamadas como información, no como marketing.
   - Incluye equipo y atribución de responsabilidades.

DIRECCIÓN VISUAL: "CUADERNO DE LABORATORIO + BANCO DE CONSULTAS"
La interfaz debe sentirse como una herramienta académica de ingeniería de datos precisa y contemporánea. Su gesto memorable es una línea vertical de ejecución que conecta pregunta, SQL, validación y resultado; el resto debe ser sobrio.

Tokens sugeridos:
- Fondo "niebla": #F3F7F7.
- Superficie: #FFFFFF.
- Tinta: #14282B.
- Petróleo: #0C5968.
- Cobre de acción: #C7643B.
- Cian de estado: #52B6C0.
- Borde: #CCD9D9.
- Error: #A33A3A.

Tipografía:
- IBM Plex Sans para interfaz y narrativa.
- IBM Plex Mono para esquema, SQL, métricas y valores técnicos.
- Si la carga de fuente falla, usa fallbacks del sistema sin bloquear render.

Composición:
- Densidad media-alta de herramienta profesional; espacios generosos solo entre grupos funcionales.
- Alineación principalmente izquierda.
- Bordes finos y radios diferenciados: 6px en controles técnicos, 12px solo en paneles de nivel superior.
- Sombras mínimas. La jerarquía depende de estructura, tipografía y contraste.
- Nada de hero comercial ni titulares promocionales.
- Movimiento solo para cambios de estado: progreso de generación y expansión de la traza. Respeta prefers-reduced-motion.

LIBRERÍAS PERMITIDAS
- shadcn/ui para primitives accesibles: Button, Tabs, Select, Dialog, Tooltip, Table, Badge, Sheet, Skeleton y Alert.
- Lucide React para iconos; no uses emojis como iconos.
- Recharts mediante el componente Chart de shadcn/ui.
- @uiw/react-codemirror y @codemirror/lang-sql para los editores; cárgalos con next/dynamic y un skeleton para no inflar el bundle inicial.
- Sonner para confirmaciones puntuales como "SQL copiado".
- No añadas una librería de animación; CSS es suficiente.

COMPONENTES Y DATOS
- Crea componentes pequeños por dominio, no una sola page enorme.
- Define tipos compartidos: ModelVariant, QueryRequest, QueryAttempt, QueryResponse, ExperimentRun, DatasetSummary y ErrorCategory.
- Define una interfaz TextToSqlClient con dos implementaciones: FixtureTextToSqlClient y HttpTextToSqlClient.
- Usa NEXT_PUBLIC_TEXT_TO_SQL_API_URL solo si existe; si no, usa fixtures.
- Mantén los fixtures en /web/src/data o /web/public/results y marca su naturaleza de demo en la UI.
- Usa Server Components por defecto y Client Components solo para editores, charts e interacción.
- Importa paquetes directamente y carga CodeMirror de forma diferida.
- Evita effects para estado derivado; conserva estado local cerca del componente que lo usa.

ACCESIBILIDAD Y CALIDAD
- Navegación completa por teclado y focus visible.
- Labels reales para todos los campos.
- Contraste AA, mensajes de error específicos y aria-live para estados de generación.
- Diseño usable desde 360px hasta escritorio; en móvil apila el workbench sin ocultar acciones.
- Tablas con encabezados semánticos y alternativa textual para charts.
- Soporta prefers-reduced-motion.
- Incluye estados vacío, cargando, éxito, error de red, SQL rechazado y backend no configurado.
- Añade pruebas mínimas para el cambio Base/QLoRA, generación fixture, copiado y fallback sin API.
- Configura lint, typecheck y build. No dejes errores ni warnings evitables.

ENTREGA DE ESTA ITERACIÓN
1. Crea la aplicación completa en /web.
2. Incluye README propio con instalación pnpm, scripts, variables y cómo reemplazar fixtures.
3. Incluye .env.example sin secretos.
4. Incluye los fixtures tipados.
5. Ejecuta lint, typecheck, tests y build; corrige fallos.
6. Resume los archivos modificados y no toques el núcleo Python.

Antes de escribir código, propón un plan breve y verifica que todas tus decisiones respetan el PDF. Después implementa sin volver a preguntar salvo que falte acceso al repositorio.
```

## Contrato futuro del backend local

v0 no debe construir este backend en la primera iteración, pero puede preparar el cliente para:

```http
POST /api/generate
Content-Type: application/json

{
  "schema": "CREATE TABLE ...",
  "question": "¿Qué clientes compraron más de tres veces?",
  "use_adapter": true,
  "execute": false
}
```

```json
{
  "sql": "SELECT ...",
  "latency_ms": 1840,
  "read_only": true,
  "attempts": [
    {"index": 1, "sql": "SELECT ...", "status": "accepted", "error": null}
  ],
  "result": null
}
```

La implementación real vivirá en `backend/`, importará `solucion.py` y se ejecutará localmente o en infraestructura propia con GPU. El frontend no debe confundir una preview de Vercel con inferencia real.

## Criterios de aceptación del handoff

- La app queda íntegramente bajo `web/`.
- No aparece ninguna integración de IA o base de datos externa.
- Los fixtures están etiquetados como demostración.
- La dirección visual coincide con los tokens y no cae en una plantilla SaaS genérica.
- Las cuatro rutas funcionan y comparten navegación.
- CodeMirror se carga dinámicamente.
- Hay separación entre cliente fixture y cliente HTTP.
- Mobile, teclado, foco, reduced motion y errores son verificables.
- `pnpm lint`, typecheck, tests y build pasan.
- El cambio llega por una rama/PR separada y no modifica los entregables Python.

## Por qué estas librerías no contradicen el PDF

El PDF prohíbe modelos distintos y APIs externas **al generar la consulta**. shadcn/ui, Tailwind, Lucide, Recharts, CodeMirror y Sonner son dependencias de presentación ejecutadas dentro de la app React; no generan SQL, no sustituyen el modelo y no participan en `solucion.py`. La separación de carpetas y dependencias conserva esa frontera.
