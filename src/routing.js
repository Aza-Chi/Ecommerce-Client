import { createBrowserRouter } from "react-router-dom";
import { App, authLoader } from "./App";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { productFeedLoader } from "./features/products/ProductFeed.js";
import ProductFeed from "./features/products/ProductFeed"; // default exports so import without curly braces
import AccountPage from "./components/AccountPage/AccountPage";
import { ordersLoader } from "./features/orders/OrderHistory";
import { RegisterPage, registerAction } from "./features/auth/RegisterPage";
import { LoginPage, loginAction } from "./features/auth/LoginPage";
import {
  ProductDetail,
  productDetailLoader,
  addToCartAction,
} from "./features/products/ProductDetail";
import { Cart, cartLoader } from "./features/orders/Cart";
import { removeCartItemAction } from "./features/orders/OrderItem";
import {
  OrderDetailsPage,
  orderDetailsLoader,
} from "./features/orders/OrderDetailsPage";
import { CheckoutPage, checkoutAction } from "./features/orders/CheckoutPage";
import PaymentPage from "./features/orders/PaymentPage";
import PaymentReturn from "./features/orders/PaymentReturn";

// https://reactrouter.com/en/6.23.1/routers/create-browser-router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: authLoader,
    id: "app", //This id for { useRouteLoaderData } from "react-router-dom"; i.e.   const authData = useRouteLoaderData("app"); The only data available is the routes that are currently rendered. If you ask for data from a route that is not currently rendered, the hook will return undefined. https://reactrouter.com/en/main/hooks/use-route-loader-data
    children: [
      {
        path: "",
        element: <ProductFeed />,
        loader: productFeedLoader,
      },
      {
        path: "category/:categorySlug",
        element: <ProductFeed />,
        loader: productFeedLoader,
      },
      {
        path: "account",
        element: <AccountPage />,
        loader: ordersLoader,
      },
      {
        path: "register",
        element: <RegisterPage />,
        action: registerAction,
      },
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "products/:id/:productNameSlug",
        element: <ProductDetail />,
        loader: productDetailLoader,
        action: addToCartAction,
      },
      {
        path: "search",
        element: <ProductFeed isSearchResults={true} />,
        loader: productFeedLoader,
      },
      {
        path: "cart",
        element: <Cart />,
        loader: cartLoader,
        action: removeCartItemAction,
      },
      {
        path: "orders/:id",
        element: <OrderDetailsPage />,
        loader: orderDetailsLoader,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
        loader: cartLoader,
        action: checkoutAction,
      },
      {
        path: "checkout/:orderId/payment",
        element: <PaymentPage />,
      },
      {
        path: "checkout/:orderId/payment-return",
        element: <PaymentReturn />,
      },
      {
        path: "checkout/:id/success",
        element: <OrderDetailsPage checkoutSuccess={true} />,
        loader: orderDetailsLoader,
      },
    ],
  },
]);

/*


 


 






*/
