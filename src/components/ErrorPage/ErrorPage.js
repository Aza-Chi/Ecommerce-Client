import { Link, useRouteError } from "react-router-dom";

import Header from "../Header/Header";
import styles from "../../App.module.css";


export default function ErrorPage() {

  const error = useRouteError();
  const is404 = error.status === 404;
  console.error(error);

  return (
    <>
      {is404 ? <Header /> : null}
      
      <main  className={styles.pagePadding}> 
        <h1 className={styles.h1}>{is404 ? "404 - Page Not Found" : "Service unavailable"}</h1>
        <p>{is404 ? "This page does not exist." : "An unexpected error has occurred. Somehow you got lost!"}</p>
        <p>Error:</p>
        <p>
          <em>{error.statusText || error.message}</em>
        </p>
        <hr className={styles.separator}></hr>
        <Link to="/" className={styles.button}>Back to Homepage</Link>
      </main>
    </>
  );
}