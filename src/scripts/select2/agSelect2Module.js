import angular from 'angular'
import uiSelect2 from './ui.select2'
import pathWithCtx from '../pathWithContext'

export default 'ag.select2'
angular.module('ag.select2', [
  uiSelect2,
  pathWithCtx
])
