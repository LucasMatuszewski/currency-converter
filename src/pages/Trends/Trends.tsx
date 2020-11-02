import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import './trends.scss';
import { API } from '../../services/api';
import { useContextDispatch, useContextState } from '../../services/context';
import { Currencies, RouteParams } from '../../types';

import Loader from '../../components/Loader/Loader';
import TrendsForm from './TrendsForm/TrendsForm';

interface RatesType {
  [key: string]: {
    [key: string]: number;
  };
}

const Trends = () => {
  const {
    amount,
    baseCurrency,
    convertTo,
    startDate,
    endDate,
  } = useContextState();
  const dispatch = useContextDispatch();

  const [rates, setRates] = useState<RatesType>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      if (!startDate || !endDate) return;
      if (baseCurrency === convertTo) return;
      setIsLoading(true);
      const result = await API.getHistory(
        startDate,
        endDate,
        baseCurrency,
        convertTo
      );
      setRates(result.rates);
      setIsLoading(false);
    };
    /**
     * @todo use ref to check if base has changed, if not don't fetch data again
     * @todo cache results
     */
    fetchCurrencies();
  }, [baseCurrency, convertTo, startDate, endDate]);

  const decimalPoint = 4;
  const startRate =
    rates &&
    startDate &&
    convertTo &&
    rates[startDate] &&
    rates[startDate][convertTo];
  const startAmount = startRate && amount && startRate * amount;
  const startAmountText = startAmount
    ? startAmount.toFixed(decimalPoint)
    : '--';

  const endRate =
    rates &&
    endDate &&
    convertTo &&
    rates[endDate] &&
    rates[endDate][convertTo];
  const endAmount = endRate && amount && endRate * amount;
  const endAmountText = endAmount ? endAmount.toFixed(decimalPoint) : '--';

  const subtraction = startAmount && endAmount && startAmount - endAmount;

  const tileColor = subtraction && subtraction > 0 ? 'is-success' : 'is-danger';

  return (
    <div className="box">
      <Helmet>
        <title>
          {baseCurrency} vs {convertTo} Trends - Currently
        </title>
      </Helmet>
      <div className="trends-header">
        <h1 className="title">Currency Trends</h1>
      </div>

      <TrendsForm />

      {/**
       * @todo Add chart with rates history
       * @todo Fix bad UI styles
       */}

      {isLoading ? (
        <Loader />
      ) : rates ? (
        <div className="trend-grid">
          <article className={`notification ${tileColor}`}>
            <p className="subtitle">
              <strong>
                {amount} {baseCurrency}
              </strong>
              <br />
              {startAmountText} {convertTo} ({startDate})
              <br />
              {endAmountText} {convertTo} ({endDate})
            </p>
            <p className="subtitle">
              {startAmountText} - {endAmountText} =
            </p>
            <p className="title">
              {subtraction ? subtraction.toFixed(decimalPoint) : '--'}{' '}
              {convertTo}
            </p>
          </article>
        </div>
      ) : (
        <p>There was some problem to get currency data</p>
      )}
    </div>
  );
};

export default Trends;
