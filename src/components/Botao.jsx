// Botão padrão do sistema. Mantém o mesmo visual e tamanho mínimo de toque em todas as telas.
const VARIANTES = {
  primario: 'bg-destaque text-white hover:bg-destaque-escuro',
  secundario: 'bg-white text-tinta border-2 border-linha hover:border-tinta',
  perigo: 'bg-ajuda text-white hover:bg-red-800',
  fantasma: 'bg-transparent text-destaque hover:bg-destaque/10',
}

export default function Botao({ variante = 'primario', carregando = false, className = '', children, ...props }) {
  return (
    <button
      type="button"
      disabled={carregando || props.disabled}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTES[variante]} ${className}`}
      {...props}
    >
      {carregando ? 'Aguarde...' : children}
    </button>
  )
}
