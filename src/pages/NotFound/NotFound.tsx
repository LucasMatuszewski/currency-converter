import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './notFound.scss';

function NotFound() {
  return (
    <div className="box has-text-centered not-found-container">
      <Helmet>
        <title>Page Not Found - Currently</title>
      </Helmet>
      <h1 className="has-text-primary">OOPS!</h1>
      <h2 className="has-text-weight-semibold">
        We can't find the page you're looking for.
      </h2>
      <Link
        className="button is-primary has-text-weight-semibold is-outlined"
        to="/"
      >
        Visit homepage
      </Link>
    </div>
  );
}

export default NotFound;
