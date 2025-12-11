import { BrowserRouter } from "react-router-dom";
import Navbar from "./componants/Navbar";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
          },
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
}
