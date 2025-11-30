import {
  getTestamentos,
  getLivrosPorTestamento,
  getCapitulosPorLivro,
  getVersiculosPorCapitulo
} from '../services/biblia.service.js';

export const getTestamentosController = async (req, res) => {
  try {
    const testamentos = await getTestamentos();
    res.json(testamentos);
  } catch (error) {
    console.error('Erro ao buscar testamentos:', error);
    res.status(500).json({
      error: 'Erro ao buscar testamentos',
      message: error.message
    });
  }
};

export const getLivrosPorTestamentoController = async (req, res) => {
  try {
    const { testamento } = req.params;
    
    if (!testamento || (testamento.toLowerCase() !== 'antigo' && testamento.toLowerCase() !== 'novo')) {
      return res.status(400).json({
        error: 'Testamento inválido',
        message: 'Use "antigo" ou "novo" como parâmetro'
      });
    }

    const livros = await getLivrosPorTestamento(testamento);
    res.json(livros);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({
      error: 'Erro ao buscar livros',
      message: error.message
    });
  }
};

export const getCapitulosPorLivroController = async (req, res) => {
  try {
    const { livro } = req.params; 
    
    console.log(`[BACKEND LOG] Requisição de capítulos recebida para ID: ${livro}`);

    if (!livro) {
      return res.status(400).json({
        error: 'Livro não informado',
        message: 'Informe o ID do livro (ex: gn, mt, jo)'
      });
    }

    const dados = await getCapitulosPorLivro(livro);
    
    if (!dados) {
      console.warn(`[BACKEND LOG] Dados não encontrados para o livro ID: ${livro}. Retornando 404.`);
      return res.status(404).json({
        error: 'Livro ou capítulos não encontrados',
        message: `Não foram encontrados dados de capítulos para o ID "${livro}".`
      });
    }

    console.log(`[BACKEND LOG] Sucesso! ${dados.nome} encontrado.`); 
    res.json(dados);
    
  } catch (error) {
    console.error('Erro ao buscar capítulos (CATCH):', error);
    res.status(500).json({
      error: 'Erro ao buscar capítulos',
      message: error.message
    });
  }
};

export const getVersiculosPorCapituloController = async (req, res) => {
  try {
    const { livro, capitulo } = req.params;
    
    if (!livro) {
      return res.status(400).json({
        error: 'Livro não informado',
        message: 'Informe o ID do livro (ex: gn, mt, jo)'
      });
    }

    const numeroCapitulo = parseInt(capitulo);
    if (isNaN(numeroCapitulo) || numeroCapitulo < 1) {
      return res.status(400).json({
        error: 'Capítulo inválido',
        message: 'O capítulo deve ser um número maior que zero'
      });
    }

    const dados = await getVersiculosPorCapitulo(livro, numeroCapitulo);
    
    if (!dados) {
      return res.status(404).json({
          error: 'Versículos não encontrados',
          message: `Nenhum versículo encontrado para o livro ${livro} e capítulo ${numeroCapitulo}.`
      });
    }

    res.json(dados);
  } catch (error) {
    console.error('Erro ao buscar versículos:', error);
    res.status(500).json({
      error: 'Erro ao buscar versículos',
      message: error.message
    });
  }
};