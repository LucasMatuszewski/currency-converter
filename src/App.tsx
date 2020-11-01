import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Converter from './pages/Converter/Converter';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={['/', '/currency/:baseCurrency']}>
          <Converter />
        </Route>
        <Route path={'/not-found'}>
          <NotFound />
        </Route>
        <Route path="*">
          <Redirect to="/not-found" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
