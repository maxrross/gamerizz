package main

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	"github.com/joho/godotenv"
)

func main() {
  err := godotenv.Load(".env")
  if err != nil {
    fmt.Println("Error loading .env file")
    return
  }

  r := gin.Default()

  // The JWT middleware
  AUTH0_URL, _ := url.Parse(os.Getenv("AUTH0_URL"))
  AUTH0_AUDIENCE := os.Getenv("AUTH0_AUDIENCE")

  auth0Provider := jwks.NewCachingProvider(AUTH0_URL, time.Duration(5 * time.Minute))

  jwtValidator, _ := validator.New(auth0Provider.KeyFunc, validator.RS256, AUTH0_URL.String(), []string{AUTH0_AUDIENCE})


  jwtMiddleWare := jwtmiddleware.New(jwtValidator.ValidateToken)
  r.Use(adapter.Wrap(jwtMiddleWare.CheckJWT))

  
  r.GET("/ping", adapter.Wrap(jwtMiddleWare.CheckJWT), func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      
      "message": "pong",
    })
  })
  r.Run() 
}