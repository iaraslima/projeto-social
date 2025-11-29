import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BIBLIA_API_CONFIG, LIVROS_MAP } from '../config/api.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const BIBLIA_JSON_URL = BIBLIA_API_CONFIG.jsonUrl;
const CACHE_FILE = path.join(__dirname, '../../data/biblia-cache.json');


let bibliaCache = null;


const MAPEAMENTO_LIVROS = {
    // Antigo Testamento
    'Gênesis': 'gn', 'Êxodo': 'ex', 'Levítico': 'lv', 'Números': 'nm', 'Deuteronômio': 'dt',
    'Josué': 'js', 'Juízes': 'jz', 'Rute': 'rt', '1 Samuel': '1sm', '2 Samuel': '2sm',
    '1 Reis': '1rs', '2 Reis': '2rs', '1 Crônicas': '1cr', '2 Crônicas': '2cr', 'Esdras': 'ed',
    'Neemias': 'ne', 'Ester': 'et', 'Jó': 'job', 'Salmos': 'sl', 'Provérbios': 'pv',
    'Eclesiastes': 'ec', 'Cânticos': 'ct', 'Isaías': 'is', 'Jeremias': 'jr', 'Lamentações': 'lm',
    'Ezequiel': 'ez', 'Daniel': 'dn', 'Oséias': 'os', 'Joel': 'jl', 'Amós': 'am',
    'Obadias': 'ob', 'Jonas': 'jn', 'Miqueias': 'mq', 'Naum': 'na', 'Habacuque': 'hc',
    'Sofonias': 'sf', 'Ageu': 'ag', 'Zacarias': 'zc', 'Malaquias': 'ml',
    // Novo Testamento
    'Mateus': 'mt', 'Marcos': 'mc', 'Lucas': 'lc', 'João': 'jo', 'Atos': 'at',
    'Romanos': 'rm', '1 Coríntios': '1co', '2 Coríntios': '2co', 'Gálatas': 'gl', 'Efésios': 'ef',
    'Filipenses': 'fp', 'Colossenses': 'cl', '1 Tessalonicenses': '1ts', '2 Tessalonicenses': '2ts',
    '1 Timóteo': '1tm', '2 Timóteo': '2tm', 'Tito': 'tt', 'Filemom': 'fm', 'Hebreus': 'hb',
    'Tiago': 'tg', '1 Pedro': '1pe', '2 Pedro': '2pe', '1 João': '1jo', '2 João': '2jo',
    '3 João': '3jo', 'Judas': 'jd', 'Apocalipse': 'ap'
};


const carregarBiblia = async () => {
    if (bibliaCache) {
        return bibliaCache;
    }

    try {
        if (fs.existsSync(CACHE_FILE)) {
        const cacheData = fs.readFileSync(CACHE_FILE, 'utf-8');
        bibliaCache = JSON.parse(cacheData);
        console.log('Bíblia carregada do cache local');
        return bibliaCache;
        }
    } catch (error) {
        console.log('Erro ao carregar cache local, baixando do GitHub...');
    }

  try {
    console.log('Baixando Bíblia completa...');
    const response = await axios.get(BIBLIA_JSON_URL, {
      timeout: 30000
    });
    
    bibliaCache = response.data;
    
    try {
      const dataDir = path.dirname(CACHE_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(bibliaCache), 'utf-8');
      console.log('Bíblia salva no cache local');
    } catch (error) {
      console.log('Aviso: Não foi possível salvar cache local:', error.message);
    }
    
    return bibliaCache;
  } catch (error) {
    console.error('Erro ao baixar Bíblia do GitHub:', error.message);
    throw new Error('Não foi possível carregar a Bíblia completa');
  }
};

