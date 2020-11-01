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
  const [amount, setAmount] = useState(1);
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
        <h1 className="title">Currency Converter</h1>

        <div>
          <form noValidate>
            <div className="field has-addons has-addons-centered">
              <p className="control">
                <input
                  className={`input${errors.amount ? ' is-danger' : ''}`}
                  name="amount"
                  id="amount"
                  type="text"
                  required
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setAmount(parseInt(event.target.value))
                  }
                  value={amount}
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
        </div>

        {ratesDate ? <p className="subtitle">Rates on day: {ratesDate}</p> : ''}
        <div className="currency-grid">
          {rates
            ? Object.entries(rates).map(([currency, rate]) => (
                <article className="notification is-primary">
                  <p className="title">{currency}</p>
                  <p className="subtitle">{rate * amount}</p>
                </article>
              ))
            : 'Loading...'}
        </div>
      </div>
    </Layout>
  );
}

export default Converter;
