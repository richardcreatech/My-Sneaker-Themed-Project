import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const dummyProduct = {
  id: 1,
  name: "Fall Limited Edition Sneakers",
  category: "Sneaker Company",
  description:
    "These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.",
  price: 125.0,
  oldPrice: 250.0,
  discount: 50,
  images: [
    "https://picsum.photos/seed/sneaker1/500/500",
    "https://picsum.photos/seed/sneaker2/500/500",
    "https://picsum.photos/seed/sneaker3/500/500",
    "https://picsum.photos/seed/sneaker4/500/500",
  ],
};

// function CurrentProduct({ product }) {
function CurrentProduct() {
  const [quantity, setQuantity] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  let product = dummyProduct;

  if (!product) {
    return <main className="current_product">Loading product...</main>;
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
