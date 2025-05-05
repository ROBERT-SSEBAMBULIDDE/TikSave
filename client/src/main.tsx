import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Font Awesome
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js";
script.crossOrigin = "anonymous";
script.referrerPolicy = "no-referrer";
document.head.appendChild(script);

// Add font
const fontLink = document.createElement('link');
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// Add title
const title = document.createElement('title');
title.textContent = "TikSave - Download TikTok Videos Without Watermark";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
