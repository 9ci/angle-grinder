import appState from 'angle-grinder/src/tools/AppState'

class controller {
  constructor($element) {
    this.$element = $element
    this.$state = appState.$state
    this.appState = appState
    this.sideMenuItems = [{data:{title: "Org", href: 'org'}}, {data:{title: "User", href: 'user'}}]//appState.routerStates.children
  }

  // $onInit() {
  //   super.onInit()
  //   super.validate()
  // }

  $onChanges(changesObj) {
    console.log('sidebar $onChanges(changesObj)', changesObj)
  }
}

export default angular.module('app.sidebar', [])
  .component('appSidebar', {
    controller,
    template: require('./index.html')
    // require: {
    //   ngModelCtrl: 'ngModel',
    // },
    // bindings: {
    //   ngModel: '=',
    // }
  })
  .name
