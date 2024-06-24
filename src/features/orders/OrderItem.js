import { Form, Link } from "react-router-dom";
import { getProductDetailPath } from "../products/utils";
import styles from "./OrderItem.module.css";
import globalStyles from "../../App.module.css";

export async function removeCartItemAction({ request }) {
  //console.log("OrderItem.js - Attempting Remove Cart Item")

  let formData = await request.formData();
  //console.log("OrderItem.js - form data: ", formData);
  const productId = formData.get("product_id");
  const productName = formData.get("product_name");
  const cartId = formData.get("cart_id");
  // Debugging logs
  //console.log("OrderItem.js removeCartItemAction - Received productId:", productId);
  //console.log("OrderItem.js removeCartItemAction - Received productName:", productName);
  //console.log("OrderItem.js removeCartItemAction - Received cartId:", cartId);

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/shoppingcart/${cartId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      return { error: false, productId, productName, cartId };
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { error: true, productId, productName, cartId };
  }
}


export function OrderItem({ productData, editable, lastItem }) {
  const { product_id, product_name, price, quantity, cart_id, subtotal  } = productData;
  //console.log(`OrderItem.js - OrderItem productData:`, productData);
  const productPath = getProductDetailPath(product_id, product_name);


  return (
    <div className={styles.orderItem}>
      <hr className={globalStyles.separator} />
      
      <article className={styles.flexContainer}>
        <div className={styles.contentContainer}>
          <strong>
            <Link to={productPath} className={`${globalStyles.largeText} ${globalStyles.link}`}>Item: {product_name}</Link>
          </strong>
          <div className={globalStyles.mt1rem}>Product ID: {product_id}</div>
          {price?.length > 0 ? (
          <>
            <div className={globalStyles.mt1rem}>Price: £{price}</div>
          </>
        ) : null}
          


          {subtotal?.length > 0 ? (
          <>
            <div className={globalStyles.mt1rem}>Subtotal: £{subtotal}</div>
          </>
        ) : null}
          
          <div className={globalStyles.mt1rem}>Quantity: {quantity}</div>
        </div>
        {editable ?
        <Form method="post">
          {/* formData to be used in the removeCartItemAction, don't need them all but just practising here*/}
          <input type="hidden" name="product_id" value={product_id}></input>
          <input type="hidden" name="product_name" value={product_name}></input>
          <input type="hidden" name="cart_id" value={cart_id}></input>
          
          <button type="submit" className={styles.button}>Remove</button>
        </Form>
        : null}
      </article>
      {lastItem ? <hr className={globalStyles.separator} /> : null}
    </div>
  );
}

/*
This component is shared between Orders and Carts, cartData already sends product_name, price, and other required information
orderData sent from OrderDetailsPage.js -> utils.js -> OrderItem.js.  Does not have product_name and price 
1 set of data in orderData
address_id: 6
created_at: "2024-06-03T22:11:40.166Z"
customer_id: 21
order_date: "2024-06-03T22:11:40.166Z"
order_id: 17
product_id: 2
quantity: 211
status_id: 0
subtotal: "4009.00"
total_amount: "9900.00"
updated_at: "2024-06-03T22:11:40.166Z"
//Note there is no price or product_name 
For each array need to get the product_name and append it to the data?
*/