// import Log from '../../../utils/Log'
import _ from 'lodash'

export default () => ({
  restrict: 'E',
  require: {
    gridCtrl: '^gridz'
  },
  template: require('./toolbar.html'),
  bindToController: true,
  scope: {
    options: '<'
  },
  controller: Controller,
  controllerAs: 'tbCtrl'
})

class Controller {
  opts = {
    selectedButtons: {
      massUpdate: { icon: 'fa-edit', tooltip: 'Mass Update', action: () => this.gridCtrl.listCtrl.showMassUpdate() },
      export: { icon: 'fa-table', tooltip: 'Export to Excel', action: () => this.gridCtrl.xlsExport() }
    },
    leftButtons: {
      createNew: { icon: 'fa-plus', tooltip: 'Create New', action: () => this.gridCtrl.listCtrl.create() }
    },
    showQuickSearch: true,
    showSearchFormButton: true
  }

  constructor($element, $compile, $scope) {
    this.$element = $element
    this.$compile = $compile
    this.$scope = $scope
  }

  $onInit() {
    if (this.options) {
      _.merge(this.opts, this.options)
    }
  }

  $postLink() {
    const rightSec = this.options.rightSection
    if (rightSec) {
      const rightHtml = this.$element.find('.right-html')
      rightHtml.append(rightSec.template)
      const scope = this.options.scope ? this.options.scope() : this.$scope
      this.$compile(rightHtml)(scope)
    }
    this.setupSearchInput()
  }

  setupSearchInput() {
    this.$element.find('.quick-search').bind('keydown', event => {
      // console.log("keydown event", event)
      // 13 - Enter key code
      if (event.which === 13) {
        event.preventDefault()
        this.gridCtrl.quickSearch(this.quickSearchEntry)
        // this.quickSearchEntry = ""
      }
      // esc key
      if (event.which === 27) {
        this.quickSearchEntry = ''
        // scope.$apply()
      }
    })
  }

  fireButtonClick(key, btnItem, event) {
    // if it has an action then fire that
    if (_.isFunction(btnItem.action)) {
      btnItem.action(btnItem, event)
    } else if (_.isFunction(this.buttonClick)) { // if there is a default then use it
      this.buttonClick(btnItem, event)
    }
  }
}
