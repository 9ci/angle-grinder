import angular from 'angular'
import agSelectModule from './agSelect2Module'

var app = angular.module(agSelectModule)

class Select2OptionsClass {
  constructor() {
    return function(options, dataOptions) {
      if (options == null) { options = {} }
      if (dataOptions == null) { dataOptions = {} }
      if (!options.ajax) { options.ajax = {} }

      // build default options
      const defaults = {
        width: 'element',
        initSelection: angular.noop,

        ajax: {
          dataType: 'json',
          url: angular.noop, // dummy url, must be overridden

          data(term, page) {
            if (page == null) { page = 1 }
            const dataDefaults = {
              // search term (query params)
              q: term,

              // sorting and pagination
              sort: 'id',
              order: 'asc',
              max: 20,
              page
            }

            return angular.extend(dataDefaults, dataOptions)
          },

          results(result, page) {
            return {
              results: result.rows,
              more: page < result.total
            }
          }
        },

        // formatters for result and selection
        formatResult(record) { return record.name },
        formatSelection(record) { return record.name }
      }

      const ajax = angular.extend(defaults.ajax, options.ajax)
      options = angular.extend(defaults, options)
      options.ajax = ajax
      return options
    }
  }
}

app.service('Select2Options', Select2OptionsClass)
