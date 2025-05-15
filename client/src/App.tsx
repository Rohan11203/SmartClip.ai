
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter } from 'react-router-dom'
import MainPage from "@/components/MainPage";

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
