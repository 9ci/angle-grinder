<html>
<head>
    <meta name="layout" content="agAdmin"/>
    <g:set var="entityName" value="${ag.label(code: "ShowCase")}"/>
    <title>${entityName} Admin</title>

    <r:require modules="admin"/>

    <style type="text/css">
    .select2-container {
        background-color: #fff
    }

    .form-horizontal.form-multi-column .control-label {
        width: 100px;
    }

    .form-horizontal.form-multi-column .controls {
        margin-left: 120px;
    }

    .form-horizontal.form-multi-column .form-actions {
        padding-left: 120px;
    }

    .input-prepend, .input-append {
        width: 100%;
    }

    .input-prepend .add-on {
        width: 10%;
    }

    .input-prepend .input-block-level {
        width: 90%;
    }

    </style>
</head>

<body data-resource-name="orgShowCase"
      data-resource-path="/orgShowCase">

<h3 class="page-header"><g:message code="default.list.label" args="[entityName]"/></h3>

<div ng-app="angleGrinder" ng-controller="orgShowCase.ListCtrl"
     ng-init="editTemplateUrl = '${createLink(action: 'editPartial')}' ">

    <ag-alerts></ag-alerts>

    <div ng-show="showSearchForm" class="search-form-panel">
         <div ng-include="'${createLink(action: 'searchPartial')}'"></div>
    </div>

    <div class="navbar navbar-grid navbar-default">
        <div class="navbar-inner with-selected-pointer with-grid-options">
            <ul class="nav navbar-nav col-sm-4">
                <li>
                    <a href="" ng-click="createRecord()">
                        <i class="fa fa-user"></i><g:message code="default.new.label" args="[entityName]"/>
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav pull-right">
                <li>
                    <a title="search screen" ng-click="showSearchForm = !showSearchForm" href="">
                        <i class="fa fa-search"></i>
                    </a>
                </li>
            </ul>

            <form action="" class="navbar-search pull-right" ng-submit="orgShowCaseGrid.search(filters)">
                <input type="text" value="" placeholder="quick search" class="search-query span2" style="width: 150px;"
                       ng-model="filters.quickSearch"/>
            </form>
        </div>
    </div>

    <div ag-grid="gridOptions"
         ag-grid-name="orgShowCaseGrid"></div>
</div>

</body>
</html>
