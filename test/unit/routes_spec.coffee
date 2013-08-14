describe "Application routes", ->

  # create spy on `userResolver` service
  beforeEach module "angleGrinder.resources", ($provide) ->
    $provide.value "userResolver", jasmine.createSpy("userResolver")
    null

  beforeEach module "angleGrinder"

  beforeEach ->
    module("templates/list.html")
    module("templates/users_list.html")
    module("templates/users/list.html")
    module("templates/users/show.html")
    module("templates/users/form.html")

  $rootScope = null
  $route = null
  $location = null

  beforeEach inject (_$rootScope_, _$route_, _$location_) ->
    $route = _$route_
    $rootScope = _$rootScope_
    $location = _$location_

  navigateTo = (path) ->
    $rootScope.$apply -> $location.path(path)

  it "recognizes `/`", ->
    navigateTo "/"
    expect($route.current.templateUrl).toEqual("templates/users_list.html")
    expect($route.current.controller).toEqual("UsersListCtrl")

  it "recognizes `/list`", ->
    navigateTo "/list"
    expect($route.current.templateUrl).toEqual("templates/list.html")
    expect($route.current.controller).toEqual("ListCtrl")

  it "recognizes `/users_list`", ->
    navigateTo "/users_list"
    expect($route.current.templateUrl).toEqual("templates/users_list.html")
    expect($route.current.controller).toEqual("UsersListCtrl")

  it "recognizes `/users`", ->
    navigateTo "/users"
    expect($route.current.templateUrl).toEqual("templates/users/list.html")
    expect($route.current.controller).toEqual("users.ListCtrl")

  it "recognizes `/users/create`", ->
    navigateTo "/users/create"
    expect($route.current.templateUrl).toEqual("templates/users/form.html")
    expect($route.current.controller).toEqual("users.FormCtrl")
    expect($route.current.resolve.user).toBeDefined()

  it "recognizes `/users/:id`", inject (userResolver) ->
    # When
    navigateTo "/users/12345"
    expect(userResolver).toHaveBeenCalledWith("12345")

    # Then
    expect($route.current.templateUrl).toEqual("templates/users/show.html")
    expect($route.current.controller).toEqual("users.ShowCtrl")

  it "recognizes `/users/:id/edit`", inject ($q, userResolver) ->
    # When
    navigateTo "/users/234/edit"
    expect(userResolver).toHaveBeenCalledWith("234")

    # Then
    expect($route.current.templateUrl).toEqual("templates/users/form.html")
    expect($route.current.controller).toEqual("users.FormCtrl")
    expect($route.current.resolve.user).toBeDefined()
