// src/schemas/imovelSchema.ts
import { z } from "zod";

export const createImovelSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome do imóvel deve ter pelo menos 2 caracteres")
    .max(100, "Nome do imóvel deve ter no máximo 100 caracteres"),

  endereco: z
    .string()
    .min(5, "Endereço deve ter pelo menos 5 caracteres")
    .max(255, "Endereço deve ter no máximo 255 caracteres"),

  // ✅ Corrigido: invalid_type_error deve ser passado dentro de z.number(), não em z.coerce.number()
  valor: z.coerce
    .number()
    .positive("Valor deve ser maior que zero")
    .refine((val) => !isNaN(val), {
      message: "Valor deve ser numérico",
    }),

  descricao: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),

  dataConstrucao: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true; // campo vazio é válido
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, "Data de construção deve ser uma data válida"),
  });

export const updateImovelSchema = createImovelSchema.partial();
