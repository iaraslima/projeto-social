import styles from "./CardMenu.module.css";

export default function CardMenu({ icon, label }) {
  return (
    <div className={styles.card}>
      <img src={icon} alt={label} className={styles.icon} />
      <p className={styles.label}>{label}</p>
    </div>
  );
}