import Botao from './Botao'
import SeloNivel from './SeloNivel'
import { useRelogio } from '../hooks/useRelogio'
import { STATUS, minutosEntre } from '../utils/regras'
import { formatarDataHora, formatarDuracao } from '../utils/formatadores'

// Cartão de um alerta. As ações mudam conforme a etapa do atendimento.
export default function CartaoAlerta({ alerta, aoAssumir, aoRegistrarVisita, aoLiberar, aoExcluir }) {
  const agora = useRelogio()
  const tempoAberto = minutosEntre(alerta.abertoEm, alerta.atendidoEm || agora)
  const urgente = alerta.status !== 'atendido' && alerta.nivel === 'ajuda'

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-5 ${urgente ? 'border-2 border-ajuda' : 'border-linha'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SeloNivel nivel={alerta.nivel} />
        <span className="text-sm font-bold text-suave">{STATUS[alerta.status]?.rotulo}</span>
      </div>

      <div>
        <h3 className="text-lg font-bold">{alerta.idoso}</h3>
        <p className="text-suave">{alerta.endereco}</p>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-suave">Temperatura</dt>
          <dd className="text-lg font-bold">{alerta.temperatura} °C</dd>
        </div>
        <div>
          <dt className="text-suave">Aberto em</dt>
          <dd className="font-bold">{formatarDataHora(alerta.abertoEm)}</dd>
        </div>
        <div>
          <dt className="text-suave">{alerta.status === 'atendido' ? 'Atendido em' : 'Esperando há'}</dt>
          <dd className="font-bold">{formatarDuracao(tempoAberto)}</dd>
        </div>
      </dl>

      {alerta.voluntarioNome && (
        <p className="rounded-xl bg-papel px-3 py-2 text-sm">
          Voluntário: <strong>{alerta.voluntarioNome}</strong>
        </p>
      )}
      {alerta.relato && (
        <p className="rounded-xl bg-normal/10 px-3 py-2 text-sm">
          <strong>Relato da visita:</strong> {alerta.relato}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {alerta.status === 'aberto' && aoAssumir && <Botao onClick={() => aoAssumir(alerta)}>Vou até lá</Botao>}
        {alerta.status === 'em_atendimento' && aoRegistrarVisita && (
          <>
            <Botao onClick={() => aoRegistrarVisita(alerta)}>Registrar visita</Botao>
            <Botao variante="secundario" onClick={() => aoLiberar(alerta)}>
              Não consigo ir
            </Botao>
          </>
        )}
        {aoExcluir && (
          <Botao variante="fantasma" onClick={() => aoExcluir(alerta)}>
            Excluir
          </Botao>
        )}
      </div>
    </article>
  )
}
