import {
  Link,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";

import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import InlineLink from "../../components/InlineLink/InlineLink";
import { getProductDetailPath } from "../products/utils";
import { renderOrderItems } from "./utils";
import globalStyles from "../../App.module.css";
import axios from "axios";

// https://reactrouter.com/en/main/start/tutorial#loading-data
// https://reactrouter.com/en/main/route/loader
export async function cartLoader() {
  try {
    // Call the status route to get the customer ID
    //console.log(`Cart.js - attempting /status`);
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/auth/status`,
      {
        headers: {
          //'Authorization': `Bearer ${token}`, // Include JWT token as Bearer token
        },
        withCredentials: true, // If needed for CORS with credentials
      }
    );
    //console.log(`Cart.js cartloader - /status received`);
    //console.log(`Cart.js cartloader statusRes- ${JSON.stringify(res.data)}`);
    //304 - not modified or 200
    if (res.status === 200 || res.status === 304) {
      //console.log(`Cart.js cartloader - res.status was 200 or 304!`);
      const customerId = res.data.jsonData.id;
      //console.log(`Cart.js cartloader - customerId: ${customerId}`);

      // Use the customer ID to fetch the shopping cart data
      //console.log(`Cart.js cartloader - Attempting cart /get`);
      const cartRes = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/shoppingcart/customer/${customerId}`,
        { credentials: "include" }
      );
      //console.log(`Cart.js cartloader - cartRes: ${JSON.stringify(cartRes)}`);
      if (cartRes.ok) {
        //console.log(`Cart.js cartloader cartRes was ok!`);
        const cartData = await cartRes.json();
        //console.log(`Cart.js cartloader cartData: ${JSON.stringify(cartData)}`);
        return { cartData };
      } else {
        throw new Error("Unexpected status code.");
      }
    }
  } catch (error) {
    return {
      cartLoaderError:
        "Your cart could not be loaded. Please try again later.",
    };
  }
}

//Backup cartLoader
// export async function cartLoader() {

//   try {
//     const res = await fetch(
//       `${process.env.REACT_APP_API_BASE_URL}/shoppingcart`,
//       { credentials: "include" }
//     );
//     if (res.ok) {
//       const cartData = await res.json();
//       return { cartData };
//     }
//     throw new Error("Unexpected status code.");
//   } catch (error) {
//     return { cartLoaderError: "Sorry, your cart could not be loaded. Please try again later." };
//   }
// }

// end

export function Cart() {
  const authData = useRouteLoaderData("app");
  const { cartData, cartLoaderError } = useLoaderData();
  const removalResult = useActionData();

  // console.log(`Cart.js - authData id: ${authData?.jsonData?.id}`);
  // console.log(`Cart.js - authData email: ${authData.jsonData?.email_address}`);
  // console.log(`Cart.js - authData auth method: ${authData?.jsonData?.auth_method}`);
  // console.log(`Cart.js - authData logged in: ${authData?.jsonData?.logged_in}`);
  console.log("Cart Data from:", cartData); 

  if (!authData?.jsonData?.logged_in) {
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
    console.log(`Cart.js renderRemovalMessage - Attempting renderRemovalMessage 22222222`);
    console.log("Cart.js renderRemovalMessage - removalResult:", removalResult);

    if (!removalResult) {
      console.log("removalResult = null");
      return null;
    }
    const { error, productId, productName, cart_id } = removalResult; //= useActionData()
    let message;
    if (error) {
      console.log(`Cart.js 33333- renderRemovalMessage error occured:`, error)
      message = `'${productName}' couldn't be removed from your cart.`;
    } else {
      console.log(
        `Cart.js - renderRemovalMessage calling getproductDetailPath - 120`
      );
      const productPath = getProductDetailPath(productId, productName); // LINK? Not here
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
  // Calculate subtotal
  const subtotal = cartData.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={globalStyles.pagePadding}>
      <h1 className={globalStyles.h1}>Cart</h1>
      <p>You are logged in as {authData.jsonData.email_address}.</p>
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
      {renderOrderItems(cartData, cartLoaderError)}{" "}
      {/*slugify errors if cartData doesn't have productName, needed to add JOIN to cart queries to products for productName!*/}
      {/* Test goes here*/}
      
        <strong><p>Total: £{subtotal.toFixed(2)} ({totalItems} items)</p></strong>
      
      {/* Test end  */}
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
