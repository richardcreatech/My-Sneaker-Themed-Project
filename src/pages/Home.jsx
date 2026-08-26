import { useRef, useEffect } from "react";
import gsap from "gsap";
import HomeImgGallery from "./Homeimggallery";
import QuickView from "./Quickview";
import SneakerStory from "./SneakerStory";
import Footer from "./Footer";

function Home() {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- TWEAK: entrance timing ----
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0 }
      )
        .fromTo(
          paragraphRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.45" // overlaps the previous tween so it doesn't feel like a queue
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          galleryRef.current,
          { opacity: 0, y: 36, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="home_hero_section">
      <section id="home_info">
        <h1 ref={headingRef}>SNEAKERS ARE IN STYLE</h1>
        <p ref={paragraphRef}>
          From casual streetwear to effortlessly polished looks, sneakers
          have become more than just everyday essentials.
        </p>
        <div id="home_btns">
          <button ref={buttonRef} className="explore-btns">
            Explore Me
          </button>
        </div>
      <div ref={galleryRef}>
        <HomeImgGallery />
      </div>
      </section>


      <QuickView />
      <Footer />
    </section>
  );
}

export default Home;