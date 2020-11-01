import React, { createContext, useReducer, useContext } from 'react';
import { Currencies } from '../types';

// With TS we get suggestions and errors without 'constants' file with freezed 'types' object:
type Action =
  | { type: 'SET_BASE'; baseCurrency: Currencies }
  | { type: 'SET_AMOUNT'; amount: number | undefined }
  | { type: 'SET_START_DATE'; startDate: string }
  | { type: 'SET_END_DATE'; endDate: string };

type Dispatch = (action: Action) => void;
type State = {
  baseCurrency: Currencies;
  amount: number | undefined;
  startDate?: string;
  endDate?: string;
  convertTo?: Currencies[];
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
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

const initialState: State = {
  baseCurrency: 'EUR',
  amount: 1,
};

function ContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(contextReducer, initialState);

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
