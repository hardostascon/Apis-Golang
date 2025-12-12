package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
)

type GeoResponse struct {
	Results []struct {
		Name      string  `json:"name"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
		Country   string  `json:"country"`
	} `json:"results"`
}

type OpenMeteoResponse struct {
	CurrentWeather struct {
		Temperature   float64 `json:"temperature"`
		Windspeed     float64 `json:"windspeed"`
		WindDirection float64 `json:"winddirection"`
		WeatherCode   int     `json:"weathercode"` // Código numérico del estado (ej: 0 = despejado)
		Time          string  `json:"time"`
	} `json:"current_weather"`
}

func ConsumirApi(Ciudad string) (*OpenMeteoResponse, error) {

	lat, lon, foundName, err := getCoordinates(Ciudad)

	if err != nil {
		log.Fatal("Error buscando ciudad:", err)
	}
	fmt.Printf("📍 Ciudad encontrada: %s (Lat: %.2f, Lon: %.2f)\n", foundName, lat, lon)

	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current_weather=true", lat, lon)
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal("Error al hacer la solicitud:", err)
	}
	defer resp.Body.Close()
	var weatherResp OpenMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&weatherResp); err != nil {
		return nil, err
	}

	return &weatherResp, nil

}

func getCoordinates(ciudad string) (float64, float64, string, error) {
	safeCity := url.QueryEscape(ciudad)
	url := fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1&language=es&format=json", safeCity)
	resp, err := http.Get(url)
	if err != nil {
		return 0, 0, "", err
	}
	defer resp.Body.Close()

	var geoResp GeoResponse
	if err := json.NewDecoder(resp.Body).Decode(&geoResp); err != nil {
		return 0, 0, "", err
	}

	if len(geoResp.Results) == 0 {
		return 0, 0, "", fmt.Errorf("no se encontró la ciudad: %s", ciudad)
	}

	// Retornamos latitud, longitud y el nombre oficial encontrado
	return geoResp.Results[0].Latitude, geoResp.Results[0].Longitude, geoResp.Results[0].Name, nil
}

func Serverwheather(w http.ResponseWriter, r *http.Request) {
	ciudad := r.URL.Query().Get("ciudad")
	if ciudad == "" {
		http.Error(w, "Debe enviar el parámetro ?ciudad=", http.StatusBadRequest)
		return
	}

	weatherData, err := ConsumirApi(ciudad)

	if err != nil {
		http.Error(w, "No se pudo obtener el clima: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weatherData)
}
