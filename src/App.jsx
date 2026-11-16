import { Route, Routes } from 'react-router-dom'
import Cabecalho from './components/Cabecalho'
import Rodape from './components/Rodape'

function Temporaria({ titulo }) {
  return <h1 className="text-3xl font-bold">{titulo}</h1>
}

// Define as rotas (páginas) do site
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Temporaria titulo="Início" />} />
          <Route path="/alertas" element={<Temporaria titulo="Alertas" />} />
          <Route path="/voluntarios" element={<Temporaria titulo="Voluntários" />} />
          <Route path="/historico" element={<Temporaria titulo="Histórico" />} />
          <Route path="/sobre" element={<Temporaria titulo="Sobre" />} />
        </Routes>
      </main>
      <Rodape />
    </div>
  )
}
