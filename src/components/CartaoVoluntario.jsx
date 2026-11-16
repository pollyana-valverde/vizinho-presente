import Botao from './Botao'

// Cartão com os dados de um voluntário e as ações de editar, pausar e excluir
export default function CartaoVoluntario({ voluntario, aoEditar, aoAlternarAtivo, aoExcluir }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-linha bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{voluntario.nome}</h3>
          <p className="text-suave">{voluntario.rua}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            voluntario.ativo ? 'bg-normal/10 text-normal' : 'bg-linha text-suave'
          }`}
        >
          {voluntario.ativo ? 'Disponível' : 'Pausado'}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-suave">Telefone</dt>
          <dd className="font-bold">{voluntario.telefone}</dd>
        </div>
        <div>
          <dt className="text-suave">Horário</dt>
          <dd className="font-bold">{voluntario.disponibilidade}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <Botao variante="secundario" onClick={() => aoEditar(voluntario)}>
          Editar
        </Botao>
        <Botao variante="secundario" onClick={() => aoAlternarAtivo(voluntario)}>
          {voluntario.ativo ? 'Pausar' : 'Reativar'}
        </Botao>
        <Botao variante="fantasma" onClick={() => aoExcluir(voluntario)}>
          Excluir
        </Botao>
      </div>
    </article>
  )
}
