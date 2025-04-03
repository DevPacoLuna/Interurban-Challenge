import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./views/Authentication/Authentication";
import Home from "./views/Home/Home";
import CityDetails from "./views/CityDetails/CityDetails";
import Header from "./components/Header/Header";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/city/:cityName" element={<CityDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
