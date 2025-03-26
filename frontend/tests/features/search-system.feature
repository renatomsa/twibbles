Feature: Search System

  Scenario: Search for users by name
    When I select the "Users" search type
    And I enter "john" in the search box
    Then I should see users with "john" in their name
    And each user should have their profile picture
    And each user should have their username displayed

  Scenario: Search for posts by location
    When I select the "Location" search type
    And I enter "New York" in the search box
    Then I should see posts tagged with "New York"
    And each post should show its location
    And each post should show the author's name

  Scenario: Search for posts by hashtag
    When I select the "Hashtag" search type
    And I enter "travel" in the search box
    Then I should see posts containing the hashtag "#travel"
    And each post should show its hashtags
    And each post should show the author's name

  Scenario: No search results found
    When I enter "nonexistentuser123" in the search box
    Then I should see a "No users found" message
    And the search results should be empty
    And I should see the search type selector 