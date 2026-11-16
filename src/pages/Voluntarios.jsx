import { useState } from 'react'
import Botao from '../components/Botao'
import CampoFormulario from '../components/CampoFormulario'
import CartaoVoluntario from '../components/CartaoVoluntario'
import FormularioVoluntario from '../components/FormularioVoluntario'
import JanelaModal from '../components/JanelaModal'
import { Carregando, EstadoVazio, MensagemErro } from '../components/EstadoTela'
import { useAviso } from '../hooks/useAviso'
import { useVoluntarios } from '../hooks/useVoluntarios'

// Página de voluntários: cadastro, edição, pausa e exclusão (CRUD completo)
export default function Voluntarios() {
  const { voluntarios, carregando, erro, recarregar, criar, atualizar, excluir, alternarAtivo } = useVoluntarios()
  const aviso = useAviso()
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null)
  const [excluindo, setExcluindo] = useState(null)

  const filtrados = voluntarios.filter((v) =>
    `${v.nome} ${v.rua}`.toLowerCase().includes(busca.trim().toLowerCase()),
  )

  async function aoCriar(dados) {
    try {
      await criar(dados)
      aviso.sucesso('Voluntário cadastrado. Obrigado por ajudar!')
    } catch (e) {
      aviso.erro(e.message)
      throw e
    }
  }

  async function aoSalvarEdicao(dados) {
    try {
      await atualizar(editando.id, { ...editando, ...dados })
      aviso.sucesso('Dados do voluntário atualizados.')
      setEditando(null)
    } catch (e) {
      aviso.erro(e.message)
    }
  }

  async function aoAlternar(voluntario) {
    try {
      const atualizado = await alternarAtivo(voluntario)
      aviso.sucesso(atualizado.ativo ? `${atualizado.nome} voltou a receber alertas.` : `${atualizado.nome} foi pausado.`)
    } catch (e) {
      aviso.erro(e.message)
    }
  }

  async function aoConfirmarExclusao() {
    try {
      await excluir(excluindo.id)
      aviso.sucesso('Voluntário excluído.')
    } catch (e) {
      aviso.erro(e.message)
    } finally {
      setExcluindo(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Voluntários</h1>
        <p className="mt-1 max-w-2xl text-suave">
          Vizinhos que aceitaram receber alertas e fazer visitas quando um idoso da rua precisar.
        </p>
      </header>

      <section aria-labelledby="titulo-cadastro" className="rounded-2xl border border-linha bg-white p-6">
        <h2 id="titulo-cadastro" className="mb-4 text-xl font-bold">
          Quero ser voluntário
        </h2>
        <FormularioVoluntario aoSalvar={aoCriar} />
      </section>

      <section aria-labelledby="titulo-lista" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="titulo-lista" className="text-xl font-bold">
            Rede de voluntários ({voluntarios.length})
          </h2>
          <div className="w-full sm:w-72">
            <CampoFormulario
              id="busca"
              rotulo="Buscar por nome ou rua"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {carregando && <Carregando texto="Buscando voluntários..." />}
        {!carregando && erro && <MensagemErro mensagem={erro} aoTentarDeNovo={recarregar} />}
        {!carregando && !erro && filtrados.length === 0 && (
          <EstadoVazio
            titulo={busca ? 'Nenhum voluntário encontrado' : 'Ainda não há voluntários'}
            texto={busca ? 'Tente buscar outro nome ou rua.' : 'Use o formulário acima para cadastrar o primeiro.'}
          />
        )}
        {!carregando && !erro && filtrados.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtrados.map((v) => (
              <CartaoVoluntario
                key={v.id}
                voluntario={v}
                aoEditar={setEditando}
                aoAlternarAtivo={aoAlternar}
                aoExcluir={setExcluindo}
              />
            ))}
          </div>
        )}
      </section>

      <JanelaModal aberta={Boolean(editando)} titulo="Editar voluntário" aoFechar={() => setEditando(null)}>
        {editando && (
          <FormularioVoluntario
            inicial={{
              nome: editando.nome,
              telefone: editando.telefone,
              rua: editando.rua,
              disponibilidade: editando.disponibilidade,
            }}
            aoSalvar={aoSalvarEdicao}
            aoCancelar={() => setEditando(null)}
          />
        )}
      </JanelaModal>

      <JanelaModal aberta={Boolean(excluindo)} titulo="Excluir voluntário?" aoFechar={() => setExcluindo(null)}>
        <p>
          {excluindo?.nome} deixará de receber alertas. Se a pessoa só vai ficar fora por um tempo, prefira
          <strong> Pausar</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Botao variante="perigo" onClick={aoConfirmarExclusao}>
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
