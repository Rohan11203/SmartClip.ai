import MainPage from "@/components/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/clipVideos" element={<MainPage />} />
        </Route>

        <Route path="*" element={<p>Page not found</p>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
