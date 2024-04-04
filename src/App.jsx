import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, set, get, ref, child } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./App.css";
import Prompt from "./Prompt";
import Warning from "./Warning";
import logo from "/assets/logo.png";

export default function App() {
  const [mode, setMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [prompt, setPrompt] = useState(false);
  const [isInvalidSignUp, setIsInvalidSignUp] = useState(false);
  const [isInvalidSignIn, setIsInvalidSignIn] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyC2_HN1bJp0y0-VkcbQcDllEUKSoRpVkHw",
    authDomain: "docbot-2a7fa.firebaseapp.com",
    databaseURL: "https://docbot-2a7fa-default-rtdb.firebaseio.com",
    projectId: "docbot-2a7fa",
    storageBucket: "docbot-2a7fa.appspot.com",
    messagingSenderId: "630925020953",
    appId: "1:630925020953:web:312c5371a36eeff1637f88",
    measurementId: "G-VBRDLMDC4K",
  };

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getDatabase();
      createUserWithEmailAndPassword(auth, email, password)
        .then((credentials) => {
          set(ref(db, `users/${credentials.user.uid}`), {
            email: email,
            password: password,
          });
          setUsername("");
          setEmail("");
          setPassword("");
          setPrompt(true);
          setTimeout(() => {
            setPrompt(false);
            setMode(false);
          }, 4000);
        })
        .catch((error) => {
          // console.log(error.code, error.message);
          setIsInvalidSignUp(true);
          setTimeout(() => {
            setIsInvalidSignUp(false);
          }, 5000);
        });
    } catch (error) {
      console.log(error.code, error.message);
      setIsInvalidSignUp(true);
      setTimeout(() => {
        setIsInvalidSignUp(false);
      }, 5000);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      const app = initializeApp(firebaseConfig);
      const db = getDatabase();
      const auth = getAuth(app);
      const dbref = ref(db);

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setEmail("");
          setPassword("");
          get(child(dbref, `users/${userCredential.user.uid}`))
            .then((snapshot) => {
              console.log(snapshot.val());
              if (snapshot) {
                sessionStorage.setItem(
                  "user-info",
                  JSON.stringify({
                    email: snapshot.val().email,
                    password: snapshot.val().password,
                  })
                );
                sessionStorage.setItem(
                  "user",
                  JSON.stringify(userCredential.user)
                );
                window.location.href = "https://www.instagram.com/";
              } else {
                throw new Error("Invalid credentials");
              }
            })
            .catch((error) => {
              setIsInvalidSignIn(true);
              setTimeout(() => {
                setIsInvalidSignIn(false);
              }, 5000);
              console.log(error);
            });
        })
        .catch((error) => {
          setIsInvalidSignIn(true);
          setTimeout(() => {
            setIsInvalidSignIn(false);
          }, 5000);

          console.log(error);
        });
    } catch (error) {
      console.log(error.code, error.message);
    }
  };

  return (
    <div className={`container ${mode ? "sign-up-mode" : ""}`}>
      <h1>{prompt && <Prompt />}</h1>
      <img src="/assets/logo.png" alt="logo" className="app-logo-sign-up" />
      <img src="/assets/logo.png" alt="logo" className="app-logo-sign-in" />

      <div className={`forms-container`}>
        <div className="signin-signup">
          {
            // Sign-in form
          }

          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Login</h2>
            <div className="input-field">
              <input
                type="email"
                placeholder="Enter your Email"
                className="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            {!isInvalidSignIn && (
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            )}
            {isInvalidSignIn && (
              <Warning password={password}>
                {" "}
                <p className="warning-text">
                  <strong>Your email or password is incorrect</strong>
                </p>{" "}
              </Warning>
            )}
            <input type="submit" value="Login" className="btn solid" />
          </form>
          {
            // Sign-up form
          }
          <form className="sign-up-form" onSubmit={handleRegister}>
            <h2 className="title">Register</h2>
            <div className="input-field">
              <input
                type="text"
                placeholder="Username"
                className="sign-up-username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                className="sign-up-email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            {!isInvalidSignUp && (
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="sign-up-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            )}
            {isInvalidSignUp && (
              <Warning password={password}>
                {" "}
                <p className="warning-text">
                  Password should be between 8 to 20 characters
                </p>{" "}
              </Warning>
            )}
            <input
              type="submit"
              className="btn sign-up-button"
              value="Register"
            />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New to our community ?</h3>
            <p>
              Welcome to HealthAxon, your gateway to smarter healthcare powered
              by advanced AI solutions. Log in now to explore how HealthAxon's
              innovative technology is reshaping the healthcare landscape,
              providing personalized insights and cutting-edge tools to enhance
              your well-being and improve your health journey.
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => setMode(!mode)}
            >
              Register
            </button>
          </div>
          <img
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
            className="image"
            alt=""
          />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of Our Valued Members</h3>
            <p>
              Thank you for joining the HealthAxon community. Your participation
              enriches our collective experience. Let's embark on this
              transformative healthcare journey together!
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => setMode(!mode)}
            >
              Login
            </button>
          </div>
          <img
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
            className="image"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
