// Campo com rótulo, dica e mensagem de erro ligados ao input (acessível para leitores de tela).
// Use opcoes={[...]} para virar uma lista de seleção.
export default function CampoFormulario({ id, rotulo, erro, dica, opcoes, ...props }) {
  const idDica = dica ? `${id}-dica` : undefined
  const idErro = erro ? `${id}-erro` : undefined
  const classes = `mt-1 w-full rounded-xl border-2 bg-white px-4 py-3 text-base ${
    erro ? 'border-ajuda' : 'border-linha focus:border-destaque'
  }`

  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {rotulo}
      </label>
      {dica && (
        <p id={idDica} className="text-sm text-suave">
          {dica}
        </p>
      )}
      {opcoes ? (
        <select id={id} className={classes} aria-invalid={Boolean(erro)} aria-describedby={idErro || idDica} {...props}>
          <option value="">Selecione</option>
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} className={classes} aria-invalid={Boolean(erro)} aria-describedby={idErro || idDica} {...props} />
      )}
      {erro && (
        <p id={idErro} role="alert" className="mt-1 text-sm font-bold text-ajuda">
          {erro}
        </p>
      )}
    </div>
  )
}
