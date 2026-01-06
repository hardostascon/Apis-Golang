import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, Eye } from 'lucide-react-native';

interface WeatherCardProps {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
}

export function WeatherCard({
  city,
  country,
  temperature,
  condition,
  description,
  humidity,
  windSpeed,
  visibility,
}: WeatherCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.country}>{country}</Text>
      </View>

      <View style={styles.mainSection}>
        <WeatherIcon condition={condition} size={100} />
        <Text style={styles.temperature}>{temperature}°C</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Droplets size={24} color="#3b82f6" />
          <Text style={styles.detailLabel}>Humedad</Text>
          <Text style={styles.detailValue}>{humidity}%</Text>
        </View>

        <View style={styles.detailItem}>
          <Wind size={24} color="#3b82f6" />
          <Text style={styles.detailLabel}>Viento</Text>
          <Text style={styles.detailValue}>{windSpeed} m/s</Text>
        </View>

        <View style={styles.detailItem}>
          <Eye size={24} color="#3b82f6" />
          <Text style={styles.detailLabel}>Visibilidad</Text>
          <Text style={styles.detailValue}>{visibility} km</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  city: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
  },
  country: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  mainSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
  },
  description: {
    fontSize: 20,
    color: '#6b7280',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailItem: {
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
