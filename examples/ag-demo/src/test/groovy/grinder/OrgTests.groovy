package agdemo

import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(Org)
class OrgTests extends Specification {

    void setup() {
        def existingOrg = new Org(name: "github", num: "123-456")
    }

    void testValidate() {
      when:
        def org = new Org()
        assert !org.validate()
      then:
         2 == org.errors.allErrors.size()
         "Property [{0}] of class [{1}] cannot be null" == org.errors["name"].defaultMessage
         "Property [{0}] of class [{1}] cannot be null" == org.errors["num"].defaultMessage
    }

    void testNameUniquenessValidation() {
      when:
        def org = new Org(name: "github", num: "234-567")
      then:
        org.validate()
    }
}
