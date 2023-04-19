package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// insert tempKey
var tempKey string = "Use Rawg_Key here"

// test to see if the first game ID matches the ID of Mario
func TestSearchGamesID(t *testing.T) {

	want := 164830
	got := searchGames("Mario", tempKey)
	//print out got to see what it is
	//fmt.Println(got)
	if want != got[0].ID {
		t.Errorf("got %q, wanted %q", got[0].ID, want)
	}
}

// test to see if the first game returned is mario
func TestSearchGamesName(t *testing.T) {

	want := "mario"
	got := searchGames("Mario", tempKey)
	//print out got to see what it is
	//fmt.Println(got)
	if want != got[0].Name {
		t.Errorf("got %q, wanted %q", got[0].Name, want)
	}
}

// only want the first 20 games returned
func TestSearchGamesCount(t *testing.T) {
	want := 20
	got := searchGames("Mario", tempKey)
	//print out got to see what it is
	//fmt.Println(got)
	if want != len(got) {
		t.Errorf("got %q, wanted %q", len(got), want)
	}
}

func TestGetGameDataID(t *testing.T) {
	want := "mario-tennis-aces"
	got := getGameData("mario-tennis-aces", tempKey)
	//print out got to see what it is
	fmt.Println(got)
	if want != got.Slug {
		t.Errorf("got %q, wanted %q", got.ID, want)
	}
}

func setupRouter() *gin.Engine {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
		log.Fatal(err)
	}

	var ctx = context.TODO()

	clientOptions := options.Client().ApplyURI("use MongoDB URI here")

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("games").Collection("game")

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/game", func(c *gin.Context) {
		gameData := getGameData("mario", tempKey)
		filter := bson.M{"name": "mario"}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}
		var upvotes int32 = 0

		if game != nil {
			upvotes = game["upvotes"].(int32)
		}
		c.JSON(http.StatusOK, gin.H{
			"gameInfo":    gameData,
			"upvoteCount": upvotes,
		})
	})

	r.GET("/upvoteCount", func(c *gin.Context) {
		filter := bson.M{"name": "mario"}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}
		var upvotes int32 = 0

		if game != nil {
			upvotes = game["upvotes"].(int32)
		}

		c.JSON(http.StatusOK, gin.H{
			"upvoteCount": upvotes,
		})
	})

	r.GET("/upvote", func(c *gin.Context) {
		filter := bson.M{"name": "mario"}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		var upvotes int32 = 0

		if game == nil {
			game = bson.M{"name": "mario", "upvotes": upvotes}
			_, err = collection.InsertOne(context.Background(), game)
		}

		if game != nil {
			upvotes = game["upvotes"].(int32)
			upvotes += 1
			update := bson.M{"$set": bson.M{"upvotes": upvotes}}
			_, err = collection.UpdateOne(context.Background(), filter, update)
		}

		c.JSON(http.StatusOK, gin.H{
			"message":     "upvoted",
			"upvoteCount": upvotes,
		})
	})

	r.GET("/downvote", func(c *gin.Context) {

		filter := bson.M{"name": "mario"}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		var upvotes int32 = 0

		if game == nil {
			game = bson.M{"name": "mario", "upvotes": upvotes}
			_, err = collection.InsertOne(context.Background(), game)
		}

		if game != nil {
			upvotes = game["upvotes"].(int32)
			upvotes -= 1
			update := bson.M{"$set": bson.M{"upvotes": upvotes}}
			_, err = collection.UpdateOne(context.Background(), filter, update)
		}

		c.JSON(http.StatusOK, gin.H{
			"message":     "downvoted",
			"upvoteCount": upvotes,
		})
	})
	r.GET("/writeReview", func(c *gin.Context) {
		filter := bson.M{"name": "mario"}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		review := bson.M{"author": "Zachary", "review": "test review", "rating": "6"}
		update := bson.M{"$push": bson.M{"reviews": review}}
		_, err = collection.UpdateOne(context.Background(), filter, update)

		c.JSON(http.StatusOK, gin.H{
			"message": "review written",
		})
	})
	return r
}

func TestUpvoteCount(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/upvoteCount", nil)
	router.ServeHTTP(w, req)
	fmt.Println(w.Body.String())
	assert.Equal(t, "{\"upvoteCount\":8}", w.Body.String())
}

func TestUpvote(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/upvote", nil)
	router.ServeHTTP(w, req)
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/upvoteCount", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, "{\"upvoteCount\":9}", w.Body.String())
}

func TestDownvote(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/downvote", nil)
	router.ServeHTTP(w, req)
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/upvoteCount", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, "{\"upvoteCount\":8}", w.Body.String())
}

func TestWriteReview(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/writeReview", nil)
	router.ServeHTTP(w, req)
	fmt.Println(w.Body.String())
	assert.Equal(t, "{\"message\":\"review written\"}", w.Body.String())
}
