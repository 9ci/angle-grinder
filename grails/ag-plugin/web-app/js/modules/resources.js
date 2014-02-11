var resources = angular.module("angleGrinder.resources", [
    "ngResource"
]);

// Build a resource for the given restful url
resources.factory("resourceBuilder", [
  "$resource", "pathWithContext", function($resource, pathWithContext) {
    return function(basePath, resourceName) {
      if (resourceName == null) {
        resourceName = basePath.replace(/$\/+/, "");
      }
      basePath = pathWithContext(basePath, resourceName);

      var Resource = $resource("" + basePath + "/:action/:id", { id: "@id" }, {
        list:       { method: "GET", params: { action: "list" }, isArray: true },
        get:        { method: "GET", params: { action: "get" } },
        save:       { method: "POST", params: { action: "save" } },
        update:     { method: "POST", params: { action: "update" } },
        "delete":   { method: "POST", params: { action: "delete" } },

        // mass actions (for selected rows)
        massUpdate: { method: "POST", params: { action: "massUpdate" } },
        massDelete: { method: "POST", params: { action: "massDelete" } }
      });

      angular.extend(Resource.prototype, {
        resourceName: function() {
          return resourceName;
        },

        // Returns true if the record is persisted (has an id)
        persisted: function() {
          return this.id != null;
        },

        // Return true if the record is not persisted
        newRecord: function() {
          return !this.persisted();
        },

        // Backbone style save() that inserts or updated the record
        // based on the presence of an id.
        save: function(options) {
          var method;
          method = this.persisted() ? "update" : "save";
          return Resource[method]({}, this, options.success, options.error);
        },

        "delete": function(options) {
          return Resource["delete"]({}, this, options.success, options.error);
        }
      });

      return Resource;
    };
  }
]);

// This module defines the resource mappings required by Angular JS to map to a
// standard Grails CRUD URL scheme that uses `"/$controller/$action?/$id?"`.
resources.factory("Resource", [
  "$document", "resourceBuilder", function($document, resourceBuilder) {
    var $body = $document.find("body");
    var url = $body.data("resource-path");
    var name = $body.data("resource-name");

    return resourceBuilder(url, name);
  }
]);

// Tries to load an user record with the given id taken from route params
resources.factory("resourceResolver", [
  "$q", "Resource", function($q, Resource) {
    return function(id) {
      var deferred = $q.defer();

      var onSuccess = function(user) {
        return deferred.resolve(user);
      };

      var onError = function() {
        return deferred.reject();
      };

      Resource.get({ id: id }, onSuccess, onError);
      return deferred.promise;
    };
  }
]);
