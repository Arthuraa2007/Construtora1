import axios from "axios";
import type { Imovel } from "../types/imovel";
import { API_ENDPOINTS } from "../config/api";

// 🔹 Buscar todos os imóveis
export const getImoveis = async (): Promise<Imovel[]> => {
  const res = await axios.get<Imovel[]>(API_ENDPOINTS.IMOVEIS);
  return res.data;
};

// 🔹 Deletar imóvel
export const deleteImovel = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.IMOVEIS}/${id}`);
};

// 🔹 Atualizar imóvel
export const updateImovel = async (
  id: number,
  dados: Partial<Omit<Imovel, "id" | "createdAt" | "updatedAt">>
): Promise<Imovel> => {
  const res = await axios.put<Imovel>(`${API_ENDPOINTS.IMOVEIS}/${id}`, dados);
  return res.data;
};

// 🔹 Criar imóvel
export const createImovel = async (
  dados: Omit<Imovel, "id" | "createdAt" | "updatedAt">
): Promise<Imovel> => {
  const res = await axios.post<Imovel>(API_ENDPOINTS.IMOVEIS, dados);
  return res.data;
};

export default {
  getImoveis,
  deleteImovel,
  updateImovel,
  createImovel,
};
