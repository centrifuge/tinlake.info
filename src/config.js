const process = require('process')

let config = {
  "eth": process.env['ETH_RPC'],
  "graph": "https://api.thegraph.com/subgraphs/name/jennypollack/tinlake-rewards",
}


export default config
