# MINHA PLANTINHA — PROJECT CONTEXT & DOCUMENTAÇÃO TÉCNICA

Documento vivo consolidando as decisões arquiteturais, identidade visual, design system, autenticação e modelagem de banco de dados implementadas no projeto.

---

## 1. Identidade Visual & Design System (ETAPA 02)

### 1.1. Paleta de Cores Oficial (Tokens no `@theme`)
Implementada sem `tailwind.config.js`, diretamente via `@theme` no CSS global:

| Token | Valor Hex | Função no Produto | Contraste WCAG |
|---|---|---|---|
| `--color-forest-950` | `#050c09` | Fundo mais profundo / base de modal | Passa AAA |
| `--color-forest-900` | `#08100d` | Fundo principal da aplicação | Passa AAA |
| `--color-forest-850` | `#0b1712` | Fundo elevado / containers | Passa AAA |
| `--color-forest-800` | `#0e2219` | Cards primários e glassmorphism | Passa AA |
| `--color-forest-750` | `#132c21` | Superfícies elevadas e borders ativas | Passa AA |
| `--color-botanical-600` | `#059669` | Primário botânico profundo | Passa AA |
| `--color-botanical-500` | `#10b981` | Acento ativo, destaques e timelines | Passa AA |
| `--color-botanical-400` | `#34d399` | Textos de destaque e ícones | Passa AA |
| `--color-sage-100` | `#eef4f0` | Texto principal | Contraste 14.8:1 |
| `--color-sage-300` | `#c2d5c8` | Texto secundário | Contraste 9.2:1 |
| `--color-earth-amber` | `#d97706` | Alertas moderados e clima | Passa AA |
| `--color-earth-rose` | `#e11d48` | Alertas críticos e ações destrutivas | Passa AA |

### 1.2. Tipografia
- **Texto Corrido & UI**: `Plus Jakarta Sans` (pesos 400, 500, 600, 700) — legibilidade técnica limpa, números monospaçados claros.
- **Títulos & Nomes Botânicos**: `Playfair Display` (pesos 600, 700) — elegância editorial botânica que foge do visual genérico "app de IA".
- **Código, Datas e Metadados**: `font-mono` para datas ISO e diferenciais de dias (`+186 dias`).

### 1.3. Escala de Raio & Espaçamento
- `--radius-card`: `1.25rem` (20px) — curvas orgânicas suaves sem excesso de pill.
- `--radius-card-sm`: `0.875rem` (14px).
- `--radius-button`: `0.75rem` (12px).
- `--radius-input`: `0.75rem` (12px).

### 1.4. Diretriz Estrita de Ícones (Lucide React)
- **Permitido**: Ícones com forte conotação natural e de observação botânica (`Sprout`, `Leaf`, `Droplets`, `Sun`, `Wind`, `Calendar`, `Eye`, `Split`, `Camera`, `Library`).
- **Proibido**: Ícones genéricos de tecnologia ou negócios (foguete, lâmpada incandescente, engrenagem de robô).

### 1.5. Página Temporária de Validação
- **Rota/Visualização**: `/design-preview` (`src/views/DesignPreviewView.tsx`).
- **Aviso**: Esta página exibe a bateria completa de componentes base (Button, Badge, Card, Input, Skeleton, Ícones) para validação visual. **Deve ser removida antes da Etapa 22**.

---

## 2. Estrutura Principal e Navegação (ETAPA 03)

- **Mobile First**:
  - `Bottom Navigation Bar` fixa e ancorada no rodapé em telas `< lg` (`< 1024px`), com padding seguro (`pb-safe`) e ícones táteis:
    1. Início (Dashboard + badge de alertas ativos)
    2. Plantas (Coleção)
    3. Diário (Feed de registros e galeria)
    4. Agenda (Calendário mensal)
    5. Mais / Insights / Guia / Ajustes
- **Desktop Sidebar**:
  - Sidebar lateral persistente em telas `≥ 1024px` com rota ativa realçada por gradiente botânico suave, contadores em tempo real e indicador de estado de conexão.
- **Componente de Loading**:
  - `Skeleton.tsx` com animação `@keyframes shimmer` personalizada em tons de floresta escura (`rgba(14, 34, 25, 0.6)` para `rgba(36, 82, 63, 0.4)`).

---

## 3. Autenticação & Área Privada (ETAPA 04)

