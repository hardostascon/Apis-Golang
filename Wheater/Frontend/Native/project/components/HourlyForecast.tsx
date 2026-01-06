import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WeatherIcon } from './WeatherIcon';

interface HourlyItem {
  time: string;
  temperature: number;
  condition: string;
}

interface HourlyForecastProps {
  hourly: HourlyItem[];
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronóstico por Horas</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.map((item, index) => (
          <View key={index} style={styles.hourItem}>
            <Text style={styles.time}>{item.time}</Text>
            <WeatherIcon condition={item.condition} size={32} />
            <Text style={styles.temp}>{item.temperature}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  scrollContent: {
    gap: 12,
  },
  hourItem: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    gap: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  temp: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
});
