package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/Wheater", Serverwheather)

	log.Println("API corriendo en http://localhost:8989")
	http.ListenAndServe(":8989", nil)
}
