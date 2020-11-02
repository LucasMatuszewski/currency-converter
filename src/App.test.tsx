import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

test('Renders loader, load App, then click on Trends link and see Trends Page.', async () => {
  render(<App />);

  expect(screen.getByTestId('loader-element')).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByTestId('loader-element'));

  const trendsLink = await screen.findByRole('link', { name: /trends/i });
  expect(trendsLink).toBeInTheDocument();

  const converterHeader = screen.getByRole('heading', {
    name: /currency converter/i,
  });
  expect(converterHeader).toBeInTheDocument();

  userEvent.click(trendsLink);

  const trendsHeader = await screen.findByRole('heading', {
    name: /currency trends/i,
  });

  expect(trendsHeader).toBeInTheDocument();
  expect(converterHeader).not.toBeInTheDocument();
});
