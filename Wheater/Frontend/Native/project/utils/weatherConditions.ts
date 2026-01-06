export function getConditionFromCode(code: number): {
  condition: string;
  description: string;
} {
    switch (code) {
        case 0:
            return { condition: 'Clear', description: 'Despejado' };
        case 1:
            return { condition: 'Clear', description: 'Principalmente despejado' };
        case 2:
            return { condition: 'Partly cloudy', description: 'Parcialmente nublado' };
        case 3:
            return { condition: 'Partly cloudy', description: 'Despejado' };            
        case 45:  
            return { condition: 'Fog', description: 'Neblina' };
        case 48:
            return { condition: 'Fog', description: 'Neblina ligera' };
        case 51:
            return { condition: 'Drizzle', description: 'Llovizna ligera' };
        case 53:
            return { condition: 'Drizzle', description: 'Llovizna moderada' };
        case 55:
            return { condition: 'Drizzle', description: 'Llovizna densa' };
        case 56:
            return { condition: 'Freezing Drizzle', description: 'Llovizna helada ligera' };
        case 57:
            return { condition: 'Freezing Drizzle', description: 'Llovizna helada densa' };
        case 61:
            return { condition: 'Rain', description: 'Lluvia ligera' };
        case 63:
            return { condition: 'Rain', description: 'Lluvia moderada' };
        case 65:
            return { condition: 'Rain', description: 'Lluvia fuerte' };
        case 66:
            return { condition: 'Freezing Rain', description: 'Lluvia helada ligera' };
        case 67:
            return { condition: 'Freezing Rain', description: 'Lluvia helada fuerte' };
        case 71:
            return { condition: 'Snowfall', description: 'Nieve ligera' };
        case 73:
            return { condition: 'Snowfall', description: 'Nieve moderada' };
        case 75:
            return { condition: 'Snowfall', description: 'Nieve fuerte' };
        case 77:
            return { condition: '', description: '' }; // No hay código para nieve granizada
        case 80:
            return { condition: 'Rain showers', description: 'Chubascos de lluvia ligeros' };
        default:
            return { condition: 'Unknown', description: 'Desconocido' };
    }
}

export function calculateFeelsLike(
  temperature: number,
  humidity: number,
  windSpeed: number
): number {

  // 🔥 CALOR → Heat Index
  if (temperature >= 27) {
    const T = temperature;
    const RH = humidity;

    const hi =
      -8.784695 +
      1.61139411 * T +
      2.338549 * RH -
      0.14611605 * T * RH -
      0.012308094 * T * T -
      0.016424828 * RH * RH +
      0.002211732 * T * T * RH +
      0.00072546 * T * RH * RH -
      0.000003582 * T * T * RH * RH;

    return Math.round(hi * 10) / 10;
  }

  // ❄️ FRÍO → Wind Chill
  if (temperature <= 10 && windSpeed > 4.8) {
    const wc =
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * temperature * Math.pow(windSpeed, 0.16);

    return Math.round(wc * 10) / 10;
  }

  // 🌤️ TEMPLADO → temperatura real
  return Math.round(temperature * 10) / 10;
}