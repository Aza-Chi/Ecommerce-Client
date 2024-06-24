// The item in the product list/products page
import { Link } from "react-router-dom";
import { getProductDetailPath } from "./utils";
import utilStyles from "../../App.module.css";
import styles from "./ProductFeedItem.module.css";
import { formatDate } from "./utils";
// import Rating from "../../components/Rating/Rating"; //Implement rating later?

export default function ProductFeedItem({ productData }) {
  // Assuming getProductDetailPath and getProductImagePath are correctly implemented
  const detailPath = getProductDetailPath(
    productData.product_id,
    productData.product_name
  );
  //const imagePath = getProductImagePath(productData.product_id, productData.product_name);
  const { price, stock_quantity, created_at, updated_at, image_url } =
    productData;

  return (
    <article className={styles.feedItem}>
      <Link to={detailPath}>
        <img
          src={image_url}
          alt={productData.product_name}
          height="500"
          width="500"
          className={styles.image}
        />
      </Link>
      <div className={styles.textContainer}>
        <div className={utilStyles.mb1rem}>
          <Link to={detailPath} className={styles.nameLink}>
            <strong
              className={`${utilStyles.regularWeight} ${utilStyles.XLText}`}
            >
              {productData.product_name}
            </strong>
          </Link>
        </div>

        <div className={styles.price}>£{price}</div>
        <div className={styles.date}>Listed at: {formatDate(created_at)}</div>
        <div className={styles.date}>Updated at: {formatDate(updated_at)}</div>
        <div className={styles.price}>Stock left: {stock_quantity}</div>
      </div>
    </article>
  );
}
