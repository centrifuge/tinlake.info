import React, { useEffect } from 'react'

import './App.css'
import logo from './logo.svg'

import { StoreProvider, useStoreActions} from 'easy-peasy';
import { store } from './store';


import { gql, useQuery } from '@apollo/client'
//import { toDAINumberFormat, parseDecimal, parseDate } from './format'
//
import { AssetValueAreaChart} from './components/assetvaluechart'
import { PoolList } from './components/poollist'

//import mainnetPools from '@centrifuge/tinlake-pools-mainnet'
//function loadPools() {
//  return mainnetPools.filter((pool) => pool.version == 3 && pool.addresses != null);
//}

const dailyPool = gql`
query {
  days {
    id
    reserve
    assetValue
  }
}`

function App() {
    const {loading, data} = useQuery(dailyPool)
    const loadData = useStoreActions((actions) => actions.loadData);
    useEffect(() => { loadData() }, [])
    if (loading) {
      return (<h1>Loading</h1>)
    }
    return (
      <StoreProvider store={store}>
        <div className="App">
          <header className="App-header">
            <h1><img src={logo} alt=""/>tinlake.info</h1>
        </header>
           <AssetValueAreaChart data={data}/>
           <PoolList />
        <a href="https://tinlake.centrifuge.io">tinlake.centrifuge.io</a>
        </div>
      </StoreProvider>
    )
}

export default App
