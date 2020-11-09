// import logo from './logo.svg';
import React from 'react';
import './App.css';
import mainnetPools from '@centrifuge/tinlake-pools-mainnet'
//import contractsABI from './dapp.sol.json'
import {gql, useQuery} from '@apollo/client'
import Chart from 'chart.js'
import ethers from 'ethers'

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



let parseDecimal = (str) => {
  return ethers.BigNumber.from(str).div(ethers.BigNumber.from("1000000000000000000")).toString();
}


function prepareData (data) {
  let labels = []
  let assetValue = []
  let reserve = []
  const last = data.days.length-1;
  data.days.forEach((d, i) => {
    if (last === i) { return }
    labels.push(d.id)
    assetValue.push(parseDecimal(d.assetValue))
    reserve.push(parseDecimal(d.reserve))
  })

  return {
    labels: labels,
    datasets: [
      {
        label: "Asset Value",
        data: assetValue,
        backgroundColor: 'rgba(20, 255, 20, 0.5)'
      },
      {
        label: "Reserve",
        data: reserve,
        backgroundColor: 'rgba(20, 20, 255, 0.5)'
      },
    ]
  }
}


class AssetValueAreaChart extends React.Component {
    chartRef = React.createRef();
    buildChart() {
      const _ref = this.chartRef.current.getContext("2d");
      new Chart(_ref, {
          type: "line",
          data: prepareData(this.props.data),
          options: {
            scales: {
              yAxes: [{
                stacked: true
              }]
            }
          }
      });
    }
    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }
    render() {
        return (
            <div>
                <canvas
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

function App() {
    const {loading, data} = useQuery(dailyPool)
    if (loading) {
      return (<h1>Loading</h1>)
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1>tinlake.info</h1>
        </header>
      <AssetValueAreaChart data={data}/>
      </div>
    )
}

export default App;
