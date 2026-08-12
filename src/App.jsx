import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";
import { ToastProvider } from "./components/Toast";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import Requests from "./pages/Requests";
import Connections from "./pages/Connections";

function AppRoutes() {
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/auth";

  return (
    <>
      {!hideNav && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/connections" element={<Connections />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ParticleBackground />
      <AppRoutes />
    </ToastProvider>
  );
}
