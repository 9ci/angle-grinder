import stringUtils from '../../utils/stringFomUtils'

import _ from 'lodash'

export default class AgBaseControl {
  isRequired = false

  /* @ngInject */
  constructor($element, $timeout, $scope) {
    this.$element = $element
    this.$timeout = $timeout
    this.$scope = $scope
  }

  setupDefaults() {
    this.type = this.type || 'text'
    const modelPath = this.$element.attr('ng-model')
    if (!this.modelKey && modelPath) {
      this.modelKey = _.split(modelPath, '.').slice(-1).pop()
    }
    // passing in a blank string to label will not be undefined, and is how to blank it out
    if (typeof this.label === 'undefined') {
      this.label = stringUtils.parseWords(this.modelKey)
    }
    this.placeholder = this.placeholder || (this.label || stringUtils.parseWords(this.modelKey))

    // figure out an id for the field if it doesn't have one
    if (!this.id) {
      const idKey = `field_${this.type}_${this.modelKey}`
      this.id = _.uniqueId(`${idKey}_`)
    }

    if (!this.name) {
      this.name = this.id
    }

    // if required is added it wont be undefined and may have blank str if no value is set
    if (this.required === '' || this.required === 'true' ||
        this.ngRequired === '' || this.ngRequired === 'true') {
      this.isRequired = true
    }
  }

  onInit() {
    this.setupDefaults()

    if (this.formCtrl) {
      if (!this.isHorizontal) this.isHorizontal = this.formCtrl.isHorizontal
      if (!this.labelClass && this.formCtrl.labelClass) this.labelClass = this.formCtrl.labelClass
    }
    // if (this.isHorizontal) this.labelClass = `column ${this.labelClass}`

    this.ngModelCtrl.$render = () => {
      this.value = this.ngModelCtrl.$viewValue
    }

    // if isHorizontal, move label outside and wrap in a columns div
    if (this.isHorizontal && this.label) {
      this.$timeout(() => {
        const el = this.$element
        // needs to be in timeout so all things have rendered.
        const label = el.find('.label')
        // Log.debug("label", label)
        const colClass = this.columnsClass || ''
        var content = angular.element(`<div class="columns is-mobile ${colClass}"></div>`)
        el.wrap(content)
        el.parent().prepend(label)
      })
    }
  }

  onChange() {
    this.ngModelCtrl.$setViewValue(this.value)
  }

  validate() {
    // run extra validation code here
    return true
  }

  // $postLink() {
  //   this.$scope.$evalAsync(() => {

  //   })
  // }
}

AgBaseControl.common = {
  dir: {
    restrict: 'E',
    replace: true,
    controllerAs: '$ctrl',
    bindToController: true
  },
  scope: {
    // id: '@',
    label: '@',
    hint: '@',
    name: '@',
    placeholder: '@',
    required: '@',
    ngRequired: '@',
    fieldClass: '@',
    inputClass: '@',
    labelClass: '@',
    isHorizontal: '@',
    columnsClass: '@',
    isDense: '@'
  }
}
