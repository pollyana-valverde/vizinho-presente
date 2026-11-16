import { useEffect, useRef } from 'react'

// Janela sobreposta usada para confirmar ações e registrar visitas.
// Fecha com a tecla Esc ou clicando fora, e leva o foco para dentro dela.
export default function JanelaModal({ aberta, titulo, aoFechar, children }) {
  const caixaRef = useRef(null)

  useEffect(() => {
    if (!aberta) return undefined
    caixaRef.current?.focus()
    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoApertarTecla)
    return () => document.removeEventListener('keydown', aoApertarTecla)
  }, [aberta, aoFechar])

  if (!aberta) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/50 p-4 sm:items-center" onClick={aoFechar}>
      <div
        ref={caixaRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-janela"
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="titulo-janela" className="text-xl font-bold">
          {titulo}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
