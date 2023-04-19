## Work we completed in Sprint 4

### Backend
Blake:
Added the /topGames route that shows the top 25 games in RAWG's database. Added the ability to write reviews and get reviews of any game.

Zachary:
Wrote unit tests to check the upvote count of a specific game, to check functionality of the upvote/downvote functions, and to verify the ability
to write a review for any game.


### Frontend
Max: 

Brogan: 
Added unit tests to test to make sure the site shouldn't render the log in and sign up buttons, when the user is not authenticated, and that the site shouldn't render the user profile and sign out button.

## Frontend unit tests
1. Testing renders home page without crashing
2. renders SearchBar component
3. renders Loader component

## Backend unit tests
TestSearchGamesID() -- verifies the first game ID returned from our search is what we would expect from our database

TestSearchGamesName() -- verifies the first game Name returned from our search is what we would expect from our database

TestSearchGamesCount() -- verifies that our search is limited to the first 20 objects (the size of the array returned should be 20)

TestGetGameDataID() -- verifies that individual games are able to be looked up

TestUpvoteCount -- verifies that the upvote count for a given game is what we expect

TestUpvote() -- verifies that the upvote functionality works for a given game

TestDownvote() -- verifies that the downvote functionality works for a given game

TestWriteReview() -- verifies that a review can be written for a game



(note our tests won't run without our API access key, which has been omitted from the test file for security reasons)

## Show updated documentation for your backend API
We implemented several new routes and updated some routes. 
1. The /game route now outputs gamerizz reviews as well.
2. The /writeReview route allows somebody to write a review.
3. The /topGames route shows the top 25 games in RAWG's database.
