import { useRouteLoaderData } from "react-router-dom";
import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";
import InlineLink from "../InlineLink/InlineLink";
// import { OrdersHistory } from "../../features/orders/OrderHistory";
import { Addresses } from "./Addresses";
import { AddressForm } from "./AddressForm";
import { useLoaderData } from 'react-router-dom';
//import styles from "./AddressPage.module.css";
import globalStyles from "../../App.module.css";
//pagePadding



export default function AddressPage() {
    const { customer_id, addressesData } = useLoaderData(); //2. pass this data from the addressLoader in Addresses component
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  //console.log(`AccountPage.js - authData: ${authData.jsonData.logged_in}`);
  //console.log(`AccountPage.js - authData: logged in? ${authData.logged_in}`);

  if (!authData || !authData.jsonData.logged_in) {
    //console.log('AccountPage.js - authData: not logged in!', authData);
    console.log(("Checking if !authData.logged_in, it should be true"));
    console.log((!authData.logged_in)); //true then returns this fail page 
    return <InlineErrorPage pageName="Your account" type="login_required" />;
    

  } else if (authData.jsonData.logged_in)   {
    console.log('AddressPage.js - authData: logged in!', authData);
    return (
      <div className={globalStyles.pagePadding}>
        <h1 className={globalStyles.h1}>Your Addresses</h1>
        <p>You are logged in as {authData.jsonData.email_address}.</p>
        <p className={globalStyles.mb3rem}>
          View your addresses below or add a new address below.
          {/* <InlineLink path="/addaddress" anchor="add a new address" /> */}
        </p>
        <h2>Addresses:</h2>
        <Addresses />
        {/*  */}
      {/* <Addresses addressesData={addressesData} />  can pass addressesData through here as a prop if we only used the loader in AddressPage*/}
        <hr className={globalStyles.separator} />
        <div className={globalStyles.addAddressForm}>
        <h3>Add New Address:</h3>
        {/*3. pass customer_id to Address Form */}
        <AddressForm customer_id={customer_id}/>
        </div>
      </div>
    );
  }

}