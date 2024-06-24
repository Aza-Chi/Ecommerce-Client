import { useEffect, useState } from 'react';
import { Form, Link, redirect, useActionData, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { renderOrderItems, generateOrderReference, getOrderByReference, getAddressesByCustomerId } from "./utils";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import globalStyles from "../../App.module.css";
import { getStatus } from "../products/utils";

/* 
1. Post the order 
  order reference? Create 16 character 4 chars, 12 numbers? order reference, check if order reference exists, if so create another 
  save the order_reference then pass it to order_details
}

get order_reference, to get order_id? 
post order details
  order_id: get from the order that was just made?? 
  product_id: from cart
  quantity: from cart?
*/
export async function checkoutAction({ request }) {
  const res = await getStatus();
  const customer_id = res.jsonData.id;

  let formData = await request.formData();
  const total_amount = formData.get('totalCost');

  try {
    let order_reference = generateOrderReference();
    console.log(`order_reference generated: `, order_reference);

    let checkOrderReferenceRes = await getOrderByReference(order_reference);
    
    //checkOrderReferenceRes.status = 404; // Testing if it generates a new order ref
    while (checkOrderReferenceRes.status !== 204) {
      console.log(`order_reference was in use! `, order_reference);
      console.log(`generating new order_reference!`);
      order_reference = generateOrderReference();
      console.log(`new order_reference generated: `, order_reference);
      checkOrderReferenceRes = await getOrderByReference(order_reference);
    }
    console.log(`Proceeding with Checkout Action using order_reference: `, order_reference);

    const address_id = formData.get("address_id");

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/1`, //revert later .1 is intentional for now 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ customer_id, total_amount, address_id, status_id: 0, order_reference })
      }
    );

    if (res.ok) {
      const { order_id } = await res.json();
      return redirect(`/checkout/${order_id}/payment`);
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { checkoutError: "Sorry, your order could not be completed. Please try again later." };
  }
}


export function CheckoutPage() {
  const authData = useRouteLoaderData("app");
  const { cartData, cartLoaderError } = useLoaderData();
  const checkoutError = useActionData()?.checkoutError;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    async function fetchAddresses() {
      const res = await getStatus();
      const customer_id = res.jsonData.id;

      const response = await getAddressesByCustomerId(customer_id);
      //console.log(`response`, response); This one!
      //console.log(`response[0]`,response[0]);
      setAddresses(response);
    }

    fetchAddresses();
  }, []);

  if (!authData || !authData.jsonData.logged_in) {
    return <InlineErrorPage pageName="Checkout" type="login_required" loginRedirect="/cart" />;
  } else if (cartLoaderError) {
    return <InlineErrorPage pageName="Checkout" message={cartLoaderError} />;
  } else if (cartData.length === 0) {
    return <InlineErrorPage pageName="Checkout" message="Cart is empty, checkout not possible." />;
  }

  function getTotalCost() {
    return cartData.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  }

  return (
    <div className={globalStyles.pagePadding}>
      <h1 className={globalStyles.h1}>Checkout</h1>
      <p className={globalStyles.mb3rem}>Complete your order below.</p>
      <h2>Order items</h2>
      {renderOrderItems(cartData, false)}
      <div className={`${globalStyles.mb3rem} ${globalStyles.XLText}`}>
        <strong>Total cost: <span className={globalStyles.price}>${getTotalCost()}</span></strong>
      </div>
      {/* Delivery Start */}
      <h2>Delivery address</h2>
      <Form method="post" className={globalStyles.stackedForm}>
        <label htmlFor="address_id" className={globalStyles.label}>Select Address</label>
        <select
          id="address_id"
          className={globalStyles.input}
          name="address_id"
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          required
        >
          <option value="" disabled>Select an address</option>
          {addresses.map((address) => (
            <option key={address.address_id} value={address.address_id}>
              {address.address_line_1}, {address.city}, {address.country}, {address.postcode}
            </option>
          ))}
        </select>
        <input type="hidden" name="totalCost" value={getTotalCost()} />
        <button type="submit" className={`${globalStyles.mt2rem} ${globalStyles.button}`}>Continue to payment</button>
      </Form>
      {/* Delivery End */}
      
      {checkoutError ? (
        <div className={globalStyles.mt2rem}>
          <p className={`${globalStyles.mb2rem} ${globalStyles.red}`}><strong>{checkoutError}</strong></p>
          <Link to="/" className={globalStyles.button}>Continue shopping</Link>
        </div>
      ) : null}
    </div>
  );
}