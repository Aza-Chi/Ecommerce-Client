import { Link } from "react-router-dom";
import styles from "../../App.module.css";

export default function InlineLink({ path, anchor }) {
  return <Link to={path} className={styles.link}>{anchor}</Link>
}



// function ExampleComponent() {
//     return (
//       <div>
//         <InlineLink path="/about" anchor="About Us" />
//         <InlineLink path="/contact" anchor="Contact" />
//       </div>
//     );
//   }