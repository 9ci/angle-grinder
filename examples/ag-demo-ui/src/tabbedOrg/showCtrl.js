/* @ngInject */
export default class ShowCtrl {
  constructor($scope, $controller, $location, alerts) {
    $scope.org = $scope.$parent.org

    $scope.orgTypes = ['company', 'organisation']

    // setup the grid pager
    $scope.currentId = $scope.org.id
    $scope.gridPager = $controller('gridPagerCtrlMixin', {
      $scope,
      gridName: 'grid.org',
      currentId: 'currentId',
      path: '/:id'
    }
    )

    $scope.save = function(form, org) {
      if (form.$invalid) { return }

      const onSuccess = () => alerts.info('Org address has been updated.')

      const onError = function(response) {
        if (response.status === 422) {
          const {
            errors
          } = response.data
          return form.$serverErrors = errors.org
        }
      }

      return org.save({ success: onSuccess, error: onError })
    }
  }
}
