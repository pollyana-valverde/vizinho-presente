import { NIVEIS } from '../utils/regras'

// Etiqueta colorida com o nível de risco. Sempre mostra texto, não depende só da cor.
export default function SeloNivel({ nivel }) {
  const info = NIVEIS[nivel] || NIVEIS.normal
  return (
    <span className={`inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-bold ${info.classes}`}>
      <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
      {info.rotulo}
    </span>
  )
}
