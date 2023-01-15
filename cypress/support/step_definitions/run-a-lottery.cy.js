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
import { faker } from "@faker-js/faker";

//let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
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

Given("user gets an invitation link", () => {
  cy.get(generalElements.submitButton).click();
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
    });
  cy.clearCookies();
});

When(
  "friend as {string} and {string} approves the lottery",
  (login, password) => {
    let wishes =
      faker.word.noun() +
      " " +
      faker.word.adverb() +
      " " +
      faker.word.adjective();

    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(login, password);
    cy.contains("Создать карточку участника").should("exist");
    cy.createAParticipantCard(wishes);
  }
);

Then("the lottery is approved", () => {
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
  cy.clearCookies();
});

Given("the box {string} exists", (newBoxName) => {
  cy.get(dashboardPage.boxesHrefSelector).click();
  cy.contains("Мои Коробки").should("exist");
  cy.contains(newBoxName).should("exist");
});

When("the user starts the lottery for the box {string}", (newBoxName) => {
  cy.contains(newBoxName).click({ timeout: 2000 });
  cy.get(lotteryPage.lotteryStartSelector).click({ force: true });
  cy.get(generalElements.submitButton).click();
  cy.get(lotteryPage.lotteryApproveSelector).click();
});

Then("the lottery has been run successfully", () => {
  cy.contains("Жеребьевка проведена").should("exist");
  cy.clearCookies();
});

When("user clicks on a notification link", () => {
  cy.get(dashboardPage.showNotificationsSelector)
    .should("exist")
    .click({ force: true });
});

Then(
  "user can see the notification about the lottery in the box {string}",
  (newBoxName) => {
    cy.get(dashboardPage.notificationTextSelector).should(
      "have.text",
      `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`
    );
    cy.get(dashboardPage.readAllNotificationsSelector).click();
    cy.clearCookies();
  }
);

Then("Delete the box after test", () => {
  let connectSIDcookie = "";
  cy.request({
    method: "POST",
    url: "api/login",
    body: {
      email: users.userAuthor.email,
      password: users.userAuthor.password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
  cy.request({
    method: "GET",
    url: "api/session",
  }).then((response) => {
    let cookie = response.requestHeaders["cookie"];
    let arrayofcookies = cookie.split(";");
    connectSIDcookie = arrayofcookies[arrayofcookies.length - 1];
  });

  cy.request({
    method: "DELETE",
    url: `api/box/${newBoxId}`,
    headers: {
      cookie: connectSIDcookie,
    },
  }).should((response) => {
    expect(response.status).to.eq(200);
  });
});

