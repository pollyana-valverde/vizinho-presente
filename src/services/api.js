// Camada de acesso a dados: única parte do sistema que conversa com a API externa (MockAPI).
// Os componentes nunca chamam fetch diretamente; eles usam os serviços que importam este arquivo.

const URL_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const apiConfigurada = URL_BASE.length > 0

// Erro com mensagem amigável para mostrar na tela
export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

function mensagemPorStatus(status) {
  if (status === 404) return 'Registro não encontrado. Ele pode ter sido excluído.'
  if (status === 429) return 'Muitas requisições em pouco tempo. Aguarde alguns segundos e tente de novo.'
  if (status >= 500) return 'O servidor está com problemas no momento. Tente novamente em instantes.'
  return 'Não foi possível concluir a operação.'
}

async function requisicao(caminho, opcoes = {}) {
  if (!apiConfigurada) {
    throw new ErroApi('A API ainda não foi configurada. Defina VITE_API_URL no arquivo .env.', 0)
  }

  let resposta
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    })
  } catch {
    throw new ErroApi('Sem conexão com a internet ou com o servidor.', 0)
  }

  if (!resposta.ok) {
    throw new ErroApi(mensagemPorStatus(resposta.status), resposta.status)
  }

  // DELETE pode responder sem corpo
  const texto = await resposta.text()
  return texto ? JSON.parse(texto) : null
}

export const api = {
  // O MockAPI pode responder 404 quando a lista está vazia; nesse caso devolvemos lista vazia
  listar: async (recurso) => {
    try {
      return (await requisicao(`/${recurso}`)) || []
    } catch (erro) {
      if (erro.status === 404) return []
      throw erro
    }
  },
  buscar: (recurso, id) => requisicao(`/${recurso}/${id}`),
  criar: (recurso, dados) =>
    requisicao(`/${recurso}`, { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (recurso, id, dados) =>
    requisicao(`/${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (recurso, id) => requisicao(`/${recurso}/${id}`, { method: 'DELETE' }),
}
