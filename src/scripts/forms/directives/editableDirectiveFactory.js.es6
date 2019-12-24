/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const forms = angular.module("angleGrinder.forms");

// Decorates all editable inputs with mechanism
// for displaying validation errors.
forms.config(["$provide", $provide => $provide.decorator("editableDirectiveFactory", [
  "$delegate", "validationMessages", function($delegate, validationMessages) {

    // collect all error messages for the given model
    const errorsFor = function(model) {
      const callback = function(result, invalid, error) {
        if (invalid) { result.push(validationMessages[error]); }
        return result;
      };

      return _.reduce(model.$error, callback, []).join(", ");
    };

    return function() {
      const directive = $delegate.apply(this, arguments);
      const {
        link
      } = directive;

      directive.compile = (element, attrs) => (function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);

        const form = ctrl[1];
        const name = attrs.eName;
        const {
          disabled
        } = attrs;

        // watch for model validity
        // and display errors if necessary
        if (form? && name?) {
          const viewValue = () => form[name]?.$viewValue;
          scope.$watch(viewValue, function() {
            const model = form[name];

            if (model?.$invalid) {
              form.$setError(name, errorsFor(model));
            }

            if (model?.$valid) {
              return form.$setError(name, "");
            }
          });
        }

        // watch if input has disabled attribute
        if (form? && disabled?) {
          scope.disabled = disabled;
        }

        const {
          options
        } = attrs;
        if (options?) {
          return scope.options = options;
        }
      });

      return directive;
    };
  }
])
]);
