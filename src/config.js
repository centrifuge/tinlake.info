const process = require('process')

let config = {
  "eth": process.env['ETH_RPC'],
  "graphUrl": "https://api.thegraph.com/subgraphs/name/jennypollack/tinlake-rewards",
  "legacyGraphUrl": "https://api.thegraph.com/subgraphs/name/centrifuge/tinlake-v2",
}


export default config
