# Vizinho Presente

Quando falta luz no calor e o idoso não responde, o vizinho voluntário é avisado.

Aplicação web da Global Solution 2026.2 (CitizenTech), Engenharia de Software, 1º ano, FIAP.
O mesmo projeto é entregue nas disciplinas **Front-end Design** e **Web Development**.

## Ficha da CitizenTech

| Campo | Resposta |
| --- | --- |
| Nome da CitizenTech | Vizinho Presente |
| Cidade e bairro | São Paulo (SP) |
| Cidadão beneficiado | Idoso que mora sozinho e o vizinho voluntário que pode ir até a casa dele em uma emergência. |
| Problema, em uma frase | Quando um temporal do El Niño derruba a energia em dias de calor, idosos que moram sozinhos ficam sem ventilação e sem ter como pedir ajuda, e ninguém percebe a tempo. |
| Como funciona | Um aparelho simples na casa do idoso percebe quando a luz acaba e mede a temperatura. O idoso aperta um botão "estou bem" para avisar que está tudo certo. Se faltar luz, a casa esquentar e ninguém apertar o botão, os vizinhos voluntários recebem um alerta no site e um deles vai até lá fazer a visita. |
| O que cada parte faz | **Sensor (Edge):** percebe a falta de luz e o calor e decide o nível de alerta. **Lógica (Python):** organiza o cadastro de idosos e voluntários e o histórico de visitas. **Matemática:** calcula em quanto tempo a casa fica quente demais. **Interface e Interação (este site):** onde voluntários veem os alertas e registram as visitas. **Experiência:** jornada, requisitos e protótipo. **Pitch:** o vídeo que conta a história. |
| Link do repositório | https://github.com/pollyana-valverde/vizinho-presente |
| Link do site publicado | https://vizinho-presente.vercel.app |
| Indicador de impacto | Tempo entre o alerta e a visita do voluntário (meta: até 30 minutos) e porcentagem de alertas atendidos dentro da meta. Os dois aparecem na página Histórico. |
| ODS conectados | ODS 3 (Saúde e bem-estar), ODS 10 (Redução das desigualdades), ODS 11 (Cidades e comunidades sustentáveis), ODS 13 (Ação contra a mudança global do clima). |

## Equipe

| Nome | RM |
| --- | --- |
| Pollyana Valverde dos Santos | RM569871 |
| Luana Lopes Sventkauskas | RM569643 |
| João Fernando Gonçalves Senziani | RM572144 |

## O que o site faz

| Página | O que a pessoa consegue fazer |
| --- | --- |
| Início | Entender o projeto e ver os números da rede: alertas urgentes, aguardando, a caminho e voluntários disponíveis. |
| Alertas | Ver as casas em risco ordenadas por prioridade, simular uma leitura do sensor (abrir alerta), escolher um voluntário ("Vou até lá"), devolver o alerta para a fila ("Não consigo ir"), registrar a visita e excluir alertas abertos por engano. A lista se atualiza sozinha a cada 30 segundos. |
| Voluntários | Cadastrar, buscar, editar, pausar, reativar e excluir voluntários. |
| Histórico | Ver as visitas concluídas e o indicador de impacto (tempo médio e porcentagem dentro da meta de 30 minutos). |
| Sobre | Problema, solução, ODS, equipe e um botão para carregar dados fictícios de demonstração. |

### Regras de negócio aplicadas

* O nível de risco é calculado a partir da leitura do sensor, com os mesmos limites usados no ESP32 e no relatório de Matemática:
  * **Normal:** a casa tem energia.
  * **Sem energia:** a luz caiu e a casa está abaixo de 30 °C.
  * **Atenção:** sem luz e 30 °C ou mais (ou 32 °C ou mais, mas o morador apertou "estou bem").
  * **Pedir ajuda:** sem luz, 32 °C ou mais e ninguém apertou "estou bem".
* Só um voluntário **ativo** pode assumir um alerta, e só se o alerta ainda estiver **aberto**.
* Um alerta só é encerrado depois do **registro da visita**, com relato de pelo menos 10 caracteres.
* Os alertas aparecem por prioridade: primeiro os que aguardam voluntário, depois os mais graves, depois os mais antigos.
* Na hora de escolher quem vai, aparecem primeiro os voluntários que moram na mesma rua.

## Tecnologias

* React 19 com Vite
* Tailwind CSS 4
* React Router
* MockAPI (API externa com as operações de criar, consultar, atualizar e excluir)
* Vercel (publicação do site)

## Pré-requisitos

* Node.js 20 ou mais recente
* npm (já vem com o Node.js)
* Uma API criada no MockAPI (passo a passo abaixo)

## Como criar a API no MockAPI

