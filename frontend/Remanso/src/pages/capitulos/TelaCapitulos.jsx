import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraBusca from "../../components/BarraBusca/BarraBusca";
import styles from './TelaCapitulos.module.css';

const API_BASE_URL = 'http://localhost:3000/api/biblia'; 

function TelaCapitulos({ 
  livroId, 
  nomeInicial = 'Gênesis', 
  onVoltar 
}) {
  const [termoBusca, setTermoBusca] = useState('');
  const [nomeLivro, setNomeLivro] = useState(nomeInicial);
  const [capitulos, setCapitulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!livroId) {
      setError('ID do livro não fornecido.');
      setIsLoading(false);
      return;
    }

    const fetchCapitulos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/capitulos/${livroId}`);
        const data = response.data;
        
        if (data && data.capitulos && Array.isArray(data.capitulos)) {
          setNomeLivro(data.nome || nomeInicial); 
          
          const numerosCapitulos = data.capitulos.map(c => c.numero);
          setCapitulos(numerosCapitulos);
          
          setError(null); 
        } else {
          setError('A API não retornou dados de capítulos válidos.');
          setCapitulos([]);
        }

      } catch (err) {
        console.error("Erro ao buscar capítulos (404/500):", err);
        setError('Não foi possível carregar os capítulos deste livro. (Erro de API: 404/500)');
        setCapitulos([]); 

      } finally {
        setIsLoading(false);
      }
    };

    fetchCapitulos();
  }, [livroId, nomeInicial]); 

  const handleSelecionarCapitulo = (numero) => {
    console.log(`Capítulo ${numero} de ${nomeLivro} selecionado.`);
  };

  const handleVoltar = onVoltar || (() => console.log('Voltar padrão.'));

  const renderConteudo = () => {
    if (isLoading) {
      return <p>Carregando capítulos...</p>;
    }

    if (error) {
      return <p className="mensagem-erro">🚨 {error}</p>;
    }
    
    const capitulosFiltrados = (capitulos || []).filter(num => 
        String(num).includes(termoBusca)
    );

    return (
      <>
        <h2 className={styles.tituloLivro}>{nomeLivro}</h2>
        
        <div className={styles.gridCapitulos}>
          {capitulosFiltrados.map(num => (
            <button 
              key={num} 
              className={styles.botaoCapitulo}
              onClick={() => handleSelecionarCapitulo(num)}
            >
              {num}
            </button>
          ))}
          {capitulosFiltrados.length === 0 && termoBusca && (
             <p>Nenhum capítulo encontrado com o número "{termoBusca}".</p>
          )}
          {capitulosFiltrados.length === 0 && !termoBusca && (
             <p>Este livro não possui capítulos registrados.</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.containerTela}>
      <div className={styles.headerApp}>
        <span className={styles.logo}>LOGO</span>
      </div>

      <BarraBusca 
        termo={termoBusca} 
        aoMudar={setTermoBusca} 
      />

      <div className={styles.conteudoPrincipal}>
        {renderConteudo()}
      </div>

      <div className={styles.barraInferiorNav}>
        <button 
          className={styles.botaoVoltar} 
          onClick={handleVoltar}
        >
          <span className={styles.iconeVoltar}>←</span> Voltar
        </button>
        <div className={styles.iconeHomePlaceholder}></div>
      </div>
    </div>
  );
}

export default TelaCapitulos;