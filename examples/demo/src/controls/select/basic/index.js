import compDemoModule from './comp'

import htmlRaw from '!raw-loader!./comp.html'
import jsRaw from '!raw-loader!./comp.js'
// import mdRaw from '!raw-loader!./docs.md';

class controller {
  rawHtml = htmlRaw
  rawJs = jsRaw
  // rawMd = mdRaw
}

const template = `
<example-snippet raw-js='$ctrl.rawJs' raw-html='$ctrl.rawHtml' raw-md='$ctrl.rawMd' max-height="600px">
  <p>input element basic single select example with array of strings</p>
  <demo-sel-input/>
</example-snippet>
`
// export the module name
export default angular.module(compDemoModule)
  .component('exSelBasic', { template, controller })
  .name
