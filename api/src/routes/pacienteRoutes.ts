import { Router } from "express";
import {
  createPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
} from "../controllers/pacienteController";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createPacienteSchema,
  updatePacienteSchema,
  idParamSchema,
} from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gerenciamento de Clientes
 */

/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - dataNascimento
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente criado com sucesso
 *       400:
 *         description: Erro na requisição
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/pacientes", validateBody(createPacienteSchema), createPaciente);

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Retorna todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/pacientes", getAllPacientes);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/pacientes/:id", validateParams(idParamSchema), getPacienteById);

/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
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
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  "/pacientes/:id",
  validateParams(idParamSchema),
  validateBody(updatePacienteSchema),
  updatePaciente
);

/**
 * @swagger
 * /pacientes/{id}:
 *   delete:
 *     summary: Deleta um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/pacientes/:id", validateParams(idParamSchema), deletePaciente);

export default router;