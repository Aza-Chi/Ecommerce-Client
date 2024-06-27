import { useEffect, useState } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import globalStyles from "../../App.module.css";
import axios from "axios";

// https://stripe.com/docs/checkout/embedded/quickstart?client=react&lang=node
// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=embedded-checkout#mount-checkout

// UNCOMMENT THIS LATER with line 53  //stripe={stripePromise}!!! = Uncommented to stop stripe post requested from clogging my console !!
const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);

export default function PaymentPage() {
  const { order_id } = useParams(); //this parameter is captured in routing configuration at routing.js !!
  // const order_id = useParams();  doing it this way will pass it as an object leading to broken URLs !!! 
  console.log("PaymentPage.js - useParams() Order ID:", order_id);
  console.log("PaymentPage.js Order ID Type:", typeof order_id); // Log the type of order_id OBJECT !! 
  //const order_id_str = String(order_id);
  //console.log("PaymentPage.js Order ID Type after String():", typeof order_id_str); // Log the type of order_id OBJECT !! 
  const authData = useRouteLoaderData("app");
  console.log(`PaymentPage.js authData: `, authData);
  const [clientSecret, setClientSecret] = useState("");

  /* Rewrite  */
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const basePath = `${process.env.REACT_APP_API_BASE_URL}/checkout/create-payment-session`;
        const customer_id = "replace_with_actual_customer_id"; // Get customer_id from your application state or props
        //const total_amount = "replace_with_actual_total_amount"; // Get total_amount from your application state or props
        const address_id = "replace_with_actual_address_id"; // Get address_id from your application state or props
        const order_reference = "replace_with_actual_order_reference"; // Get order_reference from your application state or props
        
        const requestData = {
          customer_id,
          //  total_amount,
          address_id,
          order_reference,
          order_id, //this must be order_id not a string
        };

        const response = await axios.post(basePath, requestData, {
          withCredentials: true, // Ensure credentials are included if needed
        });

        const data = response.data;
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
        // Handle error state or logging as needed
      }
    };

    fetchClientSecret();
  }, [order_id]);
  /* Rewrite End */

  if (!authData || !authData.logged_in) {
    return (
      <InlineErrorPage
        pageName="Order failed"
        type="login_required"
        loginRedirect="/orders"
      />
    );
  }

  return (
    <div className={globalStyles.pagePadding} id="checkout">
      <h1 className={globalStyles.h1}>Complete your payment below</h1>
      <p>
        The payment system (Stripe) is in test mode, so only a demo of
        success/failure will be displayed.
      </p>
      <p>
        For a successful payment, test the card number below and use any valid
        input for the other forms:
      </p>
      <ul className={globalStyles.mb3rem}>
        <li>
          <strong>Email: </strong>testuser@example.com
        </li>
        <li>
          <strong>Card number: </strong>4242 4242 4242 4242
        </li>
        <li>
          <strong>Expiry date: </strong>12/34
        </li>
        <li>
          <strong>CVC: </strong>123
        </li>
        <li>
          <strong>Name: </strong>Bob Smith
        </li>
        <li>
          <strong>Postcode: </strong>A1 1AB
        </li>
      </ul>
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise} //
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}