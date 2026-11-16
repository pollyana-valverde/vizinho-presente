import Botao from './Botao'
import CampoFormulario from './CampoFormulario'
import SeloNivel from './SeloNivel'
import { useFormulario } from '../hooks/useFormulario'
import { LIMITE_ATENCAO, LIMITE_PERIGO, NIVEIS, classificarNivel, validarAlerta } from '../utils/regras'

const INICIAL = { idoso: '', endereco: '', temperatura: '33', semEnergia: true, respondeu: false }

// Simula a leitura que o sensor (ESP32) envia. Enquanto o sensor real não está ligado ao site,
// este formulário permite abrir alertas manualmente para testar o fluxo inteiro.
export default function FormularioAlerta({ aoRegistrar }) {
  const { valores, erros, enviando, alterar, reiniciar, enviar } = useFormulario(INICIAL, validarAlerta)

  const temperatura = Number(valores.temperatura)
  const nivelPrevisto = Number.isNaN(temperatura)
    ? 'normal'
    : classificarNivel({ semEnergia: valores.semEnergia, temperatura, respondeu: valores.respondeu })

  async function aoEnviar(evento) {
    evento.preventDefault()
    const ok = await enviar(aoRegistrar)
    if (ok) reiniciar()
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="grid gap-4 sm:grid-cols-2">
      <CampoFormulario
        id="idoso"
        rotulo="Nome do morador"
        dica="Use um nome fictício."
        value={valores.idoso}
        erro={erros.idoso}
        onChange={(e) => alterar('idoso', e.target.value)}
      />
      <CampoFormulario
        id="endereco"
        rotulo="Endereço"
        dica="Rua e número, por exemplo Rua das Flores, 120."
        value={valores.endereco}
        erro={erros.endereco}
        onChange={(e) => alterar('endereco', e.target.value)}
      />
      <CampoFormulario
        id="temperatura"
        rotulo="Temperatura dentro da casa (°C)"
        dica={`Atenção a partir de ${LIMITE_ATENCAO} °C. Perigo a partir de ${LIMITE_PERIGO} °C.`}
        type="number"
        min="10"
        max="50"
        step="0.5"
        value={valores.temperatura}
        erro={erros.temperatura}
        onChange={(e) => alterar('temperatura', e.target.value)}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="font-bold">Situação da casa</legend>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-linha bg-white px-4">
          <input
            type="checkbox"
            className="h-5 w-5 accent-destaque"
            checked={valores.semEnergia}
            onChange={(e) => alterar('semEnergia', e.target.checked)}
          />
          A energia caiu
        </label>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-linha bg-white px-4">
          <input
            type="checkbox"
            className="h-5 w-5 accent-destaque"
            checked={valores.respondeu}
            onChange={(e) => alterar('respondeu', e.target.checked)}
          />
          O morador apertou "estou bem"
        </label>
      </fieldset>

      <div className="flex flex-col gap-2 rounded-xl bg-papel p-4 sm:col-span-2" aria-live="polite">
        <p className="text-sm text-suave">Com esses dados, o sistema classifica como:</p>
        <div className="flex flex-wrap items-center gap-3">
          <SeloNivel nivel={nivelPrevisto} />
          <span className="text-sm">{NIVEIS[nivelPrevisto].descricao}</span>
        </div>
      </div>

      <div className="sm:col-span-2">
        <Botao type="submit" carregando={enviando}>
          Abrir alerta
        </Botao>
      </div>
    </form>
  )
}
