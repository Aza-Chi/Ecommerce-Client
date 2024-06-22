// The product listing/products
import { redirect, useLoaderData } from "react-router-dom";

import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import ProductFeedItem from "./ProductFeedItem"; // Assuming this import is correct
import globalStyles from "../../App.module.css";
import styles from "./ProductFeed.module.css";

// Adjust fetchCategoryData to correctly filter categories by url_slug
async function fetchCategoryData(categorySlug) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`);
    if (!res.ok) {
      throw new Error("Unsuccessful categories fetch.");
    }
    const categories = await res.json();

    const filteredCategory = categories.find(c => c.url_slug === categorySlug);
    if (!filteredCategory) {
      throw new Error("Category not found.");
    }
    return filteredCategory;

  } catch (error) {
    console.error("Error fetching category data:", error);
    throw error;
  }
}

// Adjust productFeedLoader function to handle productsData structure
export async function productFeedLoader({ params, request }) {
  try {
    const url = new URL(request.url);
    let productsFetchURL = `${process.env.REACT_APP_API_BASE_URL}/products`;
    let categoryData = null; // Set this after 
    let searchTerm = null; // Set this after 

    if (params.categorySlug) {
      categoryData = await fetchCategoryData(params.categorySlug);
      productsFetchURL += `?category_id=${categoryData.id}`;

    } else if (url.pathname.includes("search")) {
      searchTerm = url.searchParams.get("q");
      if (!searchTerm) {
        return redirect("/");
      }
      productsFetchURL += `?search_term=${searchTerm}`;
    }

    const res = await fetch(productsFetchURL);
    if (!res.ok) {
      throw new Error("Unsuccessful products fetch.");
    }
    const productsData = await res.json();

    return { productsData, categoryData, searchTerm };

  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// ProductFeed component
export default function ProductFeed({ isSearchResults }) {
  const { categoryData, productsData, searchTerm, error } = useLoaderData();

  if (error) {
    return <InlineErrorPage pageName="Error" message={error.message || error} />;
  }

  function getHeadingText() {
    if (isSearchResults) {
      return "Search Results";
    } else if (categoryData) {
      return categoryData.name;
    } else {
      return "All Products";
    }
  }

  function getDescriptionText() {
    if (isSearchResults) {
      const productCount = productsData.length;
      const resultText = productCount !== 1 ? "results" : "result";
      return `${productCount} ${resultText} for "${searchTerm}".`;

    } else if (categoryData) {
      return categoryData.description;

    } else {
      return "Browse our full range of products. (Stock Data is for Dev/Test Purposes, look at the 0 stock and <=5 stock products)";
    }
  }

  function renderFeedItems() {
    if (!productsData || productsData.length === 0) {
      return <p className={globalStyles.emptyFeedMessage}>Error: No products were found.</p>;
    }
    const feedItems = productsData.map(p => <ProductFeedItem key={p.product_id} productData={p} />);
    return <div className={styles.productGrid}>{feedItems}</div>;
  }

  return (
    <div className={globalStyles.pagePadding}>
      <div className={globalStyles.mb4rem}>
        <h1 className={globalStyles.h1}>{getHeadingText()}</h1>
        <p>{getDescriptionText()}</p>
      </div>
      {renderFeedItems()}
    </div>
  );
}