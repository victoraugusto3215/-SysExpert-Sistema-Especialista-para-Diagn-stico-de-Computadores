# 🧠 SysExpert — Sistema Especialista para Diagnóstico de Computadores

> Trabalho Prático — Sistemas Especialistas com Encadeamento para Frente  
> Disciplina: Inteligência Artificial

---

## 📌 Sobre o Projeto

O **SysExpert** é um sistema especialista desenvolvido para diagnosticar problemas comuns em computadores pessoais. O sistema utiliza **encadeamento para frente (forward chaining)** como técnica de inferência, permitindo que o usuário informe os sintomas observados e receba automaticamente diagnósticos, explicações do raciocínio utilizado e recomendações de solução.

---

## 🗂️ Estrutura do Projeto

```
sysexpert/
├── index.html   # Estrutura da interface (HTML semântico, sem estilos inline)
├── style.css    # Todos os estilos da aplicação
└── app.js       # Lógica completa: motor de inferência, CRUD e renderização
```

---

## ▶️ Como Executar

1. Baixe os três arquivos (`index.html`, `style.css`, `app.js`)
2. Coloque-os na **mesma pasta**
3. Abra o arquivo `index.html` em um navegador moderno (Chrome, Edge ou Firefox)
4. Nenhuma instalação, servidor ou dependência externa é necessária

> ⚠️ Os arquivos precisam estar na mesma pasta. Abrir o `index.html` sem o `style.css` e o `app.js` ao lado resultará em uma página sem estilo e sem funcionalidade.

---

## 🧩 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Seleção de fatos | O usuário marca os sintomas observados no computador |
| Motor de inferência | Executa o encadeamento para frente sobre os fatos selecionados |
| Conclusões | Exibe os diagnósticos obtidos com severidade e recomendação |
| Motor de explicação | Mostra quais regras foram disparadas, em que iteração e por quê |
| Base de fatos | Visualização, cadastro e remoção de fatos |
| Base de regras | Visualização, cadastro e remoção de regras |
| Persistência | Fatos e regras são salvos automaticamente via `localStorage` |

---

## 🏗️ Arquitetura do Sistema

### Base de Fatos
Armazena os fatos observáveis pelo usuário (sintomas). Cada fato possui:
- **Chave** — identificador único (ex.: `computador_lento`)
- **Rótulo** — texto legível exibido na interface
- **Descrição** — explicação do sintoma

### Base de Regras
Regras no formato `SE <condições> ENTÃO <conclusão>`. Cada regra possui:
- **ID** — identificador único (ex.: `R01`)
- **Condições** — lista de chaves de fatos que devem estar presentes
- **Conclusão** — diagnóstico resultante
- **Severidade** — `alta`, `media` ou `baixa`
- **Recomendação** — orientação ao usuário

### Motor de Inferência — Encadeamento para Frente
```
1. Inicializa a memória de trabalho com os fatos selecionados pelo usuário
2. Percorre todas as regras da base
3. Para cada regra não disparada, verifica se TODAS as condições estão na memória
4. Se sim, dispara a regra e registra na trilha de inferência
5. Repete até não haver novas regras disparáveis (convergência)
   Limite máximo: 50 iterações (proteção contra loops)
```

### Motor de Explicação
Registra a cadeia completa de raciocínio: quais regras foram disparadas, em qual iteração, quais fatos satisfizeram cada condição e qual foi a conclusão obtida.

---

## 📋 Regras Pré-cadastradas

| ID | Nome | Severidade |
|---|---|---|
| R01 | Diagnóstico de Vírus/Malware | 🔴 Alta |
| R02 | Suspeita de Adware | 🟡 Média |
| R03 | Falha Iminente do HD | 🔴 Alta |
| R04 | Superaquecimento por Poeira | 🔴 Alta |
| R05 | Problema de DNS ou Roteador | 🟡 Média |
| R06 | Problema de Hardware WiFi | 🟡 Média |
| R07 | BSOD por Driver Incompatível | 🔴 Alta |
| R08 | Falha na Memória RAM | 🔴 Alta |
| R09 | Lentidão por Disco Cheio | 🟡 Média |
| R10 | RAM Insuficiente | 🟡 Média |
| R11 | Startup Sobrecarregado | 🟢 Baixa |
| R12 | Ameaça Ativa pelo Antivírus | 🔴 Alta |

---

## 💡 Exemplo de Uso

1. Acesse a aba **Diagnóstico**
2. Marque os fatos: `Pop-ups e propagandas` + `Programas desconhecidos` + `CPU em uso máximo`
3. Clique em **▶ Executar Inferência**
4. O sistema dispara as regras **R01** e **R02**, exibindo os diagnósticos com recomendações
5. Acesse a aba **Explicação** para ver a cadeia de raciocínio detalhada

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — estrutura semântica da interface
- **CSS3** — estilização com variáveis CSS, grid, flexbox e animações
- **JavaScript (ES6+)** — lógica da aplicação, motor de inferência e manipulação do DOM
- **localStorage** — persistência dos dados no navegador, sem necessidade de servidor
- **Google Fonts** — tipografia (Syne + Space Mono)

Nenhuma biblioteca ou framework externo foi utilizado na lógica principal.

---

## 📁 Entregáveis

- `index.html` — interface navegável
- `style.css` — estilos da aplicação
- `app.js` — lógica completa do sistema especialista
- `regras-sysexpert.docx` — documentação das regras com explicações técnicas
- `README.md` — este arquivo

---

## 👤 Autor
Luiz Felipe, Rafael Soares e Victor Augusto

Trabalho desenvolvido para a disciplina de **Inteligência Artificial**.
