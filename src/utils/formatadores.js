// Funções de apoio para mostrar datas, tempos e telefones de forma legível

export function formatarDataHora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatarDuracao(minutos) {
  if (minutos === null || minutos === undefined) return 'sem dados'
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto ? `${horas} h ${resto} min` : `${horas} h`
}

// Aplica a máscara (11) 91234-5678 enquanto a pessoa digita
export function formatarTelefone(valor) {
  const d = (valor || '').replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

// Mostra a temperatura no padrão brasileiro, com vírgula: 33,5 °C
export function formatarTemperatura(valor) {
  return `${Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} °C`
}
