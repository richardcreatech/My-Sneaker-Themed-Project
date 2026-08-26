import { useEffect, useRef } from "react";
import gsap from "gsap";
import logo from "../assets/logo.png"

function Footer() {
  const footerRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        linksRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="site_footer">
      <div id="site_footer_inner">

        <div id="footer_brand">
          <h2><img src={logo}
           alt="" /> SNEAKERS</h2>

          <p>
            Step into something different.
          </p>
        </div>

        <nav id="footer_links" aria-label="Footer navigation">
          <a
            href="#home_hero_section"
            ref={(el) => (linksRef.current[0] = el)}
          >
            Home
          </a>

          <a
            href="#quick_view_section"
            ref={(el) => (linksRef.current[1] = el)}
          >
            Collection
          </a>

          <a
            href="#ceo_section"
            ref={(el) => (linksRef.current[2] = el)}
          >
            About
          </a>

          <a
            href="#contact"
            ref={(el) => (linksRef.current[3] = el)}
          >
            Contact
          </a>
        </nav>

        <div id="footer_bottom">
          <span>© 2026 Sneakers</span>

          <div id="footer_socials">
            <a href="#instagram">Instagram</a>
            <a href="#twitter">X</a>
            <a href="#github">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;