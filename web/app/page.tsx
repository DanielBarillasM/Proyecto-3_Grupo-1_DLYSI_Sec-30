'use client'

import { useState } from 'react'
import { Check, Clipboard, Database, Play, RotateCcw, ShieldCheck } from 'lucide-react'
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
    if (!schema.trim() || !question.trim()) return setMessage('Completa el esquema y la pregunta.')
    setBusy(true); setMessage('Generando consulta…')
    try {
      const next = await generateSql({ esquema: schema, pregunta: question, usar_adapter: variant === 'adapter' })
      setResult(next)
      setMessage(next.source === 'fixture' ? 'Fixture local generado. Conecta la API para usar el modelo.' : 'Consulta generada por la API local.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No fue posible generar la consulta.') }
    finally { setBusy(false) }
  }

  function reset() {
    setSchema(initialSchema); setQuestion(initialQuestion); setVariant('baseline'); setResult(null); setMessage('Formulario restablecido.')
  }

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <SiteHeader />
    <main id="contenido" className="shell">
      <section className="hero">
        <div><p className="eyebrow"><Database aria-hidden="true" /> Banco de pruebas reproducible</p><h1>Del español a una consulta SQL que sí se puede verificar.</h1><p className="lede">Explora el contrato real del proyecto: esquema, pregunta y una única consulta de lectura compatible con MySQL 8.4.10.</p></div>
        <aside className="status-note"><strong>Estado del sistema</strong><span>Datos y API listos · entrenamiento pendiente</span></aside>
      </section>

      <section className="workspace" aria-label="Laboratorio Text-to-SQL">
        <div className="panel input-panel">
          <div className="panel-heading"><span>01</span><h2>Contexto de entrada</h2></div>
          <label htmlFor="schema">Esquema MySQL</label>
          <textarea id="schema" name="schema" spellCheck={false} value={schema} onChange={(event) => setSchema(event.target.value)} />
          <label htmlFor="question">Pregunta en lenguaje natural</label>
          <textarea id="question" name="question" className="question" value={question} onChange={(event) => setQuestion(event.target.value)} />
          <fieldset><legend>Variante</legend><label><input type="radio" name="variant" checked={variant === 'baseline'} onChange={() => setVariant('baseline')} /> Baseline</label><label><input type="radio" name="variant" checked={variant === 'adapter'} onChange={() => setVariant('adapter')} /> Adapter QLoRA</label></fieldset>
          <div className="actions"><button className="primary" type="button" onClick={run} disabled={busy}><Play aria-hidden="true" /> {busy ? 'Generando…' : 'Generar SQL'}</button><button className="secondary" type="button" onClick={reset}><RotateCcw aria-hidden="true" /> Reiniciar</button></div>
        </div>

        <div className="panel output-panel">
          <div className="panel-heading"><span>02</span><h2>Salida inspeccionable</h2></div>
          <div className="output-meta"><span className="pill"><ShieldCheck aria-hidden="true" /> Solo lectura</span><span>MySQL 8.4.10</span></div>
          <pre className="sql-output" aria-label="Consulta SQL generada"><code>{result?.sql ?? '-- Ejecuta una consulta para ver el resultado.'}</code></pre>
          <button className="copy" type="button" disabled={!result} onClick={() => result && navigator.clipboard.writeText(result.sql)} aria-label="Copiar consulta SQL"><Clipboard aria-hidden="true" /> Copiar SQL</button>
          <div className="trace"><h3>Traza de ejecución</h3><dl><div><dt>Fuente</dt><dd>{result?.source ?? '—'}</dd></div><div><dt>Adapter</dt><dd>{result?.adapter_loaded ? 'cargado' : 'no cargado'}</dd></div><div><dt>Intentos</dt><dd className="numeric">{result?.attempts ?? 0}</dd></div></dl></div>
          <p className="live" aria-live="polite"><Check aria-hidden="true" /> {message}</p>
        </div>
      </section>

      <section className="facts" aria-labelledby="facts-title"><div><p className="eyebrow">Base experimental</p><h2 id="facts-title">Lo que ya está medido.</h2></div><dl><div><dt>Pares aceptados</dt><dd>2,592</dd></div><div><dt>Esquemas de entrenamiento</dt><dd>12</dd></div><div><dt>Casos de validación</dt><dd>40</dd></div><div><dt>EX del modelo</dt><dd className="pending">Pendiente</dd></div></dl></section>
    </main>
  </>
}
