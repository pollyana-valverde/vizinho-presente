import { useState } from 'react'
import Botao from '../components/Botao'
import { useAviso } from '../hooks/useAviso'
import { carregarDadosExemplo } from '../services/dadosExemplo'

const EQUIPE = [
  { nome: 'Pollyana Valverde dos Santos', rm: 'RM569871' },
  { nome: 'Luana Lopes Sventkauskas', rm: 'RM569643' },
  { nome: 'João Fernando Gonçalves Senziani', rm: 'RM572144' },
]

const ODS = [
  { numero: 3, titulo: 'Saúde e bem-estar', texto: 'Protege a saúde de idosos durante o calor extremo.' },
  { numero: 10, titulo: 'Redução das desigualdades', texto: 'Apoia um grupo vulnerável que costuma ficar sem ajuda.' },
  { numero: 11, titulo: 'Cidades e comunidades sustentáveis', texto: 'Fortalece a rede de vizinhança diante de desastres.' },
  { numero: 13, titulo: 'Ação contra a mudança do clima', texto: 'Adapta a cidade aos eventos extremos do El Niño.' },
]

// Página institucional: o problema, a solução, os ODS e a equipe
export default function Sobre() {
  const aviso = useAviso()
  const [carregando, setCarregando] = useState(false)

  async function aoCarregarExemplos() {
    setCarregando(true)
    try {
      await carregarDadosExemplo()
      aviso.sucesso('Dados de exemplo criados. Veja as páginas de Alertas e Voluntários.')
    } catch (e) {
      aviso.erro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <header>
        <h1 className="text-3xl font-bold">Sobre o projeto</h1>
        <p className="mt-2 text-lg text-suave">
          CitizenTech criada para a Global Solution 2026 da FIAP, Engenharia de Software, 1º ano.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold">O problema</h2>
        <p className="mt-2">
          O El Niño de 2026 deve trazer a São Paulo ondas de calor e temporais com ventania. Os temporais derrubam
          árvores e fios, e bairros inteiros ficam sem energia por horas ou dias. Para um idoso que mora sozinho, ficar
          sem ventilador e sem geladeira no calor é perigoso, e muitas vezes ninguém percebe a tempo.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">A solução</h2>
        <p className="mt-2">
          Um aparelho simples na casa do idoso percebe a falta de luz e mede a temperatura. Se a casa esquentar demais e
          o morador não apertar o botão "estou bem", vizinhos voluntários recebem o alerta neste site e um deles vai até
          lá. O sistema é composto por sensor (ESP32), lógica em Python, modelo matemático do aquecimento da casa e
          esta aplicação web.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Objetivos de Desenvolvimento Sustentável</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ODS.map((ods) => (
            <li key={ods.numero} className="rounded-2xl border border-linha bg-white p-5">
              <p className="font-bold text-destaque">ODS {ods.numero}</p>
              <p className="font-bold">{ods.titulo}</p>
              <p className="mt-1 text-suave">{ods.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Equipe</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {EQUIPE.map((pessoa) => (
            <li key={pessoa.rm} className="rounded-2xl border border-linha bg-white p-5">
              <p className="font-bold">{pessoa.nome}</p>
              <p className="text-suave">{pessoa.rm}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-linha p-6">
        <h2 className="text-xl font-bold">Para a apresentação</h2>
        <p className="mt-1 text-suave">
          Cria voluntários e alertas fictícios na API para demonstrar todas as etapas. Use apenas uma vez.
        </p>
        <Botao variante="secundario" className="mt-4" carregando={carregando} onClick={aoCarregarExemplos}>
          Carregar dados de exemplo
        </Botao>
      </section>
    </div>
  )
}