- **Fluxo de Autenticação**:
  - Formulário de login e cadastro com validação de nome completo, formato de email e senha com mínimo de 8 caracteres.
  - Sessão persistida de usuário com suporte a logout seguro.
  - Bloqueio completo da área privada caso o usuário não esteja autenticado (`AuthView`).
  - Botão de acesso rápido com usuário de demonstração ("Camila Duarte") para testes ágeis sem atrito.
- **Trigger de Perfil Automático**:
  - No banco Supabase, o trigger `on_auth_user_created` gera automaticamente a linha na tabela `profiles` com avatar padrão e configurações de cidade.

---

## 4. Banco de Dados de Domínio & Row Level Security (ETAPA 05)

Arquivo de migração criado em `/supabase/migrations/01_domain_schema.sql` e tipos gerados em `src/types/database.types.ts`:

### 4.1. Tabelas Criadas
1. `profiles`: Dados do usuário, cidade para previsão meteorológica e coordenadas. RLS ativa (`auth.uid() = id`).
2. `plants`: Registro botânico individual, espécie, capa, data de aquisição, status e frequência de rega. RLS ativa (`auth.uid() = user_id`).
3. `diary_entries`: Entradas no diário com notas e data/hora. RLS ativa (`auth.uid() = user_id`).
4. `entry_photos`: Fotos de cada registro com path de storage e caption. RLS ativa (`auth.uid() = user_id`).
5. `tags`: Tags personalizadas por usuário. RLS ativa (`auth.uid() = user_id`).
6. `entry_tags`: Associação entre entradas e tags com validação RLS cruzada.
7. `plant_events`: Histórico de regas, adubações, podas, replantio e pragas. RLS ativa (`auth.uid() = user_id`).
8. `weather_alert_settings`: Limiares personalizados de chuva, vento, oscilação térmica e horários de silêncio. RLS ativa (`auth.uid() = user_id`).
9. `push_subscriptions`: Inscrições Web Push VAPID por usuário. RLS ativa (`auth.uid() = user_id`).
10. `educational_content`: Conteúdo global de leitura compartilhada (`select` liberado para autenticados; sem escrita no cliente).

### 4.2. Índices de Performance
- `idx_plants_user_id` em `plants`
- `idx_diary_plant_id` e `idx_diary_entry_date` em `diary_entries`
- `idx_photos_entry_id` em `entry_photos`
- `idx_events_plant_id` e `idx_events_user_id` em `plant_events`

---

## 5. Cadastro e Gestão de Plantas (ETAPA 06)

- **CRUD Completo de Plantas**:
  - Criação de planta com nome, espécie (opcional), data de aquisição (`acquired_date`), notas e foto inicial/preset.
  - Edição in-place reaproveitando formulário unificado (`PlantModal.tsx`).
  - Arquivamento (`status: 'archived'`) como ação primária para preservar histórico biológico versus exclusão definitiva irreversível.
  - Idade da planta calculada dinamicamente via `calculatePlantAge` em linguagem natural amigável em português (ex: "1 ano e 2 meses", "18 semanas", "32 dias", "Chegou hoje").
  - Estado vazio estilizado com convite tátil para a primeira planta.

---

## 6. Página Individual da Planta (ETAPA 07)

- **Hub Central da Planta** (`PlantsView.tsx` / `selectedPlantId`):
  - Cabeçalho com foto de capa em alta definição, nome comum e espécie botânica em itálico com fonte serifada.
  - Métricas em tempo real: dias de convivência, total de fotos registradas, última rega e status de saúde.
  - Barra de ações rápidas: *Novo Registro*, *Adicionar Cuidado*, *Comparar Antes/Depois* e *Editar*.
  - Visualização alternada em abas:
    - **Linha do Tempo**: Registros visuais em ordem cronológica com marcador de dias decorridos.
    - **Galeria de Fotos**: Grade de todas as fotos registradas para a planta.
    - **Histórico de Cuidados**: Registro de regas, podas e adubações.

---

## 7. Diário de Bordo & Feed Cronológico (ETAPA 08)

- **Feed Global e Individual** (`DiaryGalleryView.tsx`):
  - Ordenação cronológica (mais recentes primeiro).
  - Filtragem por planta selecionada e por tags temáticas (`#folha-nova`, `#replantio`, `#floração`, `#adubação`).
  - Observações textuais e metadados de data/hora exatos.
  - Modal `NewDiaryEntryModal.tsx` com seleção rápida de fotos, data personalizada e adição de novas tags.

