import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Initialize React application
createRoot(document.getElementById("root")!).render(<App />);