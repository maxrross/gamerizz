//Detail work you've completed in Sprint 2

Zachary:
Implemented the unit tests for the backend--testing various aspects of the searchGames function. These tests
check to see if our search is appropriately accessing the database of games and returning their IDs and Names.
One of the tests also makes sure we are only returning the first 20 games.

//List unit tests and Cypress test for frontend

//List unit tests for backend
TestSearchGamesID() -- verifies the first game ID returned from our search is what we would expect from our database
TestSearchGamesName() -- verifies the first game Name returned from our search is what we would expect from our database
TestSearchGamesCount() -- verifies that our search is limited to the first 20 objects (the size of the array returned should be 20)
(note our tests won't run without our API access key, which has been omitted from the test file for security reasons)

//Add documentation for your backend API 
