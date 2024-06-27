import {
  Link,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";

import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import InlineLink from "../../components/InlineLink/InlineLink";
import { getProductDetailPath, getStatus } from "../products/utils";
import { renderOrderItems } from "./utils";
import globalStyles from "../../App.module.css";
import axios from "axios";


// https://reactrouter.com/en/main/start/tutorial#loading-data
// https://reactrouter.com/en/main/route/loader
export async function cartLoader() {
  try {
    const res = await getStatus();

    // Check if the response has the necessary data
    if (res?.id) {
      const customerId = res.id;

      const cartRes = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/shoppingcart/customer/${customerId}`,
        { credentials: "include" }
      );

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        return { cartData };
      } else {
        throw new Error("Unexpected status code.");
      }
    } else {
      throw new Error("Failed to retrieve user status.");
    }
  } catch (error) {
    console.error(`cartLoader - error: ${error}`);
    return {
      cartLoaderError: "Your cart could not be loaded. Please try again later.",
      cartData: null
    };
  }
}


export function Cart() {
  const authData = useRouteLoaderData("app");
  const { cartData, cartLoaderError } = useLoaderData();
  const removalResult = useActionData();

  console.log("Cart Data from:", cartData);

  if (!authData?.logged_in) {
    return (
      <InlineErrorPage
        pageName="Cart"
        type="login_required"
        loginRedirect="/cart"
      />
    );
  } else if (cartLoaderError) {
    return <InlineErrorPage pageName="Cart" message={cartLoaderError} />;
  }

  function renderRemovalMessage() {
    if (!removalResult) {
      return null;
    }
    const { error, productId, productName } = removalResult;
    let message;
    if (error) {
      message = `'${productName}' couldn't be removed from your cart.`;
    } else {
      const productPath = getProductDetailPath(productId, productName);
      message = (
        <>
          '<InlineLink path={productPath} anchor={productName} />' was removed
          from your cart.
        </>
      );
    }
    return (
      <p>
        <strong>{message}</strong>
      </p>
    );
  }

  const subtotal = cartData.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={globalStyles.pagePadding}>
      <h1 className={globalStyles.h1}>Cart</h1>
      <p>You are logged in as {authData.email_address}.</p>
      <p>
        {cartData?.length > 0 ? (
          <>
            {" "}
            View your cart below or{" "}
            <InlineLink path="/checkout" anchor="check out" />.
          </>
        ) : null}
      </p>
      {removalResult ? renderRemovalMessage() : null}
      {renderOrderItems(cartData, cartLoaderError)}
      <strong><p>Total: £{subtotal.toFixed(2)} ({totalItems} items)</p></strong>
      {cartData?.length > 0 ? (
        <Link to="/checkout" className={globalStyles.button}>
          Go to checkout
        </Link>
      ) : null}
    </div>
  );
}


// Test stuff
// <ul>
// {cartData.map((item) => (
//   <li key={item.cart_id}>
{/* {item.product_name} Price: £{item.price} - Quantity: {item.quantity} */}
            {/* <button>Remove</button> */}
//   </li>
// ))}
// </ul>


// Things to add - Quantity changer from cart page 
