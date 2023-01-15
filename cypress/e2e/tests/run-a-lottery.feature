Feature: User runs the lottery on secret santa website

  Scenario: User logs in successfully
    Given user is on secret santa login page
    When user logs in with table
      | login                  | password |
      | shevtma+test@gmail.com | test1234 |
    Then user is on secret santa dashboard page

  Scenario: User creates a new box
    Given user is on secret santa dashboard page
    When user creates new box as "NewBoxName" and "55" and "Евро"
    Then new box is created as "NewBoxName"

  Scenario: Friends of the user approve the lottery
    Given user gets an invitation link
    When friend as "shevtma+test1@gmail.com" and "test1234" approves the lottery
    Then the lottery is approved
    When friend as "shevtma+test2@gmail.com" and "test1234" approves the lottery
    Then the lottery is approved
    When friend as "shevtma+test3@gmail.com" and "test1234" approves the lottery
    Then the lottery is approved

  Scenario: The user can run he lottery
    Given user is on secret santa login page
    And user logs in as "shevtma+test@gmail.com" and "test1234"
    And the box "NewBoxName" exists
    When the user starts the lottery for the box "NewBoxName"
    Then the lottery has been run successfully

  Scenario: Friends of the user have notifications in their accounts
    Given user is on secret santa login page
    And user logs in as "<login>" and "<password>"
    When user clicks on a notification link
    Then user can see the notification about the lottery in the box "NewBoxName"
    Examples:
      | login                   | password |
      | shevtma+test1@gmail.com | test1234 |
      | shevtma+test2@gmail.com | test1234 |
      | shevtma+test3@gmail.com | test1234 |

  Scenario: Delete the box after test
    Then Delete the box after test
