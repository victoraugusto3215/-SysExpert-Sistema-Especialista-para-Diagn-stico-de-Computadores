/**
 * SysExpert — Sistema Especialista para Diagnóstico de Computadores
 * Arquivo: app.js
 *
 * Disciplina: Inteligência Artificial
 * Técnica: Encadeamento para Frente (Forward Chaining)
 *
 * Estrutura:
 *  1. Base de Conhecimento (fatos e regras padrão)
 *  2. Estado da Aplicação
 *  3. Persistência (localStorage)
 *  4. Motor de Inferência
 *  5. Renderização de componentes
 *  6. Handlers de eventos
 *  7. Inicialização
 */

/* ==============================================
   1. BASE DE CONHECIMENTO PADRÃO
   ============================================== */

const DEFAULT_FACTS = [
  { key: "computador_lento",       label: "Computador está lento",           desc: "O sistema demora para responder a comandos simples" },
  { key: "sem_internet",           label: "Sem acesso à internet",           desc: "Não consegue acessar nenhum site" },
  { key: "tela_azul",              label: "Tela azul (BSOD)",                desc: "O Windows exibe tela azul com mensagem de erro" },
  { key: "superaquecimento",       label: "Superaquecimento",                desc: "Computador desliga sozinho ou fica muito quente" },
  { key: "barulho_hd",             label: "Barulho no HD",                   desc: "Ouve-se barulho de clique ou arranhado no HD" },
  { key: "erros_arquivos",         label: "Erros ao abrir arquivos",         desc: "Arquivos corrompidos ou que não abrem" },
  { key: "pop_ups",                label: "Pop-ups e propagandas",           desc: "Aparecem pop-ups e anúncios inesperados" },
  { key: "programas_desconhecidos",label: "Programas desconhecidos",         desc: "Há programas instalados que o usuário não reconhece" },
  { key: "uso_cpu_alto",           label: "CPU em uso máximo",               desc: "Gerenciador de tarefas mostra CPU a 100%" },
  { key: "wifi_conectado",         label: "WiFi aparece conectado",          desc: "O ícone mostra conectado mas sem acesso" },
  { key: "sem_sinal_wifi",         label: "Sem sinal WiFi",                  desc: "Nenhuma rede aparece na lista de WiFi" },
  { key: "reinicia_sozinho",       label: "Reinicia sozinho",                desc: "Computador reinicia inesperadamente sem aviso" },
  { key: "ventoinhas_barulho",     label: "Ventoinhas barulhentas",          desc: "Ventoinhas do computador fazem muito barulho" },
  { key: "espaco_disco_cheio",     label: "Disco quase cheio",               desc: "Menos de 10% de espaço livre no disco" },
  { key: "ram_insuficiente",       label: "Memória RAM insuficiente",        desc: "Sistema avisa sobre pouca memória disponível" },
  { key: "driver_desatualizado",   label: "Driver desatualizado",            desc: "Aviso de driver desatualizado no gerenciador" },
  { key: "antivirus_alertas",      label: "Alertas de antivírus",            desc: "Antivírus emitiu alertas recentes" },
  { key: "lentidao_boot",          label: "Boot lento",                      desc: "Demora muito para o computador ligar completamente" },
];

