import angular from 'angular'
import _ from 'lodash'
import './app.module'
import './config.router'
import appState from 'angle-grinder/src/tools/AppState'

const app = angular.module('app')
// export default app.name

app.run(function($rootScope, $state, $stateParams) {
  // Set the ui-router state vars to global root to access them from any scope
  $rootScope.$state = $state
  appState.$state = $state
  $rootScope.$stateParams = $stateParams

  const userInfo = {
    id: '123',
    name: 'Peter Schiff',
    job: 'Bot Wrangler',
    picture: 'app/img/user/02.jpg'
  }
  _.merge(appState.user, userInfo)

  const defaultLayout = {
    isNavbarFixed: true, // true if you want to initialize the template with fixed header
    isSidenavFixed: true, // true if you want to initialize the template with fixed sidebar
    isFooterFixed: false, // true if you want to initialize the template with fixed footer
    theme: 'light', // indicate the theme chosen for your project
    logo: 'assets/images/logos/yak-white.svg', // relative path of the project logo
    logoWidth: 150,
  }

  _.merge(appState.layout, defaultLayout)

  const info = {
    name: 'Yak Works Template', // name of your project
    author: 'YakWorks', // author's name or company name
    description: 'Angular Admin Template', // brief description
    version: '1.0', // current version
    year: ((new Date()).getFullYear()) // automatic current year (for copyright information)
  }
  _.merge(appState.info, info)

  // appState defaults
  appState.sidenav.open = true

  $rootScope.appState = appState
})

