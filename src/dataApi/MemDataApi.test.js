/* eslint-disable */
import _ from 'lodash'
import MemDataApi from './MemDataApi'

describe('MemDataApi', () => {
  const dataJson = `[
    {"id":1,"refnum":"762341","tranDate":"2020-05-11","customer":{"id":7,"num":"TO7272","name":"Topicshots"},"amount":3240.77,"state":{"id":1,"name":"Closed"},"comments":"In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.","hasTax":true,"ext":{"orderNum":"3838","bolNum":"PO-2404"}},
    {"id":2,"refnum":"244928","tranDate":"2020-05-10","customer":{"id":10,"num":"WI4195","name":"Wikizz"},"amount":8393.73,"state":{"id":0,"name":"Open"},"comments":"In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.","hasTax":false,"ext":{"orderNum":"8708","bolNum":"PO-6434"}},
    {"id":3,"refnum":"656522","tranDate":"2020-08-20","customer":{"id":2,"num":"YO7612","name":"Yodo"},"amount":4435.2,"state":{"id":0,"name":"Open"},"comments":"Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.","hasTax":true,"ext":{"orderNum":"8001","bolNum":"PO-9186"}},
    {"id":4,"refnum":"825461","tranDate":"2020-10-31","customer":{"id":8,"num":"QU9909","name":"Quatz"},"amount":2421.53,"state":{"id":1,"name":"Closed"},"comments":"Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.","hasTax":false,"ext":{"orderNum":"3325","bolNum":"PO-2363"}}
  ]`
  const data = JSON.parse(dataJson)
  const api = new MemDataApi(JSON.parse(dataJson))

  describe('qbe', function() {
    it('query by example simple single', function() {
      const result = api.qbe(data, {refnum: '762', amount: 3240.77})
      // console.log("result", result)
      expect(result.length).toEqual(1)
    })

    it('playing with isMatchWith', function() {

      var match = {refnum: '762', amount: 3240.77, customer:{id:7}}

      const hit = _.isMatchWith(data[0], match, (objValue, srcValue) => {
        console.log("objValue", objValue)
        console.log("srcValue", srcValue)
        if(_.isString(objValue) && _.isString(srcValue)){
          return objValue.toLowerCase().includes(srcValue.toLowerCase())
        }
        return undefined
      })
      console.log("hit", hit)
      expect(hit).toBe(true)
    })
  })

  describe('searching', function() {

    it('search', async function() {
      const params = {
        max: 20,
        order: "asc",
        page: 1,
        sort: "id",
        _search: false
      }
      const result = await api.search(params)
      // console.log("result", result)
      expect(result.data.length).toEqual(4)
      expect(result.page).toEqual(1)
      expect(result.records).toEqual(4)
      expect(result.total).toEqual(1)
    })

    it('q search', async function() {
      const params = {
        max: 20,
        order: "asc",
        page: 1,
        sort: "id",
        _search: true,
        filters: '{"qSearch":"762"}'
      }
      const result = await api.search(params)
      expect(result.data.length).toEqual(1)
    })

    it('filter qSearch', function() {
      const params = {
        filters: '{"qSearch":"762341"}'
      }
      const result = api.filter(data, params)
      expect(result.length).toEqual(1)
    })

    it('q search simple', async function() {
      const params = {
        q: "762341"
      }
      const result = await api.search(params)
      expect(result.data.length).toEqual(1)
    })

    it('searchAny function', function() {
      const result = api.searchAny(data, "762341")
      expect(result.length).toEqual(1)
    })
  })

  describe('picklist', function() {
    it('should return paged data', async function() {
      const result = await api.picklist()
      //console.log("result", result)
      expect(result.data.length).toEqual(4)
    })
  })

})
