-- ETAPA 17: SEED DA TABELA educational_content
-- Conteúdos educativos botânicos estruturados por categoria
-- Inserção executada no servidor/painel do Supabase (sem escrita permitida pelo client)

insert into educational_content (category, title, body, display_order)
values
(
  'cuidados_gerais',
  'Princípios Fundamentais para Não Matar Suas Plantas de Interior',
  'A grande maioria das plantas de interior morre por excesso de amor — especificamente excesso de rega — e não por descuido. Em um vaso fechado, o excesso de água expulsa o oxigênio e apodrece as raízes.\n\nAclimatação: quando você traz uma planta nova do viveiro para casa, ela passa por um choque de luminosidade e umidade. É normal que ela perca uma ou duas folhas mais velhas nas primeiras 3 semanas.\n\nA regra de ouro: conheça a origem nativa da espécie. Plantas de sub-bosque tropical requerem alta umidade; suculentas de zonas áridas exigem sol e longos períodos de seca.',
  1
),
(
  'observacao_vegetal',
  'A Arte da Observação Botânica: Como "Ler" o Que as Folhas Dizem',
  'A observação visual frequente é o método mais eficaz de prevenção. O diário de bordo fotográfico foi concebido exatamente para registrar mudanças graduais que o olho humano esquece com o tempo.\n\nFolhas enrolando para dentro: mecanismo de defesa para diminuir a área de transpiração e perda de água.\n\nPontas marrons e crocantes: ar muito seco ou acúmulo de cloro da água da torneira.\n\nFolha amarelada com caule amolecido: excesso de umidade no substrato.\n\nEstiolamento: a planta estica o caule em busca desesperada de luz.',
  2
),
(
  'saude_vegetal',
  'Diagnóstico de Deficiências Nutricionais e Doenças Fúngicas',
  'Plantas em vasos contam apenas com os nutrientes presentes no substrato. Com as regas sucessivas, esses minerais são lixiviados.\n\nClorose férrica: as folhas novas nascem amarelas com nervuras bem verdes.\n\nFalta de Nitrogênio (N): a planta inteira perde o verde intenso uniformemente.\n\nFungos e manchas circulares: geralmente causados por borrifar água nas folhas à noite sem ventilação.',
  3
),
(
  'manutencao',
  'Manual de Poda, Limpeza Foliar e Troca de Vaso (Repotting)',
  'A manutenção preventiva estimula o crescimento vegetativo vigoroso e reduz o consumo desnecessário de energia.\n\nPoda sanitária: corte folhas secas ou amareladas na base do pecíolo com lâmina limpa e desinfetada.\n\nPoda de beliscamento (topping): cortar a ponta da haste principal estimula brotações laterais.\n\nTroca de vaso: escolha vasos novos apenas 2 a 5 cm maiores em diâmetro.',
  4
),
(
  'glossario',
  'Glossário Botânico Ilustrado do Cultivador Urbano',
  'Fenestração: aberturas e fendas naturais nas folhas maduras de plantas como a Monstera deliciosa.\n\nNó e Entrenó: o nó é a região saliente do caule de onde surgem folhas e raízes adventícias.\n\nPecíolo: haste delgada que conecta a lâmina foliar ao caule principal.\n\nEpífita: planta que cresce sobre outra árvore apenas para suporte físico, sem sugar seiva.\n\nEstômatos: estruturas microscópicas nas folhas responsáveis pelas trocas gasosas.',
  5
),
(
  'perguntas_frequentes',
  'Perguntas Frequentes (FAQ) sobre o Cultivo e Uso do Diário',
  'P: Com que frequência devo regar minha planta?\nR: Não existe regra fixa de calendário. Teste o substrato com o dedo. Se estiver seco até 4 cm de profundidade, regue abundantemente até escorrer pelos furos.\n\nP: Por que as folhas novas da Monstera nascem sem furos?\nR: Geralmente por falta de luminosidade suficiente ou idade jovem da planta.\n\nP: Posso usar água da torneira diretamente?\nR: Deixe a água descansar em um recipiente aberto por 24 horas para evaporar o cloro antes de regar espécies sensíveis.',
  6
),
(
  'rega',
  'O Padrão-Ouro da Rega: Saturação Completa vs. Apodrecimento Radicular',
  'O maior causador de perdas em plantas cultivadas em ambientes internos não é a falta de água, mas o excesso crônico no substrato somado à má aeração radicular.\n\nO método padrão-ouro é o teste tátil do substrato até a segunda falange do dedo. Se sair terra escura e úmida colada, a planta ainda tem água suficiente.',
  7
),
(
  'iluminacao',
  'Luz Direta vs. Luz Indireta Brilhante: Decodificando a Janela',
  'Luz direta: o sol atinge as folhas diretamente (para cactos e suculentas de sol pleno).\n\nLuz indireta brilhante: o ambiente é iluminado intensamente, mas os raios solares diretos não queimam a folha (ideal para Monstera, Ficus e Filodendros).\n\nSombra ou baixa luminosidade: a mais de 3 metros da janela.',
  8
),
(
  'substrato',
  'A Receita do Substrato Areado para Plantas Tropicais (Aroid Mix)',
  'A fórmula clássica caseira consiste em: 40% casca de pinus triturada ou chips de coco, 20% perlita expandida ou carvão vegetal quebrado, 20% terra vegetal orgânica solta e 20% húmus de minhoca.',
  9
),
(
  'pragas',
  'Guia Orgânico de Combate a Cochonilhas, Ácaros e Fungus Gnats',
  'Cochonilha-branca: remova com cotonete embebido em álcool 70%.\n\nÁcaro-rajado: causa pontilhado amarelado e teias finas. Borrifar água e elevar a umidade afasta os ácaros.\n\nFungus Gnats: deixe a camada superficial do solo secar completamente para quebrar o ciclo reprodutivo.',
  10
),
(
  'propagacao',
  'Propagação por Estacas na Água: Como Clonar suas Plantas Favoritas',
  'O segredo reside no nó: a saliência no caule de onde nascem as folhas e raízes. Corte 1 cm abaixo do nó com tesoura esterilizada e mergulhe em frasco com água limpa até criar raízes de 5 cm.',
  11
);
