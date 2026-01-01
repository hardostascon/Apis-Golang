package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

type GeoResponse struct {
	Results []struct {
		Name        string  `json:"name"`
		Latitude    float64 `json:"latitude"`
		Longitude   float64 `json:"longitude"`
		Country     string  `json:"country"`
		CountryCode string  `json:"country_code"`
		Admin1      string  `json:"admin1"`
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
	CurrentUnits struct {
		Temperature string `json:"temperature"` // Aquí verás "°C"
	} `json:"current_weather_units"`
	Hourly struct {
		Time          []string  `json:"time"`
		Temperature2m []float64 `json:"temperature_2m"`
	} `json:"hourly"`
	HourlyUnits struct {
		Temperature2m string `json:"temperature_2m"` // Aquí también verás "°C"
	} `json:"hourly_units"`
}

func ConsumirApi(Ciudad string, Pais string, horas int) (*OpenMeteoResponse, error) {

	lat, lon, foundName, err := getCoordinates(Ciudad, Pais)

	if err != nil {
		log.Fatal("Error buscando ciudad:", err)
	}
	fmt.Printf("📍 Ciudad encontrada: %s (Lat: %.6f, Lon: %.6f)\n", foundName, lat, lon)
	fmt.Printf("🌐 Horas solicitadas: %d\n", horas)

	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%.5f&longitude=%.5f&current_weather=true", lat, lon)

	if horas > 0 {
		// Agregamos el parámetro para obtener temperaturas por hora
		url += "&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min"
	}
	fmt.Println(url)

	resp, err := http.Get(url)
	if err != nil {
		log.Fatal("Error al hacer la solicitud:", err)
	}
	defer resp.Body.Close()
	var weatherResp OpenMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&weatherResp); err != nil {
		return nil, err
	}
	fmt.Printf("🌡️ Unidad de temperatura: %s\n", weatherResp.CurrentUnits.Temperature)
	fmt.Printf("🌡️ Temperatura actual: %.1f%s\n",
		weatherResp.CurrentWeather.Temperature,
		weatherResp.CurrentUnits.Temperature)
	if horas > 0 && len(weatherResp.Hourly.Time) > 0 {
		// Si el usuario pide más horas de las que trae un día (24),
		// limitamos al máximo disponible para evitar errores.
		maxHoras := len(weatherResp.Hourly.Time)
		if horas > maxHoras {
			horas = maxHoras
		}

		// "Recortamos" los arrays para que solo tengan N elementos
		weatherResp.Hourly.Time = weatherResp.Hourly.Time[:horas]
		weatherResp.Hourly.Temperature2m = weatherResp.Hourly.Temperature2m[:horas]
	}

	return &weatherResp, nil

}

func getCoordinates(ciudad string, pais string) (float64, float64, string, error) {
	safeCity := url.QueryEscape(ciudad)
	url := fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=6&language=es&format=json", safeCity)
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

	if pais != "" {
		paisUpper := strings.ToUpper(pais) // CO, US, ES, etc.
		for _, result := range geoResp.Results {
			if result.CountryCode == paisUpper {
				fmt.Printf("✅ Ciudad encontrada: %s, %s (%s)\n",
					result.Name, result.Admin1, result.Country)
				return result.Latitude, result.Longitude, result.Name, nil
			}
		}
		// Si no encuentra el país especificado
		return 0, 0, "", fmt.Errorf("no se encontró %s en %s", ciudad, pais)
	}

	// Retornamos latitud, longitud y el nombre oficial encontrado
	return geoResp.Results[0].Latitude, geoResp.Results[0].Longitude, geoResp.Results[0].Name, nil
}

func Serverwheather(w http.ResponseWriter, r *http.Request) {
	ciudad := r.URL.Query().Get("ciudad")
	horasStr := r.URL.Query().Get("horas")
	pais := r.URL.Query().Get("pais")
	if ciudad == "" {
		http.Error(w, "Debe enviar el parámetro ?ciudad=", http.StatusBadRequest)
		return
	}

	var horas int
	var err error

	if horasStr != "" {
		horas, err = strconv.Atoi(horasStr) // Convierte string a int
		if err != nil {
			http.Error(w, "El parámetro 'horas' debe ser un número válido", http.StatusBadRequest)
			return
		}
	}

	weatherData, err := ConsumirApi(ciudad, pais, horas)

	if err != nil {
		http.Error(w, "No se pudo obtener el clima: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weatherData)
}
