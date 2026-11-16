import { useCallback, useMemo, useState } from 'react'
import { AvisoContext } from '../hooks/useAviso'

const ESTILOS = {
  sucesso: 'border-normal bg-white text-tinta',
  erro: 'border-ajuda bg-white text-tinta',
}

// Mostra mensagens curtas no canto da tela e as remove sozinho depois de alguns segundos
export default function ProvedorAvisos({ children }) {
  const [avisos, setAvisos] = useState([])

  const remover = useCallback((id) => {
    setAvisos((atual) => atual.filter((a) => a.id !== id))
  }, [])

  const mostrar = useCallback(
    (texto, tipo = 'sucesso') => {
      const id = Date.now() + Math.random()
      setAvisos((atual) => [...atual, { id, texto, tipo }])
      setTimeout(() => remover(id), 4500)
    },
    [remover],
  )

  const valor = useMemo(
    () => ({ sucesso: (t) => mostrar(t, 'sucesso'), erro: (t) => mostrar(t, 'erro') }),
    [mostrar],
  )

  return (
    <AvisoContext.Provider value={valor}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`flex items-start justify-between gap-3 rounded-xl border-l-8 p-4 shadow-lg ${ESTILOS[aviso.tipo]}`}>
            <p className="font-bold">{aviso.texto}</p>
            <button type="button" onClick={() => remover(aviso.id)} className="text-suave hover:text-tinta" aria-label="Fechar aviso">
              Fechar
            </button>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  )
}
