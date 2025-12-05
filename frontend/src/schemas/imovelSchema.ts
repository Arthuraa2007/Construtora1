import { z } from "zod";

export const createImovelSchema = z.object({
  nome: z.string()
    .min(2, "Nome do imóvel deve ter pelo menos 2 caracteres")
    .max(100, "Nome do imóvel deve ter no máximo 100 caracteres"),

  endereco: z.string()
    .min(5, "Endereço deve ter pelo menos 5 caracteres")
    .max(255, "Endereço deve ter no máximo 255 caracteres"),

  valor: z.coerce.number()
    .positive("Valor deve ser maior que zero"),

  descricao: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),

  dataConstrucao: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, { message: "Data de construção deve ser uma data válida" }),
});

export const updateImovelSchema = createImovelSchema.partial();
