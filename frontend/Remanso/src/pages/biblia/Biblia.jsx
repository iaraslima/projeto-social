import Header from "../../components/Header/Header";
import styles from "./Biblia.module.css";

export default function Biblia({ onBack, onNavigateToAntigoTestamento }) {
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.verseCard}>
        <h2 className={styles.verseTitle}>Versículo do dia</h2>
        <p className={styles.verseText}>
          Pois a sua ira só dura um instante, mas o seu favor dura a vida toda; o choro pode persistir uma noite, mas de manhã irrompe a alegria.
        </p>
        <div className={styles.verseFooter}>
          <span className={styles.verseReference}>- Salmos 30:5</span>
          <button className={styles.speakerButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14.07 7.93L15.54 5.54C17.55 6.71 19 9.05 19 12C19 14.95 17.55 17.29 15.54 18.46L14.07 16.07C15.48 15.29 16.5 13.77 16.5 12ZM19 12C19 9.13 16.87 6.78 14 6.18V8.27C15.61 8.88 16.5 10.38 16.5 12C16.5 13.62 15.61 15.12 14 15.73V17.82C16.87 17.22 19 14.87 19 12Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>

      <button className={styles.testamentButton} onClick={onNavigateToAntigoTestamento}>Antigo testamento</button>
      <button className={styles.testamentButton}>Novo testamento</button>

      <div className={styles.navigationBar}>
        <button className={styles.backButton} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Voltar</span>
        </button>
        <button className={styles.homeButton} onClick={onBack}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

