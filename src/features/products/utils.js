import axios from "axios";

function slugify(str) {
  //console.log("slugify at products/utils received this parameter: ");
  //console.log(`products/utils.js: `, str);
  if (typeof str !== "string") {
//    console.error("Expected a string in slugify, got:", str);
    return "Undefined123";
  }

  str = str.replace(/^\s+|\s+$/g, ""); // Trim
  str = str.toLowerCase();
  str = str
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Collapse whitespace and replace with `-`
    .replace(/-+/g, "-"); // Collapse dashes

  return str;
}

export function getProductDetailPath(id, name) {
  //console.log(`products/utils.js - getProductDetailPath received the parameters id: ${id}, name: ${name}`);
  const nameSlug = slugify(name);
  return `/products/${id}/${nameSlug}`;
}

// export function getProductImagePath(id, name) {
//   const nameSlug = slugify(name);
//   return `/product-images/${id}-${nameSlug}.jpg`;
// }

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function getStatus() {
  const res = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/auth/status`,
    {
      headers: {},
      withCredentials: true, // If needed for CORS with credentials
    }
  );

  if (res.status === 200 || res.status === 304) {
    //console.log(`products/utils.js getStatus() - res.status was 200 or 304!`);
    //console.log(`products/utils.js getStatus() - res.data:`, res.data);
    return res.data;
  } else {
    console.log(`products/utils.js - getStatus() ERROR!`);
    throw new Error("Unexpected status code.");
  }
}

export async function getProductData(product_id) {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/products/${product_id}`
    );

    if (res.status === 200 || res.status === 304) {
      //console.log(`products/utils.js - res.status was 200 or 304!`);
      //console.log(`products/utils.js - res.data:`, res);
      const productData = res.data;
      console.log(`products/utils.js - getProductData productData[0]:`, productData[0]);
      return productData[0];
    } else {
      console.log(`products/utils.js - getProductData ERROR!`);
      throw new Error("Unexpected status code.");
    }
  } catch (error) {
    console.log(`products/utils.js - getProductData ERROR!`, error);
    throw new Error("Unexpected status code.");
  }
}
