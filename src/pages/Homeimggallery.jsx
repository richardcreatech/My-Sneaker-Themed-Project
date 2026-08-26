import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import s1 from "./../assets/shoes/shoe-1.png"
import s2 from "./../assets/shoes/shoe-2.png"
import s3 from "./../assets/shoes/shoe-3.png"

// Swap `image` and `shoeIcon` for real photos/renders later.
// `shoeIcon` is what shows in the pagination row — right now it's a
// silhouette placeholder, eventually a cropped product shot of that shoe.
const slides = [
  {
    id: "dunk-panda",
    image: "https://i.pinimg.com/736x/de/1b/57/de1b57805a7d049de948e45f39ba149c.jpg",
    shoeIcon: s1,
    alt: "Nike Dunk Low Panda on brick pavement",
  },
  {
    id: "af1-purple",
    image: "https://i.pinimg.com/1200x/ba/8a/3f/ba8a3f82284aacbd1ab415243f7d19d3.jpg",
    shoeIcon: s2,
    alt: "Purple Air Force 1",
  },
  {
    id: "sb-orange",
    image: "https://i.pinimg.com/736x/ef/30/dc/ef30dcedd70be2bee6f589708f696f68.jpg",
    shoeIcon: s3,
    alt: "Orange Nike SB Dunk",
  },
  // {
  //   id: "af1-tan",
  //   image: "https://i.pinimg.com/1200x/51/46/05/514605f8f54980b2a17f99f816cb748c.jpg",
  //   shoeIcon: "/images/icons/af1-tan-icon.png",
  //   alt: "Tan Air Force 1",
  // },
  // {
  //   id: "sb-blue",
  //   image: "/images/gallery/sb-blue.jpg",
  //   shoeIcon: "/images/icons/sb-blue-icon.png",
  //   alt: "Blue Nike SB Dunk",
  // },
];

const SWIPE_THRESHOLD = 50; // px of horizontal drag before it counts as a swipe

function HomeImgGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageRefs = useRef([]);
  const iconRefs = useRef([]);
  const dragState = useRef({ startX: 0, dragging: false });
  const frameRef = useRef(null);

  const goTo = (nextIndex) => {
    const clamped = (nextIndex + slides.length) % slides.length;
    if (clamped === activeIndex) return;
    setActiveIndex(clamped);
  };

  // Crossfade + scale the images whenever activeIndex changes
  useEffect(() => {
    imageRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === activeIndex;
      gsap.to(el, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.06,
        duration: 0.6,
        ease: "power2.out",
        pointerEvents: isActive ? "auto" : "none",
      });
    });

    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === activeIndex;
      gsap.to(el, {
        scale: isActive ? 1.35 : 1,
        y: isActive ? -6 : 0,
        opacity: isActive ? 1 : 0.55,
        duration: 0.4,
        ease: "back.out(2)",
      });
    });
  }, [activeIndex]);

  // Pointer-based swipe (works for touch and mouse)
  const onPointerDown = (e) => {
    dragState.current = { startX: e.clientX, dragging: true };
    frameRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging || !frameRef.current) return;
    const deltaX = e.clientX - dragState.current.startX;
    gsap.set(frameRef.current, { x: deltaX * 0.3 });
  };

  const endDrag = (e) => {
    if (!dragState.current.dragging) return;
    const deltaX = e.clientX - dragState.current.startX;
    dragState.current.dragging = false;

    gsap.to(frameRef.current, { x: 0, duration: 0.4, ease: "power2.out" });

    if (deltaX <= -SWIPE_THRESHOLD) goTo(activeIndex + 1);
    else if (deltaX >= SWIPE_THRESHOLD) goTo(activeIndex - 1);
  };

  return (
    <section id="home-img-gallery">
      <div
        id="gallery-frame"
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {slides.map((slide, i) => (
          <img
            key={slide.id}
            ref={(el) => (imageRefs.current[i] = el)}
            src={slide.image}
            alt={slide.alt}
            className="gallery-slide"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
            draggable={false}
          />
        ))}
      </div>

      <div id="gallery-pagination" role="tablist" aria-label="Gallery pages">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            ref={(el) => (iconRefs.current[i] = el)}
            className="shoe-icon"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Show ${slide.alt}`}
            onClick={() => goTo(i)}
          >
            <img src={slide.shoeIcon} alt="" draggable={false} />
          </button>
        ))}
      </div>
    </section>
  );
}

export default HomeImgGallery;