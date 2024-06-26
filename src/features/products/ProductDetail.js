import axios from "axios";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import InlineLink from "../../components/InlineLink/InlineLink";
import { getProductDetailPath } from "./utils";
import globalStyles from "../../App.module.css";
import styles from "./ProductDetail.module.css";
import { formatDate, getStatus } from "./utils";
//import Rating from "../../components/Rating/Rating"; //Future feature?

export async function addToCartAction({ request, params }) {
  const formData = await request.formData();
  const quantity = parseInt(formData.get("quantity"), 10);
  const res = await getStatus();
  const customer_id = res.jsonData.id;
  const product_id = parseInt(params.id);

  try {
    // Fetch product details to check stock quantity
    const productRes = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/products/${product_id}`
    );
    const productData = await productRes.json();
    const stock_quantity = productData[0].stock_quantity;

    if (quantity > stock_quantity) {
      return "Error: Requested quantity exceeds available stock.";
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/shoppingcart`,
      {
        customer_id,
        product_id,
        quantity,
      },
      { withCredentials: true }
    );

    if (response.status === 200 || response.status === 201) {
      const cartLink = <InlineLink path="/cart" anchor="cart" />;
      return <>Item has been added to your {cartLink}.</>;
    } else if (response.status === 400) {
      return response.data;
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return "Error: Item could not be added to your cart.";
  }
}

/* */

export async function productDetailLoader({ params }) {
  try {
    console.log("productDetailLoader attempting to fetch products/id");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/products/${params.id}`
    ); 
    console.log("Here is watch we fetched!");
    console.log(res);

    if (res.status === 404) {
      throw new Response("Not Found", { status: 404 });
    } else if (!res.ok) {
      throw new Error("Unsuccessful product fetch.");
    }

    const productData = await res.json();

    // Redirect non-canonical matched paths to the canonical path
    console.log(
      `The params.id is: ${params.id}, the productNameSlug is: ${params.productNameSlug}`
    );
    const currentPath = `/products/${params.id}/${params.productNameSlug}`;
    //console.log( productData[0] );
    //console.log(`The productData.product_id is: ${productData[0].product_id}, the productData.product_name is: ${productData[0].product_name}`); // undefined? Fixed by accessing the first object in the returned array !!! [0]
    //const canonicalPath = getProductDetailPath(productData.product_id, productData.product_name); // Breaks here
    const canonicalPath = `/products/${productData[0].product_id}/${productData[0].product_name}`;

    console.log({ productData });
    console.log("Checking if paths are correct");
    if (currentPath !== canonicalPath) {
      console.log(
        "currentPath !== canonicalPath, redirecting to: " + `${canonicalPath}` //Delete later !!!!!!
      );
      return redirect(canonicalPath);
    }
    console.log("Here is the productData");
    console.log({ productData });
    return { productData };
  } catch (error) {
    if (error.status === 404) {
      throw error;
    }
    return { error: "Error: Product could not be loaded." };
  }
}
export function ProductDetail() {
  const { productData, error } = useLoaderData();
  const authData = useRouteLoaderData("app");
  const addToCartMessage = useActionData();

  if (error) {
    return <InlineErrorPage pageName="Error" message={error} />;
  }

  const {
    product_name,
    product_description,
    price,
    stock_quantity,
    image_url,
    created_at,
    updated_at,
  } = productData[0];

  function renderButton() {
    const buttonStyles = `${globalStyles.button} ${styles.button}`;
    if (stock_quantity < 1) {
      return (
        <p className={globalStyles.largeText}>
          <em>Out of stock</em>
        </p>
      );
    } else if (authData.jsonData.logged_in) {
      return (
        <Form method="post">
          <label htmlFor="quantity" className={styles.quantityLabel}>
            Quantity:
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            defaultValue="1"
            className={styles.quantityInput}
          />
          <button type="submit" className={buttonStyles}>
            Add to cart
          </button>
        </Form>
      );
    } else {
      const currentPath = getProductDetailPath(
        productData[0].product_id,
        productData[0].product_name
      );
      const linkPath = `/login?redirect=${currentPath}`;
      return (
        <Link to={linkPath} className={buttonStyles}>
          Log in to buy
        </Link>
      );
    }
  }

  return (
    <div className={styles.productDetailContainer}>
      <div className={globalStyles.pagePadding}>
        <section className={styles.summarySection}>
          <div className={styles.imageContainer}>
            <img
              src={image_url}
              alt={productData[0].product_name}
              height="500"
              width="500"
              className={styles.image}
            />
          </div>
          <div className={styles.summaryTextContent}>
            <h1 className={styles.productName}>{product_name}</h1>
            <p className={styles.price}>£{price}</p>
            <hr />
            <p>{product_description}</p>
            <hr />
            {stock_quantity >= 1 && stock_quantity <= 5 ? (
              <p>
                <strong>Only {stock_quantity} left in stock!</strong>
              </p>
            ) : null}
            {renderButton()}
            {addToCartMessage ? (
              <p className={styles.buttonMessage}>{addToCartMessage}</p>
            ) : null}
          </div>
        </section>
        <section className={styles.descriptionSection}>
          <h2>Description</h2>
          <p className={globalStyles.XLText}>{product_description}</p>
          <p>Listed at: {formatDate(created_at)}</p>
          <p>Updated at: {formatDate(updated_at)}</p>
        </section>
      </div>
    </div>
  );
}