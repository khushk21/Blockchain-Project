import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchDomain from "./pages/SearchDomain";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/search_domain" component={SearchDomain} />
      </BrowserRouter>
    </>
  );
}

export default App;
