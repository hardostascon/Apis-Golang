import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudFog } from 'lucide-react-native';

interface WeatherIconProps {
  condition: string;
  size?: number;
  color?: string;
} 

export function WeatherIcon({ condition, size = 80, color = '#3b82f6' }: WeatherIconProps) {
  console.log('WeatherIcon condition:', condition);
  console.log('WeatherIcon size:', size);
  console.log('WeatherIcon color:', color);
  //return 'Paro';
  const getIcon = () => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun size={size} color="#fbbf24" />;
      case 'clouds':
        return <Cloud size={size} color={color} />;
      case 'rain':
        return <CloudRain size={size} color="#60a5fa" />;
      case 'drizzle':
        return <CloudDrizzle size={size} color="#60a5fa" />;
      case 'snow':
        return <CloudSnow size={size} color="#93c5fd" />;
      case 'mist':
      case 'fog':
        return <CloudFog size={size} color="#9ca3af" />;
      default:
        return <Cloud size={size} color={color} />;
    }
  };

  return getIcon();
}
