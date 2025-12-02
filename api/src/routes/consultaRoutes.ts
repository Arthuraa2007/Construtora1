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
 *   name: Imovel
 *   description: Gerenciamento de Imovéis
 */

/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Cria um novo imovel
 *     tags: [Imovel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataHora
 *               - pacienteId
 *               - medicoId
 *             properties:
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *               pacienteId:
 *                 type: integer
 *               medicoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Imovel criado com sucesso
 *       400:
 *         description: Erro na requisição
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/consultas", validateBody(createConsultaSchema), createConsulta);

/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Retorna todas os imoveis
 *     tags: [Imovel]
 *     responses:
 *       200:
 *         description: Lista de imoveis
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/consultas", getAllConsultas);

/**
 * @swagger
 * /consultas/{id}:
 *   get:
 *     summary: Retorna um imovel pelo ID
 *     tags: [Imovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imovel encontrado
 *       404:
 *         description: Imovel não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/consultas/:id", validateParams(idParamSchema), getConsultaById);

/**
 * @swagger
 * /consultas/{id}:
 *   put:
 *     summary: Atualiza um imovel
 *     tags: [Imovel]
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
 *               data:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Imovel atualizado com sucesso
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Imovel não encontrado
 *       500:
 *         description: Erro interno do servidor
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
 *     summary: Deleta um imovel
 *     tags: [Imovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Imovel deletado com sucesso
 *       404:
 *         description: Imovel não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/consultas/:id", validateParams(idParamSchema), deleteConsulta);

export default router;
