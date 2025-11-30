import React from 'react';
import styles from './BarraBusca.module.css'; 

export default function BarraBusca({ termo, aoMudar }) {
  return (
    <div className={styles.searchBar}>
      <input 
        type="text" 
        placeholder="Buscar..." 
        className={styles.searchInput}
        value={termo}
        onChange={(e) => aoMudar(e.target.value)}
      />
      <div className={styles.searchIcons}>
        {/* Ícone de Lupa */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#b5391c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Ícone de Microfone */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" fill="#b5391c"/>
          <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z" fill="#b5391c"/>
          <path d="M11 22H13V20H11V22Z" fill="#b5391c"/>
        </svg>
      </div>
    </div>
  );
}