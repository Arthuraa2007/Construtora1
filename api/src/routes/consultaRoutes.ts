import { Router } from "express";
import {
  createConsulta,
  getAllConsultas,
  getConsultaById,
  updateConsulta,
  deleteConsulta,
} from "../controllers/consultaController";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createConsultaSchema,
  updateConsultaSchema,
  idParamSchema,
} from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: Gerenciamento de Consultas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConsultaCreate:
 *       type: object
 *       required:
 *         - dataHora
 *         - pacienteId
 *         - medicoId
 *       properties:
 *         dataHora:
 *           type: string
 *           format: date-time
 *           example: "2025-12-25T23:00:00.000Z"
 *         pacienteId:
 *           type: integer
 *           example: 1
 *         medicoId:
 *           type: integer
 *           example: 2
 *         imovelId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         motivo:
 *           type: string
 *           example: "Visita ao imóvel"
 *
 *     ConsultaUpdate:
 *       type: object
 *       properties:
 *         dataHora:
 *           type: string
 *           format: date-time
 *         pacienteId:
 *           type: integer
 *         medicoId:
 *           type: integer
 *         imovelId:
 *           type: integer
 *           nullable: true
 *         motivo:
 *           type: string
 */

/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Criar uma nova consulta
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ConsultaCreate"
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post("/consultas", validateBody(createConsultaSchema), createConsulta);

/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Listar todas as consultas
 *     tags: [Consultas]
 *     responses:
 *       200:
 *         description: Lista de consultas
 */
router.get("/consultas", getAllConsultas);

/**
 * @swagger
 * /consultas/{id}:
 *   get:
 *     summary: Buscar consulta por ID
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta encontrada
 *       404:
 *         description: Consulta não encontrada
 */
router.get("/consultas/:id", validateParams(idParamSchema), getConsultaById);

/**
 * @swagger
 * /consultas/{id}:
 *   put:
 *     summary: Atualizar uma consulta
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ConsultaUpdate"
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso
 *       404:
 *         description: Consulta não encontrada
 */
router.put(
  "/consultas/:id",
  validateParams(idParamSchema),
  validateBody(updateConsultaSchema),
  updateConsulta
);

/**
 * @swagger
 * /consultas/{id}:
 *   delete:
 *     summary: Remover consulta
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Consulta removida
 *       404:
 *         description: Consulta não encontrada
 */
router.delete("/consultas/:id", validateParams(idParamSchema), deleteConsulta);

export default router;
