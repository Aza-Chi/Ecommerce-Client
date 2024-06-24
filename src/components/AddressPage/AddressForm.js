// import { getStatus } from "../../features/products/utils";
//import { Form, Link } from "react-router-dom";
import React, { useState } from 'react';
//import styles from "./AddressForm.module.css";
import globalStyles from "../../App.module.css";


//4. AddressForm receives customer_id through props!
export function AddressForm({ customer_id }) {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`AddressForm.js customer_id: `, customer_id);
    const address_type = 'default';

    const addressData = {
      customer_id,
      address_type,
      address_line_1: addressLine1,
      address_line_2: addressLine2,
      city,
      country,
      postcode
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      const result = await response.json();
      console.log('Address added successfully:', result);

      // Optionally reset the form fields
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setCountry('');
      setPostcode('');

      setSuccessMessage('Address added successfully!');
      setErrorMessage('');

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error adding address:', error);
      setErrorMessage('Failed to add address. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className={`${globalStyles.pagePadding} ${globalStyles.mw80rem}`}>
      <form onSubmit={handleSubmit} className={globalStyles.stackedForm}>
        <label htmlFor="address_line_1" className={globalStyles.label}>Address Line 1</label>
        <input
          id="address_line_1"
          className={globalStyles.input}
          type="text"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />
        
        <label htmlFor="address_line_2" className={globalStyles.label}>Address Line 2</label>
        <input
          id="address_line_2"
          className={globalStyles.input}
          type="text"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />
        
        <label htmlFor="city" className={globalStyles.label}>City</label>
        <input
          id="city"
          className={globalStyles.input}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        
        <label htmlFor="country" className={globalStyles.label}>Country</label>
        <input
          id="country"
          className={globalStyles.input}
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        
        <label htmlFor="postcode" className={globalStyles.label}>Postcode</label>
        <input
          id="postcode"
          className={globalStyles.input}
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          required
        />
        
        <button type="submit" className={globalStyles.button}>Add Address</button>
      </form>
      
      {successMessage && <p className={globalStyles.successMessage}>{successMessage}</p>}
      {errorMessage && <p className={globalStyles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default AddressForm;
