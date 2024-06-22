import { Outlet } from "react-router-dom";
import Header from './components/Header/Header';
import axios from 'axios';

//Fetch authLoader 
// export async function authLoader() {
//   // https://reactrouter.com/en/main/start/tutorial#loading-data
//   // https://reactrouter.com/en/main/route/loader
//   try {
//     console.log(`Fetching auth/status`)
//     const res = await fetch(
//       `${process.env.REACT_APP_API_BASE_URL}/auth/status`,
//       { credentials: "include" }
//     );
//     //testing
//     console.log(res);
//     //Need to set logged in to true ! 
//     //testing end 
//     if (res.ok) {
//       const authData = await res.json();
//       console.log("authData: ");
//       console.log(authData);
//       return authData;
//     }
//     throw new Error("Unexpected status code.");
//   } catch (error) {
//     return { logged_in: false, id: null, email_address: null, auth_method: null };
//   }
// }

//Axio authLoader 

export async function authLoader() {
  try {
    
    console.log(`App.js - Fetching auth/status`);
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


// <header className="App-header">
// <img src={logo} className="App-logo" alt="logo" />
// <p>
//   Edit <code>src/App.js</code> and save to reload.
// </p>
// <a
//   className="App-link"
//   href="https://reactjs.org"
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   Learn React
// </a>
// </header>