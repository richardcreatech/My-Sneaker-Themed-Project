import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function CurrentProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
        setActiveImage(0); // reset in case user navigates between products
      } catch (err) {
        console.error(err);
        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <main className="current_product">Loading product...</main>;
  }

  if (error) {
    return <main className="current_product">{error}</main>;
  }

  if (!product) {
    return <main className="current_product">Product not found.</main>;
  }

  const {
    name,
    category,
    description,
    price,
    oldPrice,
    discount,
    images = [],
  } = product;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <main className="current_product">
      {/* IMAGE */}
      <div className="current-product-image">
        <div className="current-product-main-image">
          <img src={images[activeImage]} alt={name} />
        </div>

        <div className="current-product-thumbnails">
          {images.map((img, index) => (
            <button
              key={index}
              className={index === activeImage ? "active" : ""}
              onClick={() => setActiveImage(index)}
            >
              <img src={img} alt={`${name} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="current-product-info">
        <span className="current-product-category">{category}</span>

        <h1 className="current-product-name">{name}</h1>

        <p className="current-product-description">{description}</p>

        <div className="current-product-pricing">
          <span className="current-product-price">
            ${Number(price).toFixed(2)}
          </span>
          {discount && (
            <span className="current-product-discount">{discount}%</span>
          )}
          {oldPrice && (
            <span className="current-product-old-price">
              ${Number(oldPrice).toFixed(2)}
            </span>
          )}
        </div>

        <div className="current-product-actions">
          <div className="current-product-quantity">
            <button onClick={handleDecrease}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button className="current-product-add-to-cart">
            <FontAwesomeIcon icon={faCartShopping} />
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}

export default CurrentProduct;