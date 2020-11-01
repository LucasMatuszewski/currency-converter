import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './converter.scss';
import { API } from '../../services/api';
import { useContextDispatch, useContextState } from '../../services/context';
import { Currencies, RouteParams } from '../../types';

import Layout from '../../components/Layout/Layout';
import Loader from '../../components/Loader/Loader';

interface RatesType {
  [key: string]: number;
}

const Converter = () => {
  const { amount, baseCurrency } = useContextState();
  const dispatch = useContextDispatch();

  const { urlCurrency } = useParams<RouteParams>();
  const defaultCurrency: Currencies = urlCurrency
    ? (urlCurrency.toUpperCase() as Currencies)
    : 'EUR';

  const [ratesDate, setRatesDate] = useState<string>();
  const [rates, setRates] = useState<RatesType>();
  const [isLoading, setIsLoading] = useState(true);

  const currenciesArray: Currencies[] = ['EUR', 'GBP', 'USD', 'PLN', 'SEK'];
  const errors: any = {}; /** @todo error handling */

  useEffect(() => {
    defaultCurrency &&
      dispatch({ type: 'SET_BASE', baseCurrency: defaultCurrency });
  }, [defaultCurrency, dispatch]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      const result = await API.getLatest(baseCurrency);
      setRatesDate(result.date);
      setRates(result.rates);
      setIsLoading(false);
    };
    /**
     * @todo use ref to check if base has changed, if not don't fetch data again
     */
    fetchCurrencies();
  }, [baseCurrency]);

  return (
    <Layout>
      <div className="box">
        <div className="converter-header">
          <h1 className="title">Currency Converter</h1>
          {ratesDate ? (
            <p className="subtitle is-italic">Exchange rates on: {ratesDate}</p>
          ) : null}
        </div>

        <form noValidate className="block">
          <div className="field has-addons has-addons-centered">
            <p className="control">
              <input
                className={`input${errors.amount ? ' is-danger' : ''}`}
                name="amount"
                id="amount"
                type="number"
                // min="1"
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const amountValue = event.target.value
                    ? parseFloat(event.target.value)
                    : false;
                  if (typeof amountValue !== 'number' || isNaN(amountValue)) {
                    // set error
                    dispatch({ type: 'SET_AMOUNT', amount: undefined });
                    return;
                  }

                  dispatch({ type: 'SET_AMOUNT', amount: amountValue });
                }}
                value={amount ? amount : ''}
              />
            </p>
            <p className="control">
              <span
                className={`select is-fullwidth${
                  errors.currency ? ' is-danger' : ''
                }`}
              >
                <select
                  name="currency"
                  id="currency"
                  required
                  onChange={
                    (event: React.ChangeEvent<HTMLSelectElement>) =>
                      dispatch({
                        type: 'SET_BASE',
                        baseCurrency: event.target.value as Currencies,
                      }) // temporary fix "as"
                  }
                  value={baseCurrency}
                >
                  {currenciesArray.map((currency: Currencies) => (
                    <option key={`key-${currency}`} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </span>
            </p>
            {errors.amount ? (
              <p className="help is-danger">{errors.amount}</p>
            ) : null}
          </div>
        </form>

        {isLoading ? (
          <Loader />
        ) : rates ? (
          <div className="currency-grid">
            {Object.entries(rates).map(([currency, rate]) => {
              if (currency === baseCurrency) return '';
              return (
                <article
                  className="notification is-primary"
                  key={`currency-${currency}`}
                >
                  <p className="title">{currency}</p>
                  <p className="subtitle">
                    {amount ? (rate * amount).toFixed(4) : '--'}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <p>There was some problem to get currency data</p>
        )}
      </div>
    </Layout>
  );
};

export default Converter;
