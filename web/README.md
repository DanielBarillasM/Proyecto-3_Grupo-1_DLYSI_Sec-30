# Interfaz React

Aplicación Next.js 16 para demostrar y auditar el contrato Text-to-SQL. Funciona sin backend mediante un fixture honesto; para usar el runtime local, copia `.env.example` a `.env.local` e inicia la API FastAPI desde la raíz.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

En otra terminal:

```powershell
.\.venv\Scripts\uvicorn.exe backend.main:app --reload
```

Rutas: `/` laboratorio, `/experimentos`, `/datos` y `/metodologia`. El modo fixture nunca presenta métricas de modelo como reales.
