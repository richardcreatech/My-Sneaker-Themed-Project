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
    return <div className="products-page">Loading products...</div>;
  }

  if (error) {
    return <div className="products-page">{error}</div>;
  }

  return (
    <section className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <div className="products-categories">
          <button className="active">All items</button>
          <button>Sneakers</button>
          <button>Jordan</button>
          <button>Nike</button>
        </div>

        <div className="brand-logo">
          <span>NIKE</span>
        </div>
      </div>

      {/* PRODUCT GRID */}
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
    </section>
  );
}


export default  Products