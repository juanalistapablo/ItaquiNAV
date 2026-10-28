# ItaquiNav — Painel de Fila e Status de Navios (Porto do Itaqui)

Aplicação web desenvolvida para a disciplina **Desenvolvimento de Sistemas Web (EECP0036)** do curso de **Engenharia da Computação — UFMA** (Prof. Renan Sousa Freire).

## 1. O que o app faz e qual problema resolve

Com base no estudo *"PORTO DO ITAQUI: Os desafios que envolvem a logística portuária e os problemas ambientais"* (Dantas et al., 2023), um dos principais gargalos operacionais do Porto do Itaqui (São Luís - MA) é o tempo de espera para atracação, agravado pela grande amplitude de maré da Baía de São Marcos e pela lentidão na visualização integrada das filas de navios.

O **ItaquiNav** permite cadastrar, filtrar e gerenciar o fluxo de embarcações dividido nas três etapas operacionais utilizadas pela EMAP (*Sistema Porto Agora*):
1. **Navios Esperados** (em trânsito para o porto).
2. **Navios Fundeados** (ancorados na fila aguardando janela de maré e berço).
3. **Navios Atracados** (em operação de carga/descarga nos berços).

Além disso, o sistema identifica automaticamente embarcações com **calado igual ou superior a 12,0 metros**, exibindo um alerta visual de que a manobra exige **Janela de Maré Cheia**.

## 2. Tecnologias e Arquitetura (Trilha C)

* **HTML5 Semântico:** uso de `<header>`, `<main>`, `<section>`, `<form>`, `<footer>` e `<label>` vinculado a cada `<input>` e `<select>`.
* **CSS3 Responsivo:** layout construído com CSS Grid (`auto-fit` / `minmax`), adaptando-se automaticamente para telas de celulares e computadores sem uso de frameworks.
* **JavaScript Puro (Vanilla JS):**
  * Persistência local com `localStorage` (pré-carregado com 8 embarcações reais extraídas das tabelas de maio/2023 da EMAP presentes no artigo).
  * Validação de entradas vazias e limites numéricos de calado sem quebrar a execução.
  * Segurança contra XSS (*Cross-Site Scripting*): todos os dados são inseridos no DOM exclusivamente via `textContent` e `document.createElement` (nunca `innerHTML`).

## 3. Como rodar localmente

1. Clone este repositório ou extraia os arquivos em uma pasta local:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd itaquinav-dsw
   ```
2. Inicie um servidor HTTP local na pasta do projeto:
   * **Com Python 3:**
     ```bash
     python -m http.server 8000
     ```
   * **Ou pelo VS Code:** clique com o botão direito no `index.html` e selecione **Open with Live Server**.
3. Abra o navegador em `http://localhost:8000`.

## 4. Análise da Aba Rede (Network)

*(Insira abaixo a captura de tela da aba Rede do seu navegador ao rodar em `http://localhost:8000`)*

`![Print da Aba Rede](rede-print.png)`

**Explicação do print da aba Rede:**
A captura da aba Rede (*Network*) mostra a requisição HTTP `GET` enviada pelo navegador para `http://localhost:8000/` ao carregar a aplicação (Trilha C). O servidor local respondeu com o código de status **`200 OK`**, confirmando que o documento principal (`index.html`), a folha de estilos (`style.css`) e o script da aplicação (`app.js`) foram transferidos com sucesso.

## 5. Declaração de Uso de IA

* **Ferramenta utilizada:** Google Gemini.
* **O que foi pedido:**
  1. Análise do artigo científico sobre os gargalos logísticos do Porto do Itaqui (*Dantas et al., 2023*) para escolha do problema e extração dos dados reais das tabelas de navios da EMAP.
  2. Planejamento da arquitetura em camadas (HTML/CSS/JS separados) e estruturação inicial do código seguindo as restrições da atividade (uso estrito de `textContent`, validação de campo vazio e persistência em `localStorage`).
* **O que foi revisado e adaptado pelo aluno:** revisão completa da lógica de mudança de status das embarcações, testes de validação com campos em branco, verificação de responsividade e captura/análise da requisição HTTP na aba Rede no ambiente local.
# ItaquiNAV
