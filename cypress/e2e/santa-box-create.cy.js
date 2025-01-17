const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
const lotteryPage = require("../fixtures/pages/lotteryPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink = "";
  let newBoxId = "";

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
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
    cy.get(dashboardPage.createdBoxNameSelector).should(
      "have.text",
      newBoxName
    );
    cy.get(dashboardPage.headerElementsSelector)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("approve as user1", () => {
    let wishes =
      faker.word.noun() +
      " " +
      faker.word.adverb() +
      " " +
      faker.word.adjective();

    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users.user1.email, users.user1.password);
    cy.contains("Создать карточку участника").should("exist");
    cy.createAParticipantCard(wishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user2", () => {
    let wishes =
      faker.word.noun() +
      " " +
      faker.word.adverb() +
      " " +
      faker.word.adjective();

    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users.user2.email, users.user2.password);
    cy.contains("Создать карточку участника").should("exist");
    cy.createAParticipantCard(wishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user3", () => {
    let wishes =
      faker.word.noun() +
      " " +
      faker.word.adverb() +
      " " +
      faker.word.adjective();

    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users.user3.email, users.user3.password);
    cy.contains("Создать карточку участника").should("exist");
    cy.createAParticipantCard(wishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("Start the lottery", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.get(dashboardPage.boxesHrefSelector).click();
    cy.contains("Мои Коробки").should("exist");
    cy.contains(newBoxName).click({ timeout: 2000 });
    cy.get(lotteryPage.lotteryStartSelector).click({ force: true });
    cy.get(generalElements.submitButton).click();
    cy.get(lotteryPage.lotteryApproveSelector).click();
    cy.contains("Жеребьевка проведена").should("exist");
    cy.clearCookies();
  });

  it("Check notifications for user1", () => {
    cy.visit("/login");
    cy.login(users.user1.email, users.user1.password);
    cy.checkNotifications(newBoxName);
    cy.clearCookies();
  });

  it("Check notifications for user2", () => {
    cy.visit("/login");
    cy.login(users.user2.email, users.user2.password);
    cy.checkNotifications(newBoxName);
    cy.clearCookies();
  });

  it("Check notifications for user3", () => {
    cy.visit("/login");
    cy.login(users.user3.email, users.user3.password);
    cy.checkNotifications(newBoxName);
    cy.clearCookies();
  });

  after("delete box", () => {
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
});

