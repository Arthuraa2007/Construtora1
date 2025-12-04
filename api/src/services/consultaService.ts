import { prisma } from "../database/prisma";
import { Consulta } from "../generated/prisma";

// 🔹 Tipos auxiliares
type ConsultaCreateData = Omit<Consulta, "id" | "createdAt" | "updatedAt">;
type ConsultaUpdateData = Partial<
  Omit<Consulta, "id" | "createdAt" | "updatedAt" | "pacienteId" | "medicoId">
>;

// 🔹 Criar consulta
export const create = async (data: ConsultaCreateData): Promise<Consulta> => {
  const { pacienteId, medicoId, imovelId } = data;

  // valida paciente
  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente) throw new Error("Paciente não encontrado");

  // valida médico
  const medico = await prisma.medico.findUnique({ where: { id: medicoId } });
  if (!medico) throw new Error("Médico não encontrado");

  // valida imóvel APENAS SE vier no body
  if (imovelId !== null && imovelId !== undefined) {
    const imovel = await prisma.imovel.findUnique({ where: { id: imovelId } });
    if (!imovel) throw new Error("Imóvel não encontrado");
  }

  // cria consulta
  return prisma.consulta.create({
    data: {
      ...data,
      dataHora: new Date(data.dataHora),
      imovelId: imovelId ?? null, // garante null quando não enviado
    },
    include: {
      paciente: { select: { nome: true, cpf: true } },
      medico: { select: { nome: true, especialidade: true } },
      imovel: { select: { nome: true, endereco: true, valor: true } },
    },
  });
};

// 🔹 Listar todas as consultas
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

// 🔹 Buscar consulta por ID
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

// 🔹 Atualizar consulta
export const update = async (
  id: number,
  data: ConsultaUpdateData
): Promise<Consulta> => {
  const updateData: any = {
    ...data,
    dataHora: data.dataHora ? new Date(data.dataHora) : undefined,
  };

  // permitir imovelId = null (remover imóvel)
  if (data.imovelId === null) {
    updateData.imovelId = null;
  }

  // se enviar um imóvel novo, validar
  if (data.imovelId !== undefined && data.imovelId !== null) {
    const imovel = await prisma.imovel.findUnique({
      where: { id: data.imovelId },
    });
    if (!imovel) throw new Error("Imóvel não encontrado");
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

// 🔹 Remover consulta
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
