import Botao from './Botao'
import { apiConfigurada } from '../services/api'

// Mostra carregamento, erro ou lista vazia de forma padronizada em todas as telas
export function Carregando({ texto = 'Carregando...' }) {
  return (
    <div role="status" className="flex items-center gap-3 py-10 text-suave">
      <span className="h-5 w-5 animate-spin rounded-full border-4 border-linha border-t-destaque" aria-hidden="true" />
      {texto}
    </div>
  )
}

export function MensagemErro({ mensagem, aoTentarDeNovo }) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-ajuda/30 bg-ajuda/5 p-5">
      <p className="font-bold text-ajuda">Algo deu errado</p>
      <p className="mt-1">{mensagem}</p>
      {!apiConfigurada && (
        <p className="mt-2 text-sm text-suave">
          Crie o arquivo .env na raiz do projeto com VITE_API_URL, como mostra o README.
        </p>
      )}
      {aoTentarDeNovo && apiConfigurada && (
        <Botao variante="secundario" className="mt-4" onClick={aoTentarDeNovo}>
          Tentar de novo
        </Botao>
      )}
    </div>
  )
}

export function EstadoVazio({ titulo, texto, children }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-linha p-8 text-center">
      <p className="text-lg font-bold">{titulo}</p>
      {texto && <p className="mt-1 text-suave">{texto}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
