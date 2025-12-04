import type { Imovel } from "./imovel";

export interface Consulta {
  id: number;
  dataHora: string;
  pacienteId: number;
  medicoId: number;
  imovelId: number | null; // 🔹 deixe null porque é opcional na criação

  motivo?: string; // 🔹 ADICIONADO (opcional)

  paciente?: {
    nome: string;
    cpf: string;
  };
  medico?: {
    nome: string;
    especialidade: string;
  };
  imovel?: Imovel;
}
