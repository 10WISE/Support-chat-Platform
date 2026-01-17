import { combineReducers } from 'redux';
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';

import { appReducer } from './app';
import { connHubReducer } from './connHub';

export const rootReducer = combineReducers({
  app: appReducer,
  connHub: connHubReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
