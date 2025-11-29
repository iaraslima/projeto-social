import CardMenu from "../../components/CardMenu/CardMenu";
import Header from "../../components/Header/Header";

import bibleIcon from "../../assets/biblia.png";
import gamesIcon from "../../assets/jogos.png";
import tutorialIcon from "../../assets/video.png";


import styles from "./Home.module.css";

export default function Home({ onNavigateToBiblia }) {
  return (
    <div className={styles.container}>
      <Header />

      <h1 className={styles.title}>Bem Vindo</h1>

      <div className={styles.row}>
        <CardMenu icon={bibleIcon} label="Bíblia" onClick={onNavigateToBiblia} />
        <CardMenu icon={gamesIcon} label="Jogos" />
      
      </div>
      <div className={styles.center}>
        <CardMenu icon={tutorialIcon} label="Tutoriais" />
      </div>
    </div>
  );
}
