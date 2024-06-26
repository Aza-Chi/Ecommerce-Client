import { NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import styles from "./MainNav.module.css";
import SearchBar from "../SearchBar/SearchBar";

export default function MainNav() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const navigate = useNavigate();

  async function handleClickLogOut () {
    try {
      console.log(`MainNav.js - Attemping Logout -`)
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Unexpected status code.");
      }
      console.log(`MainNav.js  Logout - res data ${res.jsonData} `);
      authData.jsonData.logged_in = false;
    } catch (error) {
      console.log(error);
    } finally {
      navigate('/');  // Redirect to homepage
      //navigate(0);  // Refresh page to clear auth state and re-render
    }
  }

  function renderNavItem(path, anchor, onClick=null) {
    return (
      <li className={styles.listItem}>
        <NavLink to={path} className={styles.link} onClick={onClick}>{anchor}</NavLink>
      </li>
    );
  }

  return (
    <nav className={styles.mainNav}>
      <ul className={styles.navList}>
        {renderNavItem("/", "Home")}
        {/* Todo Pages! About - Contact - more*/}
        {/* {renderNavItem("/about", "About")} */}

        {/* For categories I need to add category numbers to my DB so far they're all null!*/}
        {/* {renderNavItem("/category/tech", "Tech")}
        {renderNavItem("/category/food", "Food")}
        {renderNavItem("/category/misc", "Misc")} */}
      </ul>
      
      <SearchBar />
      {authData.jsonData?.logged_in ?
      <ul className={styles.navList}>
        {renderNavItem("/account", "Account")}
        {renderNavItem("/addresses", "Addresses")}
        {renderNavItem("/cart", "Cart")}
        {renderNavItem("#", "Log Out", handleClickLogOut)}
      </ul>
      :
      <ul className={styles.navList}>
        {renderNavItem("/login", "Log In")}
        {renderNavItem("/register", "Register")}
      </ul>
      }
    </nav>
  );
}