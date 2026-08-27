import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SHOE_SRC from  "../assets/shoes/shoe-1.png"


// const SHOE_SRC = "https://i.pinimg.com/736x/f4/23/0e/f4230e33a37b455ea98eef34c157b641.jpg";

function ShoeRain() {
  const containerRef = useRef(null);
  const templateRef = useRef(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  const lastDropRef = useRef(0);

  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const createShoeDrop = (intensity = 0.5) => {
    const container = containerRef.current;
    const template = templateRef.current;

    if (!container || !template) return;

    // Outer wrapper handles position + overall tumble rotation.
    // Inner img handles a faster secondary spin, so the shoe
    // reads as tumbling on two axes instead of spinning flatly.
    const wrapper = document.createElement("div");
    wrapper.classList.add("shoe_drop");

    const shoe = template.cloneNode(true);
    shoe.removeAttribute("id");
    shoe.classList.add("shoe_drop_img");

    wrapper.appendChild(shoe);
    container.appendChild(wrapper);

    const containerWidth = container.clientWidth;

    const startX = gsap.utils.random(0, containerWidth);

    const size = gsap.utils.random(18 + intensity * 8, 38 + intensity * 25);

    const rotation = gsap.utils.random(-180, 180);
    const finalRotation = rotation + gsap.utils.random(240, 720);

    // Secondary spin on the inner img — faster, independent axis.
    const innerRotation = gsap.utils.random(-90, 90);
    const innerFinalRotation = innerRotation + gsap.utils.random(-900, 900);

    const duration = gsap.utils.random(
      2.5 - intensity * 0.8,
      5 - intensity * 1.2,
    );

    const drift = gsap.utils.random(-140, 140);
    const wobbleFrequency = gsap.utils.random(3, 6);
    const wobbleAmount = gsap.utils.random(15, 35);

    const startY = gsap.utils.random(-120, -40);

    gsap.set(wrapper, {
      x: startX,
      y: startY,
      width: size,
      rotation,
      opacity: gsap.utils.random(0.5, 1),
    });

    gsap.set(shoe, {
      rotation: innerRotation,
    });

    /*
     * Main falling animation. Drift + wobble are both driven off
     * this tween's own progress via onUpdate, so there's only ever
     * one thing writing to `x` — no fighting with a second tween.
     */
    const fallTween = gsap.to(wrapper, {
      y: container.clientHeight + 120,
      rotation: finalRotation,

      duration,
      ease: "none",

      onUpdate: function () {
        const progress = this.progress();
        const wobble =
          Math.sin(progress * Math.PI * wobbleFrequency) * wobbleAmount;

        gsap.set(wrapper, {
          x: startX + drift * progress + wobble,
        });
      },

      onComplete: () => {
        innerSpinTween.kill();
        wrapper.remove();
      },
    });

    /*
     * Secondary tumble on the inner image, independent axis/speed.
     */
    const innerSpinTween = gsap.to(shoe, {
      rotation: innerFinalRotation,
      duration,
      ease: "none",
    });
  };

  const detectSound = () => {
    const analyser = analyserRef.current;

    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(data);

    let total = 0;

    for (let i = 0; i < data.length; i++) {
      total += data[i];
    }

    const average = total / data.length;

    /*
     * Convert microphone volume to 0 → 1.
     */
    const normalizedLevel = Math.min(average / 100, 1);

    setAudioLevel(normalizedLevel);

    const now = performance.now();

    /*
     * Quiet = almost no shoes.
     * Loud = lots of shoes.
     */
    const threshold = 0.18;

    if (normalizedLevel > threshold && now - lastDropRef.current > 90) {
      const intensity = (normalizedLevel - threshold) / (1 - threshold);

      const amount = Math.max(1, Math.floor(intensity * 4));

      for (let i = 0; i < amount; i++) {
        createShoeDrop(normalizedLevel);
      }

      lastDropRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(detectSound);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      const audioContext = new AudioContext();

      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;

      source.connect(analyser);

      analyserRef.current = analyser;

      setIsListening(true);

      detectSound();
    } catch (error) {
      console.error("Unable to access microphone:", error);
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;

    setIsListening(false);
    setAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <section id="shoe_rain_section">
      <div id="shoe_rain" ref={containerRef}>
        <img
          ref={templateRef}
          id="shoe_template"
          src={SHOE_SRC}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div id="shoe_rain_content">
        <p className="shoe_rain_eyebrow">SOUND OF THE STREETS</p>

        <h2>Make some noise.</h2>

        <p>
          Turn up the volume and watch the sneakers come falling down. The
          louder the sound, the harder they fall.
        </p>

        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className="shoe_rain_button"
        >
          <span>{isListening ? "■" : "●"}</span>
          {isListening ? "Stop listening" : "Start the rain"}
        </button>

        <div className="sound_indicator" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${Math.max(audioLevel, 0.05)})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default ShoeRain;
