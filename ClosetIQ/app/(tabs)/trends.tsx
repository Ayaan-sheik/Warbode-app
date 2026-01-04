import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trend } from '../../types';
import trendsData from '../../data/trends.json';

export default function TrendsScreen() {
  const [trends, setTrends] = useState<Trend[]>([]);

  useEffect(() => {
    setTrends(trendsData as Trend[]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trending-now':
        return 'bg-red-100 text-red-700';
      case 'rising':
        return 'bg-orange-100 text-orange-700';
      case 'classic':
        return 'bg-blue-100 text-blue-700';
      case 'fading':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'trending-now':
        return 'flame';
      case 'rising':
        return 'trending-up';
      case 'classic':
        return 'time';
      case 'fading':
        return 'trending-down';
      default:
        return 'analytics';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-purple-600 px-4 py-6">
        <Text className="text-white text-2xl font-bold">Fashion Trends</Text>
        <Text className="text-purple-200 mt-2">
          Stay ahead with the latest style trends
        </Text>
      </View>

      {/* Trending Now Section */}
      <View className="px-4 py-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="flame" size={24} color="#EF4444" />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Trending Now
          </Text>
        </View>

        {trends
          .filter(trend => trend.status === 'trending-now')
          .map(trend => (
            <TouchableOpacity
              key={trend.id}
              className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm"
            >
              {trend.image && (
                <Image
                  source={{ uri: trend.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              )}
              <View className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-xl font-bold text-gray-800">
                    {trend.name}
                  </Text>
                  <View
                    className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(
                      trend.status
                    )}`}
                  >
                    <Ionicons
                      name={getStatusIcon(trend.status) as any}
                      size={14}
                      color="#EF4444"
                    />
                    <Text className="ml-1 text-xs font-semibold">Hot</Text>
                  </View>
                </View>

                <Text className="text-gray-600 mb-3">{trend.description}</Text>

                {trend.colors.length > 0 && (
                  <View className="flex-row items-center mb-2">
                    <Text className="text-sm text-gray-500 mr-2">Colors:</Text>
                    {trend.colors.slice(0, 5).map((color, idx) => (
                      <View
                        key={idx}
                        className="w-6 h-6 rounded-full mr-1 border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </View>
                )}

                {trend.categories && trend.categories.length > 0 && (
                  <View className="flex-row flex-wrap mt-2">
                    {trend.categories.map((category, idx) => (
                      <View
                        key={idx}
                        className="bg-purple-50 rounded px-2 py-1 mr-2 mb-1"
                      >
                        <Text className="text-purple-700 text-xs capitalize">
                          {category}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* Rising Trends */}
      <View className="px-4 py-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="trending-up" size={24} color="#F59E0B" />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Rising Trends
          </Text>
        </View>

        {trends
          .filter(trend => trend.status === 'rising')
          .map(trend => (
            <TouchableOpacity
              key={trend.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-bold text-gray-800">
                  {trend.name}
                </Text>
                <View
                  className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(
                    trend.status
                  )}`}
                >
                  <Ionicons
                    name={getStatusIcon(trend.status) as any}
                    size={14}
                    color="#F59E0B"
                  />
                  <Text className="ml-1 text-xs font-semibold">Rising</Text>
                </View>
              </View>

              <Text className="text-gray-600 mb-2">{trend.description}</Text>

              {trend.colors.length > 0 && (
                <View className="flex-row items-center">
                  {trend.colors.slice(0, 5).map((color, idx) => (
                    <View
                      key={idx}
                      className="w-5 h-5 rounded-full mr-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
      </View>

      {/* Timeless Classics */}
      <View className="px-4 py-4 mb-6">
        <View className="flex-row items-center mb-4">
          <Ionicons name="time" size={24} color="#3B82F6" />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Timeless Classics
          </Text>
        </View>

        {trends
          .filter(trend => trend.status === 'classic')
          .map(trend => (
            <TouchableOpacity
              key={trend.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              <Text className="text-lg font-bold text-gray-800 mb-2">
                {trend.name}
              </Text>
              <Text className="text-gray-600">{trend.description}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
}
