import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MarketplaceItem, ClosetItem } from '../../types';
import marketplaceData from '../../data/marketplace.json';
import { auth, db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MarketplaceScreen() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [recommendations, setRecommendations] = useState<MarketplaceItem[]>([]);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);

  useEffect(() => {
    setItems(marketplaceData as MarketplaceItem[]);
    loadClosetItems();
  }, []);

  useEffect(() => {
    if (closetItems.length > 0) {
      generateRecommendations();
    }
  }, [closetItems]);

  const loadClosetItems = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'closetItems'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as ClosetItem[];
      setClosetItems(loaded);
    } catch (error) {
      console.error('Error loading closet items:', error);
    }
  };

  const generateRecommendations = () => {
    // Simple recommendation logic
    const categories = closetItems.map(item => item.category);
    
    // Recommend items from categories not in closet
    const recommended = (marketplaceData as MarketplaceItem[])
      .filter(item => !categories.includes(item.category))
      .slice(0, 5);

    setRecommendations(recommended);
  };

  const handleItemPress = (item: MarketplaceItem) => {
    Linking.openURL(item.affiliateLink);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-purple-600 px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Marketplace</Text>
      </View>

      <ScrollView>
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View className="px-4 py-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                Recommended for You
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommendations.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleItemPress(item)}
                  className="bg-white rounded-lg overflow-hidden mr-3 shadow-sm"
                  style={{ width: 180 }}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-40"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text
                      className="text-sm font-semibold text-gray-800"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {item.brand}
                    </Text>
                    <Text className="text-lg font-bold text-purple-600 mt-2">
                      ${item.price}
                    </Text>
                    {item.reason && (
                      <View className="mt-2 bg-purple-50 rounded px-2 py-1">
                        <Text className="text-purple-700 text-xs">
                          {item.reason}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Items */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            All Products
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleItemPress(item)}
                className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm"
                style={{ width: '48%' }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text
                    className="text-sm font-semibold text-gray-800"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {item.brand}
                  </Text>
                  <Text className="text-lg font-bold text-purple-600 mt-2">
                    ${item.price}
                  </Text>

                  <View className="flex-row mt-2">
                    {item.colors.slice(0, 3).map((color, idx) => (
                      <View
                        key={idx}
                        className="w-4 h-4 rounded-full mr-1 border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View className="px-4 py-6 mb-6">
          <View className="bg-blue-50 rounded-lg p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-blue-800 font-semibold ml-2">
                Demo Marketplace
              </Text>
            </View>
            <Text className="text-blue-700 text-sm">
              This is a demonstration marketplace with mock products. In
              production, this would integrate with affiliate networks and real
              retailers.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
