package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"sort"
	"text/template"
)

type Card struct {
	Name        string `json:"name"`
	Category    string `json:"category"`
	Order       int    `json:"order"`
	Date        string `json:"date"`
	Link        string `json:"link"`
	Colour      string `json:"colour"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

func main() {
	tmpl := parseTemplate()
	cards := parseJSON()

	f := createFile()
	defer f.Close()

	err := tmpl.Execute(f, cards)
	if err != nil {
		log.Fatal(err)
	}
}

func parseTemplate() *template.Template {
	tmpl, err := template.ParseFiles("./template.gohtml")
	if err != nil {
		log.Fatal(err)
	}

	return tmpl
}

func parseJSON() *[]Card {
	data, err := ioutil.ReadFile("./cards.json")
	if err != nil {
		log.Fatal(err)
	}

	var cards []Card
	err = json.Unmarshal(data, &cards)
	if err != nil {
		log.Fatal(err)
	}

	sort.Slice(cards, func(i, j int) bool {
		return cards[i].Order < cards[j].Order
	})

	return &cards
}

func createFile() *os.File {
	f, err := os.Create("../dist/index.html")
	if err != nil {
		log.Fatal(err)
	}

	return f
}
