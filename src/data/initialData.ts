import { 
  Plant, 
  DiaryEntry, 
  PlantEvent, 
  WeatherAlertSettings, 
  UserProfile, 
  EducationalGuide, 
  Tag,
  CannabisPlant,
  CannabisFeedLog
} from '../types/index.ts';

export const initialProfile: UserProfile = {
  id: 'usr-1',
  full_name: 'Camila Duarte',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  weather_city: 'São Paulo, SP',
  weather_lat: -23.5505,
  weather_lng: -46.6333,
  experience_level: 'iniciante',
  grow_type: 'indoor',
  primary_focus: 'todas',
  onboarding_completed: false, // Triggers the onboarding & personalization walkthrough for the user
  show_cannabis_tab: true,
  created_at: '2026-01-10T10:00:00Z',
};

export const initialAlertSettings: WeatherAlertSettings = {
  id: 'alert-cfg-1',
  user_id: 'usr-1',
  rain_alert: true,
  temp_swing_alert: true,
  wind_alert: true,
  severe_alert: true,
  sensitivity: 'media',
  quiet_hours_start: '22:00',
  quiet_hours_end: '07:00',
  updated_at: '2026-10-10T08:00:00Z',
};

export const initialTags: Tag[] = [
  { id: 'tag-1', user_id: 'usr-1', name: 'nova_folha', color: '#10b981' },
  { id: 'tag-2', user_id: 'usr-1', name: 'floracao', color: '#f43f5e' },
  { id: 'tag-3', user_id: 'usr-1', name: 'broto', color: '#34d399' },
  { id: 'tag-4', user_id: 'usr-1', name: 'repot', color: '#e07a5f' },
  { id: 'tag-5', user_id: 'usr-1', name: 'poda', color: '#f59e0b' },
  { id: 'tag-6', user_id: 'usr-1', name: 'adubacao', color: '#3b82f6' },
  { id: 'tag-7', user_id: 'usr-1', name: 'raiz_aerea', color: '#8b5cf6' },
  { id: 'tag-8', user_id: 'usr-1', name: 'recuperada', color: '#06b6d4' }
];

export const initialPlants: Plant[] = [
  {
    id: 'plant-1',
    user_id: 'usr-1',
    name: 'Monstera Deliciosa (Costela-de-Adão)',
    species: 'Monstera deliciosa',
    cover_photo_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    acquired_date: '2026-04-12',
    status: 'active',
    location: 'indoor',
    light_level: 'alta_indireta',
    watering_frequency_days: 7,
    notes: 'Posicionada perto da janela leste da sala. Muito vigorosa, produz folhas grandes e fenestradas.',
    created_at: '2026-04-12T14:00:00Z',
    updated_at: '2026-10-15T09:00:00Z',
  },
  {
    id: 'plant-2',
    user_id: 'usr-1',
    name: 'Ficus Lyrata (Figueira-lira)',
    species: 'Ficus lyrata',
    cover_photo_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    acquired_date: '2026-02-18',
    status: 'active',
    location: 'indoor',
    light_level: 'alta_indireta',
    watering_frequency_days: 8,
    notes: 'Vaso de cerâmica grande no canto da sala. Sensível a correntes de vento e mudanças de lugar.',
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-10-14T11:00:00Z',
  },
  {
    id: 'plant-3',
    user_id: 'usr-1',
    name: 'Jiboia Dourada',
    species: 'Epipremnum aureum',
    cover_photo_url: 'https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=800&q=80',
    acquired_date: '2025-11-05',
    status: 'active',
    location: 'balcony',
    light_level: 'media_indireta',
    watering_frequency_days: 5,
    notes: 'Vaso suspenso no beiral da varanda. Ramos longos e cascatas de folhas rajadas de amarelo.',
    created_at: '2025-11-05T16:00:00Z',
    updated_at: '2026-10-12T16:00:00Z',
  },
  {
    id: 'plant-4',
    user_id: 'usr-1',
    name: 'Calathea Orbifolia',
    species: 'Goeppertia orbifolia',
    cover_photo_url: 'https://images.unsplash.com/photo-1620127682256-0f512ca82a9a?auto=format&fit=crop&w=800&q=80',
    acquired_date: '2026-06-20',
    status: 'active',
    location: 'indoor',
    light_level: 'media_indireta',
    watering_frequency_days: 4,
    notes: 'Exige água filtrada ou desmineralizada para as pontas não ressecarem. Umidificador ligado ao lado.',
    created_at: '2026-06-20T12:00:00Z',
    updated_at: '2026-10-10T14:00:00Z',
  },
  {
    id: 'plant-5',
    user_id: 'usr-1',
    name: 'Peperomia Melancia',
    species: 'Peperomia argyreia',
    cover_photo_url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
    acquired_date: '2026-08-10',
    status: 'active',
    location: 'window',
    light_level: 'alta_indireta',
    watering_frequency_days: 6,
    notes: 'Mesa de trabalho. Folhas grossas que parecem mini melancias.',
    created_at: '2026-08-10T15:00:00Z',
    updated_at: '2026-10-08T18:00:00Z',
  }
];

