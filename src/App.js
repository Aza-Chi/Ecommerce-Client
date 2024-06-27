import { Outlet } from "react-router-dom";
import Header from './components/Header/Header';
import axios from 'axios';


export async function authLoader() {
  try {
    
    console.log(`App.js - Fetching auth/status`);
    console.log(`App.js - process.env.REACT_APP_API_BASE_URL: ${process.env.REACT_APP_API_BASE_URL}`); //The mistake was that somehow v1 became vl for my env variable, how did that possibly happen!?
    //const token = localStorage.getItem('token');
    //console.log(`App.js - token is: ${token}`);
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/status`, {
      headers: {
        //'Authorization': `Bearer ${token}`, // Include JWT token as Bearer token
      },
      withCredentials: true, // If needed for CORS with credentials
    });
    
    // Testing
    console.log(`App.js - res.data results printed as authData:`);
    //console.log(res); // returns object with data: auth_method: null, email_address: null, id: null, logged_in: false, 
    // Testing end 

    if (res.status === 200) {
      const authData = res.data;
      console.log('App.js - res.status=== 200:');
      console.log('App.js - authData:', authData);
      console.log('App.js - authData.logged_in:', authData.logged_in);

      
      return authData;
    }
    
    throw new Error("Unexpected status code.");
  } catch (error) {
    console.error(error);
    return { logged_in: false, id: null, email_address: null, auth_method: null };
  }
}

export function App() {
  return (
    <div className="App">
       <Header />
       <main>
        <Outlet />
      </main>
       
    </div>
  );
}