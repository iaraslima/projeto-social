import Header from "../../components/Header/Header";
import styles from "./AntigoTestamento.module.css";

const LIVRO_ID_MAP = {
  'Gênesis': 'gn', 
  'Êxodo': 'ex', 
  'Levítico': 'lv', 
  'Números': 'nm', 
  'Deuteronômio': 'dt',
  'Josué': 'js', 
  'Juízes': 'jz', 
  'Rute': 'rt', 
  '1 Samuel': '1sm', 
  '2 Samuel': '2sm',
  '1 Reis': '1rs', 
  '2 Reis': '2rs', 
  '1 Crônicas': '1cr', 
  '2 Crônicas': '2cr', 
  'Esdras': 'ed',
  'Neemias': 'ne', 
  'Ester': 'et', 
  'Jó': 'job', 
  'Salmos': 'sl', 
  'Provérbios': 'pv',
  'Eclesiastes': 'ec', 
  'Cânticos': 'ct', 
  'Isaías': 'is', 
  'Jeremias': 'jr', 
  'Lamentações': 'lm',
  'Ezequiel': 'ez', 
  'Daniel': 'dn', 
  'Oséias': 'os', 
  'Joel': 'jl', 
  'Amós': 'am',
  'Obadias': 'ob', 
  'Jonas': 'jn', 
  'Miqueias': 'mq', 
  'Naum': 'na', 
  'Habacuque': 'hc',
  'Sofonias': 'sf', 
  'Ageu': 'ag', 
  'Zacarias': 'zc', 
  'Malaquias': 'ml'
};

const livros = Object.keys(LIVRO_ID_MAP);

export default function AntigoTestamento({ onBack, onSelectBook }) {
  
  const handleBookClick = (livroNome) => {
    const livroId = LIVRO_ID_MAP[livroNome];
    
    if (onSelectBook) {
      onSelectBook(livroId, livroNome);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      {/* ... (Barra de Busca e Título) ... */}

      <h2 className={styles.sectionTitle}>Antigo testamento</h2>

      <div className={styles.booksContainer}>
        {livros.map((livro, index) => (
          <button 
            key={index} 
            className={styles.bookButton}
            onClick={() => handleBookClick(livro)} 
          >
            {livro}
          </button>
        ))}
      </div>

      <div className={styles.navigationBar}>
        {/* Botão Voltar (que usa a prop onBack) */}
        <button className={styles.backButton} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Voltar</span>
        </button>
        {/* Botão Home */}
        <button className={styles.homeButton} onClick={onBack}>
           {/* SVG Home... */}
        </button>
      </div>
    </div>
  );
}