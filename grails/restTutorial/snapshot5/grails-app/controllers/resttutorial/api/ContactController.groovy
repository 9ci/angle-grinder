package resttutorial.api

import grails.converters.JSON
import grails.plugin.dao.RestDaoController
import grails.plugin.dao.DaoUtil
import grinder.Pager
import resttutorial.Contact
import static org.springframework.http.HttpStatus.OK

class ContactController extends RestDaoController {
  static responseFormats = ['json']
  static namespace = "api"
  ContactController() {
    super(Contact)
  }

  def inactivate() {
    Contact contact = dao.inactivate(params.contactId as Long)
    respond contact
  }

  def updateDomain(){
    Map result = dao.update(fullParams(params, request))
    DaoUtil.flush()
    result
  }

  @Override
  protected List<Contact> listAllResources(Map params) {
    def crit = Contact.createCriteria()
    def pager = new Pager(params)
    def filters = params.filters ? JSON.parse(params.filters) : null
    def datalist = crit.list(max: pager.max, offset: pager.offset) {
      if (filters) {
        if (filters.firstName){
          ilike "firstName", filters.firstName + "%"
        }
        if (filters.email){
          ilike "email", filters.email + "%"
        }
      }
      if (params.sort)
        order(params.sort, params.order)
    }
    return datalist
  }
}
