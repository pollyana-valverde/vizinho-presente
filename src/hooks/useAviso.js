import { createContext, useContext } from 'react'

// Contexto das mensagens de retorno ("Voluntário cadastrado", "Erro ao salvar"...)
export const AvisoContext = createContext(null)

// Hook personalizado: qualquer componente pode mostrar um aviso sem repassar props
export function useAviso() {
  const contexto = useContext(AvisoContext)
  if (!contexto) {
    throw new Error('useAviso precisa estar dentro de <ProvedorAvisos>.')
  }
  return contexto
}
