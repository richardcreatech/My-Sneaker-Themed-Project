import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  GestureRecognizer,
} from "@mediapipe/tasks-vision";

const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";

export default function GestureController() {
  const videoRef = useRef(null);
  const recognizerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const previousY = useRef(null);
  const lastScrollTime = useRef(0);
  const lastClickTime = useRef(0);

  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("Gesture control off");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      recognizerRef.current?.close();
    };
  }, []);

  const setupGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

    const recognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_PATH,
      },

      runningMode: "VIDEO",

      numHands: 1,

      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    recognizerRef.current = recognizer;

    return recognizer;
  };

  const startCamera = async () => {
    try {
      setError("");
      setStatus("Starting camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      await setupGestureRecognizer();

      setEnabled(true);
      setStatus("Show your hand");
      detectHands();
    } catch (err) {
      console.error(err);

      setEnabled(false);
      setStatus("Camera unavailable");

      if (err.name === "NotAllowedError") {
        setError("Camera permission was denied.");
      } else {
        setError("Could not start gesture control.");
      }
    }
  };

  const stopCamera = () => {
    cancelAnimationFrame(animationFrameRef.current);

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());

      videoRef.current.srcObject = null;
    }

    recognizerRef.current?.close();
    recognizerRef.current = null;

    previousY.current = null;

    setEnabled(false);
    setStatus("Gesture control off");
  };

  const detectHands = () => {
    if (!videoRef.current || !recognizerRef.current) return;

    const video = videoRef.current;

    if (video.readyState >= 2) {
      const now = performance.now();

      const result = recognizerRef.current.recognizeForVideo(
        video,
        now
      );

      handleGesture(result);
    }

    animationFrameRef.current =
      requestAnimationFrame(detectHands);
  };

  const handleGesture = (result) => {
    if (!result?.landmarks?.length) {
      previousY.current = null;
      setStatus("Show your hand");
      return;
    }

    const landmarks = result.landmarks[0];

    const gesture =
      result.gestures?.[0]?.[0]?.categoryName ?? "None";

    // Index finger tip
    const indexFinger = landmarks[8];

    // Coordinates are normalized between 0 and 1.
    const currentY = indexFinger.y;

    setStatus(formatGestureName(gesture));

    /*
     * POINTING UP
     * Move your pointing finger upward/downward
     * to scroll the page.
     */
    if (gesture === "Pointing_Up") {
      if (previousY.current !== null) {
        const movement = currentY - previousY.current;

        const now = performance.now();

        if (
          Math.abs(movement) > 0.008 &&
          now - lastScrollTime.current > 12
        ) {
          window.scrollBy({
            top: movement * 650,
            behavior: "auto",
          });

          lastScrollTime.current = now;
        }
      }

      previousY.current = currentY;
    } else {
      previousY.current = null;
    }

    /*
     * OPEN PALM
     * Slowly scroll downward.
     */
    if (gesture === "Open_Palm") {
      window.scrollBy({
        top: 3,
        behavior: "auto",
      });
    }

    /*
     * VICTORY
     * Optional: scroll to next section.
     */
    if (gesture === "Victory") {
      const now = performance.now();

      if (now - lastScrollTime.current > 1200) {
        window.scrollBy({
          top: window.innerHeight * 0.8,
          behavior: "smooth",
        });

        lastScrollTime.current = now;
      }
    }

    /*
     * CLOSED FIST
     * Could be used as a "stop / pause" gesture later.
     */
    if (gesture === "Closed_Fist") {
      previousY.current = null;
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className="gesture-controller__camera"
        playsInline
        muted
      />

      <div className="gesture-controller">
        <button
          type="button"
          className="gesture-controller__button"
          onClick={enabled ? stopCamera : startCamera}
        >
          {enabled ? "Disable gestures" : "Use hand control"}
        </button>

        {enabled && (
          <div className="gesture-controller__status">
            <span className="gesture-controller__dot" />
            {status}
          </div>
        )}

        {error && (
          <div className="gesture-controller__error">
            {error}
          </div>
        )}
      </div>
    </>
  );
}

function formatGestureName(name) {
  switch (name) {
    case "Pointing_Up":
      return "☝️ Point & move to scroll";

    case "Open_Palm":
      return "✋ Open palm";

    case "Victory":
      return "✌️ Next section";

    case "Closed_Fist":
      return "✊ Paused";

    default:
      return "Hand detected";
  }
}