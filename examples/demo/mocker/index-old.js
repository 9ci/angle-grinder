//import {invoices, countriesWithId} from '../src/data/selects'
const data = require('../src/data/selects')
const invoices = require('../src/data/invoices')
const delay = require('mocker-api/utils/delay')
const _ = require('lodash');

const noProxy = process.env.NO_PROXY === 'true'

const pagination = (rows, query) => {
  return {
    rows: rows.slice((query.page - 1) * query.max, query.page * query.max), page: query.page,
    records: rows.length,
    total: Math.floor(rows.length / query.max) + (rows.length % query.max === 0 ? 0 : 1)
  }
};

const gridOptions = () => {
  const colModel = () => [{
    name: 'id',
    label: 'Inv No',
    width: 60,
    sorttype: 'int',
    align: 'right'
  },
  {
    name: 'customer.name',
    label: 'Customer',
    formatter: 'editActionLink'
  },
  {
    name: 'invoiceDate',
    label: 'Date',
    width: 100,
    formatter: 'date'
  },
  {
    name: 'amount',
    label: 'Amount',
    width: 80,
    formatter: 'currency'
  },
  {
    name: 'note',
    label: 'Note'
  },
  {
    name: 'complete',
    label: 'Complete',
    width: 80,
    fixed: true,
    align: 'center',
    formatter: 'okIcon'
  }
  ]

  return function(options) {
    if (options == null) {
      options = {}
    }
    const defaults = {
      colModel: colModel(),
      sortname: 'id',
      shrinkToFit: true
    }

    return { ...defaults, ...options }
  }
}

const findById = (data, id) => {
  numId = parseInt(id)
  return data.find((obj) => obj.id === numId)
}

const countriesWithId = data.countriesWithId()

const proxy = {
  'GET /countries/picklist': (req, res) => {
    const q = req.query.q
    let rows = countriesWithId
    if(q) {
      rows = rows.filter(country =>  country.name.toLowerCase().indexOf(q.toLowerCase()) > -1)
    }

    return res.json({ page: 1, records: 3, rows: rows, total: 1 })
  },

  'GET /users': (req, res) => {
    const q = req.query.q
    let rows = data.people
    if(q) {
      rows = rows.filter(user =>  user.name.toLowerCase().indexOf(q.toLowerCase()) > -1)
    }

    return res.json({ page: 1, records: 3, rows: rows, total: 1 })
  },

  // Priority processing.
  'GET /invoices': (req, res) => {
    let result = invoices
    // console.log('req', req)
    // console.log('res', res)
    // console.log('invoice get', req.params)
    const { query } = req
    console.log('query', query)
    if (query._search && query._search === 'true') {
      const filters = JSON.parse(query.filters)
      if (filters.hasOwnProperty('complete')) {
        result = result.filter(inv => inv.complete === (filters.complete === 'true'))
      }
    }
    if (query.sort) {
      result = _.orderBy(result, query.sort , query.order)
    }
    return res.json(pagination(result, query))
  },
  'GET /invoices/get/:id': (req, res) => {
    console.log('-1--->', req.params)
    return res.json(findById(invoices, req.params.id))
  },
  'POST /invoices/delete/:id': (req, res) => {
    console.log('invoice delete', req.params)
    const row = findById(invoices, req.params.id)
    const index = invoices.indexOf(row)
    if (index > -1) {
      invoices.splice(index, 1)
    }
    return res.json(row)
  },
  'POST /invoices/update/:id': (req, res) => {
    console.log('invoice update', req.params)
    const row = findById(invoices, req.params.id)
    const index = invoices.indexOf(row)
    if (index > -1) {
      invoices[index] = { ...invoices[index], ...req.body }
    }
    return res.json(invoices[index])
  },
  'POST /invoices/save': (req, res) => {
    console.log('invoice save', req.params)
    const id = invoices.slice(-1).id + 1
    const newRow = { ...req.body, id: id }
    invoices.push(newRow)
    return res.json(newRow)
  },
  'POST /invoices/massUpdate': (req, res) => {
    console.log('invoice massUpdate', req.body)
    const ids = req.body.ids
    const data = req.body.data
    const updData = ids.map(id => {
      const inv = findById(invoices, id)
      inv.note = data.note
      return inv
    })
    return res.json({data: updData, errors: []})
  },

  'GET /api/invoices/gridOptions': (req, res) => {
    console.log('invoice get grid OPtions', req.params)
    return res.json(gridOptions()())
  },

  'GET /api/invoices': (req, res) => {
    let result = invoices
    console.log('invoice get', req.params)
    const { query } = req
    if (query._search && query._search === 'true') {
      const filters = JSON.parse(query.filters)
      if (filters.hasOwnProperty('complete')) {
        result = result.filter(inv => inv.complete === (filters.complete === 'true'))
      }
    }
    return res.json(pagination(result, query))
  },
  'GET /api/invoices/:id': (req, res) => {
    console.log('-1--->', req.params)
    return res.json(findById(invoices, req.params.id))
  },
  'DELETE /api/invoices/:id': (req, res) => {
    console.log('invoice delete', req.params)
    const row = findById(invoices, req.params.id)
    const index = invoices.indexOf(row)
    if (index > -1) {
      invoices.splice(index, 1)
    }
    return res.json(row)
  },
  'PUT /api/invoices/:id': (req, res) => {
    console.log('invoice update', req.params)
    const row = findById(invoices, req.params.id)
    const index = invoices.indexOf(row)
    if (index > -1) {
      invoices[index] = { ...invoices[index], ...req.body }
    }
    return res.json(invoices[index])
  },
  'POST /api/invoices/save': (req, res) => {
    console.log('invoice save', req.params)
    const id = invoices.slice(-1).id + 1
    const newRow = { ...req.body, id: id }
    invoices.push(newRow)
    return res.json(newRow)
  },
  'POST /api/invoices/massUpdate': (req, res) => {
    console.log('invoice massUpdate', req.body)
    const ids = req.body.ids
    const data = req.body.data
    const updData = ids.map(id => {
      const inv = findById(invoices, id)
      inv.note = data.note
      return inv
    })
    return res.json({data: updData, errors: []})
  }
}
module.exports = (noProxy ? {} : delay(proxy, 100))
// module.exports = proxy;
