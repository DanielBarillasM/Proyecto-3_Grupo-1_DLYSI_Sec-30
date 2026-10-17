'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Database, FlaskConical, Gauge, Info, Menu, Play, RotateCcw, Search, Table2, Terminal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const schema = `CREATE TABLE customers (\n  customer_id INT PRIMARY KEY,\n  name VARCHAR(120),\n  city VARCHAR(80),\n  created_at DATE\n);\n\nCREATE TABLE orders (\n  order_id INT PRIMARY KEY,\n  customer_id INT,\n  total DECIMAL(10,2),\n  status VARCHAR(20),\n  order_date DATE\n);`

const sql = `SELECT c.city,\n       COUNT(o.order_id) AS total_orders,\n       ROUND(SUM(o.total), 2) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.customer_id\nWHERE o.status = 'completed'\n  AND o.order_date >= '2024-01-01'\nGROUP BY c.city\nORDER BY revenue DESC;`

const rows = [
  ['San Juan', '184', '$42,890.50'],
  ['Bayamón', '132', '$31,204.00'],
  ['Ponce', '97', '$20,518.25'],
  ['Mayagüez', '61', '$12,776.80'],
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{children}</div>
}

function CodeBlock({ children, dark = false }: { children: string; dark?: boolean }) {
  return <pre className={`overflow-auto rounded-lg border p-4 font-mono text-[12px] leading-6 ${dark ? 'border-slate-700 bg-[#111827] text-slate-200' : 'border-white/[0.1] bg-[#080a0f] text-slate-700'}`}><code>{children}</code></pre>
}

