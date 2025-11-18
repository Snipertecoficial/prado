import { PecaPerfil2040 } from "@/types/product";

export function calcularPrecoPeca(
  comprimentoMm: number,
  quantidade: number,
  precoPorMetro: number = 99.0
): number {
  const comprimentoM = comprimentoMm / 1000;
  const total = comprimentoM * precoPorMetro * quantidade;
  return Number(total.toFixed(2));
}

export function calcularResumoPedido(
  pecas: PecaPerfil2040[],
  precoPorMetro: number = 99.0
): { totalMetros: number; totalValor: number } {
  let totalMetros = 0;
  let totalValor = 0;

  for (const peca of pecas) {
    const comprimentoM = peca.comprimentoMm / 1000;
    const valorPeca = comprimentoM * precoPorMetro * peca.quantidade;
    totalMetros += comprimentoM * peca.quantidade;
    totalValor += valorPeca;
  }

  return {
    totalMetros: Number(totalMetros.toFixed(3)),
    totalValor: Number(totalValor.toFixed(2)),
  };
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function validarComprimento(
  comprimento: number
): { valido: boolean; erro?: string } {
  if (isNaN(comprimento)) {
    return { valido: false, erro: "Por favor, insira um número válido" };
  }
  if (comprimento < 1) {
    return {
      valido: false,
      erro: "O comprimento mínimo é 1 mm",
    };
  }
  if (comprimento > 3000) {
    return {
      valido: false,
      erro: "O comprimento máximo é 3000 mm",
    };
  }
  return { valido: true };
}

export function validarQuantidade(
  quantidade: number
): { valido: boolean; erro?: string } {
  if (isNaN(quantidade) || quantidade < 1 || !Number.isInteger(quantidade)) {
    return {
      valido: false,
      erro: "A quantidade deve ser um número inteiro maior ou igual a 1",
    };
  }
  return { valido: true };
}
