import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ContextProvider } from './services/context';
import Layout from './components/Layout/Layout';
import Loader from './components/Loader/Loader';

const Converter = lazy(() => import('./pages/Converter/Converter'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  return (
    <Router>
      <ContextProvider>
        <Layout>
          <Suspense fallback={<Loader />}>
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
          </Suspense>
        </Layout>
      </ContextProvider>
    </Router>
  );
}

export default App;
