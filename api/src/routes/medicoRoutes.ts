import { Router } from "express";
import {
  createMedico,
  getAllMedicos,
  getMedicoById,
  updateMedico,
  deleteMedico,
} from "../controllers/medicoController";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createMedicoSchema,
  updateMedicoSchema,
  idParamSchema,
} from "../schemas/validation";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Atendentes
 *   description: Gerenciamento de Atendentes
 */

/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Cria um novo atendente
 *     tags: [Atendentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - especialidade
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               crm:
 *                 type: string
 *     responses:
 *       201:
 *         description: Atendente criado com sucesso
 *       400:
 *         description: Erro na requisição
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/medicos", validateBody(createMedicoSchema), createMedico);

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Retorna todos os atendentes
 *     tags: [Atendentes]
 *     responses:
 *       200:
 *         description: Lista de Atendentes
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/medicos", getAllMedicos);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Retorna um atendente pelo ID
 *     tags: [Atendentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Atendente encontrado
 *       404:
 *         description: Atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/medicos/:id", validateParams(idParamSchema), getMedicoById);

/**
 * @swagger
 * /medicos/{id}:
 *   put:
 *     summary: Atualiza um atendente
 *     tags: [Atendentes]
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
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atendente atualizado com sucesso
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  "/medicos/:id",
  validateParams(idParamSchema),
  validateBody(updateMedicoSchema),
  updateMedico
);

/**
 * @swagger
 * /medicos/{id}:
 *   delete:
 *     summary: Deleta um atendente
 *     tags: [Atendentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Atendente deletado com sucesso
 *       404:
 *         description: Atendente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/medicos/:id", validateParams(idParamSchema), deleteMedico);

export default router;
