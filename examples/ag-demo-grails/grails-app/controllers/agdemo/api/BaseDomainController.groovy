package agdemo.api

import agdemo.User
import gorm.tools.Pager
import gorm.tools.beans.BeanPathTools
import gorm.tools.repository.GormRepo
import gorm.tools.repository.RepoMessage
import gorm.tools.repository.RepoUtil
import gorm.tools.repository.errors.EntityValidationException
import grails.converters.JSON
import grails.plugin.gormtools.ErrorMessageService
import grails.util.GrailsNameUtils
import grails.validation.ValidationException
import org.grails.datastore.gorm.GormEntity
import org.grails.plugins.appsetupconfig.AppSetupService

import javax.annotation.PostConstruct

abstract class BaseDomainController {
    static namespace = 'api'
    def ajaxGrid = true
    abstract getDomainClass()
    protected List<String> getPickShowFields() { return ['*'] }
    protected List<String> getPicSearchableFields() { return [] }
    static allowedMethods = [save: "POST", update: ["PUT", "POST"], delete: ["POST", "DELETE"], massUpdate: "POST"]
    Map defaultGridOptions = [colModel: [[name: 'id']]]
    ErrorMessageService errorMessageService
    AppSetupService appSetupService
    protected GormRepo getRepo() {
        domainClass.repo as GormRepo
    }

    @PostConstruct
    protected void init() {
    }

    protected String getDomainInstanceName() {
        def suffix = grailsApplication.config?.grails?.scaffolding?.templates?.domainSuffix
        if (!suffix) {
            suffix = ''
        }
        def propName = GrailsNameUtils.getPropertyNameRepresentation(domainClass)
        "${propName}${suffix}"
    }

    def index() {
        redirect(action: "list", params: params)
    }

    /**
     * returns the list of domain obects for the scaffolded contro
     */
    protected def listCriteria() {
        def crit = domainClass.createCriteria()
        def pager = new Pager(params)
        def datalist = crit.list(max: pager.max, offset: pager.offset) {
            if (params.sort)
                order(params.sort, params.order)
        }
        return datalist
    }

    def list() {
        if (response.format == 'json') {
            listJson()
        } else {
            if (ajaxGrid) {
                return listModel()
            } else {
                forward(action: "listhtml")
                return //stop the flow
            }
        }
    }

    protected def listJson() {
        def pageData = pagedList(listCriteria())
        render pageData.jsonData as JSON
    }

    protected def pagedList(dlist) {
        def pageData = new Pager(params)
        def fieldList
        if (hasProperty('selectFields')) {
            fieldList = selectFields
        }
        pageData.setupData(dlist, fieldList)
        return pageData
    }

    protected def listModel() {
        return []
    }

    //the old standard way to list into an html page
    def listhtml(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        def pageData = pagedList(listCriteria())
        def propName = GrailsNameUtils.getPropertyNameRepresentation(domainClass)
        return [("${propName}List".toString()): pageData.data, ("${propName}ListTotal".toString()): pageData.recordCount]
    }

    def create() {
        def domainInstance = domainClass.newInstance()
        domainInstance.properties = params
        return [(domainInstanceName): domainInstance]
    }

    def edit(Long id) {
        def domainInstance = domainClass.get(id)
        if (!domainInstance) {
            flash.message = RepoMessage.notFound(GrailsNameUtils.getShortName(domainClass), params)
            redirect(action: "list")
            return
        } else {
            return [(domainInstanceName): domainInstance]
        }

    }

    protected renderSuccess(String actionMeth, result) {
        log.debug("renderSuccess ${request.format}")
        if (request.format == 'json' || response.format == 'json') {
            render successModel(entity.id) as JSON
            return
        } else {
            redirect(action: actionMeth, id: entity.id)
            return
        }
    }

