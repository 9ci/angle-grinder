package agdemo.api

import agdemo.Note
import agdemo.Org
import agdemo.User
import gorm.tools.Pager
import gorm.tools.beans.BeanPathTools
import gorm.tools.hibernate.criteria.CriteriaUtils
import grails.converters.JSON

class OrgController extends BaseDomainController {

    def domainClass = Org
    def ajaxGrid = true

    def selectFields = ["*"]

    def index() {
    }

    protected def listCriteria() {
        def pager = new Pager(params)
        def crit = domainClass.createCriteria()

        def filters = params.filters ? JSON.parse(params.filters) : null
        def qslike = (filters?.quickSearch) ? (filters?.quickSearch + "%") : null

        def datalist = crit.list(max: pager.max, offset: pager.offset) {
            if (qslike) {
                or {
                    ilike 'name', qslike
                    ilike 'num', qslike
                }
            }

            if (filters?.name)
                ilike 'name', filters.name + "%"

            if (filters?.num)
                ilike 'num', filters.num + "%"
            if (filters?.id)
                eq 'id', filters.id.toLong()
            if (filters?.ids)
                inList 'id', (filters.ids as Long[])
            if (filters?.zone)
                eq 'timeZone', filters.zone
            if (filters?.zones)
                inList 'timeZone', (filters.zones as String[])
            CriteriaUtils.applyOrder(params, delegate)
        }

        return datalist
    }

    def picklist() {
        def pager = new Pager(params)
        def crit = domainClass.createCriteria()
        def qslike = (params.q) ? (params.q + "%") : null
        def datalist = crit.list(max: pager.max, offset: pager.offset) {
            if (qslike && qslike != '*%') {
                or {
                    ilike 'name', qslike
                    ilike 'num', qslike
                }
            }

            if (params.sort)
                order(params.sort, params.order)
        }

        def pagedList = pagedList(datalist)
        render pagedList.jsonData as JSON
    }

    // retrieves all orgs
    def listAll() {
        def orgs = Org.findAll()
        render orgs as JSON
    }

    def get() {
        def org = Org.get(params.id)
        if (org) {
            render BeanPathTools.buildMapFromPaths(org, selectFields) as JSON
        } else {
            notFound params.id
        }
    }

    def saveOrUpdate() {
        try {
            def entity = params.id ? repo.update(params) : repo.create(params)
            render BeanPathTools.buildMapFromPaths(entity, selectFields) as JSON
        } catch (Exception e) {
            log.error("saveJson with error: $e.message", e)
            Map errResponse = errorMessageService.buildErrorResponse(e)
            response.status = errResponse.code
            render errResponse as JSON
        }
    }

    def listUsers() {
        def pager = new Pager(params as Map)
        def crit = User.createCriteria()

        def filters = params.filters ? JSON.parse(params.filters) : null
        def qslike = (filters?.quickSearch) ? (filters?.quickSearch + "%") : null

        def datalist = crit.list(max: pager.max, offset: pager.offset) {
            contact {
                org {
                    eq "id", params.id.toLong()
                }
            }

            if (qslike) {
                or {
                    ilike "login", qslike
                    ilike "contact.lastName", qslike
                    ilike "contact.firstName", qslike
                    ilike "contact.email", qslike
                }
            }

            def fcontact = filters?.contact

            if (fcontact?.name) {
                contact {
                    or {
                        ilike 'lastName', fcontact.name
                        ilike 'firstName', fcontact.name
                    }

                }
            }

            if (fcontact?.email)
                contact {
                    ilike 'contact.email', fcontact.email
                }

            if (filters?.login)
                ilike 'login', filters.login

            if (params.sort)
                order(params.sort, params.order)
        }

        def pagedList = pager.setupData(datalist, ["*", "contact.*"])
        render pagedList.jsonData as JSON
    }

    def listNotes() {
        def pager = new Pager(params)
        def crit = Note.createCriteria()

        def filters = params.filters ? JSON.parse(params.filters) : null
        def qslike = (filters?.quickSearch) ? (filters?.quickSearch + "%") : null

        def datalist = crit.list(max: pager.max, offset: pager.offset) {
            eq "org.id", params.id.toLong()

            if (qslike) {
                or {
                    ilike "name", qslike
                    ilike "content", qslike
                }
            }

            if (params.sort)
                order(params.sort, params.order)
        }

        def pagedList = pagedList(datalist)
        render pagedList.jsonData as JSON
    }

    def massUpdate() {
        def ids = request.JSON.ids
        def params = request.JSON.data

        def data = []

        def orgs = domainClass.getAll(ids)
        orgs.each { org ->
            org.timeZone = params.timeZone
            org.save()

            data.push BeanPathTools.buildMapFromPaths(org, selectFields)
        }

        response.status = 200
        def results = [data: data, errors: []]
        render results as JSON
    }
}
