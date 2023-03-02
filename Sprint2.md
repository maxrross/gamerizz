## Detail work you've completed in Sprint 2

Zachary:
Implemented the unit tests for the backend--testing various aspects of the searchGames function. These tests
check to see if our search is appropriately accessing the database of games and returning their IDs and Names.
One of the tests also makes sure we are only returning the first 20 games.

Max:
Created a search bar for the search page and display results after fetching the backend API for games. 
Dynamically loads games as the user types in their query.

Blake: 
Utilized the Rawg.io api to have access to over 500,000 game titles. Created a new backend endpoint that takes in a request from the frontend
and then processes and sends the request to Rawg. It then returns only the needed information. I also helped with some of the search bar functionality
on the frontend.

## List Cypress test for frontend

Max:
Implemented unit testing for the search bar using Cypress. This test checks if the component can load correctly and display results.

## List unit tests for backend

TestSearchGamesID() -- verifies the first game ID returned from our search is what we would expect from our database

TestSearchGamesName() -- verifies the first game Name returned from our search is what we would expect from our database

TestSearchGamesCount() -- verifies that our search is limited to the first 20 objects (the size of the array returned should be 20)

(note our tests won't run without our API access key, which has been omitted from the test file for security reasons)

## Add documentation for your backend API 

There is a new endpoint called /games. When a get request is sent to it with a title param, it responds with all the games that correspond to that title.
