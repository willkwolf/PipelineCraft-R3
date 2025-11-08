# language: en
@negative @regression
Feature: Login Failure Scenarios
  As a system
  I want to prevent unauthorized access
  So that only valid users can log in

  Background:
    Given the user is on the SauceDemo homepage

  @error-handling
  Scenario: Login with invalid username
    When the user attempts to login with username "invalid_user" and password "secret_sauce"
    Then the user should see an error message
    And the error message should contain "Username and password do not match"

  Scenario: Login with invalid password
    When the user attempts to login with username "standard_user" and password "wrong_password"
    Then the user should see an error message
    And the error message should contain "Username and password do not match"

  Scenario: Login with locked out user
    When the user attempts to login with username "locked_out_user" and password "secret_sauce"
    Then the user should see an error message
    And the error message should contain "Sorry, this user has been locked out"

  Scenario: Login with empty credentials
    When the user attempts to login with username "" and password ""
    Then the user should see an error message
    And the error message should contain "Username is required"
