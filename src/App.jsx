import React, { useEffect } from 'react'

import './App.css'
import logo from './logo.svg'

import { StoreProvider, useStoreActions} from 'easy-peasy';
import { store } from './store';

import { AssetValueAreaChart } from './components/assetvaluechart'
import { OriginationsChart } from './components/originationschart'
import { PoolList } from './components/poollist'
import { TotalNumbers } from './components/totals'

const useInterval = (callback: any, delay: number) => {
  const savedCallback = React.useRef()

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) (savedCallback).current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function DataContainer(props) {
    const loadData = useStoreActions((actions) => actions.loadData);
    useEffect(() => { loadData() }, [loadData])
    useInterval(() => { loadData() }, 1000) // TODO: does not work
    return (props.children)
}

function App() {
    return (
      <StoreProvider store={store}>
        <div className="App">
          <header className="App-header">
            <h1><img src={logo} alt=""/>tinlake.info</h1>
        </header>
        <DataContainer>
           <div className="main-chart">
              <AssetValueAreaChart />
              <OriginationsChart />
           </div>
           <TotalNumbers />
           <PoolList />
        </DataContainer>
        <a className="dapp-link" href="https://tinlake.centrifuge.io">tinlake.centrifuge.io</a>
        </div>
      </StoreProvider>
    )
}

export default App
