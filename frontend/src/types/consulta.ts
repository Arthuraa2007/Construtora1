import type { Imovel } from "./imovel";

export interface Consulta {
  id: number;
  dataHora: string;
  pacienteId: number;
  medicoId: number;
  imovelId: number; // 🔹 referência ao imóvel escolhido

  paciente?: {
    nome: string;
    cpf: string;
  };
  medico?: {
    nome: string;
    especialidade: string;
  };
  imovel?: Imovel; // 🔹 objeto completo do imóvel (opcional)
}
