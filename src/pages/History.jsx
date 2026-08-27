import { useRef, useState } from "react";
import { gsap } from "gsap";

const SNEAKER_LEGENDS = [
  {
    id: 1,
    name: "Bill Bowerman",
    role: "Coach & Innovator",
    image:
      "https://i.pinimg.com/736x/8f/ae/a2/8faea2a2373b77ed5c6ca5b7cfadb106.jpg",
    story:
      "Bill Bowerman was an American track and field coach and one of the key figures behind the development of modern athletic footwear. He constantly experimented with ways to make running shoes lighter, more comfortable, and more effective for athletes. His curiosity and hands-on approach helped shape the early philosophy of Nike and influenced generations of performance shoe design.",
  },

  {
    id: 2,
    name: "Phil Knight",
    role: "Nike Co-Founder",
    image:
      "https://i.pinimg.com/736x/b5/d6/67/b5d66782e6bfafab0a67872c8feebd74.jpg",
    story:
      "Phil Knight co-founded Nike and played a major role in turning a small athletic footwear company into one of the most recognizable brands in the world. His vision connected sport, performance, storytelling, and culture in a way that helped sneakers become much more than equipment.",
  },

  {
    id: 3,
    name: "Tinker Hatfield",
    role: "Legendary Designer",
    image:
      "https://i.pinimg.com/736x/11/b6/9b/11b69b7896be802adf09aedb8990fbb8.jpg",
    story:
      "Tinker Hatfield is one of the most influential footwear designers in sneaker history. Joining Nike as an architect and designer, he introduced a different way of thinking about shoes, combining performance with bold visual ideas.",
  },

  {
    id: 4,
    name: "Peter Moore",
    role: "Designer",
    image:
      "https://i.pinimg.com/736x/9e/78/f7/9e78f7fd938af2be71adfd50379abfb8.jpg",
    story:
      "Peter Moore was the designer behind the original Air Jordan 1 and played an important role in defining the visual language of Nike Basketball. His design helped create a sneaker that became one of the most recognizable silhouettes in sneaker history.",
  },

  {
    id: 5,
    name: "Michael Jordan",
    role: "Athlete & Cultural Icon",
    image: "https://i.pinimg.com/1200x/97/b5/ef/97b5ef39600ec5f3772d9f9295ea9594.jpg",
    story:
      "Michael Jordan transformed the relationship between athletes and sneakers. His partnership with Nike produced the Air Jordan line, helping establish the idea that an athlete's identity could become inseparable from a footwear brand.",
  },

 
];

function History() {
  const [activeLegend, setActiveLegend] = useState(null);

  const tooltipRef = useRef(null);
  const hideTimeout = useRef(null);

  const cancelHide = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  const hideLegend = () => {
    cancelHide();

    hideTimeout.current = setTimeout(() => {
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: 8,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
        pointerEvents: "none",
      });

      setActiveLegend(null);
    }, 150);
  };

  const showLegend = (legend, event) => {
    cancelHide();

    setActiveLegend(legend);

    const tooltip = tooltipRef.current;

    if (!tooltip) return;

    const rect = event.currentTarget.getBoundingClientRect();

    gsap.killTweensOf(tooltip);

    gsap.set(tooltip, {
      left: rect.left + rect.width / 2,
      top: rect.bottom + 14,
      xPercent: -50,
      pointerEvents: "auto",
    });

    gsap.to(tooltip, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "power3.out",
    });
  };

  const speakStory = (legend) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `${legend.name} is ${'iconic'}. ${legend.story}`
    );

    speech.rate = 0.9;
    speech.pitch =Math.round((Math.random() * 2) );
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  const stopStory = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <section id="history_of_sneakers">

      <div id="history_intro">
        <p className="history_eyebrow">
          THE PEOPLE BEHIND THE CULTURE
        </p>

        <h1>Meet the legends who changed sneakers.</h1>

        <p className="history_description">
          Sneakers became more than something we wear because of the people
          who pushed them forward. Explore the athletes, designers, artists,
          and innovators who helped shape sneaker history.
        </p>
      </div>

      <div id="legend_grid">
        {SNEAKER_LEGENDS.map((legend) => (
          <article
            className="legend_card"
            key={legend.id}
            onMouseEnter={(event) => showLegend(legend, event)}
            onMouseLeave={hideLegend}
          >
            <img src={legend.image} alt={legend.name} />

            <div className="legend_card_name">
              <span>{legend.name}</span>
            </div>
          </article>
        ))}
      </div>

      <div
        id="legend_tooltip"
        ref={tooltipRef}
        onMouseEnter={cancelHide}
        onMouseLeave={hideLegend}
      >
        {activeLegend && (
          <>
            <span className="tooltip_role">
              {activeLegend.role}
            </span>

            <h2>{activeLegend.name}</h2>

            <p>{activeLegend.story}</p>

            <div className="tooltip_buttons">
              <button
                type="button"
                onClick={() => speakStory(activeLegend)}
              >
                <span>▶</span>
                Listen
              </button>

              <button
                type="button"
                onClick={stopStory}
              >
                <span>■</span>
                Stop
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default History;