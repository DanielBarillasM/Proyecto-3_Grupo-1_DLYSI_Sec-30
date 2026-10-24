'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Clipboard,
  Code2,
  Database,
  Play,
  RotateCcw,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import SpotlightCard from '@/components/SpotlightCard'
import { SiteHeader } from '@/components/site-header'
import { generateSql, type GenerationResult } from '@/lib/client'

const initialSchema = `CREATE TABLE clientes (
  id INT PRIMARY KEY,
  nombre VARCHAR(120),
  ciudad VARCHAR(80)
);

CREATE TABLE pedidos (
  id INT PRIMARY KEY,
  cliente_id INT,
  total DECIMAL(10,2),
  estado VARCHAR(20),
  fecha DATE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);`

const initialQuestion = '¿Qué cliente tuvo el mayor total de pedidos completados durante 2024?'

export default function Page() {
  const [schema, setSchema] = useState(initialSchema)
  const [question, setQuestion] = useState(initialQuestion)
  const [variant, setVariant] = useState<'baseline' | 'adapter'>('baseline')
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('Listo para generar.')

  async function run() {
    if (!schema.trim() || !question.trim()) {
      setMessage('Completa el esquema y la pregunta.')
      return
    }

    setBusy(true)
    setMessage('Generando consulta…')
    try {
      const next = await generateSql({
        esquema: schema,
        pregunta: question,
        usar_adapter: variant === 'adapter',
      })
      setResult(next)
      setMessage(
        next.source === 'fixture'
          ? 'Fixture local generado. Conecta la API para usar el modelo.'
          : 'Consulta generada por la API local.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible generar la consulta.')
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    setSchema(initialSchema)
    setQuestion(initialQuestion)
    setVariant('baseline')
    setResult(null)
    setMessage('Formulario restablecido.')
  }

  async function copySql() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.sql)
      setMessage('SQL copiado al portapapeles.')
    } catch {
      setMessage('No se pudo copiar. Selecciona el SQL manualmente.')
    }
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="context-line"><span aria-hidden="true" /> Laboratorio reproducible · MySQL 8.4</p>
            <h1 id="hero-title">Pregunta en español.<br /><span>SQL verificable.</span></h1>
            <p className="lede">Una mesa de trabajo para inspeccionar el esquema, comparar el baseline con QLoRA y auditar cada consulta antes de ejecutarla.</p>
            <div className="hero-actions">
              <a className="primary-link" href="#laboratorio">Abrir laboratorio <ArrowRight aria-hidden="true" /></a>
              <Link className="text-link" href="/metodologia">Revisar metodología</Link>
            </div>
          </div>

          <aside className="pipeline" aria-label="Flujo del sistema de Texto a SQL">
            <div className="pipeline-bar"><span>pipeline_03</span><span className="run-state"><i aria-hidden="true" /> READY</span></div>
            <div className="pipeline-inputs">
              <div><Database aria-hidden="true" /><span>Schema</span><strong>2 tablas</strong></div>
              <div><Workflow aria-hidden="true" /><span>Pregunta</span><strong>ES natural</strong></div>
            </div>
            <div className="pipeline-route" aria-hidden="true"><span /><i>modelo</i><span /></div>
            <div className="pipeline-code">
              <p><span>SELECT</span> c.nombre, <span>SUM</span>(p.total)</p>
              <p><span>FROM</span> clientes c <span>JOIN</span> pedidos p</p>
              <p><span>ORDER BY</span> 2 <span>DESC LIMIT</span> 1;</p>
            </div>
            <div className="pipeline-foot"><ShieldCheck aria-hidden="true" /> Lectura segura · salida inspeccionable</div>
          </aside>
        </section>

        <section id="laboratorio" className="workspace" aria-labelledby="lab-title">
          <header className="workspace-header">
            <div>
              <p className="section-kicker">Consola interactiva</p>
              <h2 id="lab-title">Banco de pruebas</h2>
            </div>
            <span className="system-status"><i aria-hidden="true" /> Datos y API listos · entrenamiento pendiente</span>
          </header>

          <div className="workspace-grid">
            <section className="input-panel" aria-labelledby="input-title">
              <div className="panel-heading"><span>01</span><div><p>Entrada</p><h3 id="input-title">Define el contexto</h3></div></div>

              <label htmlFor="schema">Esquema MySQL <small>DDL de referencia</small></label>
              <textarea id="schema" name="schema" spellCheck={false} value={schema} onChange={(event) => setSchema(event.target.value)} />

              <label htmlFor="question">Pregunta <small>Lenguaje natural</small></label>
              <textarea id="question" name="question" className="question" value={question} onChange={(event) => setQuestion(event.target.value)} />

              <fieldset>
                <legend>Variante del modelo</legend>
                <div className="segment-control">
                  <label className={variant === 'baseline' ? 'selected' : ''}>
                    <input type="radio" name="variant" checked={variant === 'baseline'} onChange={() => setVariant('baseline')} />
                    <span>Baseline</span>
                  </label>
                  <label className={variant === 'adapter' ? 'selected' : ''}>
                    <input type="radio" name="variant" checked={variant === 'adapter'} onChange={() => setVariant('adapter')} />
                    <span>Adapter QLoRA</span>
                  </label>
                </div>
              </fieldset>

              <div className="actions">
                <button className="primary" type="button" onClick={run} disabled={busy}>
                  <Play aria-hidden="true" /> {busy ? 'Generando…' : 'Generar SQL'}
                </button>
                <button className="secondary" type="button" onClick={reset}><RotateCcw aria-hidden="true" /> Reiniciar</button>
              </div>
            </section>

            <SpotlightCard
              className="result-card"
              theme="dark"
              spotlightColor="#78dce8"
              intensity={0.2}
              spotlightSize={380}
              softness={0.8}
              borderGlow={0.75}
              smoothing={0.2}
              flare={false}
              grain={0.025}
              aria-labelledby="output-title"
            >
              <div className="panel-heading output-heading"><span>02</span><div><p>Resultado</p><h3 id="output-title">SQL inspeccionable</h3></div></div>
              <div className="output-meta"><span className="safe-pill"><ShieldCheck aria-hidden="true" /> Solo lectura</span><span>MySQL 8.4.10</span></div>
              <pre className="sql-output" aria-label="Consulta SQL generada"><code>{result?.sql ?? '-- Ejecuta una consulta para ver el resultado.'}</code></pre>
              <button className="copy" type="button" disabled={!result} onClick={copySql}><Clipboard aria-hidden="true" /> Copiar SQL</button>

              <div className="trace">
                <h4>Traza de ejecución</h4>
                <dl>
                  <div><dt>Fuente</dt><dd>{result?.source ?? '—'}</dd></div>
                  <div><dt>Adapter</dt><dd>{result?.adapter_loaded ? 'cargado' : 'no cargado'}</dd></div>
                  <div><dt>Intentos</dt><dd className="numeric">{result?.attempts ?? 0}</dd></div>
                </dl>
              </div>
              <p className="live" aria-live="polite"><Check aria-hidden="true" /> {message}</p>
            </SpotlightCard>
          </div>
        </section>

        <section className="facts" aria-labelledby="facts-title">
          <div className="facts-intro"><p className="section-kicker">Base experimental</p><h2 id="facts-title">Evidencia antes que promesas.</h2><p>Los números publicados corresponden a artefactos ya generados. La métrica final seguirá marcada como pendiente hasta entrenar.</p></div>
          <dl>
            <div><dt>Pares aceptados</dt><dd>2,592</dd><span>Entrenamiento</span></div>
            <div><dt>Esquemas</dt><dd>12</dd><span>Sin fuga</span></div>
            <div><dt>Validación</dt><dd>40</dd><span>Casos congelados</span></div>
            <div><dt>EX del modelo</dt><dd className="pending">Pendiente</dd><span>Después del entrenamiento local</span></div>
          </dl>
        </section>

        <section className="principle-band" aria-label="Principios del proyecto">
          <Code2 aria-hidden="true" />
          <p><strong>Un contrato simple:</strong> una pregunta, una sentencia <code>SELECT</code> o <code>WITH</code>, y evidencia suficiente para repetir el resultado.</p>
          <Link href="/datos">Explorar los datos <ArrowRight aria-hidden="true" /></Link>
        </section>
      </main>
    </>
  )
}
