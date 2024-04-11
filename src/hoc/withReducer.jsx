import React from 'react';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
/**
 * HOC for adding dynamic reducers to the global store.
 *
 * Typical usage:
 *   export default withReducer('myComponent', reducer)(MyComponent)
 *
 * Thoughts:
 *   This uses Context which has all of the warnings in the React
 *   docs to not use, but it's still documented and works here.
 *   If context seems like a bad idea, I *think* you could instead
 *   use react-redux.connect here instead. Once connected, this
 *   HOC would have access to store as a prop. Once you have
 *   access to store, you have access to injectReducer. That's the
 *   main goal, get access to the store object.
 */

const withReducer = (key, reducer) => (WrappedComponent) => {
    const Extended = (props, context) => {
        const { store } = useContext(ReactReduxContext);
        // Here's where we add the new reducer.
        // See initilizeStore for details on how this works.
        store.injectReducer(key, reducer);
        // let component = <WrappedComponent {...props} />;

        // Now just give back the original component as-is.
        return <WrappedComponent {...props} />;
    };

    return Extended;
};

export { withReducer };
