import { Link } from 'react-router-dom'

// Página mostrada quando o endereço digitado não existe
export default function NaoEncontrada() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-suave">O endereço pode estar errado ou a página mudou de lugar.</p>
      <Link to="/" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-destaque px-5 font-bold text-white">
        Voltar para o início
      </Link>
    </div>
  )
}
