# MINHA PLANTINHA — DOCUMENTO DE DESIGN SYSTEM & IDENTIDADE VISUAL
**Versão**: 2.0 (Redesign Profissional & Arquitetura Visual)  
**Status**: Especificação Oficial de Cores e Tipografia  
**Escopo**: Horta Tradicional & Cultivo de Cannabis Medicinal  

---

## 1. Filosofia de Design & Diferenciação dos Ambientes

O aplicativo **Minha Plantinha** é estruturado sobre dois ecossistemas botânicos complementares, cada um com sua atmosfera e necessidades funcionais distintas, mas unidos pelo mesmo rigor tipográfico e qualidade de acabamento:

```
                             MINHA PLANTINHA
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
   HORTA TRADICIONAL                                CANNABIS MEDICINAL
  (Alimentar & Ornamental)                          (Fitoterápica & Especializada)
  • Clima: Solar, Acolhedor, Rústico-Refinado       • Clima: Técnico, Agronômico, Noturno
  • Materiais: Cerâmica, Linho, Areia, Argila       • Materiais: Vidro escuro, Resina, Cobre
  • Emoção: Cuidado cotidiano, afeto da terra       • Emoção: Precisão, dados, monitoramento
```

---

## 2. Paleta de Cores: Horta Tradicional

Inspirada em hortas comunitárias, estufas mediterrâneas, vasos de terracota artesanal e sementes ancestrais. Evita o aspecto sintético de "tema escuro genérico" introduzindo calor mineral e conforto óptico.

### 2.1. Tons de Areia, Linho e Superfícies (Neutros Quentes)

| Token / Nome | Hex | Aplicação no App | Contraste WCAG |
|---|---|---|---|
| `sand-50` (Linho Puro) | `#FAF8F5` | Fundo principal da Horta em modo claro / Destaque de leitura | 17.5:1 vs texto escuro |
| `sand-100` (Areia Fina) | `#F3EFEA` | Fundo de cartões secundários e inputs claros | 15.2:1 vs texto escuro |
| `sand-200` (Palha Seca) | `#E7DFD5` | Bordas sutis, divisórias de seções e linhas de tabela | 1.8:1 (decorativo) |
| `sand-850` (Terra Noturna) | `#1A1916` | Fundo elevado da Horta em modo escuro | 13.9:1 vs texto areia |
| `sand-900` (Solo Escuro) | `#141311` | Fundo base imersivo da Horta em modo escuro | 16.4:1 vs texto areia |
| `sand-950` (Noite Orgânica) | `#0D0C0A` | Camada mais profunda (modais e backdrops) | 19.1:1 vs texto areia |

### 2.2. Tons de Terracota & Cerâmica (Acentos de Terra)

| Token / Nome | Hex | Aplicação no App | Contraste WCAG |
|---|---|---|---|
| `terracotta-300` (Pêssego Argila) | `#F09B82` | Textos de destaque sobre fundos escuros, etiquetas de colheita | Passa AA (4.8:1) |
| `terracotta-400` (Cerâmica Solar) | `#DE7355` | Ícones de rega/adubação da horta, badges de status ativo | Passa AA |
| `terracotta-500` (Terracota Queimado) | `#C2593F` | Botões primários da horta, botões de ação (CTA), barras de progresso | Passa AA |
| `terracotta-600` (Tijolo Rústico) | `#A2422A` | Estados de hover e foco em botões e links da horta | Passa AAA |
| `terracotta-900` (Argila Profunda) | `#3D1810` | Fundo sutil de cards em alerta moderado ou dicas de plantio | Passa AA |

### 2.3. Verde Floresta & Oliva Natural (Vegetação Tradicional)

| Token / Nome | Hex | Aplicação no App | Contraste WCAG |
|---|---|---|---|
| `forest-300` (Broto de Hortelã) | `#86C5A9` | Indicador de saúde alta, folhas jovens na horta | Passa AA |
| `forest-500` (Folha de Louro) | `#3D7A60` | Acentos botânicos de crescimento, gráficos de consistência | Passa AA |
| `forest-700` (Copa da Árvore) | `#234938` | Superfícies ativas, tabs selecionadas da horta | Passa AA |
| `forest-800` (Verde Floresta Nobre) | `#193327` | Bordas reforçadas e fundos de badges na horta | Passa AAA |

---

## 3. Paleta de Cores: Cannabis Medicinal

Projetada para atender cultivadores medicinais que operam em ciclos rigorosos de fotoperíodo, medição de pH/EC, densidade de tricomas e acompanhamento de fertirrigação. Utiliza estética dark agronômica, com elementos luminescentes que remetem a terpenos e resinas.

### 3.1. Verdes Botânicos & Espaço Vegetativo

