import React, { useState } from 'react';

import { useContextDispatch, useContextState } from '../../../services/context';
import { Currencies } from '../../../types';

type ErrorsType = {
  amount?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
};

const TrendsForm = () => {
  const {
    amount,
    baseCurrency,
    convertTo,
    startDate,
    endDate,
  } = useContextState();
  const dispatch = useContextDispatch();
  const [errors, setErrors] = useState<ErrorsType>({});

  /**
   * @todo use better validation for dates and use some custom date picker
   * @todo refactor form to be more generic and to use the same form for Converter
   * @todo use objects [{iso: 'CNY', name: 'Chinese Yuan Renminbi' }]
   * @todo add all currencies
   * @todo add currency name on Tiles
   */
  const currenciesArray: Currencies[] = [
    'CNY',
    'EUR',
    'GBP',
    'PLN',
    'SEK',
    'USD',
  ];

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const amountValue = event.target.value
      ? parseFloat(event.target.value)
      : false;
    if (typeof amountValue !== 'number' || isNaN(amountValue)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        amount: 'Amount has to be a number',
      }));
      dispatch({ type: 'SET_AMOUNT', amount: undefined });
      return;
    }

    dispatch({ type: 'SET_AMOUNT', amount: amountValue });
    setErrors(prevErrors => ({
      ...prevErrors,
      amount: '',
    }));
  };

  const handleBaseCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    dispatch({
      type: 'SET_BASE',
      baseCurrency: event.target.value as Currencies,
    }); // temporary fix "as"

    // To prevent converting to the same currency:
    if (convertTo === event.target.value) {
      dispatch({
        type: 'SET_CONVERT_TO',
        convertTo: event.target.value === 'EUR' ? 'USD' : 'EUR',
      });
    }
  };
  const handleConvertToChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    dispatch({
      type: 'SET_CONVERT_TO',
      convertTo: event.target.value as Currencies,
    }); // temporary fix "as"
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch({
      type: 'SET_START_DATE',
      startDate: event.target.value,
    });
  };
  const handleEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch({
      type: 'SET_END_DATE',
      endDate: event.target.value,
    });
  };

  return (
    <form noValidate className="block">
      <div className="field has-addons has-addons-centered">
        <p className="control">
          <input
            className={`input${errors.amount ? ' is-danger' : ''}`}
            name="amount"
            placeholder="Amount"
            id="amount"
            type="number"
            required
            onChange={handleAmountChange}
            value={amount ? amount : ''}
          />
          {errors.amount ? (
            <p className="help is-danger">{errors.amount}</p>
          ) : null}
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
              onChange={handleBaseCurrencyChange}
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
        <p className="control">
          <span
            className={`select is-fullwidth${
              errors.currency ? ' is-danger' : ''
            }`}
          >
            <select
              name="convertTo"
              id="convertTo"
              required
              onChange={handleConvertToChange}
              value={convertTo}
            >
              {currenciesArray.map((currency: Currencies) =>
                currency !== baseCurrency ? (
                  <option key={`key-${currency}`} value={currency}>
                    {currency}
                  </option>
                ) : null
              )}
            </select>
          </span>
        </p>
      </div>

      <div className="field has-addons has-addons-centered">
        <p className="control">
          <input
            className={`input${errors.startDate ? ' is-danger' : ''}`}
            name="startDate"
            placeholder="Start Date"
            id="startDate"
            type="date"
            min="2000-01-01"
            required
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleStartDateChange}
            value={startDate ? startDate : ''}
          />
          {errors.startDate ? (
            <p className="help is-danger">{errors.startDate}</p>
          ) : null}
        </p>
        <p className="control">
          <input
            className={`input${errors.endDate ? ' is-danger' : ''}`}
            name="endDate"
            placeholder="Start Date"
            id="endDate"
            type="date"
            min={startDate}
            required
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleEndDateChange}
            value={endDate ? endDate : ''}
          />
          {errors.endDate ? (
            <p className="help is-danger">{errors.endDate}</p>
          ) : null}
        </p>
      </div>
    </form>
  );
};

export default TrendsForm;
