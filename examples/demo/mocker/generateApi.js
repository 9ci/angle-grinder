const _ = require('lodash');
const MemDataApi = require('../../../src/dataApi/MemDataApi');
const REST_DELAY = 500

function generateApi(epoint, data) {
  const store = new MemDataApi(data, REST_DELAY)
  return makeMap(epoint, store)
}

module.exports = generateApi

function makeMap(epoint, api) {
  return {
    [`GET /api/${epoint}/:id`]: (req, res) => {
      // console.log("get invoice id params", req.params)
      api.get(req.params.id)
      .then((data) => {
        return res.json(data)
      })
    },

    [`GET /api/${epoint}`]: (req, res) => {
      // console.log("get invoice req.query  ", req.query)
      const { query } = req
      api.search(query)
      .then((data) => {
        // console.log("get invoice data", data)
        return res.json(data)
      })
    },

    [`GET /api/${epoint}/pickList`]: (req, res) => {
      // console.log("get pickList req.query  ", req.query)
      const { query } = req
      api.pickList(query)
      .then((data) => {
        // console.log("get invoice data", data)
        return res.json(data)
      })
    },

    [`POST /api/${epoint}`]: (req, res) => {
      // console.log('PUT /api/invoice req.body', req.body)
      const { body } = req
      api.post(body)
      .then((data) => {
        // console.log("POST invoice data", data)
        return res.json(data)
      })
    },

    [`PUT /api/${epoint}`]: (req, res) => {
      // console.log('PUT /api/invoice req.body', req.body)
      const { body } = req
      api.put(body)
      .then((data) => {
        // console.log("PUT invoice data", data)
        return res.json(data)
      })
    },

    [`PATCH /api/${epoint}/massUpdate`]: (req, res) => {
      // console.log('PUT /api/invoice req.body', req.body)
      const { body } = req
      api.massUpdate(body)
      .then((data) => {
        // console.log("PUT invoice data", data)
        return res.json(data)
      })
    },

    [`DELETE /api/${epoint}`]: (req, res) => {
      // console.log("get invoice id params", req.params)
      api.remove(req.params.id)
      .then(() => {
        return res.status(204).end()
      })
    }
  }
}
