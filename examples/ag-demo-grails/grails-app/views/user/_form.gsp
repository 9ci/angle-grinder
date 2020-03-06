<g:set var="entityName" value="User"/>

<div class="modal-header">
  <button type="button" class="close" ng-click="closeDialog()" aria-hidden="true">&times;</button>

  <h3 ng-switch="user.persisted()">
    <span ng-switch-when="true">Edit ${entityName}</span>
    <span ng-switch-when="false">Create New ${entityName}</span>
  </h3>
</div>
<div class="columns"><div class="column">
<form name="editForm" class="form-horizontal-fixed" novalidate
      ag-server-validation-errors
      ng-submit="save(user)">
  <div class="modal-body" ng-controller="user.FormCtrl" style="height:60%; overflow:auto;">

    <ng-form name="contact" ag-server-validation-errors>
      <div ag-field-group for="firstName,lastName,email">
        <div class="form-group">
          <label class="control-label">Name</label>

          <div class="controls">
            <input class="form-control"  type="text" placeholder="First Name"
                   name="firstName"
                   ng-model="user.contact.firstName" required autofocus>
            <ag-validation-errors for="firstName"/>
          </div>
        </div>

        <div class="form-group">
          <div class="controls">
            <input class="form-control"  type="text" placeholder="Last Name"
                   name="lastName"
                   ng-model="user.contact.lastName"/>
            <ag-validation-errors for="lastName"/>
          </div>
        </div>

        <div class="form-group">
          <label class="control-label">Email</label>

          <div class="controls">
            <input class="form-control"  type="email" placeholder="Email"
                   name="email" ng-model="user.contact.email"/>
            <ag-validation-errors for="email"/>
          </div>
        </div>
      </div>


        <div ag-field-group for="type" class="form-group">
          <label class="control-label">Type</label>

          <div class="controls">
            <select class="form-control" ui-select2="{closeOnSelect: false}" name="type" name="type" ng-model="user.contact.type">
              <option value="ADMIN">admin</option>
              <option value="CUSTOMER">customer</option>
            </select>
            <ag-validation-errors for="type"/>
          </div>
        </div>


      <div ag-field-group for="orgId">
        <div class="form-group">
          <label class="control-label">Org</label>

          <div class="controls">
            <select class="form-control" name="orgId" ui-select2="{}"
                    ng-model="user.contact.org.id"
                    ng-required="true">
              <option value="">-- chose org --</option>
              <option ng-repeat="org in orgs" value="{{org.id}}">{{org.name}}</option>
            </select>
            <ag-validation-errors for="orgId"/>
          </div>
        </div>
      </div>

      <div ag-field-group for="tagForReminders">
        <div class="form-group">
          <label class="control-label">
            Tag For Reminders
          </label>

          <div class="controls">
            <g:checkBox name="tagForReminders" ng-model="user.contact.tagForReminders"/>
          </div>

        </div>
      </div>
    </ng-form>

    <div ag-field-group for="login">
      <div class="form-group">
        <label class="control-label">Login</label>

        <div class="controls">
          <input class="form-control"  type="text"
                 name="login" ng-model="user.login" required/>
          <ag-validation-errors for="login"/>
        </div>
      </div>
    </div>

    <div ag-field-group for="activeDate">
      <div class="form-group">
        <label class="control-label">Active Date</label>

        <div class="controls">
          <ag-datepicker date-type="date"
                         ng-model="user.activeDate"
                         ng-required="true"
                         name="activeDate"/>
        </ag-datepicker>

          <ag-validation-errors for="activeDate"/>
        </div>
      </div>
    </div>

    <div ag-field-group for="password,repassword">
      <div class="form-group">
        <label class="control-label ">Password</label>

        <div>
          <div class="controls">
            <input class="form-control"  type="password" placeholder="Pssword"
                   name="password"
                   ng-model="user.password"
                   ng-required="user.newRecord()" ng-minlength="6"/>
            <ag-validation-errors for="password"/>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="controls">
          <input class="form-control"  type="password" placeholder="Confirm Password"
                 name="repassword"
                 ng-model="user.repassword"
                 ng-required="user.newRecord()" ng-minlength="6" match="user.password"/>
          <ag-validation-errors for="repassword"/>
        </div>
      </div>
    </div>

    <div class="form-group" ng-hide="user.newRecord()">
      <label class="control-label col-md-4">
        Inactive
      </label>

      <div class="col-md-4" style="margin-top: 7px;">
        <g:checkBox name="tagForReminders" ng-model="user.inactive"/>
      </div>

    </div>

    <div class="modal-footer">
      <span ng-if="user.persisted()">
        <ag-delete-button when-confirmed="delete(item)"></ag-delete-button>
      </span>

      <ag-cancel-button ng-click="closeDialog()"></ag-cancel-button>
      <ag-submit-button></ag-submit-button>
    </div>
</form>
</div></div>
