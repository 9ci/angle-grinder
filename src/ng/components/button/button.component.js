import _ from 'lodash'
import template from './button.html'

// Set up controller
class BtnController {
  constructor($element, $transclude) {
    this.$element = $element
    // this.$transclude = $transclude
    // console.log("this.$transclude", this.$transclude)
    $transclude((clone) => {
      // if clone.length then it has inner content/text for button
      if (clone.length) this.hasTranscluded = true
    })
  }

  $onInit() {
    this.btnCls = this.buttonClass || ''
    // setup color class
    if (this.color) this.btnCls = `${this.btnCls} is-${this.color}`
    this.setupIconClass('iconLeft')
    this.setupIconClass('iconRight')
  }

  setupIconClass(fldName) {
    let icoVal = this[fldName]
    if (icoVal && icoVal.startsWith('fa-')) icoVal = `fa ${icoVal}`
    this[`${fldName}Class`] = icoVal
  }

  fireClick(event) {
    if (_.isFunction(this.buttonClick)) { // if there is a default then use it
      this.buttonClick(event)
    }
  }

  get ngClass() {
    // let self = this
    return {
      'is-loading': this.isLoading
    }
  }
}

// Define and export component
export default {
  transclude: true,
  bindings: {
    buttonClass: '@',
    color: '@',
    iconLeft: '@',
    iconRight: '@',
    isLoading: '<',
    isDisabled: '<',
    // size: '@',
    buttonClick: '='
  },
  template,
  controller: BtnController,
  controllerAs: 'btnCtrl'
}