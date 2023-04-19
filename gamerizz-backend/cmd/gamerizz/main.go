package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PlatformInfo struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Platform struct {
	Platform PlatformInfo `json:"platform"`
}

type Game struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	BackgroundImage string `json:"background_image"`
	Description string `json:"description"`
	Released string `json:"released"`
	Rating float64 `json:"rating"`
	Platforms []Platform `json:"platforms"`
}

// Response represents a response object returned by the API
type Response struct {
	Count int    `json:"count"`
	Next  string `json:"next"`
	Prev  string `json:"prev"`
	Games []Game `json:"results"`
}

func searchGames( title string, RAWG_KEY string) []Game {
	apiKey := RAWG_KEY
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.rawg.io/api/games?search=" + title, nil)
	if err != nil {
		log.Fatal(err)
	}
	q := req.URL.Query()
	q.Add("key", apiKey)
	req.URL.RawQuery = q.Encode()
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	var data Response
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Fatal(err)
	}

	return data.Games
}


func getGameData( title string, RAWG_KEY string) Game {
	apiKey := RAWG_KEY
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.rawg.io/api/games/" + title, nil)
	if err != nil {
		log.Fatal(err)
	}
	q := req.URL.Query()
	q.Add("key", apiKey)
	req.URL.RawQuery = q.Encode()
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	var data Game
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Fatal(err)
	}
	return data
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
		return
	}

	var ctx = context.TODO()

	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("games").Collection("game")

	r := gin.Default()

	// The JWT middleware
	AUTH0_URL, _ := url.Parse(os.Getenv("AUTH0_URL"))
	AUTH0_AUDIENCE := os.Getenv("AUTH0_AUDIENCE")

	auth0Provider := jwks.NewCachingProvider(AUTH0_URL, time.Duration(5*time.Minute))

	jwtValidator, _ := validator.New(auth0Provider.KeyFunc, validator.RS256, AUTH0_URL.String(), []string{AUTH0_AUDIENCE})

	jwtMiddleWare := jwtmiddleware.New(jwtValidator.ValidateToken)

	r.Use(cors.Default())


	r.GET("/authenticated", adapter.Wrap(jwtMiddleWare.CheckJWT), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "user authenticated",
		})
	})

	r.GET("/topGames", func(c *gin.Context) {
		apiKey := os.Getenv("RAWG_KEY")
		client := &http.Client{}
		req, err := http.NewRequest("GET", "https://api.rawg.io/api/games", nil)
		if err != nil {
			log.Fatal(err)
		}
		q := req.URL.Query()
		q.Add("key", apiKey)
		q.Add("page_size", "25")
		req.URL.RawQuery = q.Encode()
		resp, err := client.Do(req)
		if err != nil {
			log.Fatal(err)
		}
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
		}
		var data Response
		err = json.Unmarshal(body, &data)
		if err != nil {
			log.Fatal(err)
		}

		c.JSON(http.StatusOK, gin.H{
			"message": data.Games,
		})
	})

	r.GET("/games", func(c *gin.Context) {
		games := searchGames(c.Query("title"), os.Getenv("RAWG_KEY"))
		c.JSON(http.StatusOK, gin.H{
			"message": games,
		})
	})

	r.GET("/game", func(c *gin.Context) {
		gameData := getGameData(c.Query("title"), os.Getenv("RAWG_KEY"))
		filter := bson.M{"name": c.Query("title")}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		var upvotes int32 = 0
		reviews := primitive.A{}

		if game != nil {
			upvotes = game["upvotes"].(int32)
			reviews = game["reviews"].(primitive.A)

		}

		c.JSON(http.StatusOK, gin.H{
			"gameInfo": gameData,
			"upvoteCount": upvotes,
			"reviews": reviews,
	
		})
	})

	r.GET("/upvoteCount", func(c *gin.Context) {
		filter := bson.M{"name": c.Query("title")}
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
		filter := bson.M{"name": c.Query("title")}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)
	
		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		var upvotes int32 = 0

		if game == nil {
			game = bson.M{"name": c.Query("title"), "upvotes": upvotes}
			_, err = collection.InsertOne(context.Background(), game)
		}

		
		if game != nil {
			upvotes = game["upvotes"].(int32)
			upvotes += 1
			update := bson.M{"$set": bson.M{"upvotes": upvotes}}
			_, err = collection.UpdateOne(context.Background(), filter, update)
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "upvoted",
			"upvoteCount": upvotes,
		})
	})

	r.GET("/downvote", func(c *gin.Context) {

		filter := bson.M{"name": c.Query("title")}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		var upvotes int32 = 0

		if game == nil {
			game = bson.M{"name": c.Query("title"), "upvotes": upvotes}
			_, err = collection.InsertOne(context.Background(), game)
		}

		if game != nil {
			upvotes = game["upvotes"].(int32)
			upvotes -= 1
			update := bson.M{"$set": bson.M{"upvotes": upvotes}}
			_, err = collection.UpdateOne(context.Background(), filter, update)
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "downvoted",
			"upvoteCount": upvotes,
		})
	})


	r.GET("/writeReview", func(c *gin.Context) {
		filter := bson.M{"name": c.Query("title")}
		var game bson.M
		err = collection.FindOne(context.Background(), filter).Decode(&game)

		if err != nil && err != mongo.ErrNoDocuments {
			log.Fatal(err)
		}

		var upvotes int32 = 0

		review := bson.M{"author": c.Query("author"), "review": c.Query("review"), "rating": c.Query("rating")}

		if game == nil {
			game = bson.M{"name": c.Query("title"), "upvotes": upvotes, "reviews": []bson.M{review}}
			_, err = collection.InsertOne(context.Background(), game)
		} else {
			update := bson.M{"$push": bson.M{"reviews": review}}
			_, err = collection.UpdateOne(context.Background(), filter, update)
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "review written",

		})
	})
	r.Run()
}