function LabHome() {
  const [question, setQuestion] = useState('¿Qué ciudad generó más ingresos por pedidos completados en 2024?')
  const [variant, setVariant] = useState<'Base' | 'QLoRA'>('Base')
  const [generated, setGenerated] = useState(true)
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  const run = () => {
    if (!question.trim()) return setNotice('Escribe una pregunta antes de ejecutar.')
    setGenerated(false)
    setNotice('')
    window.setTimeout(() => setGenerated(true), 500)
  }

  return <div className="min-h-screen overflow-hidden bg-[#0b0d12] text-slate-100 selection:bg-[#f6c453] selection:text-[#0b0d12]">
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0b0d12]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
        <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl border border-[#f6c453]/30 bg-[#f6c453]/10 text-[#f6c453] shadow-[0_0_24px_rgba(246,196,83,0.12)]"><Database /></div><div><div className="font-serif text-lg font-semibold tracking-tight text-white">Text-to-SQL</div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Laboratorio de investigación</div></div></div>
        <button className="rounded-md p-2 lg:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Abrir navegación"><Menu /></button>
        <nav className={`${mobileNav ? 'absolute left-0 right-0 top-[73px] z-20 flex border-b border-[#d8d2c7] bg-[#fbfaf7] p-4' : 'hidden'} flex-col gap-4 text-sm lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`}>
          <a className="font-semibold text-white" href="#laboratorio">Laboratorio</a><a className="text-slate-500 transition hover:text-white" href="#experimentos">Experimentos</a><a className="text-slate-500 transition hover:text-white" href="#datos">Datos</a><a className="text-slate-500 transition hover:text-white" href="#metodologia">Metodología</a>
        </nav>
        <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex"><span className="size-2 rounded-full bg-emerald-500" /> Demo local <span className="mx-1 text-[#d8d2c7]">/</span> v0.1</div>
      </div>
    </header>

    <main id="laboratorio" className="relative mx-auto max-w-[1440px] px-5 py-10 lg:px-10 lg:py-16"><div className="pointer-events-none absolute -top-32 left-1/3 size-[520px] rounded-full bg-[#f6c453]/[0.07] blur-3xl" />
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a06b13]"><FlaskConical /> Entorno de evaluación</div><h1 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight text-white md:text-6xl">Convierte preguntas en <span className="text-[#f6c453]">consultas SQL</span> verificables.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Explora cómo un modelo de lenguaje traduce instrucciones en lenguaje natural a consultas sobre un esquema relacional.</p></div><div className="rounded-lg border border-[#dfc98b] bg-[#fff8df] px-4 py-3 text-xs leading-5 text-[#755719]"><div className="flex items-center gap-2 font-semibold"><Info /> Modo demostración</div><div className="mt-1 text-[#755719]">Las respuestas se generan con fixtures locales.</div></div></div>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm shadow-[0_8px_30px_rgba(23,32,51,0.04)]"><SectionLabel><Table2 /> 01 / Esquema de base de datos</SectionLabel><CodeBlock dark>{schema}</CodeBlock><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Dialect: <strong className="text-slate-200">MySQL 8.4.10</strong></span><button className="flex items-center gap-1 font-semibold text-[#a06b13]">Ver esquema completo <ArrowRight /></button></div></div>
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm shadow-[0_8px_30px_rgba(23,32,51,0.04)]"><SectionLabel><Search /> 02 / Pregunta en lenguaje natural</SectionLabel><label htmlFor="question" className="sr-only">Pregunta</label><textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} className="min-h-[145px] w-full resize-none rounded-xl border border-white/[0.1] bg-[#080a0f] p-4 text-base leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#f6c453]/60 focus:ring-2 focus:ring-[#f6c453]/20" placeholder="Escribe una pregunta sobre tus datos..." />{notice && <p className="mt-2 text-sm text-red-700">{notice}</p>}<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-slate-500"><span>Variante:</span><div className="flex rounded-md border border-white/[0.1] bg-[#080a0f] p-1">{(['Base', 'QLoRA'] as const).map((item) => <button key={item} onClick={() => setVariant(item)} className={`rounded px-3 py-1.5 font-semibold transition ${variant === item ? 'bg-[#172033] text-white' : 'text-slate-500'}`}>{item}</button>)}</div></div><Button onClick={run} className="rounded-xl bg-[#f6c453] text-[#101218] shadow-[0_0_24px_rgba(246,196,83,0.18)] hover:bg-[#ffd875]"><Play data-icon="inline-start" /> Ejecutar consulta</Button></div></div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm"><div className="mb-4 flex items-center justify-between"><SectionLabel><Terminal /> 03 / Consulta generada</SectionLabel><span className="rounded-full bg-[#e6f4eb] px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{variant} · 98.2%</span></div>{generated ? <CodeBlock dark>{sql}</CodeBlock> : <div className="flex h-[270px] items-center justify-center rounded-lg border border-slate-700 bg-[#111827] text-sm text-slate-400">Generando consulta...</div>}<div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Check className="text-emerald-600" /> Validación sintáctica completada <span className="text-[#d8d2c7]">·</span> 1.2 s</div></div>
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm"><div className="mb-4 flex items-center justify-between"><SectionLabel><Gauge /> 04 / Resultado simulado</SectionLabel><span className="text-xs text-slate-500">4 filas · 3 columnas</span></div><div className="overflow-hidden rounded-lg border border-[#d8d2c7] bg-[#fffdf9]"><table className="w-full text-left text-sm text-slate-800"><thead className="bg-[#f0ede6] text-xs uppercase tracking-wider text-slate-700"><tr><th className="px-4 py-3 font-semibold">city</th><th className="px-4 py-3 font-semibold">total_orders</th><th className="px-4 py-3 font-semibold">revenue</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-[#e7e2d8]"><td className="px-4 py-3 font-medium">{row[0]}</td><td className="px-4 py-3 text-slate-700">{row[1]}</td><td className="px-4 py-3 font-mono text-xs text-slate-700">{row[2]}</td></tr>)}</tbody></table></div><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Ordenado por revenue ↓</span><button className="flex items-center gap-1 font-semibold text-[#a06b13]"><RotateCcw /> Reiniciar</button></div></div>
      </section>

      <section className="mt-5 rounded-xl border border-[#d8d2c7] bg-[#172033] p-5 text-slate-200"><div className="mb-4 flex items-center justify-between"><SectionLabel><span className="text-[#f6c453]">▸</span> Traza de generación</SectionLabel><span className="font-mono text-[11px] text-slate-400">run_id: demo-2024-001</span></div><div className="grid gap-3 text-xs md:grid-cols-3"><div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"><div className="mb-1 text-slate-400">01 · Schema linking</div><div className="font-mono text-[#f6c453]">customers.city → SELECT</div></div><div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"><div className="mb-1 text-slate-400">02 · Intent parsing</div><div className="font-mono text-[#f6c453]">aggregation = SUM(total)</div></div><div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"><div className="mb-1 text-slate-400">03 · SQL validation</div><div className="font-mono text-emerald-300">✓ read-only · safe</div></div></div></section>

      <section id="experimentos" className="mt-16 border-t border-white/[0.12] pt-8"><div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end"><div><div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f6c453]">Experimentos</div><h2 className="font-serif text-3xl tracking-tight text-white">Comparar antes de optimizar.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Resultados resumidos del conjunto de evaluación y las variantes del modelo.</p></div><div className="grid grid-cols-3 gap-3">{[['Exact match','68.4%'],['Execution acc.','74.1%'],['Ejemplos','1,240']].map(([label, value]) => <div key={label} className="rounded-lg border border-white/[0.12] bg-white/[0.045] p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div><div className="mt-2 font-serif text-2xl text-white">{value}</div></div>)}</div></div></section>
      <footer id="metodologia" className="mt-16 flex flex-col gap-3 border-t border-white/[0.12] pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between"><span>Proyecto 3 · DLYSI · Sección 30 · Grupo 1</span><span>Metodología: Spider-style evaluation · MySQL 8.4.10</span><span className="text-[#f6c453]">Interfaz de demostración — la evaluación oficial usa solucion.py</span></footer>
    </main>
  </div>
}

export default function Page() { return <LabHome /> }
