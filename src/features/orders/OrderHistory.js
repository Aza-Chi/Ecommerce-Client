import { useLoaderData } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import { getStatus } from "../products/utils";

export async function ordersLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  const res = await getStatus();
  
  const customer_id = res.jsonData.id; // Replace with actual customer_id as needed, customer id 0 doesn't exist so good test 
console.log(`OrderHistory.js - customer_id: `, customer_id);
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/customer/${customer_id}`,
      { credentials: "include" }
    );
    if (res.ok) {
      const ordersData = await res.json();
      return { ordersData };
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { error: "Error: Orders could not be retrieved. Please try again later." };
  }
}


export function OrdersHistory() {
  // https://reactrouter.com/en/main/hooks/use-loader-data
  const { error, ordersData } = useLoaderData();

  function renderOrderSummaries() {
    if (error) {
      return <p>{error}</p>;
    }

    // Exclude orders with incomplete or failed payments
    const filteredOrders = ordersData.filter(order => order.status_id == "1");

    if (filteredOrders.length === 0) {
      return <p>There are no orders to display.</p>;
    }

    return filteredOrders.map((order, index) => {
      if (index + 1 === filteredOrders.length) {
        return <OrderSummary key={order.order_id} orderData={order} lastItem={true} />; 
      }
      return <OrderSummary key={order.order_id} orderData={order} />;
    });
  }

  return (
    <div>
      {renderOrderSummaries()}
    </div>
  );
}