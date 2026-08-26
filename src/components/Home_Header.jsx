import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faGamepad, faHome } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import my_logo from "../../public/logo/my_logo.png";
// import "./Home_Header.css";

gsap.registerPlugin(ScrollTrigger);

// ---- TWEAKABLE TIMING -------------------------------------------------
// How many pixels of scrolling the whole transformation is spread across.
const SCROLL_DISTANCE = 550;
// -------------------------------------------------------------------

const NAV_ITEMS = [
  { to: "/", icon: faHome, label: "Home" },
  { to: "/explore", icon: faCoffee, label: "Explore" },
  { to: "/games", icon: faGamepad, label: "Games" },
];

function Home_Header() {
  const headerRef = useRef(null);
  const shellRef = useRef(null);
  const logoRef = useRef(null);
  const navListRef = useRef(null);
  const labelRefs = useRef([]);
  const location = useLocation();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add({ isMobile: "(max-width: 640px)" }, (context) => {
      const { isMobile } = context.conditions;

      // ---- TWEAK: collapsed -> expanded target sizes ----
      const shellTarget = isMobile
        ? {
            width: () => Math.min(window.innerWidth - 24, 260),
            height: 56,
            borderRadius: 26,
          }
        : {
            width: () => Math.min(window.innerWidth - 24, 380),
            height: 66,
            borderRadius: 30,
          };

      // ---- TWEAK: how far down the header travels ----
      const travelY = () => window.innerHeight - (isMobile ? 110 : 140);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}`,
          scrub: 0.4, // small lag so it glides rather than snapping 1:1 to scroll
          invalidateOnRefresh: true,
        },
      });

      // Header moves toward the bottom across the whole scroll range.
      tl.to(headerRef.current, { y: travelY }, 0);

      // 20% -> 60%: capsule stretches/grows. Logo + nav each fade their own
      // background out as the shell's background fades in — that hand-off
      // is what reads as them "merging" into one pill.
      tl.to(
        shellRef.current,
        {
          ...shellTarget,
          backgroundColor: "rgba(10,10,10,0.92)",
          borderColor: "rgba(255,255,255,0.1)",
          duration: 0.4,
          ease: "power2.out",
        },
        0.2
      )
        .to(
          logoRef.current,
          {
            backgroundColor: "rgba(10,10,10,0)",
            borderColor: "rgba(255,255,255,0)",
            duration: 0.4,
          },
          0.2
        )
        .to(
          navListRef.current,
          {
            backgroundColor: "rgba(10,10,10,0)",
            borderColor: "rgba(255,255,255,0)",
            duration: 0.4,
          },
          0.2
        );

      // ~62% -> 92%: labels reveal one by one with a small overshoot.
      // back.out(1.7) produces the bounce — raise the 1.7 for a bigger
      // overshoot, lower it to flatten it out.
      tl.fromTo(
        labelRefs.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08, // gap between Home -> Explore -> Games
          duration: 0.3,
          ease: "back.out(1.7)",
        },
        0.62
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <header id="home_header" ref={headerRef}>
      <div id="home_nav_shell" ref={shellRef}>
        <Link to="/" id="home_logo" ref={logoRef} aria-label="Go to homepage">
          <img src={my_logo} alt="" />
        </Link>

        <nav aria-label="Primary">
          <ul ref={navListRef}>
            {NAV_ITEMS.map((item, i) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.label} className={isActive ? "active" : ""}>
                  <Link to={item.to}>
                    <span className="nav_icon">
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    <span
                      className="nav_label"
                      ref={(el) => (labelRefs.current[i] = el)}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Home_Header;