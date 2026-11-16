import { useEffect, useState } from 'react'

// Hook personalizado: devolve a hora atual e a atualiza sozinho.
// Usado para mostrar há quanto tempo um alerta está esperando, sem recarregar a página.
export function useRelogio(intervaloMs = 60000) {
  const [agora, setAgora] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), intervaloMs)
    return () => clearInterval(id)
  }, [intervaloMs])

  return agora
}
