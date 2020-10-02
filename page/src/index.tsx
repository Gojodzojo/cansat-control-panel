import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'

declare global {
  interface Window {
    add: (a: number, b: number) => Promise<number>;
  }
}

export const {add} = window;


ReactDOM.render(
  <React.StrictMode> <App /> </React.StrictMode>,
  document.getElementById('root')
)
