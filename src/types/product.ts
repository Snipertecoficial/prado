export type TipoServico =
  | "sem_servico"
  | "furo_chave_allen_padrao"
  | "rosca"
  | "corte_angulo"
  | "furo_chave_allen_xmm_vertical"
  | "furo_chave_allen_xmm_horizontal"
  | "furo_conexao_rosca"
  | "furo_conexao_capa_fechamento";

export interface ServicoConfig {
  id: TipoServico;
  nome: string;
  descricao?: string;
  requerDetalhes: boolean;
  parametros?: string[];
  custoExtra: number;
}

export interface DetalhesServico {
  tipoDetalhe?: string;
  textoDetalhes?: string;
  parametros?: Record<string, any>;
}

export interface ProdutoConfig {
  id: string;
  nome: string;
  precoPorMetro: number;
  minComprimentoMm: number;
  maxComprimentoMm: number;
  toleranciaCorte: string;
  comprimentoBarraMm: number;
  pesoPorMetroKg?: number;
  servicosPermitidos: TipoServico[];
  descricaoTecnica?: string;
  ativo: boolean;
}

export interface PecaPerfil2040 {
  id: string;
  comprimentoMm: number;
  quantidade: number;
  servico: TipoServico;
  detalhesServico?: DetalhesServico;
  precoPorMetro: number;
  precoTotalPeca: number;
}

export interface PedidoPerfil2040 {
  pecas: PecaPerfil2040[];
  totalMetros: number;
  totalValor: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  installmentPrice?: number;
  installments?: number;
  handle?: string;
}

export const SERVICOS_CONFIG: ServicoConfig[] = [
  { 
    id: "sem_servico", 
    nome: "Sem serviço",
    descricao: "Perfil cortado sem serviços adicionais",
    requerDetalhes: false,
    custoExtra: 0
  },
  { 
    id: "furo_chave_allen_padrao", 
    nome: "Furo p/ passagem de chave allen p/ montagem padrão",
    descricao: "Furo padrão para montagem",
    requerDetalhes: false,
    custoExtra: 0
  },
  { 
    id: "rosca", 
    nome: "Rosca",
    descricao: "Rosca personalizada",
    requerDetalhes: true,
    parametros: ["tipo_rosca", "posicao"],
    custoExtra: 0
  },
  { 
    id: "corte_angulo", 
    nome: "Corte em ângulo",
    descricao: "Corte em ângulo específico",
    requerDetalhes: true,
    parametros: ["angulo", "lado"],
    custoExtra: 0
  },
  { 
    id: "furo_chave_allen_xmm_vertical", 
    nome: "Furo p/ passagem de chave allen a X mm da face - Vertical",
    descricao: "Furo vertical a distância específica",
    requerDetalhes: true,
    parametros: ["distancia_mm"],
    custoExtra: 0
  },
  { 
    id: "furo_chave_allen_xmm_horizontal", 
    nome: "Furo p/ passagem de chave allen a X mm da face - Horizontal",
    descricao: "Furo horizontal a distância específica",
    requerDetalhes: true,
    parametros: ["distancia_mm"],
    custoExtra: 0
  },
  { 
    id: "furo_conexao_rosca", 
    nome: "Furo p/ Conexão + Rosca",
    descricao: "Furo para conexão com rosca",
    requerDetalhes: true,
    parametros: ["tipo_conexao", "tipo_rosca"],
    custoExtra: 0
  },
  { 
    id: "furo_conexao_capa_fechamento", 
    nome: "Furo p/ Conexão + Capa de Fechamento",
    descricao: "Furo para conexão com capa",
    requerDetalhes: true,
    parametros: ["tipo_conexao", "tipo_capa"],
    custoExtra: 0
  },
];

export const SERVICOS_OPTIONS: { value: TipoServico; label: string }[] = 
  SERVICOS_CONFIG.map(s => ({ value: s.id, label: s.nome }));

// Configuração padrão do produto (pode ser sobrescrita por produto)
export const PRODUTO_DEFAULT_CONFIG: ProdutoConfig = {
  id: "PERFIL_2040_DEFAULT",
  nome: "Perfil Estrutural em Alumínio 20x40 V-Slot",
  precoPorMetro: 99.0,
  minComprimentoMm: 1,
  maxComprimentoMm: 3000,
  toleranciaCorte: "±1mm no campo e ±3mm no corte",
  comprimentoBarraMm: 6000,
  pesoPorMetroKg: 0.432,
  servicosPermitidos: [
    "sem_servico",
    "furo_chave_allen_padrao",
    "rosca",
    "corte_angulo",
    "furo_chave_allen_xmm_vertical",
    "furo_chave_allen_xmm_horizontal",
    "furo_conexao_rosca",
    "furo_conexao_capa_fechamento"
  ],
  ativo: true
};

// Helper para obter configuração de serviço
export function getServicoConfig(tipoServico: TipoServico): ServicoConfig | undefined {
  return SERVICOS_CONFIG.find(s => s.id === tipoServico);
}
