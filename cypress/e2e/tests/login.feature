Feature: User runs the lottery on secret santa website

  Scenario: User logs in successfully
    Given user is on secret santa login page
    # When user logs in
    # When user logs in as "shevtma+test@gmail.com" and "test1234"
    #When user logs in as "<login>" and "<password>"
    When user logs in with table
      | login                  | password |
      | shevtma+test@gmail.com | test1234 |

    Then user is on dashboard page
  #Examples:
  #  | login                   | password |
  #  | shevtma+test@gmail.com  | test1234 |
  #  | shevtma+test1@gmail.com | test1234 |
  #  | shevtma+test2@gmail.com | test1234 |
  #  | shevtma+test3@gmail.com | test1234 |

  Scenario: User creates a box
    Given user is on secret santa dashboard page
    When user creates new box as "NewBoxName" and "55" and "Евро"
    Then new box is created as "NewBoxName"


