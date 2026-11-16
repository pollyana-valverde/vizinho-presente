import Botao from './Botao'
import CampoFormulario from './CampoFormulario'
import { useFormulario } from '../hooks/useFormulario'
import { DISPONIBILIDADES, validarVoluntario } from '../utils/regras'
import { formatarTelefone } from '../utils/formatadores'

const VAZIO = { nome: '', telefone: '', rua: '', disponibilidade: '' }

// Formulário usado tanto para cadastrar quanto para editar um voluntário
export default function FormularioVoluntario({ inicial, aoSalvar, aoCancelar }) {
  const { valores, erros, enviando, alterar, reiniciar, enviar } = useFormulario(inicial || VAZIO, validarVoluntario)

  async function aoEnviar(evento) {
    evento.preventDefault()
    const ok = await enviar(aoSalvar)
    if (ok && !inicial) reiniciar()
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="grid gap-4 sm:grid-cols-2">
      <CampoFormulario
        id="nome"
        rotulo="Nome completo"
        value={valores.nome}
        erro={erros.nome}
        autoComplete="off"
        onChange={(e) => alterar('nome', e.target.value)}
      />
      <CampoFormulario
        id="telefone"
        rotulo="Telefone com DDD"
        inputMode="tel"
        placeholder="(11) 91234-5678"
        value={valores.telefone}
        erro={erros.telefone}
        onChange={(e) => alterar('telefone', formatarTelefone(e.target.value))}
      />
      <CampoFormulario
        id="rua"
        rotulo="Rua onde mora"
        dica="Usamos a rua para avisar primeiro quem está mais perto."
        value={valores.rua}
        erro={erros.rua}
        onChange={(e) => alterar('rua', e.target.value)}
      />
      <CampoFormulario
        id="disponibilidade"
        rotulo="Quando pode ajudar"
        opcoes={DISPONIBILIDADES}
        value={valores.disponibilidade}
        erro={erros.disponibilidade}
        onChange={(e) => alterar('disponibilidade', e.target.value)}
      />
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <Botao type="submit" carregando={enviando}>
          {inicial ? 'Salvar alterações' : 'Cadastrar voluntário'}
        </Botao>
        {aoCancelar && (
          <Botao variante="secundario" onClick={aoCancelar}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  )
}