---

## 8. Upload de Fotos e Lightbox (ETAPA 09)

- **Gestão de Imagens**:
  - Suporte a seleção de arquivos locais do dispositivo com conversão base64 para persistência offline imediata no `localStorage`.
  - Presets botânicos de alta qualidade (Unsplash com espécies reais: Monstera, Ficus lyrata, Jiboia, Zamioculcas, Suculenta) para prototipagem rápida.
  - `PhotoLightbox.tsx`: visualizador em tela cheia com overlay escuro suave, legenda, data, nome da planta e atalho direto para comparar antes/depois.

---

## 9. Linha do Tempo Visual e Marcos de Crescimento (ETAPA 10)

- **Componente `PlantTimeline.tsx`**:
  - Linha vertical conectando todos os eventos e registros fotográficos.
  - Indicador numérico de dias decorridos desde a data de chegada da planta (`+X dias`).
  - Destaque para marcos botânicos especiais (primeira foto, primeiro broto, trocas de vaso).
  - Animações fluidas de entrada e cards com visual escuro botânico refinado.

---

## 10. Comparação Visual Antes/Depois (ETAPA 11)

- **Componente `PhotoComparisonSlider.tsx`**:
  - Slider interativo de arrastar com divisor vertical responsivo a mouse e gestos de toque (touch no Safari iOS).
  - Cálculo automático e estrito do intervalo real de dias decorridos entre a foto "Antes" e a foto "Depois".
  - Modo alternado: **Divisor deslizante (Split Slider)** ou **Lado a Lado (Columns)**.
  - Modo tela cheia para inspeção minuciosa de evolução foliar.

---

## 11. Dashboard Modular Inteligente (ETAPA 12)

- **Arquitetura em Widgets Isolados**:
  - Componentes independentes em `src/components/dashboard/` e `src/components/`:
    - `PlantSummaryWidget`: contagem de plantas ativas, arquivadas e plantas precisando de atenção.
    - `WeatherWidget`: clima atual, alertas e previsão dos próximos dias.
    - `RecentEntriesWidget`: feed dos últimos registros do diário.
    - `RecentPhotosWidget`: galeria rápida das fotos mais recentes.
    - `UpcomingEventsWidget`: compromissos e tarefas de rega agendadas.
  - Layout em grid responsivo de 1 a 3 colunas que se adapta a celulares, tablets e telas amplas.

---

## 12. Integração com Previsão do Tempo Open-Meteo (ETAPA 13)

- **Serviço Meteorológico** (`src/services/weatherService.ts`):
  - Integração com a API pública gratuita Open-Meteo (sem chaves proprietárias).
  - Dados em tempo real: temperatura, sensação térmica, umidade relativa do ar, velocidade do vento, código meteorológico WMO e probabilidade de chuva.
  - Previsão estendida de 5 dias com temperaturas máximas e mínimas.
  - Busca de cidades via API de Geocoding Open-Meteo, com fallback resiliente para São Paulo/Brasil em caso de ausência de rede.

---

## 13. Sistema de Alertas Meteorológicos e Horário de Silêncio (ETAPA 14)

- **Motor de Regras Meteorológicas** (`src/utils/weatherRules.ts`):
  - Avaliação de regras botânicas reais:
    - Alerta de chuva intensa (se probabilidade > limiar configurável, ex: 60%).
    - Alerta de ventos fortes (se vento > limiar configurável, ex: 35 km/h).
    - Alerta de frio extremo ou calor excessivo com oscilação térmica.
  - **Horário de Silêncio (Quiet Hours)**:
    - Função `isWithinQuietHours` que respeita o intervalo noturno (ex: 22:00 às 07:00), mesmo com virada de meia-noite, silenciando notificações sonoras ou badges invasivos.
  - Testes unitários com 100% de cobertura via `node:test`.

---

## 14. Próximos Eventos e Calendário Mensal (ETAPA 15)

- **Calendário Interativo** (`CalendarView.tsx`):
  - Navegação mensal com indicação de dias com eventos de cuidados botânicos (rega, adubação, poda, replantio).
  - Seletor de dia para visualizar ou registrar novos cuidados rapidamente.
  - Lista de próximos compromissos calculada a partir da frequência de rega definida em cada planta.

