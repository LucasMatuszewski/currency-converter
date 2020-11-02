import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Currencies } from '../types';

// With TS we get suggestions and errors without 'constants' file with freezed 'types' object:
type Action =
  | { type: 'SET_BASE'; baseCurrency: Currencies }
  | { type: 'SET_AMOUNT'; amount: number | undefined }
  | { type: 'SET_START_DATE'; startDate: string }
  | { type: 'SET_END_DATE'; endDate: string }
  | { type: 'SET_CONVERT_TO'; convertTo: Currencies };

type Dispatch = (action: Action) => void;
type State = {
  baseCurrency: Currencies;
  amount: number | undefined;
  startDate?: string;
  endDate?: string;
  convertTo?: Currencies;
  favorite?: Currencies[];
};
type ContextProviderProps = { children: React.ReactNode };

// Separation for Efficiency, according to Kent C. Dodds:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

// for bigger App I would move this Reducer to separate file
function contextReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_BASE': {
      return {
        ...state,
        baseCurrency: action.baseCurrency,
      };
    }
    case 'SET_AMOUNT': {
      return {
        ...state,
        amount: action.amount,
      };
    }
    case 'SET_START_DATE': {
      return {
        ...state,
        startDate: action.startDate,
      };
    }
    case 'SET_END_DATE': {
      return {
        ...state,
        endDate: action.endDate,
      };
    }
    case 'SET_CONVERT_TO': {
      return {
        ...state,
        convertTo: action.convertTo,
      };
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

/**
 * @todo use current date as endDate and startDate as endDate minus 30 days
 * @todo display only dates with available currency rates ?
 */

const defaultState: State = {
  baseCurrency: 'EUR',
  convertTo: 'USD',
  amount: 1,
  startDate: '2020-01-02',
  endDate: '2020-10-30',
};

function ContextProvider({ children }: ContextProviderProps) {
  const storageKey = 'userState';
  const persistedState = window.localStorage.getItem(storageKey);
  const initialState = persistedState
    ? JSON.parse(persistedState)
    : defaultState;
  const [state, dispatch] = useReducer(contextReducer, initialState);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useContextState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useContextState must be used within a ContextProvider');
  }
  return context;
}

// instead of actions we use dispatch directly with less abstraction/boilerplate
function useContextDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useContextDispatch must be used within a ContextProvider');
  }
  return context;
}

export { ContextProvider, useContextState, useContextDispatch };