    protected renderError(String actionMeth, ex) {
        if (request.format == 'json' || response.format == 'json') {
            response.status = 400 //XXX change this a generic 400 and test
            render errorModel(ex.entity, ex.meta) as JSON
            return
        } else {
            render(view: actionMeth, model: [(domainInstanceName): ex.entity])
            return
        }
    }

    def save() {
        if (request.format == 'json' || response.format == 'json') {
            saveOrUpdateJson()
            return
        }
        try {
            def result = saveDomain(params)
            flash.message = result.message
            renderSuccess('show', result)
            return
        } catch (ValidationException e) {
            log.debug("save with error ${request.format}")
            flash.message = e.messageMap
            renderError('create', e)
            return
        }
    }

    def saveOrUpdateJson() {
        def responseJson = [:]
        try {
            def p = BeanPathTools.flattenMap(request, request.JSON)
            def entity = p.id ? repo.update(p) : saveDomain(p)
            render BeanPathTools.buildMapFromPaths(entity, selectFields) as JSON
        } catch (Exception e) {
            log.error("saveJson with error: $e.message", e)
            Map errResponse = errorMessageService.buildErrorResponse(e)
            response.status = errResponse.code
            render errResponse as JSON
        }
    }

    protected def saveDomain(p) {
        log.debug("saveDomain(${p})")
        return repo.create(p)
    }

    def show(Long id) {
        try {
            def domainInstance = showDomain(id)
            withFormat {
                html {
                    return [(domainInstanceName): domainInstance]
                }
                json {
                    render domainInstance as JSON
                }
            }
        } catch (ValidationException e) {
            flash.message = e.messageMap
            withFormat {
                html {
                    redirect(action: "list")
                }
                json {
                    response.status = 409 //Bad Request Error
                    render errorModel(e.entity, e.meta) as JSON
                }
            }
        }
    }

    protected def showDomain(Long id) {
        def domainInstance = domainClass.get(id)
        if (!domainInstance) {
            throw new EntityValidationException(RepoMessage.notFound(GrailsNameUtils.getShortName(domainClass), params), null)
        }
        return domainInstance
    }

    def update() {
        if (request.format == 'json' || response.format == 'json') {
            saveOrUpdateJson()
            return
        }
        try {
            def result = updateDomain()
            flash.message = result.message
            renderSuccess('show', result)
            return
        } catch (ValidationException e) {
            flash.message = e.messageMap
            renderError('edit', e)
            return
        }
    }

    protected def updateDomain(opts = null) {
        params.remove('companyId')
        log.debug "updateDomain with ${params}"
        def res = repo.update(params)
        if (opts?.flush) RepoUtil.flush()
        return res
    }

    def saveOrUpdate() {
        try {
            def result = params.id ? repo.update(params) : repo.create(params)
            //all was good render a success save message
            render message(code: 'user.saved')
        } catch (EntityValidationException e) {
            response.status = 409
            def emsg = (e.hasProperty("messageMap")) ? g.message(code: e.messageMap?.code, args: e.messageMap?.args, default: e.messageMap?.defaultMessage) : null
            render(template: "userEdit", model: [user: e.meta?.user ?: e.entity, errorMsg: emsg])
        }
    }

    protected Map deleteDomain(Map p) {
        GormEntity entity = repo.get(p)
        repo.remove(entity)
        String message = RepoMessage.deleted(entity, RepoMessage.badge(entity.id, entity))
        [ok: true, id: entity.id, message: message]
    }

    def delete() {
        log.debug("in deleteJson with ${params}")
        try {
            Map result = deleteDomain(params)
            response.status = 200
            render(result as JSON)
        } catch (ValidationException e) {
            log.error("delete with error", e)
            response.status = 422
            def responseJson = [
                "code"       : 422,
                "status"     : "error",
                "message"    : errorMessageService.buildMsg(e.messageMap),
                "messageCode": e.messageMap.code
            ]
            render responseJson as JSON
        } catch (Exception e) {
            log.error("delete with error", e)
            response.status = 400
            def responseJson = [
                "code"   : 400,
                "status" : "error",
                "message": e.message,
                "error"  : e.message
            ]
            render responseJson as JSON
        }
    }

