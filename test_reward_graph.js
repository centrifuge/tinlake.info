const fetch = require('cross-fetch')
const apollo = require('@apollo/client')
const bn = require('bignumber.js')

const wei = new bn.BigNumber("1000000000000000000")

const graphClient = new apollo.ApolloClient({
  link: new apollo.HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/jennypollack/tinlake-rewards",
    fetch
  }),
  cache: new apollo.InMemoryCache()
})

const block = 11577500-5760
const blockYday = 11577500-5760*2
const jenny = "0xb9d64860f0064dbfb9b64065238dda80d36fca17"
const alice = "0x0f90c0e268d57acc795e4d686f2d3dd896387fbd----"

let q = apollo.gql`
{
  tokenBalances (block: {number: ${block}}, where: {owner_in: ["${jenny}", "${alice}"]}) {
    owner { id }
    token {
      symbol
    }
    balance
    supplyAmount
    pendingSupplyCurrency
  }
  rewardBalance (block: {number: ${block}}, id: "${jenny}") {
    id
    totalRewards
  }
  rewardDayTotals(block: {number: ${block}}, first:1, skip: 1, orderBy:id, orderDirection:desc) {
    toDateAggregateValue
    todayReward
    todayValue
    toDateRewardAggregateValue
  }
}`
let yq = apollo.gql`
{
  tokenBalances (block: {number: ${blockYday}}, where: {owner_in: ["${jenny}", "${alice}"]}) {
    owner { id }
    token {
      symbol
    }
    balance
    supplyAmount
    pendingSupplyCurrency
  }
  rewardBalance (block: {number: ${blockYday}}, id: "${jenny}") {
    id
    totalRewards
  }
  rewardDayTotals(block: {number: ${blockYday}}, first:1, skip: 1, orderBy:id, orderDirection:desc) {
    id
    toDateAggregateValue
    todayReward
    todayValue
    toDateRewardAggregateValue
  }
}`


Promise.all([
graphClient.query({query: q}).then((query) => {
  console.log("\n\nTODAY")
  console.log(query.data.rewardBalance.totalRewards)
  query.data.tokenBalances.forEach((tb) => {
    console.log(tb.token.symbol, tb.owner.id)
    console.log("supply", tb.supplyAmount)
    console.log("pending", tb.pendingSupplyCurrency)
    console.log("balance", tb.balance)
  })
  return query
}),
graphClient.query({query: yq}).then((query) => {
  console.log("\n\nYDAY")
  console.log(query.data.rewardBalance.totalRewards)
  query.data.tokenBalances.forEach((tb) => {
    console.log(tb.token.symbol, tb.owner.id)
    console.log("supply", tb.supplyAmount)
    console.log("pending", tb.pendingSupplyCurrency)
    console.log("balance", tb.balance)
  })
  return query
})
]).then((res) => {
  console.log('--------------')
  let tR = new bn.BigNumber(res[0].data.rewardBalance.totalRewards)
  let yR = new bn.BigNumber(res[1].data.rewardBalance.totalRewards)
  console.log(tR.minus(yR).div(new bn.BigNumber("4200000000000000")).toString())
  console.log(res[0].data.rewardDayTotals[0])
  console.log(res[1].data.rewardDayTotals[0])
  let RDT = new bn.BigNumber(res[0].data.rewardDayTotals[0].toDateRewardAggregateValue).div(wei)
  let yRDT = new bn.BigNumber(res[1].data.rewardDayTotals[0].toDateRewardAggregateValue).div(wei)
  console.log(RDT.minus(yRDT).toString())
})

