import { useState } from 'react'
import { Link } from 'react-router-dom'
import Botao from '../components/Botao'
import CampoFormulario from '../components/CampoFormulario'
import CartaoAlerta from '../components/CartaoAlerta'
import FormularioAlerta from '../components/FormularioAlerta'
import JanelaModal from '../components/JanelaModal'
import { Carregando, EstadoVazio, MensagemErro } from '../components/EstadoTela'
import { useAlertas } from '../hooks/useAlertas'
import { useAviso } from '../hooks/useAviso'
import { useVoluntarios } from '../hooks/useVoluntarios'
import { sugerirVoluntarios } from '../utils/regras'

const FILTROS = [
  { valor: 'pendentes', rotulo: 'Precisam de ajuda' },
  { valor: 'aberto', rotulo: 'Aguardando' },
  { valor: 'em_atendimento', rotulo: 'A caminho' },
  { valor: 'todos', rotulo: 'Todos' },
]

// Painel de alertas: o voluntário vê as casas em risco, assume uma visita e registra o que encontrou
export default function Alertas() {
  const { alertas, carregando, erro, recarregar, registrar, assumir, encerrar, liberar, excluir } = useAlertas({
    atualizarSozinho: true,
  })
  const { voluntarios } = useVoluntarios()
  const aviso = useAviso()

  const [filtro, setFiltro] = useState('pendentes')
  const [mostrarSimulador, setMostrarSimulador] = useState(false)
  const [assumindo, setAssumindo] = useState(null)
  const [voluntarioEscolhido, setVoluntarioEscolhido] = useState('')
  const [visitando, setVisitando] = useState(null)
  const [relato, setRelato] = useState('')
  const [excluindo, setExcluindo] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const visiveis = alertas.filter((a) => {
    if (filtro === 'todos') return true
    if (filtro === 'pendentes') return a.status !== 'atendido'
    return a.status === filtro
  })

  // Executa uma ação, mostra o aviso e trata erro sempre do mesmo jeito
  async function executar(acao, mensagemSucesso) {
    setSalvando(true)
    try {
      await acao()
      aviso.sucesso(mensagemSucesso)
      return true
    } catch (e) {
      aviso.erro(e.message)
      return false
    } finally {
      setSalvando(false)
    }
  }

  async function aoRegistrar(dados) {
    try {
      const novo = await registrar(dados)
      aviso.sucesso(`Alerta aberto para ${novo.idoso}.`)
      setFiltro('pendentes')
    } catch (e) {
      aviso.erro(e.message)
      throw e
    }
  }

  async function confirmarAssumir() {
    const voluntario = voluntarios.find((v) => v.id === voluntarioEscolhido)
    const ok = await executar(() => assumir(assumindo, voluntario), `${voluntario?.nome} está a caminho.`)
    if (ok) {
      setAssumindo(null)
      setVoluntarioEscolhido('')
    }
  }

  async function confirmarVisita() {
    const ok = await executar(() => encerrar(visitando, relato), 'Visita registrada. Alerta encerrado.')
    if (ok) {
      setVisitando(null)
      setRelato('')
    }
  }

  async function confirmarExclusao() {
    await executar(() => excluir(excluindo.id), 'Alerta excluído.')
    setExcluindo(null)
  }

  const sugeridos = assumindo ? sugerirVoluntarios(assumindo, voluntarios) : []

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Alertas</h1>
          <p className="mt-1 max-w-2xl text-suave">
            Casas onde a luz caiu e o calor está subindo. Os mais urgentes aparecem primeiro. A lista se atualiza sozinha a
            cada 30 segundos.
          </p>
        </div>
        <Botao variante={mostrarSimulador ? 'secundario' : 'primario'} onClick={() => setMostrarSimulador((v) => !v)}>
          {mostrarSimulador ? 'Fechar simulador' : 'Simular leitura do sensor'}
        </Botao>
      </header>

      {mostrarSimulador && (
        <section aria-labelledby="titulo-simulador" className="rounded-2xl border border-linha bg-white p-6">
          <h2 id="titulo-simulador" className="text-xl font-bold">
            Simular leitura do sensor
          </h2>
          <p className="mb-4 text-suave">
            Na versão final, o aparelho na casa do idoso envia estes dados sozinho. Aqui você pode testar o fluxo.
          </p>
          <FormularioAlerta aoRegistrar={aoRegistrar} />
        </section>
      )}

      <section aria-labelledby="titulo-alertas" className="flex flex-col gap-4">
        <h2 id="titulo-alertas" className="sr-only">
          Lista de alertas
        </h2>
        <div role="group" aria-label="Filtrar alertas" className="flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              aria-pressed={filtro === f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`min-h-12 rounded-full border-2 px-4 font-bold ${
                filtro === f.valor ? 'border-tinta bg-tinta text-white' : 'border-linha bg-white hover:border-tinta'
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>

        {carregando && <Carregando texto="Buscando alertas..." />}
        {!carregando && erro && <MensagemErro mensagem={erro} aoTentarDeNovo={recarregar} />}
        {!carregando && !erro && visiveis.length === 0 && (
          <EstadoVazio titulo="Nenhum alerta aqui" texto="Quando o sensor de alguma casa disparar, ele aparece nesta lista." />
        )}
        {!carregando && !erro && visiveis.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {visiveis.map((alerta) => (
              <CartaoAlerta
                key={alerta.id}
                alerta={alerta}
                aoAssumir={setAssumindo}
                aoRegistrarVisita={setVisitando}
                aoLiberar={(a) => executar(() => liberar(a), 'Alerta voltou para a fila.')}
                aoExcluir={setExcluindo}
              />
            ))}
          </div>
        )}
      </section>

      <JanelaModal aberta={Boolean(assumindo)} titulo="Quem vai até lá?" aoFechar={() => setAssumindo(null)}>
        {sugeridos.length === 0 ? (
          <EstadoVazio titulo="Nenhum voluntário disponível" texto="Cadastre ou reative um voluntário primeiro.">
            <Link to="/voluntarios" className="font-bold text-destaque underline">
              Ir para Voluntários
            </Link>
          </EstadoVazio>
        ) : (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-suave">
              Casa de <strong className="text-tinta">{assumindo?.idoso}</strong>, {assumindo?.endereco}.
            </legend>
            {sugeridos.map((v) => (
              <label
                key={v.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2 ${
                  voluntarioEscolhido === v.id ? 'border-destaque bg-destaque/5' : 'border-linha'
                }`}
              >
                <input
                  type="radio"
                  name="voluntario"
                  className="h-5 w-5 accent-destaque"
                  checked={voluntarioEscolhido === v.id}
                  onChange={() => setVoluntarioEscolhido(v.id)}
                />
                <span>
                  <strong>{v.nome}</strong>
                  <span className="block text-sm text-suave">
                    {v.rua} · {v.disponibilidade}
                    {v.mesmaRua && ' · mora na mesma rua'}
                  </span>
                </span>
              </label>
            ))}
            <div className="mt-4 flex flex-wrap gap-3">
              <Botao onClick={confirmarAssumir} disabled={!voluntarioEscolhido} carregando={salvando}>
                Confirmar
              </Botao>
              <Botao variante="secundario" onClick={() => setAssumindo(null)}>
                Cancelar
              </Botao>
            </div>
          </fieldset>
        )}
      </JanelaModal>

      <JanelaModal aberta={Boolean(visitando)} titulo="Como foi a visita?" aoFechar={() => setVisitando(null)}>
        <CampoFormulario
          id="relato"
          rotulo="Conte o que encontrou"
          dica="Ex.: Dona Maria está bem, abrimos as janelas e deixamos água por perto."
          multilinha
          value={relato}
          onChange={(e) => setRelato(e.target.value)}
        />
        <p className="mt-2 text-sm text-suave">{relato.trim().length}/10 caracteres mínimos</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Botao onClick={confirmarVisita} disabled={relato.trim().length < 10} carregando={salvando}>
            Encerrar alerta
          </Botao>
          <Botao variante="secundario" onClick={() => setVisitando(null)}>
            Cancelar
          </Botao>
        </div>
      </JanelaModal>

      <JanelaModal aberta={Boolean(excluindo)} titulo="Excluir alerta?" aoFechar={() => setExcluindo(null)}>
        <p>Use só para alertas abertos por engano. Alertas excluídos não entram no histórico.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Botao variante="perigo" onClick={confirmarExclusao} carregando={salvando}>
            Sim, excluir
          </Botao>
          <Botao variante="secundario" onClick={() => setExcluindo(null)}>
            Cancelar
          </Botao>
        </div>
      </JanelaModal>
    </div>
  )
}
