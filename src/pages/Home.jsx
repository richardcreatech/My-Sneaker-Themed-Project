import { useRef, useEffect } from "react";
import gsap from "gsap";
import HomeImgGallery from "./Homeimggallery";
import QuickView from "./Quickview";
import Footer from "./Footer";
import History from "./History";
import ShoeRain from "./ShoeRain";
import { NavLink } from "react-router";

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
          <NavLink to={"/auth"} ref={buttonRef} className="explore-btns">
            Explore Me
          </NavLink>
        </div>
      <div ref={galleryRef}>
        <HomeImgGallery />
      </div>
      </section>
      <ShoeRain />


      <QuickView />
<canvas></canvas>

      <section id="youtube_video_box">
        <iframe width="1200" height="905" src="https://www.youtube.com/embed/O-JXUhhIRHU?si=7Fzz6JBND-nOKITW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        
        <div id="video_captions">
        <h1>
  Discover the perfect way to wear your favorite sneakers. 
</h1>
          <p>
  From the way you lace them to the way you step into them, the little
  details can make a big difference. Take a moment to watch our guide and
  discover simple techniques for wearing your sneakers with better comfort,
  a cleaner fit, and effortless style. Whether you're heading out for the
  day, meeting friends, or simply adding the finishing touch to your outfit,
  learn how to make every step feel and look just right.
</p>
        </div>
      </section>

     <History />

<canvas></canvas>
<canvas></canvas>
<canvas></canvas>

      <Footer />
    </section>
  );
}

export default Home;