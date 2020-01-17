import docResMod from '#/docs/src/main'

describe("module: exampleApp.grids", function() {

  beforeEach(angular.mock.module(docResMod));

  return describe("service: exampleGrid", function() {

    it("is defined", inject(exampleGrid => expect(exampleGrid).to.not.be.undefined)
    );

    it("has valid options", inject(function(exampleGrid) {
      const options = exampleGrid();

      expect(options).to.have.property("datatype", "local");
      expect(options).to.have.property("sortname", "id");
      return expect(options).to.have.property("colModel");
    })
    );

    it("can be overridden", inject(function(exampleGrid) {
      const options = exampleGrid({sortname: "name"});
      return expect(options).to.have.property("sortname", "name");
    })
    );

    return describe("colModel", () => it("has valid number of columns", inject(function(exampleGrid) {
      const {
        colModel
      } = exampleGrid();
      return expect(colModel).to.have.length(6);
    })
    ));
  });
});