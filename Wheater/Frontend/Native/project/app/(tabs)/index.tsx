import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { WeatherCard } from '@/components/WeatherCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { getConditionFromCode ,calculateFeelsLike} from '@/utils/weatherConditions';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  hourly: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
}

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Por favor ingresa una ciudad');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://192.168.1.8:8989/Wheater?ciudad=${encodeURIComponent(city)}&horas=24`);
      const data = await response.json();
      
      const conditionInfo = getConditionFromCode(data.current.weather_code);
    const hourlyData = data.hourly
  ? data.hourly.time.map((time: string, index: number) => ({
      time: new Date(time).toLocaleString('es-CO', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperature: data.hourly.temperature_2m[index],
      condition: conditionInfo.condition
    }))
  : [];

  console.log('Hourly Data:', hourlyData);

      console.log('Hora API:', data.current.time);
console.log('Temp API:', data.current.temperature_2m);
console.log('Hora local:', new Date().toISOString());
console.log('Temp local:', data.current.temperature_2m);
console.log('horas de datos horarios:', data.hourly ? data.hourly.time.length : 0);

     const feelsLike = calculateFeelsLike(
  data.current.temperature_2m,
  data.current.relative_humidity_2m,
  data.current.wind_speed_10m
);
console.log('Feels Like calculado:', feelsLike);

     /* const hourlyData = data.hourly
        ? data.hourly.time.map((time: string, index: number) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
        condition: conditionInfo.condition // puedes mejorar luego
        }))
  : [];*/

      const mappedWeather: WeatherData = {
          city: city,
          country: '', // tu API no lo devuelve aún
          temperature: data.current.temperature_2m,
          feelsLike: data.current.temperature_2m,
          condition:  conditionInfo.condition,
          description: conditionInfo.description,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          visibility: data.current.visibility / 1000, // metros → km
          hourly: hourlyData // puedes llenarlo luego
          };


      if (!response.ok) {
        setError(data.error || 'Error al consultar el clima');
        setWeather(null);
      } else {
        setWeather(mappedWeather);
       
        setError(null);
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Consulta del Clima</Text>
          <Text style={styles.subtitle}>
            Busca el clima de cualquier ciudad
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ingresa una ciudad..."
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={searchWeather}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchWeather}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Search size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {weather && (
          <>
            <WeatherCard
              city={weather.city}
              country={weather.country}
              temperature={weather.temperature}
              condition={weather.condition}
              description={weather.description}
              humidity={weather.humidity}
              windSpeed={weather.windSpeed}
              visibility={weather.visibility}
            />
            <HourlyForecast hourly={weather.hourly} />
          </>
        )}

        {!weather && !error && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Busca una ciudad para ver el clima
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
