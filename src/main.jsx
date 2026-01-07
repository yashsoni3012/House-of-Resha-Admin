// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 🔇 GLOBAL FIX: Silence harmless media AbortError
const originalPlay = HTMLMediaElement.prototype.play;

HTMLMediaElement.prototype.play = function () {
  const playPromise = originalPlay.apply(this, arguments);

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });
  }

  return playPromise;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
