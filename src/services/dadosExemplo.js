import { alertasService } from './alertasService'
import { voluntariosService } from './voluntariosService'
import { classificarNivel } from '../utils/regras'

// Dados fictícios para demonstrar o sistema quando a API ainda está vazia.
// Nenhum nome, telefone ou endereço pertence a uma pessoa real.

const VOLUNTARIOS = [
  { nome: 'Carla Mendes', telefone: '(11) 98765-1001', rua: 'Rua das Acácias', disponibilidade: 'Noite', ativo: true },
  { nome: 'Roberto Lima', telefone: '(11) 98765-1002', rua: 'Rua dos Ipês', disponibilidade: 'Qualquer horário', ativo: true },
  { nome: 'Fernanda Rocha', telefone: '(11) 98765-1003', rua: 'Rua das Acácias', disponibilidade: 'Manhã', ativo: false },
]

function minutosAtras(min) {
  return new Date(Date.now() - min * 60000).toISOString()
}

function alerta(idoso, endereco, temperatura, respondeu, minutos, extras = {}) {
  return {
    idoso,
    endereco,
    temperatura,
    semEnergia: true,
    respondeu,
    nivel: classificarNivel({ semEnergia: true, temperatura, respondeu }),
    status: 'aberto',
    voluntarioId: '',
    voluntarioNome: '',
    relato: '',
    abertoEm: minutosAtras(minutos),
    atendidoEm: '',
    ...extras,
  }
}

export async function carregarDadosExemplo() {
  const criados = []
  for (const v of VOLUNTARIOS) {
    criados.push(await voluntariosService.criar(v))
  }
  const carla = criados[0]
  const roberto = criados[1]

  const alertas = [
    alerta('Dona Maria (fictícia)', 'Rua das Acácias, 120', 33.5, false, 12),
    alerta('Seu Antônio (fictício)', 'Rua dos Ipês, 45', 30.5, false, 25),
    alerta('Dona Lurdes (fictícia)', 'Rua das Acácias, 300', 34, false, 18, {
      status: 'em_atendimento',
      voluntarioId: carla.id,
      voluntarioNome: carla.nome,
    }),
    alerta('Seu Jorge (fictício)', 'Rua dos Ipês, 88', 32.5, false, 140, {
      status: 'atendido',
      voluntarioId: roberto.id,
      voluntarioNome: roberto.nome,
      relato: 'Estava bem, mas com calor. Abrimos as janelas e deixamos água por perto.',
      atendidoEm: minutosAtras(118),
    }),
  ]
  for (const a of alertas) {
    await alertasService.criar(a)
  }
}
