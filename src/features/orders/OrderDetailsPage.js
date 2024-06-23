import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";

import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import { appendProductNamesToOrders, renderOrderItems } from "./utils";
import utilStyles from "../../App.module.css";
import styles from "./OrderDetailsPage.module.css";
import { formatDate, getProductData } from "../products/utils";

// Key Details Page

export async function orderDetailsLoader({ params }) { //Passing in order id
  console.log(`OrderDetailsPage.js Key - orderDetailsLoader params:`, params);
  console.log(`OrderDetailsPage.js Key - orderDetailsLoader params.id:`, params.id);
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  //Maybe better approach is to get order and join the details from order details table? Already passing in the Order ID as a param
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/summary/${params.id}`,
      { credentials: "include" }
      );
    if (res.ok) {
      const orderData = await res.json();
      console.log(`OrderDetailsPage.js - orderData:`, orderData);

      /*IMPORTANT STEP! Getting product_name for orderData to be sent to OrderItems*/
  /*for each array in orderData 
  1. get product_id
  2. getProductData()
  2. append the product_name and price to orderData for each array */
  const orderDataWithProductName = await appendProductNamesToOrders(orderData);
  console.log(`11111112222222333333orderDataWithProductName: `, orderDataWithProductName);


      return { orderDataWithProductName };
    } else if (res.status === 404) {
      // https://reactrouter.com/en/main/route/error-element#throwing-manually
      throw new Response("Not Found", { status: 404 });
    } else if (res.status === 401) {
      // https://reactrouter.com/en/main/route/error-element#throwing-manually
      return { error: "You must be logged in as the correct user to view this order." };
    }
    throw new Error("Unsuccessful order fetch.");

  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    return { error: "Sorry, this order could not be loaded. Please try again later." };
  }
}





export function OrderDetailsPage({ checkoutSuccess }) {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const { orderDataWithProductName, error } = useLoaderData();

  if (!authData.jsonData.logged_in) {
    return <InlineErrorPage pageName="Order details" type="login_required" loginRedirect="/orders" />;
  } else if (error) {
    return <InlineErrorPage pageName="Order details" message={error} />;
  }
  //const {} = addressData;
  const { address, order_id, product_id, created_at, status_id, postcode, subtotal, total_amount } = orderDataWithProductName[0];
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
          <p><span className={utilStyles.bold}>Status:</span> {status_id}</p>
          <p><span className={utilStyles.bold}>Order placed:</span> {formattedDate}</p>
          <p><span className={utilStyles.bold}>Total:</span> £{total_amount}</p>
        </div>
      </section>
      <section className={utilStyles.mb3rem}>
        <h2>Items</h2>
        {/* product_name not defined for renderOrderItems so need to define above */}
        {renderOrderItems(orderDataWithProductName, false)} 
      </section>
      <section className={utilStyles.mb3rem}>
        <h2 className={utilStyles.mb2rem}>Delivery address</h2>
        <p>{address}</p>
        <p>{postcode}</p>
      </section>
      <Link to="/" className={utilStyles.button}>Continue shopping</Link>
    </div>
  );
}