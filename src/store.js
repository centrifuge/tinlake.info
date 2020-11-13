import { gql } from '@apollo/client'
import { graphClient, legacyGraphClient } from './graphsource'
import { thunk, action, createStore } from 'easy-peasy'
import { parseDecimal } from './format'

const loaders = []

const v2PoolsQuery = gql`
query {
  pools {
    id
    shortName
    totalDebt
    totalRepaysAggregatedAmount
  }
}`
const poolsQuery = gql`
query {
  pools {
    id
    shortName
    assetValue
    reserve
    totalRepaysAggregatedAmount
  }
}
`
loaders.push((actions) => {
    return Promise.all([
      legacyGraphClient.query({query: v2PoolsQuery }).then((query) => {
        return query.data.pools.map((pool) => {
          let totalDebt = parseDecimal(pool.totalDebt)

          return {
            key: pool.id,
            name: pool.shortName,
            assetValue: totalDebt,
            poolSize: totalDebt,
            reserve: parseDecimal('0'),
            totalOriginated: parseDecimal(pool.totalRepaysAggregatedAmount).plus(totalDebt),
          }
        })
      }),
      graphClient.query({query: poolsQuery}).then((query) => {
        return query.data.pools.map((pool) => {
          let assetValue = parseDecimal(pool.assetValue)
          let reserve = parseDecimal(pool.reserve)
          let poolSize = assetValue.plus(reserve)
          return {
            key: pool.id,
            name: pool.shortName,
            assetValue: assetValue,
            reserve: reserve,
            poolSize: poolSize,
            totalOriginated: parseDecimal(pool.totalRepaysAggregatedAmount).plus(assetValue)
          }
        })
      })]).then((res) => {
        let pools = {}
        res[0].forEach((p) => {pools[p.key] = p})
        res[1].forEach((p) => {pools[p.key] = p})
        actions.set({key: 'pools', value: pools})
      })
})

const dailyAssetValue = gql`
query {
  days {
    id
    reserve
    assetValue
  }
}`

loaders.push((actions) => {
    return graphClient.query({query: dailyAssetValue}).then((query) => {
      actions.set({key:'dailyAssetValue', value: query.data})
    })
})

const store = createStore({
  pools: {},
  dailyAssetValue:{days:[]},
  set: action((state, payload) => {
    state[payload.key] = payload.value;
  }),
  loadData: thunk(async (actions, payload) => {
    return Promise.all(loaders.map((fn) => { return fn(actions) }))
  }),
})

export { store, loaders }
