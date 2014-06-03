forms = angular.module("angleGrinder.forms")

forms.directive "agPanelsRow", ->
  restrict: "C"
  controller: [
    "$log", "$scope", "$element", "$timeout",
    ($log, $scope, $element, $timeout) ->
      # an array with all panels in the current row
      @panels = []

      equalizeHeights = =>
        # get the max height
        heights = @panels.map (panel) -> panel.height()
        maxHeight = Math.max.apply(null, heights)

        $log.debug "[agPanelsRow] equalizing heights for", $element, "max height is #{maxHeight}px"

        # iterate thought all panels and re-calculate the height
        for panelEl in @panels
          # default padding
          paddings = 30

          # add heading and footer
          paddings += panelEl.find(".panel-heading").outerHeight()
          paddings += panelEl.find(".panel-footer").outerHeight()

          panelEl.find(".panel-body").css("min-height", maxHeight - paddings)

      unregister = $scope.$watch ->
        # do nothing when the element is not visible
        # for instance the tab isn't active
        return unless $element.is(":visible")

        # equalize heights
        $timeout -> equalizeHeights()

        # unregister the watch because it should run only once
        unregister()

      return
  ]

forms.directive "agPanel", ->
  restrict: "C"
  require: "^agPanelsRow"

  link: (scope, element, attrs, ctrl) ->

    # add the current panel to the stack
    ctrl.panels.push(element)
