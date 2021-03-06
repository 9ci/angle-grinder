import _ from 'lodash'

/* @ngInject */
export default class orgShowCaseCtrl {
  constructor($scope, $controller, $location, alerts, resourceBuilder, org) {
    $scope.org = org
    const orgShowCase = resourceBuilder('/orgShowCase', 'orgShowCase')
    orgShowCase.get({ id: $scope.org.orgShowCaseId }, function(resp) {
      $scope.orgShowCase = resp
      return $scope.tzShowCase = _.cloneDeep($scope.orgShowCase)
    })

    $scope.save = orgShowCase => orgShowCase.$save()
  }
}
