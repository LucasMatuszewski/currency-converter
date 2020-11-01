import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import './layout.scss';

interface LayoutProps {
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Currency Converter',
}) => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuActive((prevState: boolean) => !prevState);
  };
  return (
    <div className="layout-container">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <h2 className="has-text-primary is-size-4 has-text-weight-semibold">
              Currently
            </h2>
          </Link>
          <span
            role="button"
            className={`navbar-burger burger${
              isMenuActive ? ' is-active' : ''
            }`}
            aria-label="menu"
            aria-expanded="false"
            data-target="mainNavbar"
            onClick={handleMenuToggle}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </span>
        </div>

        <div
          id="mainNavbar"
          className={`navbar-menu${isMenuActive ? ' is-active' : ''}`}
        >
          <div className="navbar-start">
            {/**
             * @todo add 'is-active' on path match when page is selected
             */}
            <Link to="/" className="navbar-item is-tab">
              Converter
            </Link>
            <Link to="/trends" className="navbar-item is-tab">
              Trends
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <span className="navbar-link">Popular Currencies</span>

              <div className="navbar-dropdown">
                <Link to="/currency/usd" className="navbar-item">
                  USD
                </Link>
                <Link to="/currency/eur" className="navbar-item">
                  EUR
                </Link>
                <Link to="/currency/sek" className="navbar-item">
                  SEK
                </Link>
                <Link to="/currency/pln" className="navbar-item">
                  PLN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="section">
        <div className="container">{children}</div>
      </section>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Currency Converter</strong> by{' '}
            <a href="https://www.linkedin.com/in/lukaszmatuszewski/">
              Łukasz Matuszewski
            </a>
            . Built with ❤ in{' '}
            <a href="https://www.youtube.com/watch?v=QEUb9byI1V8">Łódź</a>.
            <br />
            Exchange rates from:{' '}
            <a href="http://exchangeratesapi.io/">exchangeratesapi.io</a>.{' '}
            <span>
              Photo by{' '}
              <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                Annie Spratt
              </a>{' '}
              on{' '}
              <a href="https://unsplash.com/s/photos/currency?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                Unsplash
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
