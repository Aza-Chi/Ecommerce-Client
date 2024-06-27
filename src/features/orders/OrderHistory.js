import { useLoaderData } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import { getStatus } from "../products/utils";

export async function ordersLoader() {
  try {
    // Fetch the auth status
    const statusRes = await getStatus();
    
    // Check if jsonData exists and contains the id property
    if (!statusRes || !statusRes.id) {
      throw new Error("Customer ID not found in auth status response.");
    }

    const customer_id = statusRes.id;
    console.log(`OrderHistory.js - customer_id: `, customer_id);

    // Fetch orders for the customer
    const ordersRes = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/customer/${customer_id}`,
      { credentials: "include" }
    );

    if (ordersRes.ok) {
      const ordersData = await ordersRes.json();
      return { ordersData };
    } else {
      throw new Error(`Unexpected status code: ${ordersRes.status}`);
    }
  } catch (error) {
    console.error('ordersLoader error:', error);
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