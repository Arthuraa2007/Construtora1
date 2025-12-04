import { z } from "zod";

// Schema para criar consulta
export const createConsultaSchema = z.object({
  dataHora: z.string().min(1, "Data e hora são obrigatórias"),
  motivo: z.string().optional(),

  pacienteId: z
    .number({ message: "Cliente é obrigatório" })
    .int()
    .positive("Selecione um cliente válido"),

  medicoId: z
    .number({ message: "Atendente é obrigatório" })
    .int()
    .positive("Selecione um atendente válido"),

  imovelId: z
    .number({ message: "Imóvel é obrigatório" })
    .int()
    .positive("Selecione um imóvel válido"),
});

// Schema para atualizar consulta
export const updateConsultaSchema = createConsultaSchema;
