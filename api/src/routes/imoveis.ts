import { Router } from "express";
import {
  createImovel,
  getAllImoveis,
  getImovelById,
  updateImovel,
  deleteImovel,
} from "../controllers/imovelController";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createImovelSchema,
  updateImovelSchema,
  idParamSchema,
} from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Imóveis
 *   description: Gerenciamento de Imóveis
 */

/**
 * @swagger
 * /cadastro-imoveis:
 *   post:
 *     summary: Cadastra um novo imóvel
 *     tags: [Imóveis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - endereco
 *               - valor
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               valor:
 *                 type: number
 *     responses:
 *       201:
 *         description: Imóvel cadastrado com sucesso
 *       400:
 *         description: Erro na requisição
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/cadastro-imoveis", validateBody(createImovelSchema), createImovel);

/**
 * @swagger
 * /cadastro-imoveis:
 *   get:
 *     summary: Retorna todos os imóveis
 *     tags: [Imóveis]
 *     responses:
 *       200:
 *         description: Lista de imóveis
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/cadastro-imoveis", getAllImoveis);

/**
 * @swagger
 * /cadastro-imoveis/{id}:
 *   get:
 *     summary: Retorna um imóvel pelo ID
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imóvel encontrado
 *       404:
 *         description: Imóvel não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/cadastro-imoveis/:id", validateParams(idParamSchema), getImovelById);

/**
 * @swagger
 * /cadastro-imoveis/{id}:
 *   put:
 *     summary: Atualiza um imóvel
 *     tags: [Imóveis]
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
 *               endereco:
 *                 type: string
 *               valor:
 *                 type: number
 *     responses:
 *       200:
 *         description: Imóvel atualizado com sucesso
 *       400:
 *         description: Erro na requisição
 *       404:
 *         description: Imóvel não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  "/cadastro-imoveis/:id",
  validateParams(idParamSchema),
  validateBody(updateImovelSchema),
  updateImovel
);

/**
 * @swagger
 * /cadastro-imoveis/{id}:
 *   delete:
 *     summary: Deleta um imóvel
 *     tags: [Imóveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Imóvel deletado com sucesso
 *       404:
 *         description: Imóvel não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/cadastro-imoveis/:id", validateParams(idParamSchema), deleteImovel);

export default router;