const DEFAULT_RULES = [
  {
    id: "R01",
    name: "Diagnóstico de Vírus/Malware",
    conditions: ["pop_ups", "programas_desconhecidos", "uso_cpu_alto"],
    conclusion: "Possível infecção por vírus ou malware",
    severity: "alta",
    recommendation: "Execute uma varredura completa com antivírus atualizado. Considere usar Malwarebytes ou Windows Defender offline scan. Evite inserir senhas até resolver.",
  },
  {
    id: "R02",
    name: "Suspeita de Adware",
    conditions: ["pop_ups", "programas_desconhecidos"],
    conclusion: "Suspeita de adware ou programa indesejado",
    severity: "media",
    recommendation: "Verifique os programas instalados em Configurações > Aplicativos. Remova os desconhecidos e execute AdwCleaner.",
  },
  {
    id: "R03",
    name: "Falha Iminente do HD",
    conditions: ["barulho_hd", "erros_arquivos"],
    conclusion: "HD com possível falha física — risco de perda de dados",
    severity: "alta",
    recommendation: "FAÇA BACKUP IMEDIATAMENTE. Execute o chkdsk e use CrystalDiskInfo para verificar a saúde do disco. Considere substituição.",
  },
  {
    id: "R04",
    name: "Superaquecimento por Poeira",
    conditions: ["superaquecimento", "ventoinhas_barulho"],
    conclusion: "Superaquecimento provavelmente causado por acúmulo de poeira",
    severity: "alta",
    recommendation: "Desligue e limpe o computador internamente com ar comprimido. Verifique se a pasta térmica do processador precisa ser trocada.",
  },
  {
    id: "R05",
    name: "Problema de DNS ou Roteador",
    conditions: ["sem_internet", "wifi_conectado"],
    conclusion: "Problema de DNS ou configuração de rede (não é o hardware)",
    severity: "media",
    recommendation: "Tente mudar o DNS para 8.8.8.8 (Google) ou 1.1.1.1 (Cloudflare). Execute: ipconfig /flushdns no terminal. Reinicie o roteador.",
  },
  {
    id: "R06",
    name: "Problema de Hardware WiFi",
    conditions: ["sem_internet", "sem_sinal_wifi"],
    conclusion: "Adaptador WiFi com defeito ou driver corrompido",
    severity: "media",
    recommendation: "Atualize ou reinstale o driver da placa de rede. Tente conectar via cabo para confirmar que é o WiFi. Verifique o Gerenciador de Dispositivos.",
  },
  {
    id: "R07",
    name: "BSOD por Driver Incompatível",
    conditions: ["tela_azul", "driver_desatualizado"],
    conclusion: "BSOD causado por driver incompatível ou corrompido",
    severity: "alta",
    recommendation: "Atualize todos os drivers, especialmente placa de vídeo. Use DDU (Display Driver Uninstaller) se for driver de GPU. Analise o minidump em C:/Windows/Minidump.",
  },
  {
    id: "R08",
    name: "RAM Defeituosa",
    conditions: ["tela_azul", "reinicia_sozinho"],
    conclusion: "Possível falha na memória RAM",
    severity: "alta",
    recommendation: "Execute o Windows Memory Diagnostic ou MemTest86. Tente rodar com apenas um pente de RAM de cada vez para identificar o defeituoso.",
  },
  {
    id: "R09",
    name: "Disco Cheio Prejudicando Desempenho",
    conditions: ["computador_lento", "espaco_disco_cheio"],
    conclusion: "Lentidão causada por disco rígido quase sem espaço",
    severity: "media",
    recommendation: "Libere espaço: esvazie a lixeira, use Limpeza de Disco, desinstale programas desnecessários. Considere mover arquivos para HD externo.",
  },
  {
    id: "R10",
    name: "RAM Insuficiente",
    conditions: ["computador_lento", "ram_insuficiente"],
    conclusion: "Sistema com memória RAM insuficiente para as tarefas atuais",
    severity: "media",
    recommendation: "Feche programas desnecessários em segundo plano. Considere ampliar a RAM. Ajuste o arquivo de paginação virtual do Windows.",
  },
  {
    id: "R11",
    name: "Startup Sobrecarregado",
    conditions: ["lentidao_boot", "computador_lento"],
    conclusion: "Muitos programas na inicialização do sistema",
    severity: "baixa",
    recommendation: "Abra o Gerenciador de Tarefas > guia Inicializar. Desative programas desnecessários. Considere usar o Autoruns da Microsoft.",
  },
  {
    id: "R12",
    name: "Ameaça Ativa pelo Antivírus",
    conditions: ["antivirus_alertas", "computador_lento"],
    conclusion: "Possível ameaça ativa consumindo recursos do sistema",
    severity: "alta",
    recommendation: "Siga as instruções do antivírus para quarentena ou remoção. Faça uma varredura offline se a ameaça persistir.",
  },
];

/* ==============================================
   2. ESTADO DA APLICAÇÃO
   ============================================== */

let facts        = [];
let rules        = [];
let selectedFacts = new Set();
let lastConclusions = [];
let lastTrace       = [];
let condTags        = [];

/* ==============================================
   3. PERSISTÊNCIA (localStorage)
   ============================================== */

/**
 * Carrega fatos e regras do localStorage.
 * Se não houver dados salvos, usa os padrões.
 */
