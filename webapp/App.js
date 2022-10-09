import React from "react";

import { Route, Switch } from 'react-router-dom';


import HomePage from "./HomePage.js";
import AuctionPage from "./AuctionPage.js";
import AuctionStatus from "./AuctionStatus.js";




// example from doc: https://reactjs.org/docs/forms.html#controlled-components
class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/auction/status" exact component={AuctionStatus} />

          <Route path="/auction" exact component={AuctionPage} />
          <Route path="/" exact component={HomePage} />
        </Switch>

      </div>
    )
  }
}

export default App;