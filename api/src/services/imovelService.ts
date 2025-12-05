import { prisma } from "../database/prisma";
import { Imovel } from "../generated/prisma";

// Tipos auxiliares para criação e atualização
type ImovelCreateData = Omit<Imovel, "id" | "createdAt" | "updatedAt">;
type ImovelUpdateData = Partial<ImovelCreateData>;

// Criar imóvel
export const create = async (data: ImovelCreateData): Promise<Imovel> => {
  return prisma.imovel.create({
    data: {
      ...data,
      dataConstrucao: data.dataConstrucao
        ? new Date(data.dataConstrucao)
        : undefined,
    },
  });
};

// Listar todos os imóveis
export const getAll = async (): Promise<Imovel[]> => {
  return prisma.imovel.findMany();
};

// Buscar imóvel por ID
export const getById = async (id: number): Promise<Imovel | null> => {
  return prisma.imovel.findUnique({ where: { id } });
};

// Atualizar imóvel
export const update = async (
  id: number,
  data: ImovelUpdateData
): Promise<Imovel> => {
  return prisma.imovel.update({
    where: { id },
    data: {
      ...data,
       dataConstrucao: data.dataConstrucao
        ? new Date(data.dataConstrucao)
        : undefined,
    },
  });
};

// Remover imóvel
export const remove = async (id: number): Promise<Imovel> => {
  return prisma.imovel.delete({ where: { id } });
};
