const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const generalElements = require("../../fixtures/pages/general.json");
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../../fixtures/pages/inviteeDashboardPage.json");
const lotteryPage = require("../../fixtures/pages/lotteryPage.json");
//import { faker } from "@faker-js/faker";

//let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
//let maxAmount = 55;
//let currency = "Евро";
let inviteLink = "";
let newBoxId = "";

Given("user is on secret santa login page", () => {
  cy.visit("/login");
});

When("user logs in", () => {
  cy.login(users.userAuthor.email, users.userAuthor.password);
});

When("user logs in as {string} and {string}", function (login, password) {
  cy.login(login, password);
});

When("user logs in with table", function (dataTable) {
  cy.login(dataTable.hashes()[0].login, dataTable.hashes()[0].password);
});

Then("user is on dashboard page", () => {
  cy.contains(
    "Организуй тайный обмен подарками между друзьями или коллегами"
  ).should("be.visible");
});

Given("user is on secret santa dashboard page", () => {
  cy.contains(
    "Организуй тайный обмен подарками между друзьями или коллегами"
  ).should("be.visible");
});

When(
  "user creates new box as {string} and {string} and {string}",
  (newBoxName, maxAmount, currency) => {
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxIdSelector)
      .invoke("val")
      .then((boxId) => {
        newBoxId = boxId;
      });
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
  }
);

Then("new box is created as {string}", (newBoxName) => {
  cy.get(dashboardPage.createdBoxNameSelector).should("have.text", newBoxName);
  cy.get(dashboardPage.headerElementsSelector)
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

Given("new box was created as {string}", (newBoxName) => {
  cy.get(dashboardPage.createdBoxNameSelector).should("have.text", newBoxName);
});

// When("New box is deleted", () => {
//   let connectSIDcookie = "";
//   cy.request({
//     method: "POST",
//     url: "api/login",
//     body: {
//       email: users.userAuthor.email,
//       password: users.userAuthor.password,
//     },
//   }).then((response) => {
//     expect(response.status).to.eq(200);
//   });
//   cy.request({
//     method: "GET",
//     url: "api/session",
//   }).then((response) => {
//     let cookie = response.requestHeaders["cookie"];
//     let arrayofcookies = cookie.split(";");
//     connectSIDcookie = arrayofcookies[arrayofcookies.length - 1];
//   });

//   cy.request({
//     method: "DELETE",
//     url: `api/box/${newBoxId}`,
//     headers: {
//       cookie: connectSIDcookie,
//     },
//   }).should((response) => {
//     expect(response.status).to.eq(200);
//   });
// });

//Then Deletion status code is OK

