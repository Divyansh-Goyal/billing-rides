import { createStore, applyMiddleware } from 'redux';
import  rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

export const configureStore = () => {
  const middlewares = [thunk];
  const storeEnhancer = composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(rootReducer, storeEnhancer);
  return store;
};

// Create and export the store instance using the configureStore function
export const store = configureStore();

