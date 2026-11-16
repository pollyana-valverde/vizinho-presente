import { api } from './api'

// Serviço de alertas: cada alerta representa uma casa que o sensor marcou como em risco
const RECURSO = 'alertas'

export const alertasService = {
  listar: () => api.listar(RECURSO),
  criar: (dados) => api.criar(RECURSO, dados),
  atualizar: (id, dados) => api.atualizar(RECURSO, id, dados),
  excluir: (id) => api.excluir(RECURSO, id),
}
