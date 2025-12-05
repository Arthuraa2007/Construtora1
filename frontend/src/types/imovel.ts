export interface Imovel {
  id: number;
  nome: string;
  endereco: string;
  valor: number;
  descricao?: string;
  dataConstrucao?: Date; // formato ISO (ex.: "2025-12-04T00:00:00.000Z")
  createdAt: string;       // gerado pelo Prisma
  updatedAt: string;       // gerado pelo Prisma
}
