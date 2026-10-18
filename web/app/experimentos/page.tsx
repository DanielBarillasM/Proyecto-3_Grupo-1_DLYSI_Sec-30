import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = { title: 'Experimentos' }

export default function Experimentos() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="shell">
        <header className="page-intro">
          <p className="eyebrow">Diseño experimental</p>
          <h1>Dos rangos LoRA.<br /><span>Una sola variable.</span></h1>
          <p className="lede">El baseline y ambas configuraciones usan el mismo prompt, semilla y conjunto de validación. La selección se hará por exactitud de ejecución ponderada, no por <em>loss</em>.</p>
        </header>
        <section className="content-grid" aria-label="Configuraciones experimentales">
          <article className="content-card"><h2>Baseline</h2><p>Qwen2.5-Coder-1.5B-Instruct sin adapter.</p><strong>EX pendiente</strong></article>
          <article className="content-card"><h2>QLoRA r=16</h2><p>Configuración A; alpha 32 y dropout 0.05.</p><strong>EX pendiente</strong></article>
          <article className="content-card"><h2>QLoRA r=32</h2><p>Configuración B; únicamente cambia el rango.</p><strong>EX pendiente</strong></article>
          <article className="content-card wide"><h2>Criterio de selección</h2><p>14 preguntas fáciles × 1, 14 medias × 2 y 12 difíciles × 3. Después se compara inferencia directa contra una única reparación guiada por el error de MySQL.</p></article>
          <article className="content-card"><h2>Espacio reservado</h2><p>Las curvas, EX por dificultad y análisis de errores aparecerán aquí después de las corridas en T4.</p></article>
        </section>
      </main>
    </>
  )
}
