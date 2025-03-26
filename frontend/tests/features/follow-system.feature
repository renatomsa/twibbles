Feature: Follow System

  Background: 
    Given I am logged in as "user1"
    And I am on the profile page

  Scenario: Follow a public user
    Given I am viewing "user2"'s public profile
    When I click the "Follow" button
    Then I should see the button change to "Unfollow"
    And "user2" should appear in my following list
    And I should appear in "user2"'s followers list

  Scenario: Request to follow a private user
    Given I am viewing "user3"'s private profile
    When I click the "Request to Follow" button
    Then I should see the button change to "Cancel Request"
    And the request should appear in "user3"'s follow requests list

  Scenario: Accept follow request
    Given I am logged in as "user3"
    And I have a follow request from "user1"
    When I navigate to my follow requests
    And I click "Accept" for "user1"'s request
    Then "user1" should appear in my followers list
    And I should appear in "user1"'s following list

  Scenario: Reject follow request
    Given I am logged in as "user3"
    And I have a follow request from "user1"
    When I navigate to my follow requests
    And I click "Reject" for "user1"'s request
    Then "user1" should not appear in my followers list
    And the request should be removed from the list

  Scenario: Unfollow user
    Given I am following "user2"
    When I click the "Unfollow" button on "user2"'s profile
    Then I should see the button change to "Follow"
    And "user2" should not appear in my following list
    And I should not appear in "user2"'s followers list

  Scenario: Cancel follow request
    Given I have sent a follow request to "user3"
    When I click the "Cancel Request" button on "user3"'s profile
    Then I should see the button change to "Request to Follow"
    And the request should be removed from "user3"'s follow requests list

  Scenario: View followers list
    Given I have followers "user2" and "user3"
    When I navigate to my followers tab
    Then I should see "user2" and "user3" in the list
    And each user should have appropriate follow buttons

  Scenario: View following list
    Given I am following "user2" and "user3"
    When I navigate to my following tab
    Then I should see "user2" and "user3" in the list
    And each user should have appropriate follow buttons 