export const initialDiaryEntries: DiaryEntry[] = [
  {
    id: 'entry-1',
    plant_id: 'plant-1',
    user_id: 'usr-1',
    entry_date: '2026-04-12',
    entry_time: '15:30',
    content: 'Dia em que a Monstera chegou do horto! Veio com apenas 3 folhas, raízes saudáveis e vaso de plástico de 15cm.',
    photos: [
      {
        id: 'photo-1',
        entry_id: 'entry-1',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Chegada do viveiro com 3 folhas pequenas',
        created_at: '2026-04-12T15:30:00Z'
      }
    ],
    tags: [
      { id: 'tag-1', user_id: 'usr-1', name: 'nova_folha', color: '#10b981' }
    ],
    created_at: '2026-04-12T15:30:00Z'
  },
  {
    id: 'entry-2',
    plant_id: 'plant-1',
    user_id: 'usr-1',
    entry_date: '2026-06-18',
    entry_time: '11:15',
    content: 'Surgiu a primeira folha com recortes (fenestrações)! Abriu completamente hoje e está com um tom verde-claro luminoso.',
    photos: [
      {
        id: 'photo-2',
        entry_id: 'entry-2',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1596724806089-3c8fcff50b2b?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Primeira folha aberta com fenestração',
        created_at: '2026-06-18T11:15:00Z'
      }
    ],
    tags: [
      { id: 'tag-1', user_id: 'usr-1', name: 'nova_folha', color: '#10b981' },
      { id: 'tag-3', user_id: 'usr-1', name: 'broto', color: '#34d399' }
    ],
    created_at: '2026-06-18T11:15:00Z'
  },
  {
    id: 'entry-3',
    plant_id: 'plant-1',
    user_id: 'usr-1',
    entry_date: '2026-08-25',
    entry_time: '16:00',
    content: 'Replantio realizado para vaso de cerâmica de 30cm com substrato arejado (casca de pinus, perlita, carvão e húmus). Adicionado tutor de fibra de coco.',
    photos: [
      {
        id: 'photo-3',
        entry_id: 'entry-3',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Novo vaso grande com tutor de apoio',
        created_at: '2026-08-25T16:00:00Z'
      }
    ],
    tags: [
      { id: 'tag-4', user_id: 'usr-1', name: 'repot', color: '#e07a5f' },
      { id: 'tag-7', user_id: 'usr-1', name: 'raiz_aerea', color: '#8b5cf6' }
    ],
    created_at: '2026-08-25T16:00:00Z'
  },
  {
    id: 'entry-4',
    plant_id: 'plant-1',
    user_id: 'usr-1',
    entry_date: '2026-10-15',
    entry_time: '09:40',
    content: 'Enorme folha nova de quase 40cm com fenestração dupla! A planta duplicou de tamanho comparada ao dia em que chegou.',
    photos: [
      {
        id: 'photo-4',
        entry_id: 'entry-4',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Folha gigante aberta em outubro de 2026',
        created_at: '2026-10-15T09:40:00Z'
      }
    ],
    tags: [
      { id: 'tag-1', user_id: 'usr-1', name: 'nova_folha', color: '#10b981' }
    ],
    created_at: '2026-10-15T09:40:00Z'
  },
  {
    id: 'entry-5',
    plant_id: 'plant-2',
    user_id: 'usr-1',
    entry_date: '2026-02-18',
    entry_time: '10:30',
    content: 'Ficus Lyrata recém-chegado. Tem cerca de 75cm de altura. Folhas limpas com pano úmido.',
    photos: [
      {
        id: 'photo-5',
        entry_id: 'entry-5',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Ficus no dia 1 no canto da sala',
        created_at: '2026-02-18T10:30:00Z'
      }
    ],
    tags: [],
    created_at: '2026-02-18T10:30:00Z'
  },
  {
    id: 'entry-6',
    plant_id: 'plant-2',
    user_id: 'usr-1',
    entry_date: '2026-09-02',
    entry_time: '14:20',
    content: 'Dois novos brotos apicais desenvolvendo simultaneamente após a adubação de primavera.',
    photos: [
      {
        id: 'photo-6',
        entry_id: 'entry-6',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Brotos novos no topo do Ficus',
        created_at: '2026-09-02T14:20:00Z'
      }
    ],
    tags: [
      { id: 'tag-1', user_id: 'usr-1', name: 'nova_folha', color: '#10b981' },
      { id: 'tag-6', user_id: 'usr-1', name: 'adubacao', color: '#3b82f6' }
    ],
    created_at: '2026-09-02T14:20:00Z'
  },
  {
    id: 'entry-7',
    plant_id: 'plant-3',
    user_id: 'usr-1',
    entry_date: '2026-08-14',
    entry_time: '17:00',
    content: 'Jiboia com ramos atingindo o chão da varanda! Fiz uma poda de ponta para estimular ramificação lateral.',
    photos: [
      {
        id: 'photo-7',
        entry_id: 'entry-7',
        user_id: 'usr-1',
        storage_path: 'https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=800&q=80',
        display_order: 0,
        caption: 'Cascata de folhas rajadas na varanda',
        created_at: '2026-08-14T17:00:00Z'
      }
    ],
    tags: [
      { id: 'tag-5', user_id: 'usr-1', name: 'poda', color: '#f59e0b' }
    ],
    created_at: '2026-08-14T17:00:00Z'
  }
];

