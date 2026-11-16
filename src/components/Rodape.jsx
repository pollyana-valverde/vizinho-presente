// Rodapé com o aviso sobre dados simulados e os telefones oficiais de emergência
export default function Rodape() {
  return (
    <footer className="mt-16 border-t border-linha">
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 text-sm text-suave sm:grid-cols-2">
        <p>
          <strong className="text-tinta">Em emergência, ligue:</strong> Defesa Civil 199, Bombeiros 193, SAMU 192.
        </p>
        <p className="sm:text-right">
          Protótipo acadêmico da Global Solution FIAP 2026. Todos os nomes e endereços são fictícios.
        </p>
      </div>
    </footer>
  )
}
