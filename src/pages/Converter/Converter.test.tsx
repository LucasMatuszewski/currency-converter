import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContextProvider } from '../../services/context';
import Converter from './Converter';

test('Renders loader, then loads 32 Tiles, then change base Currency.', async () => {
  render(
    <Router>
      <ContextProvider>
        <Converter />
      </ContextProvider>
    </Router>
  );
  expect(screen.getByText(/Currency Converter/i)).toBeInTheDocument();

  expect(screen.getByTestId('loader-element')).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByTestId('loader-element'));

  const exchangeRates = await screen.findByText(/Exchange rates/i);
  expect(exchangeRates).toBeInTheDocument();

  const numberOfTiles = (await screen.findAllByRole('article')).length;
  expect(numberOfTiles).toBeLessThanOrEqual(32);

  // two elements with "PLN" text visible (tile and select option)
  const numberOfPLN = screen.getAllByText('PLN').length;
  expect(numberOfPLN).toEqual(2);

  const baseCurrencySelect = screen.getByRole('combobox');
  expect(baseCurrencySelect).toBeInTheDocument();

  userEvent.selectOptions(baseCurrencySelect, 'PLN');

  // after currency changed to PLN a tile with PLN disappears
  const newNumberOfPLN = (await screen.findAllByText('PLN')).length;
  expect(newNumberOfPLN).toEqual(1);
});
