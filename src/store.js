import { gql } from '@apollo/client'
import { graphClient, legacyGraphClient, currentGraphClient } from './graphsource'
import { thunk, action, createStore } from 'easy-peasy'
import { BigNumber } from 'bignumber.js'
import { parseDecimal } from './format'
import config from './config'

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
        let pools = query.data.pools.filter((p) => config.ignorePools.indexOf(p.id) < 0)
        return pools.map((pool) => {
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
        let pools = query.data.pools.filter((p) => config.ignorePools.indexOf(p.id) < 0)
        return pools.map((pool) => {
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


const loanData = gql`
query {
  loans {
    id
    pool {
      id
    }
    opened
    borrowsAggregatedAmount
  }
}
`

const secondsInWeek = 60*60*24*7
const getWeek = (d) => {
    return secondsInWeek*Math.floor(d/secondsInWeek)
}

loaders.push((actions) => {
  return currentGraphClient.query({query:loanData}).then((query) => {
    let loans = query.data.loans.filter((l) => config.ignorePools.indexOf(l.pool.id) < 0)
    loans = loans.map((l) => {
      return {
        key: l.id,
        dateOpened: new Date(parseInt(l.opened)*1000),
        amount: parseDecimal(l.borrowsAggregatedAmount),
      }})
    let start = getWeek(1588707251+secondsInWeek*8)
    let stop  = getWeek(new Date().getTime()/1000)
    let empty = {}
    for (let i = start; i <= stop; i+=secondsInWeek) {
      empty[i] = {date: i, count:0, amount: new BigNumber('0')}
    }

    let weeks = loans.reduce((w, l) => {
      let date = getWeek(l.dateOpened.getTime()/1000)
      if (date < start) { return w}
      let week = w[date]
      week.amount = week.amount.plus(l.amount)
      week.count += 1
      w[date] = week
      return w
    }, empty)
    actions.set({key: 'weeklyOriginations', value: Object.values(weeks)})
    actions.set({key: 'loans', value: loans})
  })
})

const store = createStore({
  pools: {},
  loans: {},
  weeklyOriginations: [],
  dailyAssetValue: { days:[]},
  set: action((state, payload) => {
    state[payload.key] = payload.value;
  }),
  loadData: thunk(async (actions, payload) => {
    return Promise.all(loaders.map((fn) => { return fn(actions) }))
  }),
})

export { store, loaders }
