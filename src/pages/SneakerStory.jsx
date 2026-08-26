import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import "./SneakerStory.scss";

gsap.registerPlugin(ScrollTrigger);

import sneakerImage from "../assets/shoes/shoe-1.png";

const slogans = [
  "SNEAKERS",
  "MOVE",
  "CREATE",
  "EXPRESS",
  "DEFINE",
  "YOUR STYLE",
];

function SneakerStory() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const shoeRef = useRef(null);
  const orbitRef = useRef(null);
  const sloganRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const shoe = shoeRef.current;
    const orbit = orbitRef.current;

    const ctx = gsap.context(() => {
      const sloganElements = sloganRefs.current;

      /*
       * Initial state
       */
      gsap.set(shoe, {
        scale: 0.86,
        opacity: 0,
      });

      gsap.set(sloganElements, {
        opacity: 0.18,
        scale: 0.8,
      });

      /*
       * Positions around the sneaker.
       *
       * Instead of a perfect mathematical circle,
       * we're deliberately making the composition
       * slightly irregular/editorial.
       */
      const positions = [
        { x: 0, y: -300, rotation: 0 },
        { x: -300, y: -80, rotation: -12 },
        { x: 300, y: -40, rotation: 8 },
        { x: -250, y: 230, rotation: -8 },
        { x: 240, y: 220, rotation: 10 },
        { x: 0, y: 300, rotation: 0 },
      ];

      sloganElements.forEach((element, index) => {
        gsap.set(element, {
          x: positions[index].x,
          y: positions[index].y,
          rotation: positions[index].rotation,
        });
      });

      /*
       * Main story timeline
       */
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      /*
       * Sneaker enters first.
       */
      tl.to(shoe, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      });

      /*
       * First slogan becomes active.
       */
      tl.to(
        sloganElements[0],
        {
          opacity: 1,
          scale: 1.15,
          duration: 0.7,
        },
        "<0.25"
      );

      /*
       * Build each slogan transition.
       */
      for (let i = 0; i < sloganElements.length - 1; i++) {
        const current = sloganElements[i];
        const next = sloganElements[i + 1];

        const currentPosition = positions[i];
        const nextPosition = positions[i + 1];

        /*
         * Move the orbital system slightly between each stage.
         */
        tl.to(
          orbit,
          {
            rotation: "+=55",
            duration: 1,
            ease: "none",
          },
          "+=0.15"
        );

        /*
         * Current slogan fades back.
         */
        tl.to(
          current,
          {
            opacity: 0.18,
            scale: 0.8,
            duration: 0.35,
            ease: "power2.inOut",
          },
          "<0.35"
        );

        /*
         * Next slogan becomes active.
         */
        tl.fromTo(
          next,
          {
            opacity: 0.18,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1.15,
            duration: 0.55,
            ease: "back.out(1.7)",
          },
          "<0.15"
        );

        /*
         * Tiny vertical movement on the sneaker
         * keeps the center visually alive.
         */
        tl.to(
          shoe,
          {
            y: i % 2 === 0 ? -8 : 8,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          "<"
        );
      }

      /*
       * Final state.
       *
       * Hold the final slogan slightly longer.
       */
      tl.to({}, { duration: 0.7 });

      /*
       * ScrollTrigger pins the entire stage.
       *
       * The user must progress through the full timeline
       * before the next page section becomes reachable.
       */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 5.5}`,
        pin: stage,
        scrub: 1.2,
        animation: tl,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        /*
         * Makes the experience feel like a deliberate
         * storytelling section.
         */
        snap: {
          snapTo: 1 / (slogans.length - 1),
          duration: {
            min: 0.2,
            max: 0.5,
          },
          ease: "power2.out",
        },
      });

      /*
       * Refresh after layout/images are ready.
       */
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sneaker_story_section"
      className="sneaker-story"
    >
      <div
        ref={stageRef}
        className="sneaker-story__stage"
      >
        <div className="sneaker-story__background">
          {/* Replace these with your existing background assets */}
          <div className="bg-shoe bg-shoe--1" />
          <div className="bg-shoe bg-shoe--2" />
          <div className="bg-shoe bg-shoe--3" />
          <div className="bg-shoe bg-shoe--4" />

          <span className="bg-star bg-star--1">✦</span>
          <span className="bg-star bg-star--2">✦</span>
          <span className="bg-star bg-star--3">✦</span>
        </div>

        <div
          ref={orbitRef}
          className="sneaker-story__orbit"
        >
          {slogans.map((slogan, index) => (
            <span
              key={slogan}
              ref={(element) => {
                sloganRefs.current[index] = element;
              }}
              className="sneaker-story__slogan"
            >
              {slogan}
            </span>
          ))}
        </div>

        <div
          ref={shoeRef}
          className="sneaker-story__shoe"
        >
          <img
            src={sneakerImage}
            alt="Featured sneaker"
          />
        </div>
      </div>
    </section>
  );
}

export default SneakerStory;