import { useState } from "react";
import Signup from "../../../components/SignUp";
import Login from "../../../components/Login";
import shoe from "../../../assets/shoe_feature.png";
import my_logo from "../../../assets/my_logo.png";

function Auth() {
  const [mode, setMode] = useState("signup");

  const isSignup = mode === "signup";

  return (
    <section className="auth sneakers-auth">
      <div className="auth__container">
        <div className="auth__content">
          <header className="auth__header">
            <div className="auth__brand">
              <img src={my_logo} width={50} alt="" />
            </div>

            <div className="auth__switch">
              <span>
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button
                type="button"
                onClick={() => setMode(isSignup ? "login" : "signup")}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </div>
          </header>

          <main className="auth__form-wrap" key={mode}>
            <p className="auth__eyebrow"></p>
            <h1 className="auth__title">
              {isSignup ? "Join the lineup." : "Welcome back."}
            </h1>
            <p className="auth__subtitle">
              {isSignup
                ? "Create an account to save pairs, and check out faster."
                : "Sign in to pick up your cart and drop alerts right where you left them."}
            </p>

            {isSignup ? <Signup /> : <Login />}
          </main>
        </div>

        <aside className="auth__visual">

          <p className="auth__visual-caption">Every pair, verified</p>
        </aside>
      </div>
    </section>
  );
}

export default Auth;
