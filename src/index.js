import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { shipsApp } from './Reducers/index'
import {asyncDispatchMiddleware} from './Middleware/asyncDispatchMiddleware'

let store = createStore(shipsApp, applyMiddleware(asyncDispatchMiddleware));

ReactDOM.render(
  <Provider store={store}> 
    <App />
  </Provider>, 
  document.getElementById('root'));