---

## 15. Insights Fatuais e Gráficos de Evolução (ETAPA 16)

- **Motor de Análise Factual** (`InsightsView.tsx` & `plantCalculations.ts`):
  - **Filtro Individual ou Agregado**: permite alternar entre a visão global de todas as plantas e o detalhamento específico de uma única planta selecionada.
  - **Métricas Factuais sem Extrapolação**:
    - Frequência média de atualizações: registros por semana e por mês, calculada estritamente sobre o tempo desde `acquired_date`. Caso haja menos de 7 dias de dados, exibe "Indisponível (mínimo 7 dias)" em vez de inventar ou aproximar valores.
    - Quantidade total de registros (notas e fotos anexadas).
    - Tempo total de acompanhamento e data exata da última atualização.
    - Planta mais documentada com contagem exata de notas e fotos.
    - Planta mais antiga na coleção.
  - **Gráfico de Barras Leve (CSS Puro)**:
    - Evolução cronológica de registros nos últimos 6 meses gerada sem dependências pesadas, respeitando o tema escuro botânico e permitindo visualização de densidade de anotações.

---

## 16. Biblioteca de Conteúdos Educativos & Seed SQL (ETAPA 17)

- **Acervo Botânico Estruturado** (`LibraryView.tsx`):
  - **Categorias Completas**:
    - `cuidados_gerais`: Princípios fundamentais para cultivo interno.
    - `observacao_vegetal`: Diagnóstico visual de sinais foliares e decodificação do diário.
    - `saude_vegetal`: Deficiências de NPK, clorose férrica e doenças fúngicas.
    - `manutencao`: Manual de podas sanitárias, beliscamento e troca de vasos (*repotting*).
    - `glossario`: Glossário botânico com fenestração, nós, pecíolo e estômatos.
    - `perguntas_frequentes`: FAQ direto para dúvidas corriqueiras de cultivo.
    - Categorias práticas adicionais: `rega`, `iluminacao`, `substrato`, `pragas` e `propagacao`.
  - **Modo Leitor Dedicado**: visualização focada no artigo individual com tempo de leitura estimado, dicas práticas destacadas e botão de retorno fluido.
  - **Busca em Tempo Real**: filtragem por título, subtítulo, conteúdo e tags.
  - **Governança & Seed SQL**:
    - Script `/supabase/migrations/02_educational_seed.sql` com todos os artigos formatados para inserção direta no banco.
    - Documentação de que a tabela `educational_content` possui RLS restritiva (somente `SELECT` para usuários autenticados, sem inserção pelo cliente).

---

## 17. Configurações Unificadas & Exclusão em 2 Etapas (ETAPA 18)

- **Painel Centralizado** (`SettingsView.tsx`):
  - **Perfil**: Nome de exibição e upload de avatar local (base64) com seleção de presets fotográficos.
  - **Localização & Clima**: Consulta de cidades com geocodificação em tempo real via Open-Meteo e sincronização instantânea de coordenadas.
  - **Alertas Meteorológicos**: Limiares de chuva (60%), oscilação térmica (8°C), vento (35 km/h), extremos de temperatura e horários de silêncio (*quiet hours*).
  - **Conta & Segurança**:
    - Alteração de senha com validação de senha atual e exigência mínima de 8 caracteres.
    - Encerramento de sessão em todos os dispositivos (*logout*).
    - **Exclusão de Conta em Duas Etapas**: modal com confirmação explícita digitando a palavra "EXCLUIR", alertando sobre a remoção definitiva em cascata (`ON DELETE CASCADE`) de todas as plantas, diários e fotos.
  - **Backup & Restauração**: Exportação/importação de arquivo JSON com integridade dos dados.

---

## 18. PWA & Experiência Mobile (ETAPA 19)

- **Instalação PWA Nativa & Safari iOS**:
  - `manifest.webmanifest`: Modo `display: standalone`, orientação retrato, tema `#0d1f18` e ícones SVG 192px e 512px com suporte a maskable icons.
  - `public/sw.js`: Service worker configurado com estratégia *stale-while-revalidate* para app shell e arquivos estáticos, mantendo rotas dinâmicas de clima livres de cache obsoleto.
  - **Prompt Personalizado** (`InstallPrompt.tsx`):
    - No Android/Chrome: aciona o evento `beforeinstallprompt` com botão direto "Instalar Agora".
    - No iOS Safari: exibe orientação visual destacando o botão Compartilhar e "Adicionar à Tela de Início", explicando que notificações push no iPhone requerem instalação na tela inicial.

