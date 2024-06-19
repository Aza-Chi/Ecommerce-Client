import InlineLink from "../InlineLink/InlineLink";
import styles from "../../App.module.css";


export default function InlineErrorPage({ pageName, type, message, loginRedirect }) {

  function renderMessage() {
    if (type === "login_required") {
      const path = loginRedirect ? `/login?redirect=${loginRedirect}` : "/login";
      const loginLink = <InlineLink path={path} anchor="log in" />;
      return <p>Please {loginLink} to view this page.</p>;
    } else {
      return <p>{message}</p>;
    }
  }

  return (
    <div className={styles.pagePadding}>
      <h1 className={styles.h1}>{pageName}</h1>
      <div className={styles.largeText}>
        {renderMessage()}
      </div>
    </div>
  );
}