import { Link } from "react-router-dom";
import styles from "./OrderSummary.module.css";
import globalStyles from "../../App.module.css";
import { formatDate } from "../products/utils";

export default function OrderSummary({ orderData, lastItem }) {
  const { order_id, created_at, status_id, total_amount, customer_id } = orderData;
  console.log(`OrderSummary.js - orderData:`, orderData);
  const formattedDate = formatDate(created_at);
  const orderDetailsPath = `/orders/${order_id}`;

  return (
    <div className={styles.orderSummary}>
      <hr className={globalStyles.separator} />
      <article className={styles.flexContainer}>
        <div className={styles.contentContainer}>
          <strong>
            {/* <p>Order Summary:</p> */}
            <Link to={orderDetailsPath} className={`${globalStyles.largeText} ${globalStyles.link}`}>Order ID: #{order_id}, Status: {status_id}</Link>
          </strong>
          <div className={`${globalStyles.mt1rem} ${globalStyles.smallText} ${globalStyles.bold}`}>{formattedDate}</div>
          {/* Div below is for test purposes */}
          <div className={`${globalStyles.mt1rem} ${globalStyles.smallText} ${globalStyles.bold}`}>Ordered by Customer ID: {customer_id}</div>
          {/* Div above is for test purposes */}
          <div className={globalStyles.mt1rem}>Total: £{total_amount}</div>
        </div>
        <div>
          <Link to={orderDetailsPath} className={`${globalStyles.button} ${styles.button}`}>View details</Link>
        </div>
      </article>
      {lastItem ? <hr className={globalStyles.separator} /> : null}
    </div>
  );
}