// Número de destaque usado no painel do início e no histórico
export default function CartaoNumero({ valor, rotulo, detalhe, destaque = false }) {
  return (
    <div className={`rounded-2xl border p-5 ${destaque ? 'border-ajuda bg-ajuda/5' : 'border-linha bg-white'}`}>
      <p className={`text-4xl font-bold ${destaque ? 'text-ajuda' : 'text-tinta'}`}>{valor}</p>
      <p className="mt-1 font-bold">{rotulo}</p>
      {detalhe && <p className="text-sm text-suave">{detalhe}</p>}
    </div>
  )
}
