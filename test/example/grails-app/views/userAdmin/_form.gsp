<g:set var="entityName" value="${ag.label(code: "user")}"/>

<div class="modal-header">
    <button type="button" class="close" ng-click="closeEditDialog()" aria-hidden="true">&times;</button>

    <h3 ng-show="createNew">Create New ${entityName}</h3>
    <h3 ng-hide="createNew">Edit ${entityName}</h3>
</div>

<form name="editForm" class="form-horizontal no-margin" novalidate ng-submit="save(item)">
    <div class="modal-body">
        <server-validation-errors></server-validation-errors>

        <div field-group for="contactFirstName,contactLastName">
            <label class="control-label">${ag.label(code: "contact.name")}</label>

            <div class="controls">
                <input type="text" placeholder="${ag.label(code: 'contact.firstName')}"
                       name="contactFirstName"
                       ng-model="item.contact.firstName" required autofocus>
                <validation-error for="contactFirstName" />
            </div>

            <div class="controls" style="margin-top:5px">
                <input type="text" placeholder="${ag.label(code: 'contact.lastName')}"
                       name="contactLastName"
                       ng-model="item.contact.lastName" />
                <validation-error for="contactLastName" />
            </div>
        </div>

        <div field-group for="contactEmail">
            <label class="control-label">${ag.label(code: "contact.email")}</label>

            <div class="controls">
                <input type="email"
                       name="contactEmail" ng-model="item.contact.email" />
                <validation-error for="contactEmail" />
            </div>
        </div>

        <div field-group for="login">
            <label class="control-label">${ag.label(code: "user.login")}</label>

            <div class="controls">
                <input type="text"
                       name="login" ng-model="item.login" required />
                <validation-error for="login" />
            </div>
        </div>

        <div field-group for="password,repassword">
            <label class="control-label">${ag.label(code: "user.password")}</label>

            <div class="controls">
                <input type="password" placeholder="${ag.label(code: 'user.password')}"
                       name="password"
                       ng-model="item.password"
                       ng-required="item.newRecord()" ng-minlength="6" />
                <validation-error for="password" />
            </div>

            <div class="controls" style="margin-top:5px">
                <input type="password" placeholder="${ag.label(code: 'user.repassword')}"
                       name="repassword"
                       ng-model="item.repassword"
                       ng-required="item.newRecord()" ng-minlength="6" match="item.password" />
                <validation-error for="repassword" />
            </div>
        </div>

        <div class="control-group">
            <div class="controls">
                <label class="checkbox">
                    <g:checkBox name="contact.tagForReminders" ng-model="item.contact.tagForReminders"/>
                    ${ag.label(code: 'contact.tagForReminders')}
                </label>
            </div>

            <div class="controls" ng-hide="isCreateNew">
                <label class="checkbox">
                    <g:checkBox name="inactive" ng-model="item.inactive"/>
                    ${ag.label(code: 'user.inactive')}
                </label>
            </div>
        </div>
    </div>

    <div class="modal-footer">
        <span ng-hide="createNew">
            <delete-button when-confirmed="delete(item)"></delete-button>
        </span>

        <cancel-button ng-click="closeEditDialog()"></cancel-button>
        <submit-button></submit-button>
    </div>
</form>
