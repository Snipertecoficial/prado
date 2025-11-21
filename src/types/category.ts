export interface Subcategory {
  name: string;
  slug: string;
  featured?: boolean; // Produto em destaque dentro da categoria
}

export interface Category {
  name: string;
  slug: string;
  subcategories: Subcategory[];
  description?: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Eixos / Pillow",
    slug: "eixos-pillow",
    subcategories: [
      { name: "Casca de Pillow Block", slug: "casca-pillow-block" },
      { name: "Eixo com Suporte de Alumínio", slug: "eixo-suporte-aluminio" },
      { name: "Eixo Linear", slug: "eixo-linear" },
      { name: "Pillow Aberto – SBR", slug: "pillow-aberto-sbr" },
      { name: "Pillow Aberto Longo – SBR..LUU", slug: "pillow-aberto-longo" },
      { name: "Pillow Fechado – SCS", slug: "pillow-fechado-scs" },
      { name: "Pillow Fechado Longo – SCS..LUU", slug: "pillow-fechado-longo" },
      { name: "Pillow Block Fechado 25mm", slug: "pillow-block-25mm", featured: true },
    ]
  },
  {
    name: "Guia Linear / Patins",
    slug: "guia-linear-patins",
    subcategories: [
      { name: "Patins de Aço", slug: "patins-aco" },
      { name: "Patins de Níquel", slug: "patins-niquel" },
      { name: "Patins Padrão", slug: "patins-padrao" },
      { name: "Patins Padrão – Alongado", slug: "patins-padrao-alongado" },
      { name: "Patins Perfil Baixo", slug: "patins-perfil-baixo" },
      { name: "Patins Série Mini", slug: "patins-serie-mini" },
      { name: "Ponto de Lubrificação", slug: "ponto-lubrificacao" },
      { name: "Raspador", slug: "raspador" },
      { name: "Tanque de Óleo para Bloco Linear", slug: "tanque-oleo" },
      { name: "Guia Linear Padrão", slug: "guia-linear-padrao" },
      { name: "Guia Linear Perfil Baixo", slug: "guia-linear-perfil-baixo" },
      { name: "Guia Linear de Cromo", slug: "guia-linear-cromo" },
      { name: "Guia Linear Série Mini", slug: "guia-linear-serie-mini" },
      { name: "GLP – Guia Linear de 15mm", slug: "glp-15mm", featured: true },
    ]
  },
  {
    name: "Fuso de Esferas",
    slug: "fuso-esferas",
    subcategories: [
      { name: "Fuso de Esferas Laminado C7", slug: "fuso-laminado-c7" },
      { name: "Castanha Passo Padrão", slug: "castanha-passo-padrao" },
      { name: "Suporte Para Castanha", slug: "suporte-castanha" },
      { name: "Castanha Dupla", slug: "castanha-dupla" },
      { name: "Fuso de Esfera Passo Rápido", slug: "fuso-passo-rapido" },
      { name: "Castanha Passo Rápido", slug: "castanha-passo-rapido" },
      { name: "Usinagem e Manutenção", slug: "usinagem-manutencao" },
      { name: "KITs de Fuso de Esferas", slug: "kits-fuso" },
      { name: "Fuso de Esfera Laminado 12mm Passo 04", slug: "fuso-12mm-passo-04", featured: true },
    ]
  },
  {
    name: "Perfil Estrutural",
    slug: "perfil-estrutural",
    subcategories: [
      { name: "Acabamentos", slug: "acabamentos" },
      { name: "Arruelas", slug: "arruelas" },
      { name: "Cantoneiras", slug: "cantoneiras" },
      { name: "Conectores", slug: "conectores" },
      { name: "Dobradiças", slug: "dobradicas" },
      { name: "Parafuso Allen Cabeça Abaulada", slug: "parafuso-allen-abaulada" },
      { name: "Parafuso Allen Cabeça Cônica", slug: "parafuso-allen-conica" },
      { name: "Parafuso e Porca Martelo", slug: "parafuso-porca-martelo" },
      { name: "Perfil – Base 20", slug: "perfil-base-20" },
      { name: "Perfil – Base 30", slug: "perfil-base-30" },
      { name: "Perfil – Base 40", slug: "perfil-base-40" },
      { name: "Perfil – Base 45", slug: "perfil-base-45" },
      { name: "Pés de Nivelamento / Pés de Borracha", slug: "pes-nivelamento" },
      { name: "Porca Quadrada", slug: "porca-quadrada" },
      { name: "Porca Sextavada Flangeada", slug: "porca-sextavada" },
      { name: "Porca T Deslizante", slug: "porca-t-deslizante" },
      { name: "Puxador Manipulo – Tipo Alça", slug: "puxador-manipulo" },
      { name: "Rodízio Giratório", slug: "rodizio-giratorio" },
      { name: "Perfil – Base 60", slug: "perfil-base-60" },
      { name: "Perfil Estrutural 20×40 T-Slot Canal 6mm", slug: "perfil-20x40-t-slot", featured: true },
    ]
  },
  {
    name: "Rolamento Linear",
    slug: "rolamento-linear",
    subcategories: [
      { name: "KH…PP", slug: "kh-pp" },
      { name: "LM…OP", slug: "lm-op" },
      { name: "LM…UU | LM…LUU", slug: "lm-uu-luu" },
      { name: "LME…AJ – Especial Ajustável", slug: "lme-aj" },
      { name: "LME…OP", slug: "lme-op" },
      { name: "LME…UU", slug: "lme-uu" },
      { name: "LMF…UU | LMF…LUU", slug: "lmf-uu-luu" },
      { name: "LMH…UU | LMH…LUU", slug: "lmh-uu-luu" },
      { name: "LMK…UU | LMK…LUU", slug: "lmk-uu-luu" },
      { name: "Rolamento LM20UU", slug: "rolamento-lm20uu", featured: true },
    ]
  },
  {
    name: "Rolamento Radial",
    slug: "rolamento-radial",
    subcategories: [
      { name: "Autocompensador", slug: "autocompensador" },
      { name: "Contato Angular", slug: "contato-angular" },
      { name: "Rígido de Esferas – ZZ", slug: "rigido-esferas-zz" },
      { name: "Rolo Cônico", slug: "rolo-conico" },
      { name: "Rolamento Rígido de Esferas 6000ZZ Radial", slug: "rolamento-6000zz", featured: true },
    ]
  },
  {
    name: "Mancal",
    slug: "mancal",
    subcategories: [
      { name: "BKBF – Mancais para Fuso", slug: "bkbf-fuso" },
      { name: "EKEF – Mancais para Fuso", slug: "ekef-fuso" },
      { name: "FKFF – Mancais para Fuso", slug: "fkff-fuso" },
      { name: "KFL – Mancais para Eixo", slug: "kfl-eixo" },
      { name: "SHF – Mancais para Eixo", slug: "shf-eixo" },
      { name: "SK – Mancais para Eixo", slug: "sk-eixo" },
      { name: "UCF – Mancais para Eixo", slug: "ucf-eixo" },
      { name: "UCFL – Mancais para Eixo", slug: "ucfl-eixo" },
      { name: "UCP – Mancais para Eixo", slug: "ucp-eixo" },
      { name: "Mancal Fixo SK para Eixo 25mm", slug: "mancal-sk-25mm", featured: true },
    ]
  }
];
