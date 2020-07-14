//import controller from './listCtrl'
import template from './list.html'
import BaseListCtrl from 'angle-grinder/src/ng/gridz/list/BaseListCtrl'
import buildOptions from "../basicGrid/listCtrlOptions"
import restStoreApi from '../../store/RestStoreApi'
import Swal from 'angle-grinder/src/tools/swal'
import toast from 'angle-grinder/src/tools/toast'
import _ from 'lodash'

class ListCtrl extends BaseListCtrl {
  isLoaded = false

  editFormTpl = require('./formlyDialog.html')
  massUpdateTpl = require('../basicGrid/templates/massUpdateForm.html')

  // static $inject = _.union(super.$inject, ['restDataStore', '$timeout'])

  constructor(...args) {
    super(...args)
    this.dataApi = restStoreApi.invoice
  }

  $onInit() {
    this.doConfig()
  }

  async doConfig(){
    let cfg = await restStoreApi.appConfig("invoice")
    cfg.gridOptions.datatype = (params) => this.gridLoader(params)
    cfg.toolbarOptions.scope = () => this.$scope
    _.defaults(this, cfg)
    this.isConfigured = true

    this.cfg = {
      editForm: [
        {
          key: 'customer',
          type: 'select',
          templateOptions: {
            label: 'Customer',
            required: true,
            placeholder: 'Customer select',
            dataApiKey: 'customer'
          }
        },
        {
          key: 'refnum',
          type: 'input',
          templateOptions: {
            label: 'Ref #',
            required: true,
            placeholder: 'Invoice or Memo Num'
          }
        },
        {
          key: 'comments',
          type: 'input',
          templateOptions: {
            placeholder: 'Comments or Note'
          }
        }
      ]
    }
  }

  fireToolbarAction(btnItem, event) {
    super.fireToolbarAction(btnItem, event)
    // if btnItem.key is the same name as function then it will be fired
    if(btnItem.key === 'showSelected') this.displaySelectedRowsData()
  }

  displaySelectedRowsData() {
    console.log("displaySelectedRowsData")
    this.selectedRowsData = this.gridCtrl.getSelectedRows()
  }

  // these are called because the super.fireToolbarAction will look for same function name
  // as the key
  import() {
    console.log("import")
    toast.success('import something')
  }

  ptp() {
    toast.success('ptp')
  }
}

export default angular
  .module('ag.demo.basicRestGridDemo', [])
  .component('basicRestGridDemo', {
    template: template,
    controller: ListCtrl
  })
  .component('basicRestSearchForm', {
    template: require('../basicGrid/templates/searchForm.html')
  })
  .name
