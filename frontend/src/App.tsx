import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Authentication } from "./views/Authentication/Authentication";
import { Home } from "./views/Home/Home";
import { CityDetails } from "./views/CityDetails/CityDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/" element={<Home />} />
        <Route path="/city/:cityName" element={<CityDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
