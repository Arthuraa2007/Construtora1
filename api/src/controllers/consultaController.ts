import { Request, Response } from "express";
import * as consultaService from "../services/consultaService";
import {
  createConsultaSchema,
  updateConsultaSchema
} from "../schemas/validation";


// ---------------------------------------------
// 🔹 CREATE
// ---------------------------------------------
export const createConsulta = async (req: Request, res: Response) => {
  try {
    // valida body com Zod
    const validated = createConsultaSchema.parse(req.body);

    const consulta = await consultaService.create({
      ...validated,
      imovelId: req.body.imovelId, // imovelId vem como number
    });

    return res.status(201).json(consulta);
  } catch (error: any) {
    // Erro de validação Zod
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.errors.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------
// 🔹 GET ALL
// ---------------------------------------------
export const getAllConsultas = async (req: Request, res: Response) => {
  try {
    const consultas = await consultaService.getAll();
    return res.json(consultas);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 🔹 GET BY ID
// ---------------------------------------------
export const getConsultaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const consulta = await consultaService.getById(id);

    if (!consulta) {
      return res.status(404).json({ message: "Consulta não encontrada." });
    }

    return res.json(consulta);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 🔹 UPDATE
// ---------------------------------------------
export const updateConsulta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    // valida body com Zod
    updateConsultaSchema.parse(req.body);

    const consulta = await consultaService.update(id, req.body);

    return res.json(consulta);
  } catch (error: any) {
    // Erro de validação Zod
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.errors.map((e: any) => e.message),
      });
    }

    // Prisma: registro não encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Consulta não encontrada." });
    }

    return res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------
// 🔹 DELETE
// ---------------------------------------------
export const deleteConsulta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    await consultaService.remove(id);

    return res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Consulta não encontrada." });
    }

    return res.status(500).json({ message: error.message });
  }
};