export const initialPlantEvents: PlantEvent[] = [
  { id: 'ev-1', plant_id: 'plant-1', user_id: 'usr-1', event_type: 'rega', event_date: '2026-10-15', notes: 'Rega abundante até escorrer pelo fundo', created_at: '2026-10-15T09:00:00Z' },
  { id: 'ev-2', plant_id: 'plant-2', user_id: 'usr-1', event_type: 'rega', event_date: '2026-10-12', notes: 'Solo testado seco até 5cm de profundidade', created_at: '2026-10-12T10:00:00Z' },
  { id: 'ev-3', plant_id: 'plant-3', user_id: 'usr-1', event_type: 'rega', event_date: '2026-10-16', notes: 'Rega com água da chuva coletada', created_at: '2026-10-16T11:00:00Z' },
  { id: 'ev-4', plant_id: 'plant-4', user_id: 'usr-1', event_type: 'rega', event_date: '2026-10-14', notes: 'Água destilada + umidificador reabastecido', created_at: '2026-10-14T08:30:00Z' },
  { id: 'ev-5', plant_id: 'plant-1', user_id: 'usr-1', event_type: 'adubacao', event_date: '2026-10-01', notes: 'Bokashi líquido diluído a 50%', created_at: '2026-10-01T10:00:00Z' },
  { id: 'ev-6', plant_id: 'plant-2', user_id: 'usr-1', event_type: 'adubacao', event_date: '2026-09-25', notes: 'Torta de mamona e farinha de ossos na borda do vaso', created_at: '2026-09-25T11:00:00Z' },
  { id: 'ev-7', plant_id: 'plant-3', user_id: 'usr-1', event_type: 'poda', event_date: '2026-08-14', notes: 'Poda de três ramos compridos para propagação na água', created_at: '2026-08-14T17:00:00Z' },
  { id: 'ev-8', plant_id: 'plant-1', user_id: 'usr-1', event_type: 'replantio', event_date: '2026-08-25', notes: 'Mudança para vaso de 30cm', created_at: '2026-08-25T16:00:00Z' },
  { id: 'ev-9', plant_id: 'plant-5', user_id: 'usr-1', event_type: 'rega', event_date: '2026-10-13', notes: 'Rega por baixo (sub-irrigação por 15 min)', created_at: '2026-10-13T14:00:00Z' }
];

