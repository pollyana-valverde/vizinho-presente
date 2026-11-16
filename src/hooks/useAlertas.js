import { useCallback, useEffect, useMemo, useState } from 'react'
import { alertasService } from '../services/alertasService'
import { classificarNivel, ordenarPorPrioridade, podeAssumir, podeEncerrar } from '../utils/regras'

// Intervalo da atualização automática do painel (o sensor pode abrir alertas a qualquer momento)
const INTERVALO_ATUALIZACAO_MS = 30000

// Hook personalizado: concentra a lógica dos alertas (criar, assumir, encerrar, excluir)
export function useAlertas({ atualizarSozinho = false } = {}) {
  const [alertas, setAlertas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // silencioso = true atualiza a lista sem mostrar o indicador de carregamento
  const carregar = useCallback(async ({ silencioso = false } = {}) => {
    if (!silencioso) {
      setCarregando(true)
      setErro(null)
    }
    try {
      setAlertas(await alertasService.listar())
      setErro(null)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [])

  // Primeira carga ao abrir a tela. "ativo" evita atualizar o estado depois que a página foi fechada.
  useEffect(() => {
    let ativo = true
    alertasService
      .listar()
      .then((lista) => ativo && setAlertas(lista))
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  // Atualização automática, usada no painel de alertas
  useEffect(() => {
    if (!atualizarSozinho) return undefined
    const id = setInterval(() => carregar({ silencioso: true }), INTERVALO_ATUALIZACAO_MS)
    return () => clearInterval(id)
  }, [atualizarSozinho, carregar])

  // Lista já ordenada por prioridade, recalculada só quando os alertas mudam
  const ordenados = useMemo(() => ordenarPorPrioridade(alertas), [alertas])

  function substituir(atualizado) {
    setAlertas((atual) => atual.map((a) => (a.id === atualizado.id ? atualizado : a)))
    return atualizado
  }

  // Registra uma leitura do sensor como alerta. O nível é calculado pela regra de negócio.
  async function registrar({ idoso, endereco, temperatura, semEnergia, respondeu }) {
    const temp = Number(temperatura)
    const novo = await alertasService.criar({
      idoso: idoso.trim(),
      endereco: endereco.trim(),
      temperatura: temp,
      semEnergia,
      respondeu,
      nivel: classificarNivel({ semEnergia, temperatura: temp, respondeu }),
      status: 'aberto',
      voluntarioId: '',
      voluntarioNome: '',
      relato: '',
      abertoEm: new Date().toISOString(),
      atendidoEm: '',
    })
    setAlertas((atual) => [...atual, novo])
    return novo
  }

  async function assumir(alerta, voluntario) {
    if (!podeAssumir(alerta, voluntario)) {
      throw new Error('Este alerta já foi assumido ou o voluntário está inativo.')
    }
    return substituir(
      await alertasService.atualizar(alerta.id, {
        ...alerta,
        status: 'em_atendimento',
        voluntarioId: voluntario.id,
        voluntarioNome: voluntario.nome,
      }),
    )
  }

  async function encerrar(alerta, relato) {
    if (!podeEncerrar(alerta, relato)) {
      throw new Error('Descreva a visita com pelo menos 10 caracteres para encerrar o alerta.')
    }
    return substituir(
      await alertasService.atualizar(alerta.id, {
        ...alerta,
        status: 'atendido',
        relato: relato.trim(),
        atendidoEm: new Date().toISOString(),
      }),
    )
  }

  // Devolve o alerta para a fila caso o voluntário não consiga ir
  async function liberar(alerta) {
    return substituir(
      await alertasService.atualizar(alerta.id, {
        ...alerta,
        status: 'aberto',
        voluntarioId: '',
        voluntarioNome: '',
      }),
    )
  }

  async function excluir(id) {
    await alertasService.excluir(id)
    setAlertas((atual) => atual.filter((a) => a.id !== id))
  }

  return { alertas: ordenados, carregando, erro, recarregar: carregar, registrar, assumir, encerrar, liberar, excluir }
}
