import { useRouteLoaderData } from "react-router-dom";

import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";
import InlineLink from "../InlineLink/InlineLink";
import { OrdersHistory } from "../../features/orders/OrderHistory";
//import styles from "./AccountPage.module.css";
import styles from "../../App.module.css";
//pagePadding

export default function AccountPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  console.log(`AccountPage.js - authData: ${authData.logged_in}`);
  console.log(`AccountPage.js - authData: logged in? ${authData.logged_in}`);

  if (!authData || !authData.logged_in) {
    //console.log('AccountPage.js - authData: not logged in!', authData);
    console.log(("Checking if !authData.logged_in, it should be true"));
    console.log((!authData.logged_in)); //true then returns this fail page 
    return <InlineErrorPage pageName="Your account" type="login_required" />;
    

  } else if (authData.logged_in)   {
    console.log('AccountPage.js - authData: logged in!', authData);
    return (
      <div className={styles.pagePadding}>
        <h1 className={styles.h1}>Your account</h1>
        <p>You are logged in as {authData.email_address}.</p>
        <p className={styles.mb3rem}>
          View your previous orders below or <InlineLink path="/cart" anchor="visit your cart" />.
        </p>
        <h2>Orders:</h2>
        <OrdersHistory />
      </div>
    );
  }

}