| Token / Nome | Hex | Aplicação no App | Contraste WCAG |
|---|---|---|---|
| `cannabis-emerald-400` (Jade Fotossintético) | `#34D399` | Textos de destaque técnico, valor de pH ideal, tags de genética | Passa AA (8.9:1) |
| `cannabis-emerald-500` (Clorofila Pura) | `#10B981` | Botão do Assistente de IA, switch de fotoperíodo, estágios da vega | Passa AA |
| `cannabis-forest-800` (Cabine de Cultivo) | `#0E2219` | Cards de fertirrigação, ficha de strain, blocos de sensores | Passa AAA |
| `cannabis-forest-900` (Substrato Escuro) | `#08100D` | Fundo principal da aba de Cannabis | Passa AAA |
| `cannabis-forest-950` (Câmara Escura) | `#040907` | Base de drawers (Assistente de IA), modais de diagnóstico | Passa AAA |

### 3.2. Âmbar Canabinoide & Maturação de Tricomas

| Token / Nome | Hex | Aplicação no App | Contraste WCAG |
|---|---|---|---|
| `trichome-amber-300` (Resina Dourada) | `#FCD34D` | Alertas de início de colheita (tricomas âmbar), notas de sabor | Passa AA |
| `trichome-amber-400` (Pólen Dourado) | `#F59E0B` | Badges de floração avançada, avisos de flush, destaque de THC | Passa AA |
| `trichome-amber-500` (Âmbar Puro) | `#D97706` | Acentos de iluminação, ciclo de floração 12/12, botão de conversar | Passa AA |
| `trichome-amber-800` (Resina Concentrada) | `#78350F` | Fundo sutil de avisos legais e prescrições médicas | Passa AA |

### 3.3. Tons Terrosos, Cobre & Substrato (Solo Vivo & Fibra de Coco)

| Token / Nome | Hex | Aplicação no App | Contraste WCAG |
|---|---|---|---|
| `copper-400` (Cobre Orgânico) | `#D98863` | Indicador de condutividade elétrica (EC / PPM), nutrientes de flora | Passa AA |
| `copper-500` (Terra Vermelha) | `#B85D36` | Acentos de fertirrigação, cronograma de regas com fertilizante | Passa AA |
| `coco-900` (Fibra de Coco Úmida) | `#231812` | Superfície de histórico de dosagens e misturas de nutrientes | Passa AAA |

---

## 4. Hierarquia de Fontes para os Componentes Existentes

A tipografia do Minha Plantinha é baseada em três famílias especializadas:
1. **Playfair Display (Serifada Botânica)**: Títulos de prestígio, nomes botânicos de espécies/strains e cabeçalhos editoriais.
2. **Plus Jakarta Sans (Sans-serif Humanista)**: Rótulos de interface, textos explicativos, formulários, botões e navegação mobile.
3. **JetBrains Mono / System Monospace (Monospaçada Técnica)**: Métricas agronômicas exatas (dias de vida, temperaturas, pH 6.2, EC 1.4 mS/cm, datas ISO).

### Mapeamento Detalhado por Componente

| Componente | Elemento Interno | Família de Fonte | Peso | Tamanho Mobile / Desktop | Exemplo no App |
|---|---|---|---|---|---|
| **Header** (`Header.tsx`) | Nome do App (`h1`) | `Playfair Display` | Bold (700) | `text-xl` / `text-2xl` | *"Minha Plantinha"* |
| | Subtítulo / Saudação | `Plus Jakarta Sans` | Regular (400) | `text-xs` / `text-sm` | *"Bom cultivo, Camila"* |
| | Badges de Notificação | `Plus Jakarta Sans` | SemiBold (600) | `text-[10px]` / `text-xs` | *"2 alertas"* |
| **Navigation** (`Navigation.tsx`) | Rótulos das Abas (Bottom Bar) | `Plus Jakarta Sans` | Medium (500) | `text-[11px]` | *"Horta"*, *"Cannabis"*, *"Diário"* |
| | Contador de Itens (Sidebar) | `font-mono` | SemiBold (600) | `text-[10px]` | *"[ 8 ]"* |
| **Cards de Plantas** (`PlantCard.tsx`) | Nome Popular da Planta | `Playfair Display` | SemiBold (600) | `text-lg` / `text-xl` | *"Tomate Cereja"*, *"OG Kush"* |
| | Nome Botânico / Linhagem | `Playfair Display` (itálico) | Regular (400) | `text-xs` | *Solanum lycopersicum* |
| | Indicador de Dias de Vida | `font-mono` | Medium (500) | `text-xs` | *"Dia 42"*, *"+186 dias"* |
| | Frequência de Rega | `Plus Jakarta Sans` | Regular (400) | `text-xs` | *"A cada 2 dias"* |
| **Assistente de Genética** (`GeneticsAssistantTab.tsx`) | Título da Ficha | `Playfair Display` | Bold (700) | `text-xl` / `text-2xl` | *"Ficha Técnica: Gorilla Glue"* |
| | Parentais e Breeder | `Plus Jakarta Sans` | Medium (500) | `text-sm` | *"Chem's Sister × Sour Dubb"* |
| | Porcentagens THC/CBD | `font-mono` | Bold (700) | `text-base` | *"THC: 24-28% | CBD: < 1%"* |
| | Dificuldade & Produção | `Plus Jakarta Sans` | Regular (400) | `text-xs` | *"Indoor: 500g/m²"* |
| **Fases do Cultivo** (`CultivationPhasesAccordion.tsx`) | Nome da Fase (Germinação, Vega, Flora) | `Plus Jakarta Sans` | SemiBold (600) | `text-sm` / `text-base` | *"Fase 3: Vegetativo (Semanas 3 a 6)"* |
| | Parâmetros Técnicos (Luz/UR/VPD) | `font-mono` | SemiBold (600) | `text-xs` / `text-sm` | *"18/6h • 24°C • 65% UR • 1.0 kPa"* |
| | Instruções de Poda e Cuidados | `Plus Jakarta Sans` | Regular (400) | `text-xs` / `text-sm` | *"Iniciar LST no 4º nó foliar"* |
| **Clima & Alertas** (`ClimaWidget.tsx`) | Temperatura Atual | `font-mono` | Bold (700) | `text-3xl` / `text-4xl` | *"24°C"* |
| | Cidade e Condição | `Plus Jakarta Sans` | Medium (500) | `text-sm` | *"São Paulo, SP • Parcialmente nublado"* |
| | Título do Alerta | `Plus Jakarta Sans` | SemiBold (600) | `text-sm` | *"Vento forte detectado (38 km/h)"* |
| **Comparativo de Fotos** (`PhotoComparisonSlider.tsx`) | Rótulos das Datas (Antes / Depois) | `font-mono` | SemiBold (600) | `text-xs` | *"12/Jan/2026 ➔ 20/Fev/2026"* |
| | Legenda de Evolução | `Plus Jakarta Sans` | Regular (400) | `text-xs` | *"+39 dias de ramificação"* |
| **Botões & Modais** (`Button.tsx`, `PlantModal.tsx`) | Texto do Botão (CTA) | `Plus Jakarta Sans` | SemiBold (600) | `text-sm` | *"Salvar Registro"*, *"Adicionar Planta"* |
| | Rótulo do Campo (`label`) | `Plus Jakarta Sans` | Medium (500) | `text-xs` / `text-sm` | *"Espécie ou Genética"*, *"Data do Plantio"* |
| | Textos de Ajuda (`helper text`) | `Plus Jakarta Sans` | Regular (400) | `text-[11px]` | *"Opcional. Ex: Sol Pleno ou Meia-sombra"* |

