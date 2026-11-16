import { Route, Routes } from 'react-router-dom'
import Cabecalho from './components/Cabecalho'
import Rodape from './components/Rodape'
import Alertas from './pages/Alertas'
import Historico from './pages/Historico'
import Inicio from './pages/Inicio'
import NaoEncontrada from './pages/NaoEncontrada'
import Sobre from './pages/Sobre'
import Voluntarios from './pages/Voluntarios'

// Estrutura geral do site e definição das rotas (páginas)
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/voluntarios" element={<Voluntarios />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <Rodape />
    </div>
  )
}
