describe("Appointments", () => {
    beforeEach(() => {
      cy.request("GET", "/api/debug/reset");
      cy.visit("/");
      cy.contains("Monday");
    });
  
    it("should book an interview", () => {
      cy.get("[alt=Add]")
        .first()
        .click();
  
      cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
      cy.get('[alt="Sylvia Palmer"]').click();
  
      cy.contains("Save").click();
  
      cy.contains(".appointment__card--show", "Lydia Miller-Jones");
      cy.contains(".appointment__card--show", "Sylvia Palmer");
    });
  
    it("should cancel an interview", () => {
      // Click the delete button for an existing appointment
      cy.get("[alt=Delete]").click();
  
      // Click the confirm button
      cy.contains("Confirm").click();
  
      // Ensure the "Deleting" indicator is shown
      cy.contains("Deleting").should("exist");
  
      // Ensure the "Deleting" indicator is removed
      cy.contains("Deleting").should("not.exist");
  
      // Ensure the appointment slot is empty
      cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
    });
  });
  