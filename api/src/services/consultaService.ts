import { prisma } from "../database/prisma";
import type { Consulta } from "../generated/prisma";

// ---------------------------------------------
// 🔹 TYPES CORRETOS
// ---------------------------------------------
type ConsultaCreateData = {
  dataHora: string;
  motivo?: string | null;
  pacienteId: number;
  medicoId: number;
  imovelId: number | null;
};

type ConsultaUpdateData = Partial<{
  dataHora: string;
  motivo?: string | null;
  imovelId: number | null;
}>;

// ---------------------------------------------
// 🔹 CREATE
// ---------------------------------------------
export const create = async (data: ConsultaCreateData): Promise<Consulta> => {
  const { pacienteId, medicoId, imovelId } = data;

  // valida paciente
  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente) throw new Error("Paciente não encontrado");

  // valida médico
  const medico = await prisma.medico.findUnique({ where: { id: medicoId } });
  if (!medico) throw new Error("Médico não encontrado");

  // valida imóvel obrigatório
  if (imovelId === null || imovelId === undefined) {
    throw new Error("O imóvel deve ser informado");
  }

  const imovel = await prisma.imovel.findUnique({ where: { id: imovelId } });
  if (!imovel) throw new Error("Imóvel não encontrado");

  return prisma.consulta.create({
    data: {
      dataHora: new Date(data.dataHora),
      motivo: data.motivo ?? null,
      pacienteId,
      medicoId,
      imovelId,
    },
    include: {
      paciente: { select: { nome: true, cpf: true } },
      medico: { select: { nome: true, especialidade: true } },
      imovel: { select: { nome: true, endereco: true, valor: true } },
    },
  });
};

// ---------------------------------------------
// 🔹 GET ALL
// ---------------------------------------------
export const getAll = async () => {
  return prisma.consulta.findMany({
    include: {
      paciente: { select: { nome: true, cpf: true } },
      medico: { select: { nome: true, especialidade: true } },
      imovel: { select: { nome: true, endereco: true, valor: true } },
    },
    orderBy: { dataHora: "asc" },
  });
};

// ---------------------------------------------
// 🔹 GET BY ID
// ---------------------------------------------
export const getById = async (id: number) => {
  return prisma.consulta.findUnique({
    where: { id },
    include: {
      paciente: true,
      medico: true,
      imovel: true,
    },
  });
};

// ---------------------------------------------
// 🔹 UPDATE
// ---------------------------------------------
export const update = async (
  id: number,
  data: ConsultaUpdateData
): Promise<Consulta> => {
  const updateData: any = {
    motivo: data.motivo ?? undefined,
  };

  // Atualizar dataHora
  if (data.dataHora) {
    updateData.dataHora = new Date(data.dataHora);
  }

  // Atualizar imovelId (pode ser null para remover)
  if (data.imovelId !== undefined) {
    if (data.imovelId === null) {
      updateData.imovelId = null;
    } else {
      const imovel = await prisma.imovel.findUnique({
        where: { id: data.imovelId },
      });
      if (!imovel) throw new Error("Imóvel não encontrado");
      updateData.imovelId = data.imovelId;
    }
  }

  return prisma.consulta.update({
    where: { id },
    data: updateData,
    include: {
      paciente: { select: { nome: true, cpf: true } },
      medico: { select: { nome: true, especialidade: true } },
      imovel: { select: { nome: true, endereco: true, valor: true } },
    },
  });
};

// ---------------------------------------------
// 🔹 DELETE
// ---------------------------------------------
export const remove = async (id: number): Promise<Consulta> => {
  return prisma.consulta.delete({
    where: { id },
    include: {
      paciente: true,
      medico: true,
      imovel: true,
    },
  });
};
