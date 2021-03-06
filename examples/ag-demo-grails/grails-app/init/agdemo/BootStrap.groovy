import agdemo.OrgShowCase
import agdemo.OrgShowCaseRepo

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import groovy.json.JsonSlurper

import agdemo.Contact
import agdemo.Org
import agdemo.OrgRepo
import agdemo.User
import grails.converters.JSON
import grails.core.GrailsApplication

class BootStrap {

    OrgRepo orgRepo
    OrgShowCaseRepo orgShowCaseRepo
    GrailsApplication grailsApplication

    def init = { servletContext ->
        JSON.registerObjectMarshaller(Date) {
            //Added JSON marshaller for dates to avoid time zone applying
            return it.format("yyyy-MM-dd'T'HH:mm:ss")
        }
        JSON.registerObjectMarshaller(LocalDate) { LocalDate ld ->
            //Added JSON marshaller for dates to avoid time zone applying
            return DateTimeFormatter.ISO_LOCAL_DATE.format((LocalDate)ld)
        }
        JSON.registerObjectMarshaller(LocalDateTime) { LocalDateTime ld ->
            //Added JSON marshaller for dates to avoid time zone applying
            return DateTimeFormatter.ISO_LOCAL_DATE_TIME.format((LocalDateTime)ld)
        }

        def contactFile = grailsApplication.mainContext.getResource("classpath:contact.json")
        def userFile = grailsApplication.mainContext.getResource("classpath:user.json")
        def orgFile = grailsApplication.mainContext.getResource("classpath:org.json")
        def orgs = new JsonSlurper().parse(orgFile.getInputStream())
        OrgShowCase orgShowCase = OrgShowCase.repo.create([flush: true], [name: "name"] )
        orgs.each {
            it.description = (it.description.size() >= 255) ? it.description[0..254] : it.description
            it.orgShowCaseId  = 1
            orgRepo.create(it)
        }

        def contacts = new JsonSlurper().parse(contactFile.getInputStream())
        contacts.eachWithIndex { it, i ->
            Contact contact = new Contact(it)
            contact.org = Org.get(i + 1)
            contact.persist()
        }

        def users = new JsonSlurper().parse(userFile.getInputStream())
        users.eachWithIndex { it, i ->
            User user = new User(it)
            user.passwd = it.passwd
            user.contact = Contact.get(i + 1)
            user.persist()
        }
    }

    def destroy = {}
}
