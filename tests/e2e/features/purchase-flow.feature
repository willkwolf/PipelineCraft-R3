# language: en
@smoke @regression
Feature: Complete Purchase Flow
  As a customer
  I want to purchase products from SauceDemo
  So that I can complete my shopping

  Background:
    Given the user is on the SauceDemo homepage

  @happy-path
  Scenario: Successful purchase of products
    Given the user logs in with valid credentials
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    Then the shopping cart should show 2 items
    When the user proceeds to checkout
    And the user fills checkout information with:
      | firstName | lastName | postalCode |
      | John      | Doe      | 12345      |
    And the user completes the purchase
    Then the user should see the order confirmation message "Thank you for your order!"

  Scenario: Purchase single product
    Given the user logs in with valid credentials
    When the user adds "Sauce Labs Bolt T-Shirt" to the cart
    Then the shopping cart should show 1 item
    When the user proceeds to checkout
    And the user fills checkout information with:
      | firstName | lastName | postalCode |
      | Jane      | Smith    | 54321      |
    And the user completes the purchase
    Then the user should see the order confirmation message "Thank you for your order!"