    def picklist(){
        Pager pager = new Pager(params)
        Map criterias = [:]
        String qslike = (params.q) ? ((params.q as String) + "%") : null
        List picks = getRepo().query([criteria: criterias, max: pager.max])

        Pager pagedList = pager.setupData(picks, pickShowFields)
        render pagedList.jsonData as JSON
    }

    protected Map getExternalConfig() {
        ConfigObject controllerConfig = grailsApplication.setupConfig.screens."$controllerName"
        return controllerConfig
    }

    protected Map getGridOptions() {
        def options = externalConfig.list.gridz
        if (!options) {
            return defaultGridOptions
        }
        return appSetupService.getValue(options)
    }

    def gridOptions() {
        String gridOptsJson = gridOptions as JSON
        render(gridOptsJson)
    }

    protected buildMsg(msgMap) {
        return g.message('code': msgMap.code, 'args': msgMap.args, 'default': msgMap.defaultMessage)
    }
    //this should be able to be done easier than this
    protected errorBuilder(messageCode, args, defmsg, entity, meta) {
        def message = g.message('code': messageCode, 'args': args, 'default': defmsg)
        flash.message = null
        def errs = []

        if (entity) {
            errs = buildError(entity, errs)
        }
        if (meta) {
            meta.values()?.each { obj ->
                errs = buildError(obj, errs)
            }
        }
        // return ["response":[
        // 	"status": "fail",
        // 	"ok":false,
        // 	"error": true,
        // 	"message":message,
        // 	"id": entity ? "${entity.id}" : "",
        // 	'errors':errs
        // ]]
        //FIXME implement new way
        return [
                "code": 422,
                "status": "error",
                "message": message,
                "messageCode": messageCode,
                "id": entity ? "${entity.id}" : "",
                'errors': errs
        ]

    }

    def buildError(obj, errs) {
        eachError([bean: obj], {
            errs << [(it.field): [object: it.objectName, field: it.field, message: g.message(error: it).toString(),
                    'rejected-value': StringEscapeUtils.escapeXml(it.rejectedValue?.toString())]]
        })
        return errs
    }

    //uses the stuff in flash to create an error response with the errorBuilder
    def errorModel(entity, meta) {
        errorBuilder(flash.message?.code, flash.message?.args, flash.message?.defaultMessage, entity, meta)
    }

    def successModel(id) {
        def message = g.message('code': flash.message?.code, 'args': flash.message?.args, 'default': flash.message?.defaultMessage)
        flash.message = null
        return ["response": [
                "status": "ok",
                "ok": true,
                "error": false,
                "message": message,
                "id": id
        ]]
        //FIXME implement new way
        /*
        return	[
            "code":422
            "status": "ok",
            "message":message ,
            "messageCode":messageCode,
            "id":id
        ]
        */
    }

    //HTTP status codes
/*
The following table describes what various HTTP status codes mean in the context of the our Rest APIs.
Code 	Explanation
200 OK 	No error.
** FUTURE 201 CREATED 	Creation of the object was successful.
** FUTURE 304 FUTURE
400 BAD REQUEST 	Invalid request URI or header, or unsupported nonstandard parameter.
401 UNAUTHORIZED 	Authorization required.
*** 403 FORBIDDEN 		Unsupported standard parameter, or authentication or authorization failed.
404 NOT FOUND 		Standard - Resource (such as a feed or entry) not found.
409 CONFLICT 		Validation error or the version number doesn't match resource's latest version number.
422 UNPROCESSABLE ENTITY 		Validation error or the version number doesn't match resource's latest version number.

500 INTERNAL SERVER ERROR 	Internal error. This is the default code that is used for all unrecognized server errors.
*/
}
