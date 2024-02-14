
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";

import loginReducer from "./reducers/loginReducer";

const createReducer = asyncReducers => combineReducers({
  login: loginReducer,
  ...asyncReducers
})


const initializeStore = () => {

  const store = createStore(
    createReducer(),
    applyMiddleware(thunk)
  )

  store.injectReducer = (key, reducer) => {
    store.asyncReducers = {};
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createReducer(store.asyncReducers));

    return store;
  }

  return store;

}

export default initializeStore;