export const educationalGuides: EducationalGuide[] = [
  {
    id: 'guide-1',
    category: 'rega',
    title: 'O Teste do Dedo e a Arte de Não Afogar Raízes',
    subtitle: 'Por que o excesso de água mata mais plantas que a seca e como saber a hora certa.',
    reading_time_minutes: 4,
    body: [
      'A grande maioria das mortes de plantas domésticas decorre do excesso de umidade retida nas raízes, que causa anóxia (falta de oxigênio) e proliferação de fungos patogênicos como Pythium e Phytophthora.',
      'Em vez de seguir calendários rígidos ("regar toda terça"), o método padrão-ouro é o teste tátil do substrato. Insira o dedo indicador até a segunda falange (cerca de 4 a 5 cm de profundidade). Se sair terra escura e úmida colada, a planta ainda tem água suficiente.',
      'Sempre utilize vasos com furos de drenagem e nunca deixe água acumulada no pratinho por mais de 30 minutos após a rega.'
    ],
    tips: [
      'Regue de forma lenta e uniforme em toda a superfície do vaso, não apenas perto do caule.',
      'Vasos de barro transpiram mais rápido que plástico ou cerâmica esmaltada.',
      'No inverno, a evapotranspiração cai e a frequência de rega deve ser reduzida pela metade.'
    ],
    tags: ['rega', 'substrato', 'drenagem'],
    display_order: 1
  },
  {
    id: 'guide-2',
    category: 'iluminacao',
    title: 'Luz Direta vs. Luz Indireta Brilhante: Decodificando a Janela',
    subtitle: 'Como medir a luminosidade da sua casa e posicionar cada espécie no local ideal.',
    reading_time_minutes: 5,
    body: [
      'Luz é o combustível metabólico primário das plantas através da fotossíntese. O erro mais comum é confundir "ambiente claro para olhos humanos" com "luz suficiente para a planta crescer".',
      'Luz direta: o sol bate diretamente nas folhas sem nenhum obstáculo (ideal para cactos, suculentas de sol e jasmins).',
      'Luz indireta brilhante: o ambiente é iluminado intensamente, a planta "enxerga o céu aberto", mas os raios solares não atingem a folha (ideal para Monstera, Ficus, Filodendros e Marantas).',
      'Sombra ou baixa luminosidade: a mais de 3 metros da janela. Apenas espécies muito resistentes como Zamioculca e Espada-de-São-Jorge sobrevivem a longo prazo.'
    ],
    tips: [
      'Faça o teste da sombra: coloque a mão a 30cm de uma folha voltada para a janela. Uma sombra nítida indica luz brilhante; sombra esfumaçada indica luz média.',
      'Janelas voltadas para o Norte e Leste recebem o sol da manhã, mais ameno e seguro.',
      'Gire os vasos 90° a cada rega para evitar que a planta cresça torta buscando a luz.'
    ],
    tags: ['iluminacao', 'posicionamento', 'sol'],
    display_order: 2
  },
  {
    id: 'guide-3',
    category: 'substrato',
    title: 'A Receita do Substrato Areado para Plantas Tropicais (Aroid Mix)',
    subtitle: 'Diga adeus à terra preta compactada que sufoca as raízes das suas plantas.',
    reading_time_minutes: 6,
    body: [
      'Na natureza, espécies tropicais como Monsteras e Filodendros crescem no chão da floresta sob rica serrapilheira ou agarradas em troncos de árvores. Suas raízes necessitam de ar tanto quanto de água.',
      'A terra vegetal comum vendida em sacos tende a virar uma massa densa e asfixiante com o passar dos meses.',
      'A fórmula clássica "Aroid Mix" caseira consiste em: 40% casca de pinus triturada ou chips de coco, 20% perlita expandida ou carvão vegetal quebrado, 20% terra vegetal orgânica bem solta e 20% húmus de minhoca.'
    ],
    tips: [
      'O carvão vegetal atua como fungicida natural e previne odores no solo.',
      'Ao apertar um punhado do substrato úmido na mão, ele deve se desfazer ao abrir os dedos.',
      'Troque o substrato de vasos pequenos a cada 12 a 18 meses para renovar os nutrientes.'
    ],
    tags: ['substrato', 'raizes', 'nutricao'],
    display_order: 3
  },
  {
    id: 'guide-4',
    category: 'pragas',
    title: 'Guia Orgânico de Combate a Cochonilhas, Ácaros e Fungus Gnats',
    subtitle: 'Soluções seguras e eficazes com óleo de neem e sabão de potássio sem agrotóxicos.',
    reading_time_minutes: 5,
    body: [
      'Identificar pragas no estágio inicial evita infestações descontroladas que enfraquecem a planta.',
      'Cochonilha-branca: pequenos pontinhos que parecem algodão nas axilas das folhas e no verso. Remova com cotonete embebido em álcool 70%.',
      'Ácaro-rajado: causa um pontilhado amarelado e teias finíssimas no verso das folhas. Ama ar seco e quente. Borrifar água e elevar a umidade afasta os ácaros.',
      'Fungus Gnats (mosquitinhos pretos de substrato): alimentam-se da matéria orgânica em decomposição e umidade constante. Deixar a camada superficial do vaso secar completamente quebra o ciclo reprodutivo.'
    ],
    tips: [
      'Pulverize óleo de neem emulsionado com sabão neutro SEMPRE no final da tarde, nunca sob sol, para não queimar as folhas.',
      'Isole a planta infestada em quarentena por 14 dias para não contaminar as vizinhas.',
      'Polvilhar terra de diatomáceas na superfície do solo elimina larvas de mosquitinhos.'
    ],
    tags: ['pragas', 'neem', 'tratamento_organico'],
    display_order: 4
  },
  {
    id: 'guide-5',
    category: 'propagacao',
    title: 'Propagação por Estacas na Água: Como Clonar suas Plantas Favoritas',
    subtitle: 'Passo a passo com nós vegetativos, hormônios naturais e transição para o solo.',
    reading_time_minutes: 4,
    body: [
      'Propagar plantas é uma das partes mais recompensadoras da jardinagem. Espécies como Jiboia, Monstera, Syngonium e Pothos se multiplicam com facilidade espantosa por estaquia caulinar.',
      'O segredo reside no "nó": a saliência no caule de onde nascem as folhas e as raízes adventícias. Cortes sem nó não enraízam.',
      'Utilize uma tesoura de poda esterilizada com álcool e corte 1 cm abaixo do nó. Mergulhe em um frasco de vidro limpo com água desclorada, mantendo as folhas fora d\'água.'
    ],
    tips: [
      'Troque a água do frasco a cada 4 a 5 dias para oxigenar e prevenir algas.',
      'Mantenha o frasco em local com boa luminosidade indireta, mas longe de sol quente direto.',
      'Quando as raízes atingirem cerca de 5 cm de comprimento, transfira para o substrato úmido.'
    ],
    tags: ['propagacao', 'estaquia', 'mudas'],
    display_order: 5
  },
  {
    id: 'guide-6',
    category: 'cuidados_gerais',
    title: 'Princípios Fundamentais para Não Matar Suas Plantas de Interior',
    subtitle: 'Os 4 pilares biológicos: luz, água, ar e drenagem explicados sem jargões complexos.',
    reading_time_minutes: 5,
    body: [
      'A grande maioria das plantas de interior morre por excesso de amor — especificamente excesso de rega — e não por descuido. Em um vaso fechado, o excesso de água expulsa o oxigênio e apodrece as raízes.',
      'Aclimatação: quando você traz uma planta nova do viveiro para casa, ela passa por um choque de luminosidade e umidade. É normal que ela perca uma ou duas folhas mais velhas nas primeiras 3 semanas.',
      'A regra de ouro: conheça a origem nativa da espécie. Plantas de sub-bosque tropical (Marantas, Calatheas) requerem alta umidade; suculentas de zonas áridas exigem sol e longos períodos de seca.'
    ],
    tips: [
      'Nunca adube uma planta doente ou recém-replantada; espere ela se recuperar e emitir raízes ativas.',
      'Mantenha as folhas limpas de poeira para não bloquear os estômatos e a captação solar.',
      'Água em temperatura ambiente é sempre preferível a água gelada da torneira.'
    ],
    tags: ['cuidados_gerais', 'iniciantes', 'adaptacao'],
    display_order: 6
  },
  {
    id: 'guide-7',
    category: 'observacao_vegetal',
    title: 'A Arte da Observação Botânica: Como "Ler" o Que as Folhas Dizem',
    subtitle: 'Pontas secas, folhas amarelas, perda de brilho e enrolamento decodificados.',
    reading_time_minutes: 6,
    body: [
      'A observação visual frequente é o método mais eficaz de prevenção. O diário de bordo fotográfico foi concebido exatamente para registrar mudanças graduais que o olho humano esquece com o tempo.',
      'Folhas enrolando para dentro: mecanismo de defesa para diminuir a área de transpiração e perda de água (desidratação ou ar excessivamente seco).',
      'Pontas marrons e crocantes: ar muito seco (comum em salas com ar-condicionado) ou acúmulo de sais de cloro da água da torneira.',
      'Folha amarelada uniforme com caule amolecido: excesso severo de umidade no substrato.',
      'Folhas pálidas e com entrenós longos (estiolamento): a planta está esticando o caule em busca desesperada de luz solar.'
    ],
    tips: [
      'Compare fotos tiradas com 30 dias de intervalo para notar o ritmo real de emissão de folhas novas.',
      'Fotografe sempre sob a mesma iluminação e ângulo para avaliações comparativas confiáveis.',
      'A perda esporádica da folha mais baixa e velha é natural do ciclo de renovação celular.'
    ],
    tags: ['observacao_vegetal', 'sinais', 'diagnostico'],
    display_order: 7
  },
  {
    id: 'guide-8',
    category: 'saude_vegetal',
    title: 'Diagnóstico de Deficiências Nutricionais e Doenças Fúngicas',
    subtitle: 'Diferenciando falta de Nitrogênio, Fósforo, Ferro e ataques de míldio/oídio.',
    reading_time_minutes: 5,
    body: [
      'Plantas em vasos contam apenas com os nutrientes presentes no substrato. Com as regas sucessivas, esses minerais são lixiviados e precisam ser repostos periodicamente.',
      'Clorose férrica: as folhas novas nascem amarelas, mas as nervuras permanecem bem verdes. Indica deficiência de ferro ou pH do solo descalibrado.',
      'Falta de Nitrogênio (N): a planta inteira perde o verde intenso e as folhas velhas ficam amarelas uniformemente antes de caírem.',
      'Fungos e manchas circulares com halo amarelo: geralmente causados por borrifar água nas folhas à noite sem ventilação adequada.'
    ],
    tips: [
      'Fertilize preferencialmente durante a primavera e verão, reduzindo no outono/inverno.',
      'Opte por adubos com formulação NPK equilibrada (como 10-10-10) ou orgânicos como bokashi.',
      'Nunca adube o substrato completamente seco: molhe com água pura primeiro para não queimar as raízes.'
    ],
    tags: ['saude_vegetal', 'nutrientes', 'npk', 'fungos'],
    display_order: 8
  },
  {
    id: 'guide-9',
    category: 'manutencao',
    title: 'Manual de Poda, Limpeza Foliar e Troca de Vaso (Repotting)',
    subtitle: 'Quando, como e por que podar e transferir sua planta para um vaso maior.',
    reading_time_minutes: 6,
    body: [
      'A manutenção preventiva estimula o crescimento vegetativo vigoroso e reduz o consumo desnecessário de energia da planta.',
      'Poda sanitária: corte folhas secas, danificadas ou amareladas na base do pecíolo com lâmina limpa e desinfetada.',
      'Poda de beliscamento (topping): cortar a ponta da haste principal força a planta a emitir brotações laterais, tornando-a muito mais cheia e arbustiva.',
      'Quando trocar de vaso: raízes saindo pelos furos de drenagem, água passando direto sem ser absorvida ou o torrão de raízes completamente espiralado (novelo).'
    ],
    tips: [
      'Escolha um vaso novo apenas 2 a 5 cm maior em diâmetro que o anterior; vasos gigantes acumulam excesso de terra molhada.',
      'Corte de raízes podres: se encontrar raízes pretas e moles durante a troca, pode-as e aplique canela em pó como cicatrizante natural.',
      'Limpe as folhas com pano de microfibra úmido uma vez por mês.'
    ],
    tags: ['manutencao', 'poda', 'replantio', 'vasos'],
    display_order: 9
  },
  {
    id: 'guide-10',
    category: 'glossario',
    title: 'Glossário Botânico Ilustrado do Cultivador Urbano',
    subtitle: 'Entenda os termos técnicos mais comuns presentes em guias e fichas botânicas.',
    reading_time_minutes: 4,
    body: [
      'Fenestração: aberturas e fendas naturais nas folhas maduras de plantas como a Monstera deliciosa, permitindo a passagem de vento e luz para as folhas inferiores.',
      'Nó e Entrenó: o nó é a região saliente do caule de onde surgem folhas, gemas e raízes adventícias; entrenó é o espaço entre dois nós.',
      'Pecíolo: haste delgada que conecta a lâmina da folha ao caule principal.',
      'Epífita: planta que cresce sobre outra árvore apenas para suporte físico, sem sugar seiva (ex: orquídeas, bromélias e rhipsalis).',
      'Estômatos: estruturas microscópicas nas folhas responsáveis pelas trocas gasosas e transpiração.',
      'Substrato inerte: material que serve de ancoragem sem fornecer nutrientes (perlita, vermiculita, argila expandida).'
    ],
    tips: [
      'Consultar este glossário facilita a interpretação das notas do seu diário e dos guias avançados.',
      'Termos anatômicos ajudam a descrever exatamente em qual parte da planta uma nova brotação está surgindo.'
    ],
    tags: ['glossario', 'anatomia', 'termos_tecnicos'],
    display_order: 10
  },
  {
    id: 'guide-11',
    category: 'perguntas_frequentes',
    title: 'Perguntas Frequentes (FAQ) sobre o Cultivo e Uso do Diário',
    subtitle: 'Respostas diretas para as dúvidas mais comuns de quem cultiva plantas em casa.',
    reading_time_minutes: 5,
    body: [
      'P: Com que frequência devo regar minha planta?\nR: Não existe regra fixa de calendário. Teste o substrato com o dedo. Se estiver seco até 4 cm de profundidade, regue abundantemente até escorrer pelos furos.',
      'P: Por que as folhas novas da minha Monstera nascem sem fenestração (furos)?\nR: Geralmente por falta de luminosidade suficiente ou idade jovem da planta. Posicione-a mais perto de uma janela com luz indireta abundante.',
      'P: Posso usar água da torneira diretamente?\nR: A maioria das plantas tolera, mas espécies sensíveis (Marantas e Calatheas) acumulam cloro e flúor, queimando as bordas. Deixe a água descansar em um balde aberto por 24 horas antes de usar.',
      'P: Como tirar as melhores fotos para o comparador antes/depois?\nR: Escolha um fundo neutro, fotografe no mesmo horário sob luz natural indireta e enquadre a planta completa na mesma distância a cada registro.'
    ],
    tips: [
      'Cadastre lembretes de rega no app para manter a consistência de verificações visuais.',
      'Use o comparador antes/depois a cada 30 a 60 dias para se surpreender com o crescimento.'
    ],
    tags: ['perguntas_frequentes', 'faq', 'duvidas_comuns'],
    display_order: 11
  }
];

