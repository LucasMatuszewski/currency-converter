import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './converter.scss';
import { API } from '../../services/api';
import { useContextDispatch, useContextState } from '../../services/context';
import { Currencies, RouteParams } from '../../types';

import Loader from '../../components/Loader/Loader';
import ConverterForm from './ConverterForm/ConverterForm';

interface RatesType {
  [key: string]: number;
}

const Converter = () => {
  const { amount, baseCurrency } = useContextState();
  const dispatch = useContextDispatch();

  const { urlCurrency } = useParams<RouteParams>();
  const defaultCurrency: Currencies | null = urlCurrency
    ? (urlCurrency.toUpperCase() as Currencies)
    : null;

  const [ratesDate, setRatesDate] = useState<string>();
  const [rates, setRates] = useState<RatesType>();
  const [isLoading, setIsLoading] = useState(true);

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
     * @todo cache results
     */
    fetchCurrencies();
  }, [baseCurrency]);

  return (
    <div className="box">
      <Helmet>
        <title>{baseCurrency} - Currency Converter - Currently</title>
      </Helmet>
      <div className="converter-header">
        <h1 className="title">Currency Converter</h1>
        {ratesDate ? (
          <p className="subtitle is-italic">Exchange rates on: {ratesDate}</p>
        ) : null}
      </div>

      <ConverterForm />

      {isLoading ? (
        <Loader />
      ) : rates ? (
        <div className="currency-grid">
          {Object.entries(rates).map(([currency, rate]) => {
            if (currency === baseCurrency) return '';
            const tileColor =
              rate > 1.5
                ? 'is-success'
                : rate < 0.8
                ? 'is-danger'
                : 'is-warning';
            return (
              <article
                className={`notification ${tileColor}`}
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
  );
};

export default Converter;
