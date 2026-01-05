package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

/*
	=========================
	  CORS

=========================
*/
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

/* =========================
   STRUCTS
========================= */

// Geocoding
type GeoResponse struct {
	Results []struct {
		Name        string  `json:"name"`
		Latitude    float64 `json:"latitude"`
		Longitude   float64 `json:"longitude"`
		CountryCode string  `json:"country_code"`
	} `json:"results"`
}

// Open-Meteo (modo moderno)
type OpenMeteoResponse struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`

	Current struct {
		Temperature2m      float64 `json:"temperature_2m"`
		Windspeed10m       float64 `json:"wind_speed_10m"`
		RelativeHumidity2m float64 `json:"relative_humidity_2m"`
		WeatherCode        int     `json:"weather_code"`
		Visibility         float64 `json:"visibility"`
		Time               string  `json:"time"`
	} `json:"current"`

	CurrentUnits struct {
		Temperature2m      string `json:"temperature_2m"`
		Windspeed10m       string `json:"wind_speed_10m"`
		RelativeHumidity2m string `json:"relative_humidity_2m"`
		Visibility         string `json:"visibility"`
	} `json:"current_units"`

	Hourly struct {
		Time               []string  `json:"time"`
		Temperature2m      []float64 `json:"temperature_2m"`
		Windspeed10m       []float64 `json:"wind_speed_10m"`
		RelativeHumidity2m []float64 `json:"relative_humidity_2m"`
	} `json:"hourly"`
}

/*
	=========================
	  CONSUMIR API

=========================
*/
func ConsumirApi(ciudad, pais string, horas int) (*OpenMeteoResponse, error) {

	lat, lon, err := getCoordinates(ciudad, pais)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%.5f&longitude=%.5f"+
			"&current=temperature_2m,wind_speed_10m,relative_humidity_2m,visibility,weather_code"+
			"&current_units=true"+
			"&timezone=America/Bogota&models=gfs_global",
		lat, lon,
	)

	if horas > 0 {
		url += "&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m&models=gfs_global"
	}

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data OpenMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	// Debug real
	fmt.Printf("🌡 %.1f %s\n", data.Current.Temperature2m, data.CurrentUnits.Temperature2m)
	fmt.Printf("💨 %.1f %s\n", data.Current.Windspeed10m, data.CurrentUnits.Windspeed10m)
	fmt.Printf("💧 %.0f %s\n", data.Current.RelativeHumidity2m, data.CurrentUnits.RelativeHumidity2m)
	fmt.Printf("👀 %.0f %s\n", data.Current.Visibility, data.CurrentUnits.Visibility)

	// Limitar horas
	if horas > 0 && len(data.Hourly.Time) > 0 {
		if horas > len(data.Hourly.Time) {
			horas = len(data.Hourly.Time)
		}
		data.Hourly.Time = data.Hourly.Time[:horas]
		data.Hourly.Temperature2m = data.Hourly.Temperature2m[:horas]
		data.Hourly.Windspeed10m = data.Hourly.Windspeed10m[:horas]
		data.Hourly.RelativeHumidity2m = data.Hourly.RelativeHumidity2m[:horas]
	}

	return &data, nil
}

/*
	=========================
	  GEOLOCALIZACIÓN

=========================
*/
func getCoordinates(ciudad, pais string) (float64, float64, error) {

	safeCity := url.QueryEscape(ciudad)
	apiURL := fmt.Sprintf(
		"https://geocoding-api.open-meteo.com/v1/search?name=%s&count=5&language=es",
		safeCity,
	)

	resp, err := http.Get(apiURL)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	var geo GeoResponse
	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return 0, 0, err
	}

	if len(geo.Results) == 0 {
		return 0, 0, fmt.Errorf("ciudad no encontrada")
	}

	if pais != "" {
		pais = strings.ToUpper(pais)
		for _, r := range geo.Results {
			if r.CountryCode == pais {
				return r.Latitude, r.Longitude, nil
			}
		}
		return 0, 0, fmt.Errorf("ciudad no encontrada en el país indicado")
	}

	return geo.Results[0].Latitude, geo.Results[0].Longitude, nil
}

/*
	=========================
	  HANDLER HTTP

=========================
*/
func Serverwheather(w http.ResponseWriter, r *http.Request) {

	enableCORS(w, r)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	ciudad := r.URL.Query().Get("ciudad")
	pais := r.URL.Query().Get("pais")
	horasStr := r.URL.Query().Get("horas")

	if ciudad == "" {
		http.Error(w, "Debe enviar ?ciudad=", http.StatusBadRequest)
		return
	}

	horas := 0
	if horasStr != "" {
		h, err := strconv.Atoi(horasStr)
		if err != nil {
			http.Error(w, "horas debe ser numérico", http.StatusBadRequest)
			return
		}
		horas = h
	}

	data, err := ConsumirApi(ciudad, pais, horas)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
