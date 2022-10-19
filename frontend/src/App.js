import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchDomain from "./pages/SearchDomain";
import PayDomain from "./pages/PayDomain";
import DomainList from "./pages/DomainList";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/search_domain" component={SearchDomain} />
        <Route exact path="/pay_domain" component={PayDomain} />
        <Route exact path="/domain_list" component={DomainList} />
      </BrowserRouter>
    </>
  );
}

export default App;
