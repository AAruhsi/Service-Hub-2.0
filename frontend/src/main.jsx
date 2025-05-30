import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
