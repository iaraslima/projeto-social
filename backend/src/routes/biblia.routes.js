import express from 'express';
import {
  getTestamentosController,
  getLivrosPorTestamentoController,
  getCapitulosPorLivroController,
  getVersiculosPorCapituloController
} from '../controllers/biblia.controller.js';

const router = express.Router();

router.get('/testamentos', getTestamentosController);

router.get('/livros/:testamento', getLivrosPorTestamentoController);

router.get('/capitulos/:livro', getCapitulosPorLivroController);

router.get('/versiculos/:livro/:capitulo', getVersiculosPorCapituloController);

export default router;

