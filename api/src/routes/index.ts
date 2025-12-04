import { Router } from "express";
import secretarioRoutes from "./secretarioRoutes";
import pacienteRoutes from "./pacienteRoutes";
import medicoRoutes from "./medicoRoutes";
import consultaRoutes from "./consultaRoutes";
import autenticacaoRoutes from "./autenticacaoRoutes";
import imoveisRoutes from "./imoveis"; // ✅ importa as rotas de imóveis

const routes = Router();

routes.use(secretarioRoutes);
routes.use(pacienteRoutes);
routes.use(medicoRoutes);
routes.use(consultaRoutes);
routes.use(autenticacaoRoutes);
routes.use(imoveisRoutes); // ✅ registra as rotas de imóveis

export default routes;
