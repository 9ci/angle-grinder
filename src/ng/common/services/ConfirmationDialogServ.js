import sweetAlert from 'sweetalert'

/* @ngInject */
export default class ConfirmationDialogServ {
  constructor($log, $q) {
    this.$log = $log
    this.$q = $q
  }

  swal(options, callback) {
    sweetAlert(options, callback)
  }

  open(options) {
    if (options == null) {
      options = {}
    }
    if (angular.isString(options)) {
      options = { message: options }
    }

    // assign default confirmation message
    if (options.message == null) {
      options.message = 'Are you sure?'
    }

    // assign button labels
    if (options.cancelLabel == null) {
      options.cancelLabel = 'Cancel'
    }
    if (options.okLabel == null) {
      options.okLabel = 'Ok'
    }
    if (options.closeOnConfirm == null) {
      options.closeOnConfirm = true
    }

    this.$log.info('[ag] opening confirmation dialog', options)

    const defer = this.$q.defer()

    this.swal({
      title: options.message,
      allowEscapeKey: false,
      showCancelButton: true,
      confirmButtonText: options.okLabel,
      cancelButtonText: options.cancelLabel,
      closeOnConfirm: options.closeOnConfirm
    }, isConfirmed => defer.resolve(isConfirmed))

    return defer.promise
  }
}
