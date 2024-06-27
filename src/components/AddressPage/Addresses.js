import { useLoaderData } from "react-router-dom";
import { getStatus } from "../../features/products/utils";
//import OrderSummary from "./OrderSummary";
import globalStyles from "../../App.module.css";
import styles from "./Addresses.module.css"

export async function addressLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  const res = await getStatus();
  
  const customer_id = res.id; 
console.log(`Addresses.js - customer_id: `, customer_id);
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/addresses/customer/${customer_id}`,
      { credentials: "include" }
    );
    if (res.ok) {
      const addressesData = await res.json();
      // return { addressesData };
      return { customer_id, addressesData }; // 1. also return customer_id to be used in AddressForm.js by passing it though props
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { error: "Error: Addresses could not be retrieved. Please add an address or try again later." };
  }
}


// 4. could also pass addressesData as a prop through here too but addressLoader already here 
export function Addresses() {
  const { error, addressesData } = useLoaderData();
  console.log('Addresses.js - addressesData:', addressesData);

  async function handleRemoveAddress(addressId) {
    console.log(`Addresses.js - handleRemoveAddress attempted with addressID:`, addressId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete address: ${errorMessage}`);
      }
  
      console.log(`Address with ID ${addressId} deleted successfully`);
      window.location.reload(); // refresh the data
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  }


  function renderAddresses() {
    if (error) {
      console.log('Addresses.js - renderAddresses has encountered an error!', error);
      return <p>{error}</p>;
    }
    console.log('Addresses.js - renderAddresses - addressesData:', addressesData);
  
    if (addressesData.length === 0) {
      console.log('addressesDataLength:', addressesData.length);
      return <p>You have no addresses to display. Please add an address for delivery.</p>;
    }


    return (
      <div className={styles.Addresses}>
        {addressesData.map((address, index) => (
          <div key={index}>
            <hr className={styles.separator} />
            <div className={styles.flexContainer}>
              <div className={styles.contentContainer}>
                <p>{address.address_line_1}, {address.address_line_2}</p>
                <p>City: {address.city}</p>
                <p>Country: {address.country}</p>
                <p>Postcode: {address.postcode}</p>
              </div>
              <button 
                className={styles.button} 
                onClick={() => handleRemoveAddress(address.address_id)}
              >
                Remove Address
              </button>
            </div>
          </div>
        ))}
        <hr className={styles.separator} />
      </div>
    );
  }


  return (
    <div>
      {renderAddresses()}
    </div>
  );
}
  /*
  addressesdata - example data received
  0:
  address_id: 7
  address_line_1: "02 Ronald"
  address_line_2: "McDonald Street"
  city: "Hamburger City"
  country: "MooMoo"
  created_at: "2024-06-23T13:05:25.116Z"
  customer_id: 21
  postcode: "RM1 FF0"
  updated_at: "2024-06-23T13:05:25.116Z"
  */