---

## 5. Mapeamento de Tokens CSS para Tailwind v4 (`src/index.css`)

Estes tokens complementam e organizam o bloco `@theme` existente sem quebrar nenhuma classe legada:

```css
@theme {
  /* Horta Tradicional — Terracota, Areia e Cerâmica */
  --color-sand-50: #faf8f5;
  --color-sand-100: #f3efea;
  --color-sand-200: #e7dfd5;
  --color-sand-850: #1a1916;
  --color-sand-900: #141311;
  --color-sand-950: #0d0c0a;

  --color-terracotta-300: #f09b82;
  --color-terracotta-400: #de7355;
  --color-terracotta-500: #c2593f;
  --color-terracotta-600: #a2422a;
  --color-terracotta-900: #3d1810;

  --color-garden-300: #86c5a9;
  --color-garden-500: #3d7a60;
  --color-garden-700: #234938;
  --color-garden-800: #193327;

  /* Cannabis Medicinal — Esmeralda, Âmbar e Cobre */
  --color-cannabis-emerald-400: #34d399;
  --color-cannabis-emerald-500: #10b981;
  --color-cannabis-forest-800: #0e2219;
  --color-cannabis-forest-900: #08100d;
  --color-cannabis-forest-950: #040907;

  --color-trichome-amber-300: #fcd34d;
  --color-trichome-amber-400: #f59e0b;
  --color-trichome-amber-500: #d97706;
  --color-trichome-amber-800: #78350f;

  --color-copper-400: #d98863;
  --color-copper-500: #b85d36;
  --color-coco-900: #231812;

  /* Tipografia */
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

---

## 6. Regras de Ouro de Aplicação (Design Guidelines)

1. **Sem Gradientes Excessivos ou Efeito Plástico**: Os cards devem ter fundos sólidos foscos com transparência suave (`backdrop-blur-md`) e bordas de `1px` com contraste orgânico (ex: `border-terracotta-500/20` na horta; `border-emerald-500/20` na cannabis).
2. **Zero-Pill Discipline**: Botões de ação e cards principais adotam cantos arredondados de `12px` (`rounded-xl`) a `20px` (`rounded-2xl`). As pílulas completas (`rounded-full`) são reservadas unicamente para pequenos badges de status (`Ativa`, `Colheita`, `Atrasada`).
3. **Legibilidade Solar na Horta**: Todo texto de metadado na Horta Tradicional deve manter razão de contraste mínima de **4.5:1 (WCAG AA)**, evitando opacidades abaixo de `70%`.
4. **Precisão Agronômica na Cannabis**: Toda métrica de pH, EC, dias de floração, fotoperíodo e umidade relativa (UR) deve obrigatoriamente renderizar em `font-mono` para alinhamento tabular e leitura rápida.
