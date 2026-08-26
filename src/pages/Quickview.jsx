import React, { useState } from "react";

const my_images = [
  {
    id: 0,
    img: "https://i.pinimg.com/736x/f3/5a/5d/f35a5dda571b6ece1b68285a498d77f6.jpg",
    caption: "MADE FOR EVERY MOVE",
    sub_caption:
      "From everyday streets to late-night runs, discover sneakers built to move with you.",
  },
  {
    id: 1,
    img: "https://i.pinimg.com/736x/2a/97/f6/2a97f6bead74de1a8cb9515f8d5f2afb.jpg",
    caption: "STYLE MEETS COMFORT",
    sub_caption:
      "Clean silhouettes, bold details, and everyday comfort designed to keep your style effortless.",
  },
  {
    id: 2,
    img: "https://i.pinimg.com/736x/96/05/43/9605439307194b40ae992274fd86a27b.jpg",
    caption: "FIND YOUR NEXT PAIR",
    sub_caption:
      "Explore standout sneakers curated for the way you walk, work, and express yourself.",
  },
];

function Quickview() {
  const [my_curr_img, setMyCurrImg] = useState(0);

  const currentImage = my_images[my_curr_img];

  return (
   <section id="quick_view_section">

  <section id="quick_view_thumbnails">
    {my_images.map((image, index) => (
      <button
        key={image.id}
        type="button"
        onClick={() => setMyCurrImg(index)}
        className={`quick-view-thumbnail ${
          my_curr_img === index ? "active" : ""
        }`}
      >
        <img src={image.img} alt={image.caption} />
      </button>
    ))}
  </section>

  <section id="quick_view_image_box">
    <img
      id="current_img"
      src={currentImage.img}
      alt={currentImage.caption}
    />
  </section>

  <section id="quick_view_expose">
    <h1>{currentImage.caption}</h1>
    <p>{currentImage.sub_caption}</p>

    <button type="button">
      Explore the platform
    </button>
  </section>

</section>
  );
}

export default Quickview;