function loadState() {
  const savedFacts = localStorage.getItem('se_facts');
  const savedRules = localStorage.getItem('se_rules');

  facts = savedFacts ? JSON.parse(savedFacts) : JSON.parse(JSON.stringify(DEFAULT_FACTS));
  rules = savedRules ? JSON.parse(savedRules) : JSON.parse(JSON.stringify(DEFAULT_RULES));

  persistState();
}

/** Salva o estado atual no localStorage e atualiza a barra de status. */
function persistState() {
  localStorage.setItem('se_facts', JSON.stringify(facts));
  localStorage.setItem('se_rules', JSON.stringify(rules));
  updateStatusBar();
}

/* ==============================================
   4. MOTOR DE INFERÊNCIA — ENCADEAMENTO PARA FRENTE
   ============================================== */

/**
 * Executa o algoritmo de encadeamento para frente.
 *
 * Algoritmo:
 *  1. Inicializa a memória de trabalho com os fatos selecionados pelo usuário.
 *  2. Itera sobre todas as regras da base.
 *  3. Para cada regra ainda não disparada, verifica se TODAS as suas condições
 *     estão presentes na memória de trabalho.
 *  4. Se sim, dispara a regra, registra na trilha de inferência e marca a regra.
 *  5. Repete até que nenhuma nova regra possa ser disparada (ponto de convergência).
 */
function runInference() {
  if (selectedFacts.size === 0) {
    showToast('⚠️ Selecione pelo menos um fato observado');
    return;
  }

  const workingMemory = new Set(selectedFacts);
  const firedRules    = [];
  const firedIds      = new Set();

  const MAX_ITERATIONS = 50;
  let changed    = true;
  let iterations = 0;

  // Loop principal: continua enquanto houver mudanças e não atingir o limite
  while (changed && iterations < MAX_ITERATIONS) {
    changed = false;
    iterations++;

    for (const rule of rules) {
      // Ignora regras já disparadas (evita loops infinitos)
      if (firedIds.has(rule.id)) continue;

      // Verifica se todas as condições da regra estão satisfeitas
      const allConditionsMet = rule.conditions.every(condition =>
        workingMemory.has(condition)
      );

      if (allConditionsMet) {
        // Dispara a regra e registra na trilha
        firedRules.push({
          rule,
          conditionsUsed: [...rule.conditions],
          iteration: iterations,
        });

        firedIds.add(rule.id);
        changed = true; // houve novo disparo — continua o loop
      }
    }
  }

  // Atualiza o estado global com os resultados
  lastConclusions = firedRules;
  lastTrace       = firedRules;

  renderResults();
  renderExplanation();
  updateStatusBar();

  const timestamp = new Date().toLocaleTimeString('pt-BR');
  document.getElementById('sb-last').textContent = timestamp;

  if (firedRules.length === 0) {
    showToast('Nenhuma regra disparada com os fatos selecionados');
  } else {
    showToast(`✅ ${firedRules.length} conclusão(ões) em ${iterations} iteração(ões)`);
  }
}

/* ==============================================
   5. RENDERIZAÇÃO DE COMPONENTES
   ============================================== */

/** Atualiza os contadores da barra de status. */
function updateStatusBar() {
  document.getElementById('sb-facts').textContent = facts.length;
  document.getElementById('sb-rules').textContent = rules.length;
  document.getElementById('sb-conc').textContent  = lastConclusions.length;
}

/** Renderiza a lista de checkboxes de fatos na página de diagnóstico. */
function renderFactCheckboxes() {
  const container = document.getElementById('fact-checkboxes');

  if (!facts.length) {
    container.innerHTML = '<p class="result-empty">Nenhum fato cadastrado</p>';
    return;
  }

  container.innerHTML = facts.map(fact => `
    <div class="fact-item ${selectedFacts.has(fact.key) ? 'selected' : ''}"
         data-key="${fact.key}">
      <input
        type="checkbox"
        data-key="${fact.key}"
        ${selectedFacts.has(fact.key) ? 'checked' : ''}
        aria-label="${fact.label}"
      />
      <span class="fact-key">${fact.key}</span>
      <span>${fact.label}</span>
    </div>
  `).join('');

  renderActiveBadges();
  bindFactCheckboxEvents();
}

