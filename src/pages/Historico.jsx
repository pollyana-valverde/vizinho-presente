import CartaoNumero from '../components/CartaoNumero'
import SeloNivel from '../components/SeloNivel'
import { Carregando, EstadoVazio, MensagemErro } from '../components/EstadoTela'
import { useAlertas } from '../hooks/useAlertas'
import { META_ATENDIMENTO_MIN, calcularResumo, minutosEntre } from '../utils/regras'
import { formatarDataHora, formatarDuracao } from '../utils/formatadores'

// Histórico das visitas concluídas e o indicador de impacto do projeto
export default function Historico() {
  const { alertas, carregando, erro, recarregar } = useAlertas()
  const resumo = calcularResumo(alertas)
  const atendidos = alertas
    .filter((a) => a.status === 'atendido')
    .sort((a, b) => new Date(b.atendidoEm) - new Date(a.atendidoEm))

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Histórico de visitas</h1>
        <p className="mt-1 max-w-2xl text-suave">
          Nosso indicador de impacto é o tempo entre o alerta e a visita. A meta é chegar em até {META_ATENDIMENTO_MIN}{' '}
          minutos.
        </p>
      </header>

      {carregando && <Carregando texto="Buscando histórico..." />}
      {!carregando && erro && <MensagemErro mensagem={erro} aoTentarDeNovo={recarregar} />}

      {!carregando && !erro && (
        <>
          <section aria-label="Indicadores" className="grid gap-3 sm:grid-cols-3">
            <CartaoNumero valor={resumo.atendidos} rotulo="Visitas feitas" />
            <CartaoNumero valor={formatarDuracao(resumo.tempoMedioMin)} rotulo="Tempo médio até a visita" />
            <CartaoNumero
              valor={resumo.percentualNaMeta === null ? 'sem dados' : `${resumo.percentualNaMeta}%`}
              rotulo={`Atendidos em até ${META_ATENDIMENTO_MIN} min`}
            />
          </section>

          {atendidos.length === 0 ? (
            <EstadoVazio titulo="Nenhuma visita registrada ainda" texto="Quando um alerta for encerrado, ele aparece aqui." />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-linha bg-white">
              <table className="w-full min-w-[640px] text-left">
                <caption className="sr-only">Visitas concluídas, da mais recente para a mais antiga</caption>
                <thead className="bg-papel text-sm text-suave">
                  <tr>
                    <th scope="col" className="p-4">Morador</th>
                    <th scope="col" className="p-4">Nível</th>
                    <th scope="col" className="p-4">Voluntário</th>
                    <th scope="col" className="p-4">Concluído em</th>
                    <th scope="col" className="p-4">Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {atendidos.map((a) => {
                    const tempo = minutosEntre(a.abertoEm, a.atendidoEm)
                    return (
                      <tr key={a.id} className="border-t border-linha align-top">
                        <td className="p-4">
                          <strong>{a.idoso}</strong>
                          <span className="block text-sm text-suave">{a.relato}</span>
                        </td>
                        <td className="p-4"><SeloNivel nivel={a.nivel} /></td>
                        <td className="p-4">{a.voluntarioNome}</td>
                        <td className="p-4">{formatarDataHora(a.atendidoEm)}</td>
                        <td className={`p-4 font-bold ${tempo <= META_ATENDIMENTO_MIN ? 'text-normal' : 'text-atencao'}`}>
                          {formatarDuracao(tempo)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
