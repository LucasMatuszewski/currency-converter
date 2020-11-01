import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ContextProvider } from './services/context';
import Converter from './pages/Converter/Converter';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <ContextProvider>
        <Switch>
          <Route exact path={['/', '/currency/:urlCurrency']}>
            <Converter />
          </Route>
          <Route path={'/not-found'}>
            <NotFound />
          </Route>
          <Route path="*">
            <Redirect to="/not-found" />
          </Route>
        </Switch>
      </ContextProvider>
    </Router>
  );
}

export default App;
