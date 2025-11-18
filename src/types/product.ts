export type TipoServico =
  | "sem_servico"
  | "furo_chave_allen_padrao"
  | "rosca"
  | "corte_angulo"
  | "furo_chave_allen_xmm_vertical"
  | "furo_chave_allen_xmm_horizontal"
  | "furo_conexao_rosca"
  | "furo_conexao_capa_fechamento";

export interface DetalhesServico {
  tipoDetalhe?: string; // Select opcional (ex: "S/ Serviço", "Furo em uma extremidade", etc)
  textoDetalhes?: string; // Textarea para descrição livre
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
}

export const SERVICOS_OPTIONS: { value: TipoServico; label: string }[] = [
  { value: "sem_servico", label: "Sem serviço" },
  { value: "furo_chave_allen_padrao", label: "Furo p/ passagem de chave allen p/ montagem padrão" },
  { value: "rosca", label: "Rosca" },
  { value: "corte_angulo", label: "Corte em ângulo" },
  { value: "furo_chave_allen_xmm_vertical", label: "Furo p/ passagem de chave allen a X mm da face - Vertical" },
  { value: "furo_chave_allen_xmm_horizontal", label: "Furo p/ passagem de chave allen a X mm da face - Horizontal" },
  { value: "furo_conexao_rosca", label: "Furo p/ Conexão + Rosca" },
  { value: "furo_conexao_capa_fechamento", label: "Furo p/ Conexão + Capa de Fechamento" },
];

export const COMPRIMENTO_MIN = 1;
export const COMPRIMENTO_MAX = 3000;
export const TOLERANCIA_CAMPO = 1;
export const TOLERANCIA_CORTE = 3;
export const PRECO_POR_METRO_DEFAULT = 99.0;
