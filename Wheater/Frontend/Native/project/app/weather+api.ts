export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const country = url.searchParams.get('country'); // Opcional

    if (!city) {
      return new Response(
        JSON.stringify({ error: 'Ciudad requerida' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 🔥 URL de tu API Go (ajusta el puerto si es diferente)
    const GO_API_URL = process.env.GO_API_URL || 'http://localhost:8989';
    
    // Construir URL con parámetros
    const params = new URLSearchParams({
      ciudad: city,
      horas: '24', // Solicitar 24 horas de pronóstico
    });
    
    if (country) {
      params.append('pais', country);
    }

    const weatherUrl = `${GO_API_URL}/weather?${params.toString()}`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ error: error.error || 'Ciudad no encontrada' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

  
  

    // 🔥 Mapear los códigos del clima de Open-Meteo
    const weatherCodeMap: { [key: number]: { condition: string; description: string } } = {
      0: { condition: 'Clear', description: 'Despejado' },
      1: { condition: 'Clear', description: 'Principalmente despejado' },
      2: { condition: 'Clouds', description: 'Parcialmente nublado' },
      3: { condition: 'Clouds', description: 'Nublado' },
      45: { condition: 'Fog', description: 'Niebla' },
      48: { condition: 'Fog', description: 'Niebla con escarcha' },
      51: { condition: 'Drizzle', description: 'Llovizna ligera' },
      53: { condition: 'Drizzle', description: 'Llovizna moderada' },
      55: { condition: 'Drizzle', description: 'Llovizna densa' },
      61: { condition: 'Rain', description: 'Lluvia ligera' },
      63: { condition: 'Rain', description: 'Lluvia moderada' },
      65: { condition: 'Rain', description: 'Lluvia fuerte' },
      71: { condition: 'Snow', description: 'Nevada ligera' },
      73: { condition: 'Snow', description: 'Nevada moderada' },
      75: { condition: 'Snow', description: 'Nevada fuerte' },
      77: { condition: 'Snow', description: 'Granizo' },
      80: { condition: 'Rain', description: 'Chubascos ligeros' },
      81: { condition: 'Rain', description: 'Chubascos moderados' },
      82: { condition: 'Rain', description: 'Chubascos violentos' },
      85: { condition: 'Snow', description: 'Nevadas ligeras' },
      86: { condition: 'Snow', description: 'Nevadas fuertes' },
      95: { condition: 'Thunderstorm', description: 'Tormenta' },
      96: { condition: 'Thunderstorm', description: 'Tormenta con granizo ligero' },
      99: { condition: 'Thunderstorm', description: 'Tormenta con granizo fuerte' },
    };
     console.log('Received weather data from Go API:', data);
    const weatherInfo = weatherCodeMap[data.current.weather_code] || {
      condition: 'Unknown',
      description: 'Desconocido'
    };

    

    // 🔥 Formatear respuesta compatible con tu frontend
    const weatherData = {
      city: city,
      country: country || 'N/A',
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.temperature_2m), // Open-Meteo no tiene "feels like"
      condition: weatherInfo.condition,
      description: weatherInfo.description,
      humidity: null, // Tu API actual no devuelve humedad
      windSpeed: Math.round(data.current.wind_speed_10m),
      visibility: null, // Tu API actual no devuelve visibilidad
      hourly: data.hourly?.time?.map((time: string, index: number) => ({
        time: new Date(time).toLocaleTimeString('es', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        temperature: Math.round(data.hourly.temperature_2m[index]),
        condition: weatherInfo.condition, // Simplificado, idealmente necesitarías hourly weather_code
      })) || [],
    };
    
    return Response.json(weatherData);
  } catch (error) {
    console.error('Error al consultar el clima:', error);
    return new Response(
      JSON.stringify({ error: 'Error al consultar el clima' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}