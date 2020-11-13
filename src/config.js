const process = require('process')

let config = {
  "eth": process.env['ETH_RPC'],
  "graphUrl": "https://api.thegraph.com/subgraphs/name/jennypollack/tinlake-v3",
  "legacyGraphUrl": "https://api.thegraph.com/subgraphs/name/centrifuge/tinlake-v2",
  "currentGraphUrl": "https://api.thegraph.com/subgraphs/name/centrifuge/tinlake",
  "ignorePools": ["0x05597dd9b8e1d4fdb44eb69d20bc3a2feef605e8"]
}


export default config
