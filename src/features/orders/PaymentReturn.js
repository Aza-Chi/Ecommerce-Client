import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

// https://stripe.com/docs/checkout/embedded/quickstart?client=react&lang=node
// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=embedded-checkout#return-page
export default function PaymentReturn() {
  const { order_id } = useParams();
  console.log("PaymentReturn.js - useParams() Order ID:", order_id);
  console.log("PaymentReturn.js Order ID Type:", typeof order_id); // Log the type of order_id

  const [status, setStatus] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    // Fetch payment status (completed or failed/cancelled)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const basePath = `${process.env.REACT_APP_API_BASE_URL}/checkout/payment-session-status`;
    /* example:
    http://localhost:3001//checkout/[object%20Object]/payment-return?session_id=cs_test_b1rXOIufHbRV3pMp6HqRnSCY5nHUOnFrkTWR7mcnBkbazt54rDYAjhqUkW*/
    const order_id_str = String(order_id);
    console.log("PaymentReturn.js order_id_str Type:", typeof order_id_str); // Log the type of order_id
    fetch(`${basePath}?order_id=${order_id_str}&session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      });
  }, [order_id]);

  useEffect(() => {
    // Update database upon successful payment
    if (status === "complete" && !orderConfirmed) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const basePath = `${process.env.REACT_APP_API_BASE_URL}/checkout/confirm-paid-order`;

      fetch(`${basePath}?order_id=${order_id}&session_id=${sessionId}`, {
        method: "PUT",
      }).then(() => {
        setOrderConfirmed(true);
      });
    }
  }, [status, orderConfirmed, order_id]);

  useEffect(() => {
    // Update order status upon successful payment

    if (status === "complete" && !orderConfirmed) {
      const basePath = `${process.env.REACT_APP_API_BASE_URL}/orders/${order_id}`;

      fetch(basePath, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status_id: 1 }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update order status");
          }
          return response.json();
        })
        .then(() => {
          setOrderConfirmed(true);
        })
        .catch((error) => {
          console.error("Error updating order status:", error);
        });
    }
  }, [status, orderConfirmed, order_id]);

  if (status === "open") {
    // Payment failed or cancelled; redirect to payment page to try again
    return <Navigate to={`/checkout/${order_id}/payment`} />;
  }

  if (status === "complete" && orderConfirmed) {
    // Payment succeeded
    return <Navigate to={`/checkout/${order_id}/success`} />;
  }

  return null;
}