/** Vincula eventos de clique aos itens de fatos renderizados. */
function bindFactCheckboxEvents() {
  document.querySelectorAll('.fact-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return; // checkbox já cuida de si
      toggleFact(item.dataset.key);
    });
  });

  document.querySelectorAll('.fact-item input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => toggleFact(cb.dataset.key));
  });
}

/** Alterna a seleção de um fato. */
function toggleFact(key) {
  if (selectedFacts.has(key)) {
    selectedFacts.delete(key);
  } else {
    selectedFacts.add(key);
  }
  renderFactCheckboxes();
}

/** Limpa todos os fatos selecionados. */
function clearSelection() {
  selectedFacts.clear();
  renderFactCheckboxes();
}

/** Renderiza os badges de fatos ativos abaixo dos checkboxes. */
function renderActiveBadges() {
  const container = document.getElementById('active-facts-badges');

  if (selectedFacts.size === 0) {
    container.innerHTML = '<span class="muted-text" style="font-family:\'Space Mono\',monospace;font-size:0.78rem;">nenhum selecionado</span>';
    return;
  }

  container.innerHTML = [...selectedFacts].map(key => {
    const fact = facts.find(f => f.key === key);
    return `<span class="af-badge">${fact ? fact.label : key}</span>`;
  }).join('');
}

/** Renderiza as conclusões obtidas após a inferência. */
function renderResults() {
  const box = document.getElementById('results-box');

  if (lastConclusions.length === 0) {
    box.innerHTML = `
      <div class="result-empty">
        // Nenhuma conclusão para os fatos selecionados.<br/>
        Tente adicionar mais fatos observados.
      </div>`;
    return;
  }

  box.innerHTML = lastConclusions.map((entry, index) => `
    <div class="conclusion-item" style="animation-delay: ${index * 0.08}s">
      <span class="c-sev sev-${entry.rule.severity}">${entry.rule.severity}</span>
      <div class="c-title">🔎 ${entry.rule.conclusion}</div>
      <div class="c-rule">
        Regra: ${entry.rule.id} — ${entry.rule.name} (iteração ${entry.iteration})
      </div>
      ${entry.rule.recommendation
        ? `<div class="c-rec">💡 <strong>Recomendação:</strong> ${entry.rule.recommendation}</div>`
        : ''}
    </div>
  `).join('');
}

/** Renderiza a cadeia de inferência na aba de explicação. */
function renderExplanation() {
  const card = document.getElementById('explanation-card');

  if (lastTrace.length === 0) {
    card.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">🔍</div>
        Execute um diagnóstico primeiro.
      </div>`;
    return;
  }

  const selectedLabels = [...selectedFacts].map(key => {
    const fact = facts.find(f => f.key === key);
    return fact ? fact.label : key;
  });

  const stepsHTML = lastTrace.map((entry, index) => {
    const conditionsHTML = entry.rule.conditions.map((condKey, condIndex) => {
      const fact = facts.find(f => f.key === condKey);
      const label = fact ? fact.label : condKey;
      const prefix = condIndex > 0
        ? '<br/>&nbsp;&nbsp;&nbsp;<span class="kw-e">E</span> '
        : '';
      return `${prefix}<span class="cond-text">${label}</span>`;
    }).join('');

    return `
      <div class="inference-step" style="animation-delay: ${index * 0.1}s">
        <div>
          <div class="step-num">${String(index + 1).padStart(2, '0')}</div>
          ${index < lastTrace.length - 1 ? '<div class="connector"></div>' : ''}
        </div>
        <div class="step-body">
          <div class="step-rule">${entry.rule.id} — ${entry.rule.name}</div>
          <div class="step-cond">
            <span class="kw-se">SE</span> ${conditionsHTML}
          </div>
          <div class="step-then">→ ENTÃO: ${entry.rule.conclusion}</div>
          <div class="step-meta">
            Severidade:
            <span class="c-sev sev-${entry.rule.severity}" style="font-size:0.7rem">
              ${entry.rule.severity}
            </span>
            • Iteração ${entry.iteration}
          </div>
        </div>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <h3 style="font-weight:800;margin-bottom:6px;">Relatório de Inferência</h3>
    <p class="label-muted" style="margin-bottom:20px;">
      Fatos de entrada:
      ${selectedLabels.map(label => `<span class="af-badge">${label}</span>`).join(' ')}
    </p>
    <h4 class="section-title" style="font-size:0.78rem;">Cadeia de Raciocínio</h4>
    ${stepsHTML}
    <div class="summary-box">
      <div class="summary-box-title">📊 Resumo</div>
      <div class="summary-box-body">
        Fatos de entrada: <span class="status-val">${selectedFacts.size}</span><br/>
        Regras disparadas: <span class="status-val">${lastTrace.length}</span><br/>
        Conclusões obtidas: <span class="status-val">${lastTrace.length}</span>
      </div>
    </div>
  `;
}

/** Renderiza o grid de cartões de fatos na aba Fatos. */
function renderFactsGrid() {
  const grid = document.getElementById('facts-grid');

  if (!facts.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="es-icon">📋</div>
        Nenhum fato cadastrado ainda.
      </div>`;
    return;
  }

  grid.innerHTML = facts.map((fact, index) => `
    <div class="fact-card">
      <div class="fk">${fact.key}</div>
      <div class="fl">${fact.label}</div>
      <div class="fd">${fact.desc || '—'}</div>
      <div class="fact-card-actions">
        <button class="btn btn-danger btn-sm" data-delete-fact="${index}">
          🗑 Remover
        </button>
      </div>
    </div>
  `).join('');

  // Vincula eventos de deleção
  document.querySelectorAll('[data-delete-fact]').forEach(btn => {
    btn.addEventListener('click', () => deleteFact(Number(btn.dataset.deleteFact)));
  });
}

