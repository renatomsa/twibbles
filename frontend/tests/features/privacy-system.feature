Feature: Privacy System

  Scenario: Change profile to private
    When I click the privacy toggle button
    Then my profile should be marked as private
    And other users should see "Request to Follow" instead of "Follow"

  Scenario: Change profile to public
    Given my profile is private
    When I click the privacy toggle button
    Then my profile should be marked as public
    And other users should see "Follow" instead of "Request to Follow"

  Scenario: View private profile content
    Given I am logged in as "user2"
    And "user1" has a private profile
    When I visit "user1"'s profile
    Then I should not see their posts
    And I should not see their followers list
    And I should not see their following list

  Scenario: View public profile content
    Given I am logged in as "user2"
    And "user1" has a public profile
    When I visit "user1"'s profile
    Then I should see their posts
    And I should see their followers list
    And I should see their following list 