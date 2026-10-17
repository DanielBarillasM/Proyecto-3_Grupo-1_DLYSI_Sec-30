import Link from 'next/link'
import { Database } from 'lucide-react'
const links = [['/', 'Laboratorio'], ['/experimentos', 'Experimentos'], ['/datos', 'Datos'], ['/metodologia', 'Metodología']]
export function SiteHeader() { return <header className="site-header"><div className="nav-shell"><Link className="brand" href="/"><span><Database aria-hidden="true" /></span><strong>Text-to-SQL</strong></Link><nav aria-label="Navegación principal">{links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav><span className="project-mark">UVG · Grupo 1</span></div></header> }
