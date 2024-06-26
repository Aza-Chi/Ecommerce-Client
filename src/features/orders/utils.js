import { OrderItem } from "./OrderItem";
import globalStyles from "../../App.module.css";
import { getProductData } from "../products/utils";
import axios from "axios";
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
      const orderWithProductName = {
        ...order,
        product_name: productData.product_name,
      };
      // Add the updated order object to the new array
      ordersWithProductNames.push(orderWithProductName);
    } catch (error) {
      console.log(
        `Failed to get product data for product_id ${order.product_id}:`,
        error
      );
      // Optionally, you can decide what to do in case of an error, e.g., add the order without product name
      ordersWithProductNames.push(order);
    }
  }

  return ordersWithProductNames;
}

export function renderOrderItems(orderItemsData, editable = true) {
  //console.log(`orders/utils.js - renderOrderItems - received:`, orderItemsData);
  // Cart Items (i.e. pending order items)
  // Order Items - Sending Order Data lacks product_name, have to solve by ....

  const itemsCount = orderItemsData.length;
  if (itemsCount === 0) {
    return <p className={globalStyles.emptyFeedMessage}>Your cart is empty.</p>;
  }
  const orderItems = orderItemsData.map((item, index) => {
    if (index + 1 === itemsCount) {
      return (
        <OrderItem
          key={item.product_id}
          productData={item}
          editable={editable}
          lastItem={true}
        />
      );
    }
    return (
      <OrderItem key={item.product_id} productData={item} editable={editable} />
    );
  });
  return <div>{orderItems}</div>;
}

export function generateOrderReference() {
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  function getRandomCharacters(source, length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * source.length);
      result += source[randomIndex];
    }
    return result;
  }

  const firstFourNumbers = getRandomCharacters(numbers, 4);
  const nextFourLetters = getRandomCharacters(letters, 4);
  const nextFourNumbers = getRandomCharacters(numbers, 4);
  const lastFourLetters = getRandomCharacters(letters, 4);
  const final =
    firstFourNumbers + nextFourLetters + nextFourNumbers + lastFourLetters;
  console.log(`orders/utils.js - generating order_reference`, final);
  return final;
}

export async function getOrderByReference(order_reference) {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/orders/reference/${order_reference}`
    );

    if (res.status === 200) {
      console.log(`orders/utils.js - getOrderByReference: Order found!`);
      const orderData = res.data;
      console.log(
        `orders/utils.js - getOrderByReference: orderData`,
        orderData
      );
      return { status: 200, data: orderData }; // Return status 200 and order data
    } else if (res.status === 204) {
      console.log(`orders/utils.js - getOrderByReference: Order not found.`);
      return { status: 204 }; // Return status 204 if order not found
    } else {
      console.log(
        `orders/utils.js - getOrderByReference: Unexpected status code ${res.status}`
      );
      return { status: res.status }; // Return other status codes as they are
    }
  } catch (error) {
    console.error(`orders/utils.js - getOrderByReference: Error`, error);
    throw new Error("Unexpected error occurred.");
  }
}

export async function getAddressesByCustomerId(customer_id) {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/addresses/customer/${customer_id}`
    );

    if (res.status === 200 || res.status === 304) {
      //console.log(`orders/utils.js - res.status was 200 or 304!`);
      //console.log(`orders/utils.js - res.data:`, res);
      const addressData = res.data;
      console.log(
        `orders/utils.js - getAddressesByCustomerId addressData[0]:`,
        addressData
      );
      return addressData;
    } else {
      console.log(`orders/utils.js - getAddressesByCustomerId ERROR!`);
      throw new Error("Unexpected status code.");
    }
  } catch (error) {
    console.log(`orders/utils.js - getAddressesByCustomerId ERROR!`, error);
    throw new Error("Unexpected status code.");
  }
}

export const getStatusString = (statusId) => {
  const statusMap = {
    0: 'Pending',
    1: 'Confirmed',
    2: 'Processing',
    3: 'Dispatched',
    4: 'In Transit',
    5: 'Out For Delivery',
    6: 'Delivered',
    7: 'Attempted Delivery',
    8: 'Cancelled',
    9: 'Awaiting Pickup',
    10: 'Delayed',
    11: 'Lost',
    12: 'Held At Customs',
    13: 'Contact Support'
  };

  return statusMap[statusId] || 'Unknown Status';
};
