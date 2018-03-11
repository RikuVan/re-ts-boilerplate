import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from './state'
import { rootEpic } from './state'
import initialState from './state/initialState'

import { createEpicMiddleware } from 'redux-observable'

const epicMiddleware = createEpicMiddleware(rootEpic)

const composeEnhancers =
  (process.env.NODE_ENV === 'development' &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(epicMiddleware))
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
