## Work we completed in Sprint 3

### Backend
Blake:
Added the /game route which gives new game information and invote count given a game's title. Added a working upvote/downvote system that works all of RAWG's 500,000 game titles. Created new unit tests for the backend. Helped implement dynamic routes on the frontend. Assisted with creating unit tests for the frontend.

Zachary:
Zachary had surgery so was unable to record the video with his. Zachary helped out throughout the process with the backend.

### Frontend
Max: Made light and dark mode for UI, implemented individual page generation and linking for every game, each page contains unique information about the game and an upvote and downvote count globally managed via the backend.

Brogan: Made unit test

## Frontend unit tests
1. Testing renders home page without crashing
2. renders SearchBar component
3. renders Loader component

## Backend unit tests
TestSearchGamesID() -- verifies the first game ID returned from our search is what we would expect from our database

TestSearchGamesName() -- verifies the first game Name returned from our search is what we would expect from our database

TestSearchGamesCount() -- verifies that our search is limited to the first 20 objects (the size of the array returned should be 20)

TestGetGameDataID() -- verifies that individual games are able to be looked up

(note our tests won't run without our API access key, which has been omitted from the test file for security reasons)

## Show updated documentation for your backend API
We implemented several new routes. 
1. The /game route gives game information and upvote count for a specific game.
2. The /upvoteCount route takes in a specific game and outputs the upvote count of it.
3. The /upvote route upvotes a game.
4. THe /downvote route downvotes a game.
