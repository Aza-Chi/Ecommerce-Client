import { Form, redirect, useActionData, useRouteLoaderData, useSearchParams } from "react-router-dom";
import axios from 'axios';
import InlineLink from "../../components/InlineLink/InlineLink";
import globalStyles from "../../App.module.css";
import GoogleAuthButton from "./GoogleAuthButton";
import FacebookAuthButton from "./FacebookAuthButton";



export async function loginAction({ request }) {
  let formData = await request.formData();
  try {
    const usernameOrEmail = formData.get("email_address");
    const password = formData.get("password");
    console.log(`Attempting Login with credentials: ${usernameOrEmail} + ${password}`);
    console.log(`${process.env.REACT_APP_API_BASE_URL}/auth/login`);

    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, { 
      usernameOrEmail, 
      password },
      // { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      let redirectPath = new URL(request.url).searchParams.get("redirect");
      if (redirectPath) {
        if (redirectPath[0] !== "/") {
          // Prevent external navigation
          redirectPath = `/${redirectPath}`;
        }
      } else {
        redirectPath = "/account";
      }
      return redirect(redirectPath);
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "Login failed. The username or password is incorrect.";
    }
    console.error('Login failed:', error);
    return "Login failed. Please try again later.";
  }
}


export function LoginPage() {
  // https://reactrouter.com/en/main/components/form
  // https://reactrouter.com/en/main/hooks/use-action-data
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const loginError = useActionData();
  const [searchParams] = useSearchParams();
  const isGoogleError = searchParams.get("googleAuthError");
  const isFacebookError = searchParams.get("facebookAuthError");

  const registerLink = <InlineLink path="/register" anchor="register" />;
  const loggedOutContent = <>If you haven't created an account, please {registerLink} or sign in with Google/Facebook below.</>;
  const loggedInContent = <>You are already logged in as {authData.email_address}.</>;
  const googleError = <>Google sign in failed. Please try again later or {registerLink} instead.</>;
  const facebookError = <>Facebook sign in failed. Please try again later or {registerLink} instead.</>;

  return (
    <div className={`${globalStyles.pagePadding} ${globalStyles.mw80rem}`}>
      <h1 className={globalStyles.h1}>Log in</h1>
      <p className={globalStyles.mb2rem}>{authData.logged_in ? loggedInContent : loggedOutContent}</p>
      <Form method="post" className={globalStyles.stackedForm}>
        <label htmlFor="email_address" className={globalStyles.label}>Email</label>
        <input id="email_address" className={globalStyles.input} type="email" name="email_address" required />
        <label htmlFor="password" className={globalStyles.label}>Password</label>
        <input id="password" className={globalStyles.input} type="password" name="password" required />
        <button type="submit" className={globalStyles.button}>Log in</button>
      </Form>
      <p>{loginError ? loginError : null}</p>
      <hr className={globalStyles.separator} />
      <GoogleAuthButton />
      <FacebookAuthButton />
      <p>{isGoogleError ? googleError : null}</p>
      <p>{isFacebookError ? facebookError : null}</p>
    </div>
  );
}