import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route } from "react-router-dom";
import logo from './assets/blockchain_bg.png'

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchDomain from "./pages/SearchDomain";
import PayDomain from "./pages/PayDomain";
import DomainList from "./pages/DomainList";
import DomainBidding from "./pages/DomainBidding";
import DomainStatus from "./pages/DomainStatus";

function App() {
  return (
    
    <>
      <Navbar />
      <BrowserRouter>
        <div class="background" style={{ 
          backgroundImage: `url(${logo})`, backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh'
          }}>
          <Route exact path="/" component={Home} />
          <Route exact path='/domain/status' component={DomainStatus}/>
          <Route exact path='/domain_bidding' component={DomainBidding}/>
          <Route exact path="/search_domain" component={SearchDomain} />
          <Route exact path="/pay_domain" component={PayDomain} />
          <Route exact path="/domain_list" component={DomainList} />
        </div>
      </BrowserRouter>
    </>

  );
}

export default App;
