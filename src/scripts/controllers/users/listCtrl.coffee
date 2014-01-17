class ListCtrl
  @$inject = ["$scope", "$filter", "Users", "massUpdateMixin", "singlePageCrudCtrlMixin"]
  constructor: ($scope, @$filter, Users, massUpdateMixin, singlePageCrudCtrlMixin) ->

    # TODO create a service for grid options
    $scope.gridOptions =
      path: "/api/users"
      colModel: @gridColumns()
      rowNum: 10
      sortname: "id"
      multiselect: true

    singlePageCrudCtrlMixin $scope,
      Resource: Users
      resourcePath: "/users"
      gridName: "usersGrid"

    massUpdateMixin $scope,
      templateUrl: "/templates/examples/users/massUpdateForm.html"
      controller: "users.MassUpdateFormCtrl"
      gridName: "usersGrid"

  gridColumns: ->
    showActionLink = (cellVal, options, rowData) ->
      """
      <a class="with-pager" href="#" data-row-id="#{rowData.id}" data-ui-sref="examples.users.show">#{cellVal}</a>
      """

    [
      name: "id"
      width: 50
      formatter: showActionLink
    ,
      name: "login"
      label: "Login"
      formatter: showActionLink
    ,
      name: "info.email"
      label: "Email"
    ,
      name: "name"
      label: "Name"
      formatter: showActionLink
    ,
      name: "allowance"
      label: "Allowance"
    ,
      name: "birthday"
      label: "Birthday",
      formatter: (cellVal) => @$filter("date")(cellVal)
    ,
      name: "paid"
      label: "Paid"
    ]

angular.module("angleGrinder.examples")
  .controller("users.ListCtrl", ListCtrl)