export const initialCannabisPlants: CannabisPlant[] = [
  {
    id: 'cnb-1',
    user_id: 'usr-1',
    name: 'Gorilla Glue #4',
    strain: 'Gorilla Glue #4 (Original Glue)',
    strain_type: 'hibrida',
    is_autoflower: false,
    stage: 'floracao',
    stage_start_date: '2026-09-15',
    germination_date: '2026-07-20',
    photoperiod: '12/12',
    medium: 'solo_organico',
    pot_size_liters: 15,
    target_ph: 6.3,
    target_ec: 1.6,
    target_temp: 24,
    target_rh: 48,
    training_techniques: ['LST', 'Topping', 'Desfolhação'],
    trichome_status: 'leitosos_ponto',
    cover_photo_url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    notes: 'Semana 5 de floração. Densidade excelente dos cálices, aroma pungente terroso e de pinho. Temperatura do grow mantida em 24°C e umidade controlada em 48%.',
    created_at: '2026-07-20T10:00:00Z',
    updated_at: '2026-10-18T16:30:00Z'
  },
  {
    id: 'cnb-2',
    user_id: 'usr-1',
    name: 'Amnesia Haze',
    strain: 'Amnesia Haze',
    strain_type: 'sativa',
    is_autoflower: false,
    stage: 'vegetativo',
    stage_start_date: '2026-09-28',
    germination_date: '2026-09-10',
    photoperiod: '18/6',
    medium: 'coco_perlita',
    pot_size_liters: 11,
    target_ph: 5.9,
    target_ec: 1.3,
    target_temp: 26,
    target_rh: 62,
    training_techniques: ['LST', 'ScrOG'],
    trichome_status: 'transparentes',
    cover_photo_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    notes: 'Estrutura vigorosa e entrenós bem abertos. Rede de ScrOG instalada a 30cm do vaso para maximizar canópea uniforme antes da virada para 12/12.',
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-10-19T14:00:00Z'
  },
  {
    id: 'cnb-3',
    user_id: 'usr-1',
    name: 'Northern Lights Auto',
    strain: 'Northern Lights Automatic',
    strain_type: 'ruderalis_auto',
    is_autoflower: true,
    stage: 'pre_floracao',
    stage_start_date: '2026-10-05',
    germination_date: '2026-09-18',
    photoperiod: '20/4',
    medium: 'solo_organico',
    pot_size_liters: 11,
    target_ph: 6.4,
    target_ec: 1.4,
    target_temp: 25,
    target_rh: 55,
    training_techniques: ['LST Leve'],
    trichome_status: 'transparentes',
    cover_photo_url: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=800&q=80',
    notes: 'Início da transição floral (pistilos brancos evidentes no topo). Planta compacta e resistente, sem podas apicais para não estressar a autoflorescente.',
    created_at: '2026-09-18T09:00:00Z',
    updated_at: '2026-10-20T11:00:00Z'
  }
];

