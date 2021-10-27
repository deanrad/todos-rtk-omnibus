import React from 'react'
import { render } from 'react-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'
import { saveTodoService } from 'services/saveTodo'

const store = configureStore({
  reducer: rootReducer,
  middleware: mw => mw().concat(saveTodoService.middleware)
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
