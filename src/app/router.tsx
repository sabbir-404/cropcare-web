import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewScan from "../pages/NewScan";
import MapPage from "../pages/MapPage";
import History from "../pages/History";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/scan", element: <NewScan /> },
  { path: "/map", element: <MapPage /> },
  { path: "/history", element: <History /> },
  { path: "/settings", element: <Settings /> },
]);
