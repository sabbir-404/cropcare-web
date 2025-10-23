import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // hash router works on GitHub Pages
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import AnimatedRoutes from "./app/AnimatedRoutes";
import "./index.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
