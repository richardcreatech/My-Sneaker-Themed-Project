import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products`);

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
        <article className="product-card" key={product.id}>
          {/* IMAGE */}
          <div className="product-image">
            <img src={product.image} alt={product.name[0]} />
          </div>

          {/* DETAILS */}
          <div className="product-details">
            <span className="product-category">{product.category}</span>

            <h2 className="product-name">{product.name}</h2>

            <span className="product-price">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Products;