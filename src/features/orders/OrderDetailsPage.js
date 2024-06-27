import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";

import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import { appendProductNamesToOrders, getStatusString, renderOrderItems } from "./utils";
import utilStyles from "../../App.module.css";
import styles from "./OrderDetailsPage.module.css";
import { formatDate } from "../products/utils";

// Key Details Page

// export async function orderDetailsLoader({ params }) { //Passing in order id
//   console.log(`OrderDetailsPage.js Key - orderDetailsLoader params:`, params);
//   console.log(`OrderDetailsPage.js Key - orderDetailsLoader params.id:`, params.id);
//   // https://reactrouter.com/en/main/start/tutorial#loading-data
//   // https://reactrouter.com/en/main/route/loader
//   //Maybe better approach is to get order and join the details from order details table? Already passing in the Order ID as a param
//   try {
//     const res = await fetch(
//       `${process.env.REACT_APP_API_BASE_URL}/orders/summary/${params.id}`,
//       { credentials: "include" }
//       );
//     if (res.ok) {
//       const orderData = await res.json();
//       console.log(`OrderDetailsPage.js - orderData:`, orderData);

//       /*IMPORTANT STEP! Getting product_name for orderData to be sent to OrderItems*/
//   /*for each array in orderData 
//   1. get product_id
//   2. getProductData()
//   2. append the product_name and price to orderData for each array */
//   const orderDataWithProductName = await appendProductNamesToOrders(orderData);
//   console.log(`11111112222222333333orderDataWithProductName: `, orderDataWithProductName);
//   console.log(`11111112222222333333orderDataWithProductName[0].address: `, orderDataWithProductName[0].address_id);
//   console.log(`11111112222222333333orderDataWithProductName[0]: `, orderDataWithProductName[0]);

//   /*If there is an address_id, get the address details too */
// if (orderDataWithProductName[0].address_id !== null) {

//   const addressRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addresses/${orderDataWithProductName[0].address_id}`,
//     { credentials: "include" });
//     const addressResJson = await addressRes.json();
// console.log(`addressRes: `, addressResJson);

// return { orderDataWithProductName, addressResJson };
// /* */
//       return { orderDataWithProductName };
//     } else if (res.status === 404) {
//       // https://reactrouter.com/en/main/route/error-element#throwing-manually
//       throw new Response("Not Found", { status: 404 });
//     } else if (res.status === 401) {
//       // https://reactrouter.com/en/main/route/error-element#throwing-manually
//       return { error: "You must be logged in as the correct user to view this order." };
//     }
//     throw new Error("Unsuccessful order fetch.");

//   } catch (error) {
//     if (error.status === 404) {
//       throw error;  // Serve 404 error page
//     }
//     return { error: "Sorry, this order could not be loaded. Please try again later." };
//   }
// }

export async function orderDetailsLoader({ params }) { 
  console.log(`OrderDetailsPage.js Key - orderDetailsLoader params:`, params);
  console.log(`OrderDetailsPage.js Key - orderDetailsLoader params.id:`, params.id);

  // If params.id is not a string, convert it to string
  const orderId = String(params.id);
  console.log(`orderDetailsLoader - converted orderId to string:`, orderId);

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/summary/${orderId}`,
      { credentials: "include" }
    );

    if (res.ok) {
      const orderData = await res.json();
      console.log(`OrderDetailsPage.js - orderData:`, orderData);

      const orderDataWithProductName = await appendProductNamesToOrders(orderData);
      console.log(`orderDataWithProductName: `, orderDataWithProductName);
      console.log(`orderDataWithProductName[0].address: `, orderDataWithProductName[0].address_id);
      console.log(`orderDataWithProductName[0]: `, orderDataWithProductName[0]);

      if (orderDataWithProductName[0].address_id !== null) {
        const addressRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/addresses/${orderDataWithProductName[0].address_id}`,
          { credentials: "include" }
        );

        if (addressRes.ok) {
          const addressResJson = await addressRes.json();
          console.log(`addressRes: `, addressResJson);

          return { orderDataWithProductName, addressResJson };
        } else {
          throw new Error("Failed to fetch address details");
        }
      } else {
        return { orderDataWithProductName };
      }
    } else if (res.status === 404) {
      throw new Response("Not Found", { status: 404 });
    } else if (res.status === 401) {
      return { error: "You must be logged in as the correct user to view this order." };
    }

    throw new Error("Unsuccessful order fetch.");
  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    console.log(`OrderDetailsPage.js - there is an error somewhere here`);
    return { error: "Sorry, this order could not be loaded. Please try again later." };
  }
}




export function OrderDetailsPage({ checkoutSuccess }) {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const { orderDataWithProductName, addressResJson, error } = useLoaderData();

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Order details" type="login_required" loginRedirect="/orders" />;
  } else if (error) {
    return <InlineErrorPage pageName="Order details" message={error} />;
  }
  //const {} = addressData;
  const { address, order_id, product_id, created_at, status_id, postcode, subtotal, total_amount, order_reference } = orderDataWithProductName[0];
  console.log(`OrderDetailsPage.js - key - orderData:`, orderDataWithProductName);
  const formattedDate = formatDate(created_at);
  


  return (
    <div className={utilStyles.pagePadding}>
      <h1 className={utilStyles.mb3rem}>Order details</h1>
      {checkoutSuccess ? <p>Your order was placed successfully.</p> : null}
      <section className={utilStyles.mb3rem}>
        <h2>Key details</h2>
        <div className={styles.detailsContainer}>
          <p><span className={utilStyles.bold}>Order ID:</span> {order_id}</p>
          <p><span className={utilStyles.bold}>Status:</span> {getStatusString(status_id)}</p>
          <p><span className={utilStyles.bold}>Order placed:</span> {formattedDate}</p>
          <p><span className={utilStyles.bold}>Total:</span> £{total_amount}</p>
          <p><span className={utilStyles.bold}>Order Reference:</span> {order_reference}</p>
        </div>
      </section>
      <section className={utilStyles.mb3rem}>
        <h2>Items</h2>
        {/* product_name not defined for renderOrderItems so need to define above */}
        {renderOrderItems(orderDataWithProductName, false)} 
      </section>
      <section className={utilStyles.mb3rem}>
        <h2 className={utilStyles.mb2rem}>Delivery address</h2>
        <p>{addressResJson.address_line_1}, {addressResJson.address_line_2}</p>
        <p>{addressResJson.city}</p>
        <p>{addressResJson.postcode}</p>
        <p>{addressResJson.country}</p>
      </section>
      <Link to="/" className={utilStyles.button}>Continue shopping</Link>
    </div>
  );
}