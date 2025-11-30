import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { BIBLIA_API_CONFIG, LIVROS_MAP as MAPEAMENTO_LIVROS } from '../config/api.config.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, '../../data/biblia-cache.json'); 
const BIBLIA_JSON_URL = BIBLIA_API_CONFIG.jsonUrl;

let bibliaCache = null;

const _carregarDadosBiblia = async () => {
    if (bibliaCache) {
        return bibliaCache;
    }

    try {
        if (fs.existsSync(CACHE_FILE)) {
            const cacheData = fs.readFileSync(CACHE_FILE, 'utf-8');
            bibliaCache = JSON.parse(cacheData);
            console.log('✅ Bíblia carregada do cache local');
            return bibliaCache;
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar cache local, tentando baixar...');
    }

    try {
        console.log('🌎 Baixando Bíblia completa...');
        const response = await axios.get(BIBLIA_JSON_URL, {
        });
        
        bibliaCache = response.data;
        
        try {
            const dataDir = path.dirname(CACHE_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(CACHE_FILE, JSON.stringify(bibliaCache), 'utf-8');
            console.log('💾 Bíblia salva no cache local');
        } catch (error) {
            console.log('Aviso: Não foi possível salvar cache local:', error.message);
        }
        
        return bibliaCache;
    } catch (error) {
        console.error('❌ Erro ao baixar Bíblia do GitHub:', error.message);
        throw new Error('Não foi possível carregar a Bíblia completa');
    }
};

export const preCarregarBiblia = _carregarDadosBiblia;

const getBibliaDados = async () => {
    if (!bibliaCache) {
        return await _carregarDadosBiblia();
    }
    return bibliaCache;
}

const normalizarNomeLivro = (nome) => {
    return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const encontrarLivro = (biblia, livroId) => {
    const antigo = biblia.antigoTestamento || [];
    const novo = biblia.novoTestamento || [];
    const todosLivros = [...antigo, ...novo];
    
    console.log(`[SERVICE DEBUG] Total de livros carregados no cache: ${todosLivros.length}`); 
    
    const idNormalizado = livroId.toLowerCase(); 
    const nomeMapeado = MAPEAMENTO_LIVROS[idNormalizado];
    
    console.log(`[SERVICE DEBUG] Buscando ID: ${idNormalizado}. Nome Mapeado: ${nomeMapeado}`); 
    
    if (nomeMapeado) {
        const livro = todosLivros.find(l => 
            normalizarNomeLivro(l.nome) === normalizarNomeLivro(nomeMapeado)
        );
        if (livro) {
            console.log(`[SERVICE DEBUG] Livro encontrado por nome normalizado: ${livro.nome}`);
            return livro;
        }

        const livroExato = todosLivros.find(l => l.nome === nomeMapeado);
        if (livroExato) {
            console.log(`[SERVICE DEBUG] Livro encontrado por nome exato: ${livroExato.nome}`);
            return livroExato;
        }
    }
    
    const livroPorId = todosLivros.find(l => 
        normalizarNomeLivro(l.nome) === idNormalizado
    );
    if (livroPorId) {
        console.log(`[SERVICE DEBUG] Livro encontrado por ID fallback: ${livroPorId.nome}`);
        return livroPorId;
    }

    console.warn(`[SERVICE] Livro ID '${livroId}' NÃO encontrado no cache.`);
    return null;
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

    const id = livroId.toLowerCase();
    const quantidadeCapitulos = capitulosPorLivro[id] || 0;
    
    if (quantidadeCapitulos === 0) return null;

    const capitulos = Array.from({ length: quantidadeCapitulos }, (_, i) => ({
        numero: i + 1
    }));

    return {
        livro: id,
        nome: MAPEAMENTO_LIVROS[id] || livroId,
        capitulos: capitulos,
        quantidade: quantidadeCapitulos
    };
};

export const getTestamentos = async () => {
    const biblia = await getBibliaDados();
    
    if (!biblia || (!biblia.antigoTestamento && !biblia.novoTestamento)) {
        console.warn('⚠️ Falha crítica: Usando fallback total para testamentos.');
        return getTestamentosFallback();
    }
    
    const antigo = (biblia.antigoTestamento || []).map(livro => {
        const idCurto = Object.keys(MAPEAMENTO_LIVROS).find(key => 
            MAPEAMENTO_LIVROS[key] === livro.nome
        );
        return {
            id: idCurto || livro.nome.toLowerCase().substring(0, 2),
            nome: livro.nome,
            testamento: 'antigo'
        };
    });
    
    const novo = (biblia.novoTestamento || []).map(livro => {
        const idCurto = Object.keys(MAPEAMENTO_LIVROS).find(key => 
            MAPEAMENTO_LIVROS[key] === livro.nome
        );
        return {
            id: idCurto || livro.nome.toLowerCase().substring(0, 2),
            nome: livro.nome,
            testamento: 'novo'
        };
    });
    
    return { antigo, novo };
};


const getTestamentosFallback = () => {
    const livros = Object.entries(MAPEAMENTO_LIVROS).map(([id, nome]) => ({
        id,
        nome,
        testamento: ['gn', 'ex', 'lv', 'nm', 'dt', 'js', 'jz', 'rt', '1sm', '2sm', '1rs', '2rs', '1cr', '2cr', 'ed', 'ne', 'et', 'job', 'sl', 'pv', 'ec', 'ct', 'is', 'jr', 'lm', 'ez', 'dn', 'os', 'jl', 'am', 'ob', 'jn', 'mq', 'na', 'hc', 'sf', 'ag', 'zc', 'ml'].includes(id) ? 'antigo' : 'novo'
    }));

    return {
        antigo: livros.filter(l => l.testamento === 'antigo'),
        novo: livros.filter(l => l.testamento === 'novo')
    };
};


/**
 * Obtém os livros de um testamento específico
 */
export const getLivrosPorTestamento = async (testamento) => {
    const testamentos = await getTestamentos();
    
    if (testamento.toLowerCase() === 'antigo') {
        return testamentos.antigo;
    } else if (testamento.toLowerCase() === 'novo') {
        return testamentos.novo;
    } else {
        throw new Error('Testamento inválido. Use "antigo" ou "novo"');
    }
};


/**
 * Obtém os dados de capítulos de um livro
 * @param {string} livroId - ID do livro (ex: 'gn', 'mt')
 */
export const getCapitulosPorLivro = async (livroId) => {
    try {
        const biblia = await getBibliaDados();
        let livro = null;

        if (biblia) {
            livro = encontrarLivro(biblia, livroId);
        }
        
        if (!livro) {
            const fallbackData = await getCapitulosPorLivroFallback(livroId);
            
            if (fallbackData) {
                console.warn(`[SERVICE] Usando dados de fallback para ${livroId}.`);
                return fallbackData;
            }
            return null; 
        }
        
        const capitulos = livro.capitulos || [];
        const capitulosArray = Array.isArray(capitulos)
            ? capitulos.map((cap, index) => ({
                numero: cap.capitulo || cap.numero || (index + 1)
            }))
            : Array.from({ length: capitulos }, (_, i) => ({ numero: i + 1 })); 
        
        const quantidade = capitulosArray.length;

        return {
            livro: livroId,
            nome: livro.nome,
            capitulos: capitulosArray,
            quantidade: quantidade
        };
    } catch (error) {
        console.error(`❌ Erro fatal ao buscar capítulos de ${livroId}:`, error.message);
        return null;
    }
};


/**
 * Obtém os versículos de um capítulo específico
 */
export const getVersiculosPorCapitulo = async (livroId, capitulo) => {
    try {
        const biblia = await getBibliaDados();
        const livro = encontrarLivro(biblia, livroId);
        
        if (!livro) {
            throw new Error(`Livro ${livroId} não encontrado`);
        }
        
        const capitulos = livro.capitulos || [];
        
        let capituloData = null;
        if (Array.isArray(capitulos)) {
            capituloData = capitulos.find(cap => 
                (cap.capitulo === capitulo) || 
                (cap.numero === capitulo)
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
            livro: livroId,
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
            nomeLivro: MAPEAMENTO_LIVROS[livroId.toLowerCase()] || livroId,
            mensagem: `Erro: ${error.message}`
        };
    }
};