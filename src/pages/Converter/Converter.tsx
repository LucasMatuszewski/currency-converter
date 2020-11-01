import React, { useEffect, useState } from 'react';

import './converter.scss';
import Layout from '../../components/Layout/Layout';
import { API } from '../../services/api';
import { Currencies } from '../../types';

interface RatesType {
  [key: string]: number;
}

function Converter() {
  const [baseCurrency, setBaseCurrency] = useState<Currencies>('EUR');
  const [amount, setAmount] = useState<number | undefined>(1);
  const [ratesDate, setRatesDate] = useState<string>();
  const [rates, setRates] = useState<RatesType>();

  const currenciesArray: Currencies[] = ['SEK', 'USD', 'PLN', 'EUR'];
  const errors: any = {}; /** @todo error handling */

  useEffect(() => {
    const fetchCurrencies = async () => {
      const result = await API.getLatest(baseCurrency);
      console.log(result);
      setRatesDate(result.date);
      setRates(result.rates);
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
            <p className="subtitle is-italic">
              Exchange rates on day: {ratesDate}
            </p>
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
                    setAmount(undefined);
                    return;
                  }
                  setAmount(amountValue);
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
                      setBaseCurrency(event.target.value as Currencies) // temporary fix "as"
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

        <div className="currency-grid">
          {rates
            ? Object.entries(rates).map(([currency, rate]) => {
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
              })
            : 'Loading...'}
        </div>
      </div>
    </Layout>
  );
}

export default Converter;