export const initialCannabisFeedLogs: CannabisFeedLog[] = [
  {
    id: 'feed-1',
    plant_id: 'cnb-1',
    date: '2026-10-19',
    water_liters: 2.5,
    ph_in: 6.3,
    ph_out: 6.4,
    ec_ppm: 1.6,
    runoff_ec: 1.7,
    nutrients: [
      { name: 'Bloom NPK (2-7-4)', mlPerLiter: 3.0 },
      { name: 'CalMag Plus', mlPerLiter: 1.0 },
      { name: 'Bioestimulante Algas', mlPerLiter: 1.5 }
    ],
    notes: 'Rega com 15% de runoff. Cores das folhas verde-escuro sadio, sem pontas queimadas.'
  },
  {
    id: 'feed-2',
    plant_id: 'cnb-2',
    date: '2026-10-18',
    water_liters: 2.0,
    ph_in: 5.9,
    ph_out: 6.0,
    ec_ppm: 1.3,
    nutrients: [
      { name: 'Grow NPK (4-2-3)', mlPerLiter: 2.5 },
      { name: 'Silicato de Potássio', mlPerLiter: 0.5 },
      { name: 'CalMag', mlPerLiter: 1.2 }
    ],
    notes: 'Fertirrigação em coco com pH calibrado antes de aplicar.'
  }
];

