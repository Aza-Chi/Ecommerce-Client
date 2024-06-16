import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import MainNav from "../MainNav/MainNav";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}> <span className={styles.title}>FutureTech</span></Link>
        </div>
        <MainNav />
       {/* Could put searchbar here?? Something doesn't look right though */}
      </div>
    </header>
  );
}
