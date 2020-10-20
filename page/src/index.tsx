import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'

declare global {
  interface Window {
    startSimulation: () => Promise<void> 
    pauseSimulation: () => Promise<void>
    resumeSimulation: () => Promise<void>
  }

  export interface Array<T> {
    last(): T
  }
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

ReactDOM.render(
  <React.StrictMode> <App /> </React.StrictMode>,
  document.getElementById('root')
)

export const {startSimulation, pauseSimulation, resumeSimulation} = window;
