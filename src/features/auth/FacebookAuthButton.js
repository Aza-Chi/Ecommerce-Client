import styles from "./FacebookAuthButton.module.css";

export default function FacebookAuthButton() {
  return (
      <button
        className={styles.facebookBtn}
        onClick={() => window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/facebook`}
        >
        Sign in with Facebook
      </button>
  );
}