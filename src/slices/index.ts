import { combineReducers } from 'redux';
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';

import { appReducer } from './app';
import { connectHubReducer } from './connectHub';

export const rootReducer = combineReducers({
  app: appReducer,
  connectHub: connectHubReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
