import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const old = document.getElementById("chrome-extension-dictionary-ext");
if (old) old.remove();

const rootElement = document.createElement("div");
rootElement.id = "chrome-extension-dictionary-ext";
document.documentElement.appendChild(rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
