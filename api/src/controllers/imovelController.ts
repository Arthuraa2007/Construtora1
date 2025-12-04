import { Request, Response } from "express";
import * as imovelService from "../services/imovelService";

// Criar imóvel
export const createImovel = async (req: Request, res: Response) => {
  try {
    const novoImovel = await imovelService.create(req.body);
    return res.status(201).json(novoImovel);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: `Campo único já existe: ${error.meta.target}` });
    }
    return res.status(500).json({ message: error.message });
  }
};

// Listar todos os imóveis
export const getAllImoveis = async (_req: Request, res: Response) => {
  try {
    const imoveis = await imovelService.getAll();
    return res.json(imoveis);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Buscar imóvel por ID
export const getImovelById = async (req: Request, res: Response) => {
  try {
    const imovel = await imovelService.getById(Number(req.params.id));
    if (!imovel)
      return res.status(404).json({ message: "Imóvel não encontrado" });
    return res.json(imovel);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Atualizar imóvel
export const updateImovel = async (req: Request, res: Response) => {
  try {
    const imovel = await imovelService.update(Number(req.params.id), req.body);
    return res.json(imovel);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Imóvel não encontrado" });
    return res.status(500).json({ message: error.message });
  }
};

// Deletar imóvel
export const deleteImovel = async (req: Request, res: Response) => {
  try {
    await imovelService.remove(Number(req.params.id));
    return res.status(204).send();
  } catch (error: any) {
    // Imóvel não existe
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Imóvel não encontrado" });
    }

    // Imóvel vinculado a contratos/vendas
    if (error.code === "P2003") {
      return res.status(409).json({
        message:
          "Não é possível excluir o imóvel porque existem registros vinculados a ele.",
      });
    }

    return res.status(500).json({ message: error.message });
  }
};
