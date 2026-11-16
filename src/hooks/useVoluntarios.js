import { useCallback, useEffect, useState } from 'react'
import { voluntariosService } from '../services/voluntariosService'

// Hook personalizado: guarda a lista de voluntários e expõe as operações de CRUD.
// Os componentes só chamam estas funções, sem saber como a API funciona.
export function useVoluntarios() {
  const [voluntarios, setVoluntarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const lista = await voluntariosService.listar()
      setVoluntarios(lista.sort((a, b) => a.nome.localeCompare(b.nome)))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [])

  // Busca os dados assim que a tela abre
  useEffect(() => {
    carregar()
  }, [carregar])

  async function criar(dados) {
    const novo = await voluntariosService.criar({ ...dados, ativo: true })
    setVoluntarios((atual) => [...atual, novo].sort((a, b) => a.nome.localeCompare(b.nome)))
    return novo
  }

  async function atualizar(id, dados) {
    const atualizado = await voluntariosService.atualizar(id, dados)
    setVoluntarios((atual) => atual.map((v) => (v.id === id ? atualizado : v)))
    return atualizado
  }

  async function excluir(id) {
    await voluntariosService.excluir(id)
    setVoluntarios((atual) => atual.filter((v) => v.id !== id))
  }

  function alternarAtivo(voluntario) {
    return atualizar(voluntario.id, { ...voluntario, ativo: !voluntario.ativo })
  }

  return { voluntarios, carregando, erro, recarregar: carregar, criar, atualizar, excluir, alternarAtivo }
}
