import { api } from './api'

// Serviço de voluntários: traduz as ações da tela em chamadas à API
const RECURSO = 'voluntarios'

export const voluntariosService = {
  listar: () => api.listar(RECURSO),
  criar: (dados) => api.criar(RECURSO, { ...dados, criadoEm: new Date().toISOString() }),
  atualizar: (id, dados) => api.atualizar(RECURSO, id, dados),
  excluir: (id) => api.excluir(RECURSO, id),
}