/** Renderiza a lista de regras na aba Regras. */
function renderRulesList() {
  const container = document.getElementById('rules-list');

  if (!rules.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">⚙️</div>
        Nenhuma regra cadastrada ainda.
      </div>`;
    return;
  }

  container.innerHTML = rules.map((rule, index) => {
    const conditionsHTML = rule.conditions.map((condKey, condIndex) => {
      const fact = facts.find(f => f.key === condKey);
      const label = fact ? fact.label : condKey;
      const prefix = condIndex > 0
        ? `<br/><span class="kw-e">   E</span> `
        : '';
      return `${prefix}<span class="cond-text">${label} <span style="color:var(--accent3)">(${condKey})</span></span>`;
    }).join('');

    return `
      <div class="rule-card">
        <div class="rule-header">
          <div>
            <div class="rule-id">${rule.id}</div>
            <div class="rule-name">${rule.name}</div>
          </div>
          <div class="rule-header-right">
            <span class="c-sev sev-${rule.severity}">${rule.severity}</span>
            <button class="btn btn-danger btn-sm" data-delete-rule="${index}">🗑</button>
          </div>
        </div>
        <div class="rule-logic">
          <span class="kw-se">SE</span> ${conditionsHTML}
          <br/><span class="kw-entao">ENTÃO</span>
          <span class="cond-text">${rule.conclusion}</span>
        </div>
        ${rule.recommendation
          ? `<div class="rule-rec">💡 ${rule.recommendation}</div>`
          : ''}
      </div>
    `;
  }).join('');

  // Vincula eventos de deleção
  document.querySelectorAll('[data-delete-rule]').forEach(btn => {
    btn.addEventListener('click', () => deleteRule(Number(btn.dataset.deleteRule)));
  });
}

/** Re-renderiza todos os componentes. */
function renderAll() {
  renderFactCheckboxes();
  renderFactsGrid();
  renderRulesList();
  updateStatusBar();
}

/* ==============================================
   6. CRUD — FATOS
   ============================================== */

function openFactModal() {
  document.getElementById('f-key').value   = '';
  document.getElementById('f-label').value = '';
  document.getElementById('f-desc').value  = '';
  openModal('fact-modal');
}

function saveFact() {
  const key   = document.getElementById('f-key').value.trim().replace(/\s+/g, '_');
  const label = document.getElementById('f-label').value.trim();
  const desc  = document.getElementById('f-desc').value.trim();

  if (!key || !label) {
    showToast('⚠️ Preencha a chave e o rótulo');
    return;
  }

  if (facts.find(f => f.key === key)) {
    showToast('⚠️ Essa chave já existe');
    return;
  }

  facts.push({ key, label, desc });
  persistState();
  closeModal('fact-modal');
  renderAll();
  showToast('✅ Fato salvo com sucesso');
}

function deleteFact(index) {
  if (!confirm('Remover este fato?')) return;

  const key = facts[index].key;
  facts.splice(index, 1);
  selectedFacts.delete(key);

  persistState();
  renderAll();
  showToast('🗑 Fato removido');
}

/* ==============================================
   6. CRUD — REGRAS
   ============================================== */

function openRuleModal() {
  condTags = [];
  document.getElementById('r-name').value       = '';
  document.getElementById('r-conclusion').value = '';
  document.getElementById('r-rec').value        = '';
  document.getElementById('r-severity').value   = 'media';
  renderTagsContainer();
  openModal('rule-modal');
}

function saveRule() {
  const name       = document.getElementById('r-name').value.trim();
  const conclusion = document.getElementById('r-conclusion').value.trim();
  const severity   = document.getElementById('r-severity').value;
  const rec        = document.getElementById('r-rec').value.trim();

  if (!name || !conclusion) {
    showToast('⚠️ Preencha o nome e a conclusão');
    return;
  }

  if (condTags.length === 0) {
    showToast('⚠️ Adicione pelo menos uma condição');
    return;
  }

  const newId = `R${String(rules.length + 1).padStart(2, '0')}`;

  rules.push({
    id: newId,
    name,
    conditions: [...condTags],
    conclusion,
    severity,
    recommendation: rec,
  });

  persistState();
  closeModal('rule-modal');
  renderAll();
  showToast('✅ Regra salva com sucesso');
}

function deleteRule(index) {
  if (!confirm('Remover esta regra?')) return;

  rules.splice(index, 1);
  persistState();
  renderAll();
  showToast('🗑 Regra removida');
}

/* ==============================================
   7. COMPONENTE DE TAGS (condições da regra)
   ============================================== */

function addTag(event) {
  if (event.key !== 'Enter' && event.key !== ',') return;
  event.preventDefault();

  const input = document.getElementById('r-conds-input');
  const value = input.value.trim().replace(/\s+/g, '_');

  if (!value || condTags.includes(value)) return;

  condTags.push(value);
  renderTagsContainer();
  input.value = '';
}

function removeTag(value) {
  condTags = condTags.filter(t => t !== value);
  renderTagsContainer();
}

function renderTagsContainer() {
  const container = document.getElementById('r-conds-container');

  const tagsHTML = condTags.map(tag => `
    <span class="tag">
      ${tag}
      <span class="tag-remove" data-tag="${tag}">×</span>
    </span>
  `).join('');

  container.innerHTML = tagsHTML + `
    <input
      class="tags-input"
      id="r-conds-input"
      placeholder="chave_do_fato + Enter"
      autocomplete="off"
    />
  `;

  // Vincula eventos
  container.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => removeTag(btn.dataset.tag));
  });

  document.getElementById('r-conds-input').addEventListener('keydown', addTag);

  container.addEventListener('click', () => {
    document.getElementById('r-conds-input')?.focus();
  });
}

/* ==============================================
   8. NAVEGAÇÃO ENTRE PÁGINAS
   ============================================== */

function showPage(pageId, clickedTab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  document.getElementById(`page-${pageId}`).classList.add('active');
  clickedTab.classList.add('active');

  renderAll();
}

/* ==============================================
   9. MODAL
   ============================================== */

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* ==============================================
   10. TOAST
   ============================================== */

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ==============================================
   11. INICIALIZAÇÃO E BINDING DE EVENTOS
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Carrega dados persistidos
  loadState();
  renderAll();

  // Navegação
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => showPage(tab.dataset.page, tab));
  });

  // Página de Diagnóstico
  document.getElementById('btn-inferir').addEventListener('click', runInference);
  document.getElementById('btn-limpar').addEventListener('click', clearSelection);

  // Aba Fatos
  document.getElementById('btn-novo-fato').addEventListener('click', openFactModal);
  document.getElementById('btn-salvar-fato').addEventListener('click', saveFact);

  // Aba Regras
  document.getElementById('btn-nova-regra').addEventListener('click', openRuleModal);
  document.getElementById('btn-salvar-regra').addEventListener('click', saveRule);

  // Fechar modais pelo overlay ou pelo botão Cancelar
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

});
