// src/schemas/imovelSchema.ts
import { z } from "zod";

export const createImovelSchema = z.object({
  nome: z.string().min(2, "Nome do imóvel deve ter pelo menos 2 caracteres").max(100, "Nome do imóvel deve ter no máximo 100 caracteres"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres").max(255, "Endereço deve ter no máximo 255 caracteres"),
  valor: z.coerce.number({ invalid_type_error: "Valor deve ser numérico" }).positive("Valor deve ser maior que zero"),
  descricao: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  dataConstrucao: z.string().refine((date: string) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Data de construção deve ser uma data válida").optional(),
});

export const updateImovelSchema = createImovelSchema.partial();
