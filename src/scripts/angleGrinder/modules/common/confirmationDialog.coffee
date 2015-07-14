app = angular.module("angleGrinder.common")

class ConfirmationDialogCtrl extends BaseCtrl
  @register app, 'ConfirmationDialogCtrl'
  @inject "$scope", "$modalInstance", "$log", "options", "defer"

  close: (confirmed) ->
    @$log.info "[ag] closing confirmation dialog", confirmed
    @$modalInstance.close(confirmed)
    @defer.resolve(confirmed)


app.service "confirmationDialog", [
  "$modal", "$log", "$q", ($modal, $log, $q) ->

    # Open the confirmation dialog
    # options - it can be a string or object with the messages
    #   if th message is not specified default "Are you sure?" message will be used
    open: (options = {}) ->
      options = { message: options } if angular.isString(options)

      # assign default confirmation message
      options.message ?= "Are you sure?"

      # assign button labels
      options.cancelLabel ?= "Cancel"
      options.okLabel ?= "Ok"

      $log.info "[ag] opening confirmation dialog", options

      defer = $q.defer()

      $modal.open
        keyboard: false    # do not close the dialog with ESC key
        backdrop: "static" # do not close on click outside of the dialog

        controller: "ConfirmationDialogCtrl as ctrl"
        template: """
          <div class="modal-body">{{ctrl.options.message}}</div>

          <div class="modal-footer">
            <button class="btn" ng-click="ctrl.close(false)">{{ctrl.options.cancelLabel}}</button>
            <button class="btn btn-primary" ng-click="ctrl.close(true)">{{ctrl.options.okLabel}}</button>
          </div>
        """

        resolve:
          options: -> options
          defer: -> defer

      return defer.promise
]