const normalizarNomeLivro = (nome) => {
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const encontrarLivro = (biblia, livroId) => {
  const antigo = biblia.antigoTestamento || [];
  const novo = biblia.novoTestamento || [];
  const todosLivros = [...antigo, ...novo];
  
  const idNormalizado = livroId.toLowerCase();
  const nomePorId = LIVROS_MAP[idNormalizado];
  
  if (nomePorId) {
    const livro = todosLivros.find(l => 
      normalizarNomeLivro(l.nome) === normalizarNomeLivro(nomePorId)
    );
    if (livro) return livro;
  }
  
  const livro = todosLivros.find(l => 
    normalizarNomeLivro(l.nome) === normalizarNomeLivro(livroId) ||
    normalizarNomeLivro(l.nome).includes(normalizarNomeLivro(livroId)) ||
    normalizarNomeLivro(livroId).includes(normalizarNomeLivro(l.nome))
  );
  
  return livro;
};

/**
 * Obtém todos os testamentos com seus livros
 * @returns {Promise<Object>} Objeto com antigo e novo testamento
 */
export const getTestamentos = async () => {
  try {
    const biblia = await carregarBiblia();
    
    const antigo = (biblia.antigoTestamento || []).map(livro => ({
      id: MAPEAMENTO_LIVROS[livro.nome] || livro.nome.toLowerCase().substring(0, 2),
      nome: livro.nome,
      testamento: 'antigo'
    }));
    
    const novo = (biblia.novoTestamento || []).map(livro => ({
      id: MAPEAMENTO_LIVROS[livro.nome] || livro.nome.toLowerCase().substring(0, 2),
      nome: livro.nome,
      testamento: 'novo'
    }));
    
    return { antigo, novo };
  } catch (error) {
    console.error('Erro ao buscar testamentos:', error.message);
    return getTestamentosFallback();
  }
};


const getTestamentosFallback = () => {
  const livrosAntigo = Object.entries(LIVROS_MAP)
    .filter(([id]) => {
      const antigoIds = ['gn', 'ex', 'lv', 'nm', 'dt', 'js', 'jz', 'rt', '1sm', '2sm', 
                          '1rs', '2rs', '1cr', '2cr', 'ed', 'ne', 'et', 'job', 'sl', 'pv',
                          'ec', 'ct', 'is', 'jr', 'lm', 'ez', 'dn', 'os', 'jl', 'am',
                          'ob', 'jn', 'mq', 'na', 'hc', 'sf', 'ag', 'zc', 'ml'];
      return antigoIds.includes(id);
    })
    .map(([id, nome]) => ({ id, nome, testamento: 'antigo' }));
  
  const livrosNovo = Object.entries(LIVROS_MAP)
    .filter(([id]) => {
      const novoIds = ['mt', 'mc', 'lc', 'jo', 'at', 'rm', '1co', '2co', 'gl', 'ef',
                        'fp', 'cl', '1ts', '2ts', '1tm', '2tm', 'tt', 'fm', 'hb', 'tg',
                        '1pe', '2pe', '1jo', '2jo', '3jo', 'jd', 'ap'];
      return novoIds.includes(id);
    })
    .map(([id, nome]) => ({ id, nome, testamento: 'novo' }));

  return {
    antigo: livrosAntigo,
    novo: livrosNovo
  };
};

/**
 * Obtém os livros de um testamento específico
 * @param {string} testamento - 'antigo' ou 'novo'
 * @returns {Promise<Array>} Lista de livros do testamento
 */
export const getLivrosPorTestamento = async (testamento) => {
  try {
    const testamentos = await getTestamentos();
    
    if (testamento.toLowerCase() === 'antigo') {
      return testamentos.antigo;
    } else if (testamento.toLowerCase() === 'novo') {
      return testamentos.novo;
    } else {
      throw new Error('Testamento inválido. Use "antigo" ou "novo"');
    }
  } catch (error) {
    throw new Error(`Erro ao buscar livros: ${error.message}`);
  }
};

/**
 * Obtém a quantidade de capítulos de um livro
 * @param {string} livroId - ID do livro (ex: 'gn', 'mt')
 * @returns {Promise<Object>} Objeto com informações do livro e quantidade de capítulos
 */
export const getCapitulosPorLivro = async (livroId) => {
  try {
    const biblia = await carregarBiblia();
    const livro = encontrarLivro(biblia, livroId);
    
    if (!livro) {
      throw new Error(`Livro ${livroId} não encontrado`);
    }
    
    const capitulos = livro.capitulos || [];
    const quantidade = Array.isArray(capitulos) ? capitulos.length : (typeof capitulos === 'number' ? capitulos : 0);
    
    const capitulosArray = typeof capitulos === 'number' 
      ? Array.from({ length: capitulos }, (_, i) => ({ numero: i + 1 }))
      : capitulos.map((cap, index) => ({
          numero: cap.capitulo || cap.numero || (index + 1)
        }));
    
    return {
      livro: MAPEAMENTO_LIVROS[livro.nome] || livroId,
      nome: livro.nome,
      capitulos: capitulosArray,
      quantidade: quantidade
    };
  } catch (error) {
    console.error(`Erro ao buscar capítulos de ${livroId}:`, error.message);
    return getCapitulosPorLivroFallback(livroId);
  }
};


const getCapitulosPorLivroFallback = async (livroId) => {
  const capitulosPorLivro = {
    'gn': 50, 'ex': 40, 'lv': 27, 'nm': 36, 'dt': 34,
    'js': 24, 'jz': 21, 'rt': 4, '1sm': 31, '2sm': 24,
    '1rs': 22, '2rs': 25, '1cr': 29, '2cr': 36, 'ed': 10,
    'ne': 13, 'et': 10, 'job': 42, 'sl': 150, 'pv': 31,
    'ec': 12, 'ct': 8, 'is': 66, 'jr': 52, 'lm': 5,
    'ez': 48, 'dn': 12, 'os': 14, 'jl': 3, 'am': 9,
    'ob': 1, 'jn': 4, 'mq': 7, 'na': 3, 'hc': 3,
    'sf': 3, 'ag': 2, 'zc': 14, 'ml': 4,
    'mt': 28, 'mc': 16, 'lc': 24, 'jo': 21, 'at': 28,
    'rm': 16, '1co': 16, '2co': 13, 'gl': 6, 'ef': 6,
    'fp': 4, 'cl': 4, '1ts': 5, '2ts': 3, '1tm': 6,
    '2tm': 4, 'tt': 3, 'fm': 1, 'hb': 13, 'tg': 5,
    '1pe': 5, '2pe': 3, '1jo': 5, '2jo': 1, '3jo': 1,
    'jd': 1, 'ap': 22
  };

  const quantidadeCapitulos = capitulosPorLivro[livroId.toLowerCase()] || 0;
  const capitulos = Array.from({ length: quantidadeCapitulos }, (_, i) => ({
    numero: i + 1
  }));

  return {
    livro: livroId,
    nome: LIVROS_MAP[livroId.toLowerCase()] || livroId,
    capitulos: capitulos,
    quantidade: quantidadeCapitulos
  };
};

/**
 * Obtém os versículos de um capítulo específico
 * @param {string} livroId - ID do livro (ex: 'gn', 'mt')
 * @param {number} capitulo - Número do capítulo
 * @returns {Promise<Object>} Objeto com os versículos do capítulo
 */
export const getVersiculosPorCapitulo = async (livroId, capitulo) => {
  try {
    const biblia = await carregarBiblia();
    const livro = encontrarLivro(biblia, livroId);
    
    if (!livro) {
      throw new Error(`Livro ${livroId} não encontrado`);
    }
    
    const capitulos = livro.capitulos || [];
    
    let capituloData = null;
    if (Array.isArray(capitulos)) {
      capituloData = capitulos.find(cap => 
        (cap.capitulo === capitulo) || 
        (cap.numero === capitulo) ||
        (Array.isArray(capitulos) && capitulos.indexOf(cap) + 1 === capitulo)
      );
      
      if (!capituloData && capitulos[capitulo - 1]) {
        capituloData = capitulos[capitulo - 1];
      }
    }
    
    if (!capituloData) {
      throw new Error(`Capítulo ${capitulo} não encontrado no livro ${livro.nome}`);
    }
    
    const versiculos = capituloData.versiculos || [];
    const versiculosFormatados = versiculos.map(v => ({
      numero: v.versiculo || v.numero || v.verse,
      texto: v.texto || v.text || v.content || ''
    }));
    
    return {
      livro: MAPEAMENTO_LIVROS[livro.nome] || livroId,
      capitulo: capitulo,
      versiculos: versiculosFormatados,
      nomeLivro: livro.nome,
      versao: 'Ave Maria'
    };
  } catch (error) {
    console.error(`Erro ao buscar versículos de ${livroId} ${capitulo}:`, error.message);
    return {
      livro: livroId,
      capitulo: capitulo,
      versiculos: [],
      nomeLivro: LIVROS_MAP[livroId.toLowerCase()] || livroId,
      mensagem: `Erro: ${error.message}`
    };
  }
};
