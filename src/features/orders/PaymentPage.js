import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import globalStyles from "../../App.module.css";
import axios from "axios";

const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);

export default function PaymentPage() {
  const { order_id } = useParams();
  const authData = useRouteLoaderData("app");
  const [clientSecret, setClientSecret] = useState("");
  const fetchClientSecretCalled = useRef(false);

  const fetchClientSecret = useCallback(async () => {
    if (fetchClientSecretCalled.current) return;
    fetchClientSecretCalled.current = true;
    try {
      const basePath = `${process.env.REACT_APP_API_BASE_URL}/checkout/create-payment-session`;
      const requestData = { order_id };
      const token = localStorage.getItem("token");
      const response = await axios.post(basePath, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const data = response.data;
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  }, [order_id]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

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
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}
