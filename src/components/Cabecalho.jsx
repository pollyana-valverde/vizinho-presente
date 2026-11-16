import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/alertas', rotulo: 'Alertas' },
  { para: '/voluntarios', rotulo: 'Voluntários' },
  { para: '/historico', rotulo: 'Histórico' },
  { para: '/sobre', rotulo: 'Sobre' },
]

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-10 w-10" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#C2410C" />
      <path d="M16 7 6 15h3v10h5v-6h4v6h5V15h3z" fill="#FBF7F2" />
    </svg>
  )
}

// Cabeçalho com navegação. No celular, o menu abre por um botão.
export default function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false)

  const classeLink = ({ isActive }) =>
    `block rounded-xl px-4 py-2 font-bold ${isActive ? 'bg-destaque text-white' : 'text-tinta hover:bg-destaque/10'}`

  return (
    <header className="sticky top-0 z-40 border-b border-linha bg-papel/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuAberto(false)}>
          <Logo />
          <span className="text-xl font-bold">Vizinho Presente</span>
        </Link>

        <button
          type="button"
          className="rounded-xl border-2 border-linha px-4 py-2 font-bold md:hidden"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? 'Fechar' : 'Menu'}
        </button>

        <nav id="menu-principal" aria-label="Principal" className="hidden md:block">
          <ul className="flex gap-1">
            {LINKS.map((link) => (
              <li key={link.para}>
                <NavLink to={link.para} end={link.para === '/'} className={classeLink}>
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {menuAberto && (
        <nav aria-label="Principal no celular" className="border-t border-linha px-4 pb-4 md:hidden">
          <ul className="mt-2 flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.para}>
                <NavLink to={link.para} end={link.para === '/'} className={classeLink} onClick={() => setMenuAberto(false)}>
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
