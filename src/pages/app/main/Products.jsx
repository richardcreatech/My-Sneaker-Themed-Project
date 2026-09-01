import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, apiFetch } from "../../../config/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiFetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="products-grid">Loading products...</div>;
  }

  if (error) {
    return <div className="products-grid">{error}</div>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <Link
          to={`/main/product/${product.id}`}
          className="product-card"
          key={product.id}
        >
          <article>
            {/* IMAGE */}
            <div className="product-image">
              <img src={product.image} alt={product.name[0]} />
            </div>

            {/* DETAILS */}
            {/* <div className="product-details">
              <span className="product-category">{product.category}</span>

              <h2 className="product-name">{product.name}</h2>

           
            </div> */}
          </article>
        </Link>
      ))}
    </div>
  );
}

export default Products;
