import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

import loginReducer from './reducers/loginReducer';
import userInfoReducer from './reducers/userreducer/userInforReducer';

const createReducer = (asyncReducers) =>
    combineReducers({
        login: loginReducer,
        userInfoReducer: userInfoReducer,
        ...asyncReducers,
    });

const initializeStore = () => {
    const store = createStore(createReducer(), applyMiddleware(thunk));

    // Creates a convenient method for adding reducers later
    // See withReducer.js for this in use.

    store.injectReducer = (key, reducer) => {
        store.asyncReducers = {};
        store.asyncReducers[key] = reducer;
        store.replaceReducer(createReducer(store.asyncReducers));

        return store;
    };

    return store;
};

export default initializeStore;
