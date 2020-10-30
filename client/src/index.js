import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Store from './Store'

ReactDOM.render(
  <Store>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Store>,
  document.getElementById('root')
)