1. Acesse mockapi.io e crie uma conta gratuita.
2. Clique em **New project**, dê o nome `vizinho-presente` e, em **API prefix**, escreva `/api/v1`.
3. Dentro do projeto, clique em **New resource** e crie o recurso `voluntarios` com estes campos:

   | Campo | Tipo |
   | --- | --- |
   | nome | String |
   | telefone | String |
   | rua | String |
   | disponibilidade | String |
   | ativo | Boolean |
   | criadoEm | String |

4. Crie o recurso `alertas` com estes campos:

   | Campo | Tipo |
   | --- | --- |
   | idoso | String |
   | endereco | String |
   | temperatura | Number |
   | semEnergia | Boolean |
   | respondeu | Boolean |
   | nivel | String |
   | status | String |
   | voluntarioId | String |
   | voluntarioNome | String |
   | relato | String |
   | abertoEm | String |
   | atendidoEm | String |

5. Se o MockAPI gerar registros automáticos nos recursos, apague todos (deixe a quantidade em 0).
6. Copie o endereço do projeto, que aparece no topo da página. Ele tem este formato: `https://SEU_CODIGO.mockapi.io/api/v1`.

## Como instalar e executar

```bash
# 1. Entrar na pasta do projeto
cd vizinho-presente

# 2. Instalar as dependências
npm install

# 3. Rodar em modo de desenvolvimento
npm run dev
```

O arquivo `.env` já vem configurado com a API da equipe. Para usar outra API do MockAPI, troque o valor de `VITE_API_URL` no `.env` (o modelo está em `.env.example`).

Depois, abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

Para ter dados de demonstração, abra a página **Sobre** e clique em **Carregar dados de exemplo** (apenas uma vez).

### Outros comandos

| Comando | Para que serve |
| --- | --- |
| `npm run build` | Gera a versão final do site na pasta `dist` |
| `npm run preview` | Abre a versão final para conferir antes de publicar |
| `npm run lint` | Verifica problemas no código |

## Como publicar na Vercel

1. Importe o repositório do GitHub na Vercel.
2. Clique em **Deploy**. O endereço da API já está no arquivo `.env`.
3. Se quiser usar outra API, crie a variável `VITE_API_URL` em **Environment Variables**. O arquivo `vercel.json` já faz as rotas do React funcionarem ao recarregar a página.

## Organização do código

A lógica de negócio, o acesso aos dados e a parte visual ficam separados:

```
src/
  services/      Acesso aos dados: única camada que conversa com a API (MockAPI)
    api.js                 Requisições, tratamento de erros e mensagens amigáveis
    alertasService.js      Operações de alertas
    voluntariosService.js  Operações de voluntários
    dadosExemplo.js        Dados fictícios para demonstração
  utils/         Regras de negócio e formatação, sem React e sem API
    regras.js              Níveis de risco, validações, prioridade e indicadores
    formatadores.js        Datas, tempos, telefone e temperatura
  hooks/         Hooks personalizados que ligam regras e dados às telas
    useAlertas.js          Estado e CRUD de alertas, atualização automática
    useVoluntarios.js      Estado e CRUD de voluntários
    useFormulario.js       Valores, validação e envio de formulários
    useAviso.js            Mensagens de sucesso e erro
    useRelogio.js          Hora atual que se atualiza sozinha
  components/    Componentes visuais reutilizáveis
  pages/         Páginas do site (Início, Alertas, Voluntários, Histórico, Sobre)
```

### Componentes

Botao, CampoFormulario, SeloNivel, EstadoTela (Carregando, MensagemErro, EstadoVazio), JanelaModal, ProvedorAvisos, Cabecalho, Rodape, CartaoNumero, CartaoAlerta, FormularioAlerta, CartaoVoluntario e FormularioVoluntario.

## Requisitos das disciplinas

| Requisito | Onde está |
| --- | --- |
| React com Vite | `vite.config.js`, `src/main.jsx` |
| Tailwind CSS | `src/index.css` e classes nos componentes |
| No mínimo 8 componentes | 13 arquivos em `src/components` |
| useState e useEffect | Hooks e páginas, por exemplo `src/hooks/useAlertas.js` |
| No mínimo 2 hooks personalizados | 5 hooks em `src/hooks` |
| Lógica e dados separados da parte visual | `src/services`, `src/utils` e `src/hooks` |
| API externa com criar, consultar, atualizar e excluir | Voluntários e alertas no MockAPI |
| Funcionalidades ligadas ao tema | Alertas, visitas, rede de voluntários e indicador de impacto |
| No mínimo 15 commits | Histórico do Git |

## Acessibilidade

* Fonte Atkinson Hyperlegible, criada para pessoas com baixa visão, e texto base maior (18 px).
* Botões com área de toque de no mínimo 48 px.
* Os níveis de risco sempre aparecem com cor **e** texto.
* Rótulos ligados aos campos, mensagens de erro lidas por leitores de tela e foco visível no teclado.
* Link "Pular para o conteúdo" e janelas que fecham com a tecla Esc.

## Dados

Todos os nomes, telefones e endereços usados no projeto são fictícios. Nenhum dado pessoal real é armazenado.
