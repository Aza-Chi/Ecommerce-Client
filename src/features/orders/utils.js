import { OrderItem } from "./OrderItem";
import globalStyles from "../../App.module.css";
import { getProductData } from "../products/utils";

export function getDateTimeString(rawString) {
  const n = "numeric";
  const options = { year: n, month: n, day: n, hour: n, minute: n };
  return new Date(rawString).toLocaleString("en-GB", options);
}


export async function appendProductNamesToOrders(orderData) {
  // Create a new array to hold the orders with appended product names
  const ordersWithProductNames = [];

  for (const order of orderData) {
    try {
      const productData = await getProductData(order.product_id);
      // Append the product name to the order object
      const orderWithProductName = { ...order, product_name: productData.product_name };
      // Add the updated order object to the new array
      ordersWithProductNames.push(orderWithProductName);
    } catch (error) {
      console.log(`Failed to get product data for product_id ${order.product_id}:`, error);
      // Optionally, you can decide what to do in case of an error, e.g., add the order without product name
      ordersWithProductNames.push(order);
    }
  }

  return ordersWithProductNames;
}


export function renderOrderItems(orderItemsData, editable=true) {
    console.log(`orders/utils.js - renderOrderItems - received:`, orderItemsData);
  // Cart Items (i.e. pending order items) 
  // Order Items - Sending Order Data lacks product_name, have to solve by ....
  
  const itemsCount = orderItemsData.length;
  if (itemsCount === 0) {
    return <p className={globalStyles.emptyFeedMessage}>Your cart is empty.</p>;
  }
  const orderItems = orderItemsData.map((item, index) => {
    if (index + 1 === itemsCount) {
      return <OrderItem key={item.product_id} productData={item} editable={editable} lastItem={true} />;
    }
    return <OrderItem key={item.product_id} productData={item} editable={editable} />;
  }
  );
  return <div>{orderItems}</div>;
}



// export function renderOrderItems(orderItemsData, editable = true) {
//   const itemsCount = orderItemsData.length;
//   console.log(`orders/utils.js - renderOrderItems - received:`, orderItemsData);
  
//   if (itemsCount === 0) {
//     return <p className={globalStyles.emptyFeedMessage}>Your cart is empty.</p>;
//   }

//   const orderItems = orderItemsData.map((item, index) => {
//     return (
//       <OrderItem
//         key={item.cart_id}
//         productData={item}
//         editable={editable}
//         lastItem={index + 1 === itemsCount}
//       />
//     );
//   });

//   return <div>{orderItems}</div>;
// }