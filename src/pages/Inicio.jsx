import { Link } from 'react-router-dom'
import CartaoNumero from '../components/CartaoNumero'
import SeloNivel from '../components/SeloNivel'
import { MensagemErro } from '../components/EstadoTela'
import { useAlertas } from '../hooks/useAlertas'
import { useVoluntarios } from '../hooks/useVoluntarios'
import { NIVEIS, calcularResumo } from '../utils/regras'

const PASSOS = [
  { titulo: 'A luz cai', texto: 'O aparelho na casa do idoso percebe a falta de energia e começa a medir o calor.' },
  { titulo: 'O idoso responde', texto: 'Se estiver tudo bem, ele aperta um único botão: "estou bem".' },
  { titulo: 'O alerta sobe', texto: 'Se a casa esquentar demais e ninguém responder, o alerta aparece aqui.' },
  { titulo: 'O vizinho vai', texto: 'Um voluntário próximo assume a visita e conta como encontrou a pessoa.' },
]

// Página inicial: explica o projeto e mostra a situação atual da rede
export default function Inicio() {
  const { alertas, carregando, erro, recarregar } = useAlertas()
  const { voluntarios } = useVoluntarios()
  const resumo = calcularResumo(alertas, voluntarios)
  const mostrarNumero = (n) => (carregando ? '...' : n)

  return (
    <div className="flex flex-col gap-14">
      <section className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
        <div>
          <p className="font-bold text-destaque">El Niño 2026 · calor e temporais em São Paulo</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
            Se a luz da sua rua cair hoje, quem vai bater na porta da vizinha de 80 anos?
          </h1>
          <p className="mt-4 max-w-xl text-lg text-suave">
            O Vizinho Presente avisa vizinhos voluntários quando falta energia em dias de calor e um idoso que mora
            sozinho não responde.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/alertas" className="inline-flex min-h-12 items-center rounded-xl bg-destaque px-5 font-bold text-white hover:bg-destaque-escuro">
              Ver alertas
            </Link>
            <Link to="/voluntarios" className="inline-flex min-h-12 items-center rounded-xl border-2 border-linha bg-white px-5 font-bold hover:border-tinta">
              Quero ser voluntário
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CartaoNumero
            valor={mostrarNumero(resumo.urgentes)}
            rotulo="Urgentes agora"
            detalhe="Calor perigoso sem resposta"
            destaque={resumo.urgentes > 0}
          />
          <CartaoNumero valor={mostrarNumero(resumo.abertos)} rotulo="Aguardando" detalhe="Sem voluntário ainda" />
          <CartaoNumero valor={mostrarNumero(resumo.emAtendimento)} rotulo="A caminho" detalhe="Voluntário indo" />
          <CartaoNumero valor={mostrarNumero(resumo.voluntariosAtivos)} rotulo="Voluntários" detalhe="Disponíveis" />
        </div>
      </section>

      {erro && <MensagemErro mensagem={erro} aoTentarDeNovo={recarregar} />}

      <section aria-labelledby="titulo-como">
        <h2 id="titulo-como" className="text-2xl font-bold">
          Como funciona
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className="rounded-2xl border border-linha bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-destaque text-lg font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold">{passo.titulo}</h3>
              <p className="mt-1 text-suave">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulo-niveis">
        <h2 id="titulo-niveis" className="text-2xl font-bold">
          Os quatro estados do sensor
        </h2>
        <p className="mt-1 text-suave">As mesmas cores aparecem no aparelho, no site e nos alertas.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(NIVEIS).map(([chave, info]) => (
            <li key={chave} className="flex flex-col gap-2 rounded-2xl border border-linha bg-white p-5">
              <SeloNivel nivel={chave} />
              <p>{info.descricao}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
