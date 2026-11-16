// Regras de negócio do Vizinho Presente.
// Este arquivo não sabe nada de tela nem de API: só recebe dados e devolve decisões.

// Limites de temperatura usados também no sensor (Edge) e no relatório de Matemática
export const LIMITE_ATENCAO = 30 // °C: casa começando a ficar quente demais
export const LIMITE_PERIGO = 32 // °C: calor perigoso para pessoas idosas

// Meta do indicador de impacto: visita em até 30 minutos depois do alerta
export const META_ATENDIMENTO_MIN = 30

// Os quatro estados do sistema, iguais aos do sensor
export const NIVEIS = {
  normal: {
    rotulo: 'Normal',
    descricao: 'A casa tem energia. Nada a fazer.',
    peso: 0,
    classes: 'bg-normal/10 text-normal border-normal/40',
  },
  semenergia: {
    rotulo: 'Sem energia',
    descricao: 'A luz caiu, mas a temperatura ainda está segura.',
    peso: 1,
    classes: 'bg-semenergia/10 text-semenergia border-semenergia/40',
  },
  atencao: {
    rotulo: 'Atenção',
    descricao: 'Sem luz e a casa está esquentando.',
    peso: 2,
    classes: 'bg-atencao/10 text-atencao border-atencao/40',
  },
  ajuda: {
    rotulo: 'Pedir ajuda',
    descricao: 'Calor perigoso e ninguém confirmou que está bem.',
    peso: 3,
    classes: 'bg-ajuda/10 text-ajuda border-ajuda/40',
  },
}

export const STATUS = {
  aberto: { rotulo: 'Aguardando voluntário', ordem: 0 },
  em_atendimento: { rotulo: 'Voluntário a caminho', ordem: 1 },
  atendido: { rotulo: 'Visita registrada', ordem: 2 },
}

export const DISPONIBILIDADES = ['Manhã', 'Tarde', 'Noite', 'Qualquer horário']

// Decide o nível de risco a partir da leitura do sensor
export function classificarNivel({ semEnergia, temperatura, respondeu }) {
  if (!semEnergia) return 'normal'
  if (temperatura >= LIMITE_PERIGO && !respondeu) return 'ajuda'
  if (temperatura >= LIMITE_ATENCAO) return 'atencao'
  return 'semenergia'
}

// Validação do formulário de alerta. Devolve um objeto com as mensagens de erro (vazio se estiver tudo certo)
export function validarAlerta(dados) {
  const erros = {}
  if (!dados.idoso || dados.idoso.trim().length < 3) {
    erros.idoso = 'Informe o nome do morador (mínimo de 3 letras).'
  }
  if (!dados.endereco || dados.endereco.trim().length < 5) {
    erros.endereco = 'Informe o endereço com rua e número.'
  }
  const temperatura = Number(dados.temperatura)
  if (dados.temperatura === '' || Number.isNaN(temperatura)) {
    erros.temperatura = 'Informe a temperatura em graus.'
  } else if (temperatura < 10 || temperatura > 50) {
    erros.temperatura = 'A temperatura precisa estar entre 10 °C e 50 °C.'
  }
  return erros
}

// Validação do formulário de voluntário
export function validarVoluntario(dados) {
  const erros = {}
  if (!dados.nome || dados.nome.trim().length < 3) {
    erros.nome = 'Informe o nome completo (mínimo de 3 letras).'
  }
  const digitos = (dados.telefone || '').replace(/\D/g, '')
  if (digitos.length < 10 || digitos.length > 11) {
    erros.telefone = 'Informe um telefone com DDD, por exemplo (11) 91234-5678.'
  }
  if (!dados.rua || dados.rua.trim().length < 3) {
    erros.rua = 'Informe a rua onde você mora.'
  }
  if (!DISPONIBILIDADES.includes(dados.disponibilidade)) {
    erros.disponibilidade = 'Escolha um horário de disponibilidade.'
  }
  return erros
}

// Regra: só um voluntário ativo pode assumir um alerta que ainda está aberto
export function podeAssumir(alerta, voluntario) {
  return alerta.status === 'aberto' && Boolean(voluntario?.ativo)
}

// Regra: um alerta só é encerrado depois do registro da visita, com um relato mínimo
export function podeEncerrar(alerta, relato) {
  return alerta.status === 'em_atendimento' && (relato || '').trim().length >= 10
}

// Ordena por prioridade: primeiro os abertos, depois os mais graves, depois os mais antigos
export function ordenarPorPrioridade(alertas) {
  return [...alertas].sort((a, b) => {
    const porStatus = (STATUS[a.status]?.ordem ?? 9) - (STATUS[b.status]?.ordem ?? 9)
    if (porStatus !== 0) return porStatus
    const porNivel = (NIVEIS[b.nivel]?.peso ?? 0) - (NIVEIS[a.nivel]?.peso ?? 0)
    if (porNivel !== 0) return porNivel
    return new Date(a.abertoEm) - new Date(b.abertoEm)
  })
}

export function minutosEntre(inicio, fim) {
  return Math.max(0, Math.round((new Date(fim) - new Date(inicio)) / 60000))
}

// Números do painel e do indicador de impacto
export function calcularResumo(alertas, voluntarios = []) {
  const atendidos = alertas.filter((a) => a.status === 'atendido' && a.atendidoEm)
  const tempos = atendidos.map((a) => minutosEntre(a.abertoEm, a.atendidoEm))
  const dentroDaMeta = tempos.filter((t) => t <= META_ATENDIMENTO_MIN).length

  return {
    abertos: alertas.filter((a) => a.status === 'aberto').length,
    emAtendimento: alertas.filter((a) => a.status === 'em_atendimento').length,
    atendidos: atendidos.length,
    urgentes: alertas.filter((a) => a.status !== 'atendido' && a.nivel === 'ajuda').length,
    tempoMedioMin: tempos.length ? Math.round(tempos.reduce((s, t) => s + t, 0) / tempos.length) : null,
    percentualNaMeta: tempos.length ? Math.round((dentroDaMeta / tempos.length) * 100) : null,
    voluntariosAtivos: voluntarios.filter((v) => v.ativo).length,
  }
}

// Sugere voluntários ativos, colocando primeiro quem mora na mesma rua do alerta
export function sugerirVoluntarios(alerta, voluntarios) {
  const enderecoAlerta = (alerta.endereco || '').toLowerCase()
  return voluntarios
    .filter((v) => v.ativo)
    .map((v) => ({ ...v, mesmaRua: enderecoAlerta.includes((v.rua || '').toLowerCase().trim()) }))
    .sort((a, b) => Number(b.mesmaRua) - Number(a.mesmaRua))
}
