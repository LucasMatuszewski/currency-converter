import React, { useState } from 'react';
import { useContextDispatch, useContextState } from '../../../services/context';
import { Currencies } from '../../../types';

type ErrorsType = {
  amount?: string;
  currency?: string;
};

const ConverterForm = () => {
  const { amount, baseCurrency } = useContextState();
  const dispatch = useContextDispatch();
  const [errors, setErrors] = useState<ErrorsType>({});

  /**
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
            // min="1"
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
            }}
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
      </div>
    </form>
  );
};

export default ConverterForm;
