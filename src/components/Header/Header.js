import { Link } from "react-router-dom";
import MainNav from "../MainNav/MainNav";
import styles from "./Header.module.css";
//import SearchBar from "../SearchBar/SearchBar";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer2}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}> <span className={styles.title}>FutureTech</span></Link>
        </div>
        </div>
      <MainNav />
       {/* Could put searchbar here?? Something doesn't look right though */}
      </div>
      
    </header>
  );
}
