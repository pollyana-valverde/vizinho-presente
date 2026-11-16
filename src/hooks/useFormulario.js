import { useState } from 'react'

// Hook personalizado reutilizado pelos formulários de alerta e de voluntário.
// Cuida dos valores digitados, das mensagens de erro e do envio.
export function useFormulario(valoresIniciais, validar) {
  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  function alterar(campo, valor) {
    setValores((atual) => ({ ...atual, [campo]: valor }))
    // Some com o erro do campo assim que a pessoa corrige
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  function reiniciar(novosValores = valoresIniciais) {
    setValores(novosValores)
    setErros({})
  }

  // Valida antes de enviar. Retorna true quando deu tudo certo.
  async function enviar(aoEnviar) {
    const encontrados = validar ? validar(valores) : {}
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return false

    setEnviando(true)
    try {
      await aoEnviar(valores)
      return true
    } finally {
      setEnviando(false)
    }
  }

  return { valores, erros, enviando, alterar, reiniciar, enviar }
}
