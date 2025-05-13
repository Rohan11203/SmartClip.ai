
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter } from 'react-router-dom'
import ClipForm from "./components/ClipForm";
import Navbar from "./components/Navbar";
import MainPage from "./components/mainPage";
import { useEffect } from "react";

function App() {
    

 return (
  <>

  <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<LandingPage />} />
          <Route path="clip" element={<MainPage />} />
          {/*<Route path="contact" element={<Contact />} />*/}
          {/*<Route path="*" element={<NoPage />} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  {/* <ClipForm /> */}
  </>
 )
}

export default App;
