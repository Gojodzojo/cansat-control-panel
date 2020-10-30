import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'

declare global {
  interface Window {
    startSimulation: () => Promise<void> 
    pauseSimulation: () => Promise<void>
    resumeSimulation: () => Promise<void>
    pressureFromHeight: (height: number) => Promise<number>
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

fetch("./wasm/main.wasm").then(response =>
  response.arrayBuffer()
).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
  const {pressureFromHeight} = (results.instance.exports as any)
  const t0 = performance.now()
  const val = pressureFromHeight(1)
  const t1 = performance.now()
  console.log(`wasm performance: ${t1 - t0} ${val}`)
}).catch(console.error);

function pressureFromHeight(height: number) {
	return 101325 * Math.pow(1-2.25577 * Math.pow(10, -5) * height, 5.25588) / 100;
}

const test = () => {
  const t0 = performance.now()
  const val = pressureFromHeight(1)
  const t1 = performance.now()
  console.log(`js performance: ${t1 - t0} ${val}`)
}
test()

export const {startSimulation, pauseSimulation, resumeSimulation} = window;