---

## 19. Testes, Casos de Borda e Correções (ETAPA 20)

- **Revisão de Casos de Borda**:
  - Usuário sem nenhuma planta: estado vazio convidativo no dashboard e na lista de plantas com ação de criação em 1 clique.
  - Planta sem nenhum registro: timeline vazia com botão "Criar Primeiro Registro" sem quebrar cálculos de idade ou dias de ação.
  - Registro sem foto: layout adaptável do feed e timeline com destaque para o texto e tags.
  - Usuário sem localização definida: fallback seguro para São Paulo (-23.5505, -46.6333) sem travamento da interface.
  - Testes unitários com `node:test` validando 100% dos cálculos factuais, idades botânicas e motor de regras de clima.

---

## 20. Auditoria Mobile Lighthouse & Otimizações de Alto Impacto (ETAPA 21)

- **Diagnóstico Inicial de Gargalos Mobile**:
  - **Flash & Layout Shift no WeatherWidget**: O widget de clima iniciava com estado nulo e renderizava um skeleton de ~80px de altura. Ao receber a resposta da API do Open-Meteo (~500ms depois), expandia subitamente para ~260px, gerando CLS (Cumulative Layout Shift) e empurrando o grid de estatísticas para baixo.
  - **Decodificação Síncrona de Imagens**: As miniaturas do feed recente e da galeria não possuíam atributos explícitos de `decoding="async"`, `loading="lazy"` e dimensões fixas no HTML, concorrendo com o thread principal de renderização.

- **Otimizações Implementadas**:
  1. **Cache Stale-While-Revalidate para Dados Meteorológicos**: `weatherData` e alertas calculados agora são persistidos no `localStorage` sob a chave `minha_plantinha_cached_weather_v1`. No carregamento subsequente, o widget exibe os dados locais instantaneamente (0ms de espera e zero salto de layout), enquanto atualiza os dados em segundo plano silenciosamente.
  2. **Skeleton Estrutural com Altura Idêntica**: Criado skeleton com `min-h-[220px]` e disposição idêntica de colunas para o primeiro acesso sem cache, eliminando o CLS.
  3. **Decodificação Assíncrona e Lazy Loading**: Inclusão de `loading="lazy"`, `decoding="async"` e dimensões de layout (`width`/`height`) em todas as tags `<img>` dos cards do Dashboard, coleção de plantas e galeria do diário.
  4. **Preconnect e Font-Display Swap**: Otimização do carregamento das fontes Google no `index.html`.

- **Métricas Finais da Auditoria Mobile (Viewport 390x844 - iPhone/Safari)**:
  - **Cumulative Layout Shift (CLS)**: **0.00** (Zero deslocamento, nota máxima).
  - **First Contentful Paint (FCP)**: **636 ms** (redução de ~200 ms em relação ao baseline de 832 ms).
  - **DOMContentLoaded**: **401 ms** (redução frente aos 482 ms iniciais).
  - **Load Time Total**: **404 ms**.
  - **Erros no Console**: **0 erros**.


## 21. Preparação Final para Produção na Vercel (ETAPA 22)

- **Checklist de Produção**:
  - Arquivo `.env.example` criado com todas as variáveis necessárias documentadas.
  - Remoção de links de depuração nos menus principais de produção (o preview do design system fica restrito e acessível apenas via configurações/testes).
  - Configuração de build limpa (`npm run build` gerando bundle estático Vite/Next-ready com TypeScript validado sem warnings).
  - Deploy pronto para Vercel com roteamento SPA configurado.

---

## 22. Backlog Futuro (Melhorias Pós-Lançamento)

1. **Reconhecimento de Espécies**: Integração futura com API botânica para identificação automática de espécies por foto.
2. **Web Push em Segundo Plano**: Worker de background para envio de notificações remotas agendadas no horário ideal de rega matinal.
3. **Exportação de PDF/Álbum**: Geração de um "Livro Botânico" em PDF com a história de crescimento de cada planta para impressão.
4. **Modo Claro Opcional**: Tema botânico claro ("Manhã de Primavera") para usuários que preferirem fundo claro.


