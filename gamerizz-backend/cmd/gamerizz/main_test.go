package main

import (
	"testing"
)

var tempKey string = "insert key"

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
